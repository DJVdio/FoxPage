# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

> ⚠️ 根据 AGENTS.md，这是一个**改过的 Next.js（16.2.7）**，含有破坏性改动。在写任何依赖 Next.js 的代码（路由、数据获取、配置）之前，先阅读 `node_modules/next/dist/docs/` 里对应的指南——不要凭记忆套用旧约定。

## 命令

```bash
npm run dev            # 启动开发服务器，http://localhost:3000
npm run build          # 生产构建
npm run start          # 运行生产构建
npm run lint           # eslint --max-warnings 0（flat config：eslint.config.mjs）
npm run typecheck      # tsc --noEmit
npm test               # Vitest 单元 + 组件测试（一次性运行）
npm run test:watch     # Vitest watch 模式
npm run test:coverage  # 带覆盖率
npm run test:e2e       # Playwright 端到端（需先 npx playwright install chromium）
```

测试约定与质量门见下方「测试与流程」。

## 项目

**FoxPage**——一个 Pip-Boy（辐射）主题的 Web「应用市场」/ 启动器。首页列出一组小应用，每一项要么跳转到 `src/app/apps/` 下的内部应用，要么外链到一个 URL。仅使用 App Router；路径别名 `@/*` → `src/*`。

## 架构

### 应用清单——唯一数据源
`src/data/apps.ts` 导出 `apps: AppInfo[]`，是驱动整个市场的唯一数据源。每条 `AppInfo` 要么是**内部应用**（`path: "/apps/..."`），要么是**外链**（`externalUrl`）；可带可选 `status`（`ready/new/beta/wip/offline` → 徽章）和 `children`（**嵌套子应用**，如「小游戏」文件夹下的 snake / flappybird / wordhack）。辅助函数：`findApp(id)`、`allApps()`（扁平化含嵌套，供搜索 / 命令面板）、`findAppByPath(path)`（启动记录用）。

卡片统一由共享组件 **`<AppCard>`**（`app-card.tsx`，Server Component）渲染：内链 → `<Link prefetch>`，外链 → `<a target="_blank">`，徽章按 `status` 派生。首页 `page.tsx` 渲染客户端 **`<AppBrowser>`**（`app-browser.tsx`）：搜索、最近用、收藏置顶 + APP.LIBRARY 列表。

**新增内部应用：**（1）在 `apps.ts` 追加带 `path` 的记录（嵌套则放进某条目的 `children`）；（2）建 `src/app/apps/<name>/page.tsx`，用 `<AppScreen>` 包裹 + 客户端交互子组件 + `loading.tsx`（内容 `export { default } from "@/app/app-loading"`）。纯逻辑抽到同目录纯 `.ts` 模块以便测试（见「测试与流程」）。**外链应用** 只需加一条 `externalUrl` 记录。

### 开机动画 + 路由反馈（横跨 4 个文件——最不直观的部分）
Pip-Boy 开机序列和路由切换指示器由以下文件协同实现：

- **`layout.tsx`**——`<head>` 里的内联脚本在**首帧绘制前**读取 `sessionStorage.foxpage_booted`，并给 `<html>` 加上 `foxpage-booted` class，这样回访用户不会看到开机画面闪一下。同时挂载 `AppShell`（包裹所有 children）以及 Vercel Analytics / SpeedInsights。
- **`boot-screen.tsx`**（`"use client"`）——只在路径为 `/` 时播放一次开机日志动画，由 `played` ref + `foxpage_booted` sessionStorage 标记共同把关（约 3.2 秒序列结束后写入标记）。它挂在 layout 层级，导航过程中保持挂载。
- **`globals.css`**——`html.foxpage-booted .boot-screen-wrapper { display: none }` 就是内联脚本触发、用来瞬间隐藏开机画面的规则。
- **`app-shell.tsx`**（`"use client"`）——每当 `usePathname()` 变化时，在一个固定定位的 `<div>` 上切换 `route-active` class 来驱动顶部进度条（CSS `@keyframes route-progress`，动画不走 React state）。

改动其中任何一个，都要检查其余几个——它们共享 `foxpage_booted` 这个 key，以及 `foxpage-booted` / `route-active` 这两个 class 约定。

### 持久化与全局外壳
- **存储抽象** `src/lib/storage.ts`：SSR 安全的 K/V（前缀 `foxpage:`，同标签页 CustomEvent + 跨标签页 storage 事件）。**这是「先抽象、暂不接数据库」的落点**——将来接 DB 只改这里。
- **`use-persistent.ts`** 的 `usePersistent(key, fallback)`：基于 `useSyncExternalStore`（按 key 的快照缓存保证引用稳定；`getServerSnapshot` 返回 fallback，避免水合不一致）。
- **`lib/launches.ts`**：启动追踪（`recordLaunch` / `recentIds` / `countsById`），驱动「最近用」与档案统计。
- **`AppShell`**（客户端、常驻 layout）挂载：路由进度条、`BootScreen`、命令面板（`Cmd/Ctrl+K`，`command-palette.tsx`）、G.E.C.K. 设置（`settings.tsx`）、数字快捷键 1-9、按 `pathname` 记录启动。新增全局控件就加在这里。

### 主题
`globals.css` 定义了 Pip-Boy 外观：CSS 自定义属性（`--pip-boy-*`）通过 `@theme inline` 桥接成 Tailwind v4 的 token，外加一组工具类（`pip-card`、`pip-border`、`pip-progress`、`pip-scanline`、`pip-blink` 等）以及全局扫描线/暗角叠加层（`body::before` / `body::after`）。Tailwind v4 通过 PostCSS（`@tailwindcss/postcss`）接入，用 `@import "tailwindcss"` 引入，**没有 `tailwind.config`**。注意：组件里大多**直接硬编码绿色 hex 值**（`#00ff41`、`#00aa2a`、`#003a0f`）在 `className` 上，而非使用主题 token。

**换色皮肤**：`globals.css` 用 `<html>` 全局 `filter`（`html[data-phosphor=amber|blue|white]`）整体变色，正是为了绕过「硬编码 hex」的限制。`settings.tsx` 持久化选择；layout 的内联脚本在首帧前应用 `data-phosphor` / `data-scanline` / `data-motion`（与 `foxpage_booted` 同一段脚本）。

### 约定
- `PipHeader`（`pip-header.tsx`）是各页面复用的共享头部；`AppScreen`（`app-screen.tsx`）是子应用统一外壳（头部 + RETURN + 标题 + footer）。
- 每个路由可以有自己的 `loading.tsx`（Pip-Boy 进度条），作为 App Router 的 suspense/loading UI。

## 测试与流程

**栈**：Vitest（单元 + 组件，jsdom）+ React Testing Library；Playwright（E2E）。

- **配置**：`vitest.config.ts`（jsdom + `vitest.setup.ts` 引 jest-dom；setup 里装了内存版 `localStorage` 以规避 Node 实验性 web storage 的干扰）、`playwright.config.ts`（`webServer` 跑 `build && start`）。
- **位置与命名**：单元/组件 `*.test.ts(x)` 与源码**同目录**；E2E 放 `e2e/*.spec.ts`。
- **可测性规范**：纯逻辑从 `"use client"` 组件抽到纯 `.ts` 模块再测（如 `converter/units.ts`、`lib/password.ts`、`games/wordhack/engine.ts`、`lib/storage.ts`、`lib/launches.ts`）；组件测可见行为/交互，需要时 mock `next/link` / `next/navigation`；E2E 用 `addInitScript` 设 `sessionStorage.foxpage_booted` 跳过开机动画。
- **质量门**：
  - **CI**（`.github/workflows/ci.yml`，push / PR）：`lint → typecheck → test → build`，外加独立 E2E job。
  - **预提交钩子**（husky + lint-staged）：对暂存 `*.{ts,tsx}` 跑 `eslint --max-warnings 0` + `vitest related --run`。
- **lint 是硬门**（`--max-warnings 0`）：改完务必零 error 零 warning。修改交互式 canvas 游戏（snake / flappybird）时注意 `react-hooks` 的 immutability 与 set-state-in-effect 规则——用不可变更新和 ref 间接调度，而非就地 mutate。
