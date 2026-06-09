# 测试框架 + 规范 + 流程 · 设计

**日期：** 2026-06-09
**状态：** 已批准，待实现
**项目：** FoxPage（Next 16 + React 19 + TS + Tailwind v4，Vercel，GitHub: DJVdio/FoxPage）

## 决策

- **范围：** 单元 + 组件 + E2E（全覆盖）。
- **流程：** CI（GitHub Actions，push/PR）+ 本地预提交钩子（husky + lint-staged）。
- **框架：** Vitest（单元/组件）+ React Testing Library + jsdom；Playwright（E2E）。理由：对 Next 16 / React 19 / ESM 原生友好，配置比 Jest 轻。

## 技术栈与配置

- `vitest.config.ts`：`@vitejs/plugin-react` + `vite-tsconfig-paths`（解析 `@/`），`environment: jsdom`，`setupFiles` 引入 jest-dom，`globals: true`。
- `vitest.setup.ts`：`import "@testing-library/jest-dom/vitest"`。
- `playwright.config.ts`：`webServer` 跑 `npm run build && npm run start`（端口 3000），`baseURL`，chromium。
- devDependencies：`vitest @vitejs/plugin-react vite-tsconfig-paths jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event @playwright/test @vitest/coverage-v8 husky lint-staged`。

## 可测性重构（规范）

把埋在 `"use client"` 组件里的纯逻辑抽成纯 `.ts` 模块，组件改为 import：

| 来源 | 抽出到 |
|---|---|
| `converter.tsx` 换算表/转换/`fmt` | `apps/converter/units.ts` |
| `password-gen.tsx` `secureGenerate`/熵/强度 | `lib/password.ts` |
| `wordhack.tsx` `likeness`/`makePuzzle`/`BANK` | `apps/games/wordhack/engine.ts` |

`lib/storage.ts`、`lib/launches.ts`、`use-persistent.ts` 已足够纯净，直接测。

## 测试分层与命名约定

- **单元** `*.test.ts`（与源码同目录）：units、password、wordhack/engine、launches、storage。
- **组件** `*.test.tsx`：`usePersistent`(renderHook)、AppCard、AppBrowser、command-palette、settings、notes-pad、profile。
- **E2E** `e2e/*.spec.ts`：① 首页加载 + 搜索过滤 ② ⌘/Ctrl+K 面板打开并导航 ③ 设置换肤生效（`<html data-phosphor>`）④ 打开单位换算并换算 ⑤ wordhack 加载。
- 约定：测纯逻辑优先；组件测可见行为与交互，不测实现细节；E2E 只覆盖关键用户流程。

## 脚本（package.json）

`test`(`vitest run`) · `test:watch`(`vitest`) · `test:coverage`(`vitest run --coverage`) · `test:e2e`(`playwright test`) · `typecheck`(`tsc --noEmit`)。

## CI — `.github/workflows/ci.yml`

`on: [push, pull_request]`，Node 20：
- **quality**：install → `lint` → `typecheck` → `test` → `build`
- **e2e**：install → `playwright install --with-deps chromium` → `test:e2e`

## 预提交钩子 — husky + lint-staged

`pre-commit` → `lint-staged`；对暂存 `*.{ts,tsx}` 跑 `eslint` + `vitest related --run`（不跑 E2E，保持快）。

## 修绿既有 lint（让门能过）

- `flappybird/page.tsx`：immutability ×2 + set-state-in-effect ×1（谨慎修，保证游戏行为不变）。
- `snake/page.tsx`：未用 `nextDir`；`timer/page.tsx`：未用 `targetSec`。

## 更新 CLAUDE.md

新增"测试与流程"段：命令、测试位置与命名、纯逻辑抽离规范、质量门（CI + 钩子）说明。

## 验收标准

`npm run lint`、`typecheck`、`test`、`test:e2e`、`build` 全部通过；CI 工作流就绪；预提交钩子生效；初始测试套件覆盖全部纯逻辑模块且通过；CLAUDE.md 已更新。

## 不在本次

- 视觉回归 / 快照大规模铺开（仅按需）。
- 覆盖率强制阈值门（先收集 coverage，不设硬阈值，避免初期摩擦）。
