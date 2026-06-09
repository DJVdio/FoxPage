# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

> ⚠️ 根据 AGENTS.md，这是一个**改过的 Next.js（16.2.7）**，含有破坏性改动。在写任何依赖 Next.js 的代码（路由、数据获取、配置）之前，先阅读 `node_modules/next/dist/docs/` 里对应的指南——不要凭记忆套用旧约定。

## 命令

```bash
npm run dev      # 启动开发服务器，http://localhost:3000
npm run build    # 生产构建
npm run start    # 运行生产构建
npm run lint     # eslint（flat config：eslint.config.mjs）
```

**没有配置测试框架**——没有测试运行器，也没有测试文件。

## 项目

**FoxPage**——一个 Pip-Boy（辐射）主题的 Web「应用市场」/ 启动器。首页列出一组小应用，每一项要么跳转到 `src/app/apps/` 下的内部应用，要么外链到一个 URL。仅使用 App Router；路径别名 `@/*` → `src/*`。

## 架构

### 应用清单——唯一数据源
`src/data/apps.ts` 导出 `apps: AppInfo[]`，是驱动首页（`src/app/page.tsx`）的唯一列表。每一项要么是**内部应用**（`path: "/apps/..."`，渲染为带 `prefetch` 的 `next/link`），要么是**外链**（`externalUrl`，渲染为普通 `<a target="_blank">`）。`page.tsx` 通过 `!!app.externalUrl` 判断来选择标签和属性。

**新增内部应用：**（1）在 `apps.ts` 追加一条带 `path` 的记录；（2）创建 `src/app/apps/<name>/page.tsx`（可选 `loading.tsx`）。**新增外链应用：** 只需加一条带 `externalUrl` 的记录，无需建路由。

### 开机动画 + 路由反馈（横跨 4 个文件——最不直观的部分）
Pip-Boy 开机序列和路由切换指示器由以下文件协同实现：

- **`layout.tsx`**——`<head>` 里的内联脚本在**首帧绘制前**读取 `sessionStorage.foxpage_booted`，并给 `<html>` 加上 `foxpage-booted` class，这样回访用户不会看到开机画面闪一下。同时挂载 `AppShell`（包裹所有 children）以及 Vercel Analytics / SpeedInsights。
- **`boot-screen.tsx`**（`"use client"`）——只在路径为 `/` 时播放一次开机日志动画，由 `played` ref + `foxpage_booted` sessionStorage 标记共同把关（约 3.2 秒序列结束后写入标记）。它挂在 layout 层级，导航过程中保持挂载。
- **`globals.css`**——`html.foxpage-booted .boot-screen-wrapper { display: none }` 就是内联脚本触发、用来瞬间隐藏开机画面的规则。
- **`app-shell.tsx`**（`"use client"`）——每当 `usePathname()` 变化时，在一个固定定位的 `<div>` 上切换 `route-active` class 来驱动顶部进度条（CSS `@keyframes route-progress`，动画不走 React state）。

改动其中任何一个，都要检查其余几个——它们共享 `foxpage_booted` 这个 key，以及 `foxpage-booted` / `route-active` 这两个 class 约定。

### 主题
`globals.css` 定义了 Pip-Boy 外观：CSS 自定义属性（`--pip-boy-*`）通过 `@theme inline` 桥接成 Tailwind v4 的 token，外加一组工具类（`pip-card`、`pip-border`、`pip-progress`、`pip-scanline`、`pip-blink` 等）以及全局扫描线/暗角叠加层（`body::before` / `body::after`）。Tailwind v4 通过 PostCSS（`@tailwindcss/postcss`）接入，用 `@import "tailwindcss"` 引入，**没有 `tailwind.config`**。注意：组件里大多**直接硬编码绿色 hex 值**（`#00ff41`、`#00aa2a`、`#003a0f`）在 `className` 上，而非使用主题 token。

### 约定
- `PipHeader`（`pip-header.tsx`）是各页面复用的共享头部。
- 每个路由可以有自己的 `loading.tsx`（Pip-Boy 进度条），作为 App Router 的 suspense/loading UI。
