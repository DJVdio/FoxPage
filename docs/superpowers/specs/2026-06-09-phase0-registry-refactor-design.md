# Phase 0 · Registry 重构（共享 AppCard + 状态徽章）

**日期：** 2026-06-09
**状态：** 已批准，待实现后验收
**所属路线：** FoxPage 演进路线 Phase 0（地基重构）

## 背景与目标

FoxPage 的卡片标记目前在 `src/app/page.tsx` 与 `src/app/apps/games/page.tsx` 两处**逐字重复**，徽章文案（`READY` / `EXTERNAL`）**硬编码**，且 games 子应用（贪吃蛇、Flappy Bird）维护在 `games/page.tsx` 自带的第二份 `miniGames` 数组里——形成两个独立的“注册表”。

Phase 0 把这块收敛成**单一数据源 + 共享展示组件 + 类型化状态**，作为后续搜索、筛选、收藏、状态徽章等功能的地基。本阶段**纯前端、向后兼容、UX 零变化**。

## 决策记录

- **registry 模型：** 嵌套/文件夹模型——`AppInfo` 增加可选 `children?`；games 是一个文件夹条目，其子应用放进 `children`。首页仍渲染顶层条目（含“小游戏”文件夹卡），games 页渲染该条目的 `children`。单一数据源、UX 不变。
- **范围：** 精简版。只做 registry 重构 + 共享 `<AppCard>` + 徽章系统。**不引入** localStorage / 存储抽象 / launch log / DB / 登录 / 搜索筛选 / 命令面板 / 新应用。
- **数据库：** 暂不引入。本阶段不涉及；将来需要跨设备同步/排行榜时再决策。
- **刻意不加 `category` / `tags`：** Phase 0 无消费者，按精简版原则推迟到 Phase 3。嵌套关系用 `children` 表达即可。

## 详细设计

### ① 数据模型 — `src/data/apps.ts`

扩展 `AppInfo`，新增字段全部可选，现有 4 条记录无需改动：

```ts
export type AppStatus = "ready" | "new" | "beta" | "wip" | "offline"

export interface AppInfo {
  id: string
  name: string
  description: string
  icon: string
  path?: string
  externalUrl?: string
  status?: AppStatus       // 不设则派生：有 externalUrl → EXTERNAL，否则 READY
  children?: AppInfo[]     // 文件夹：子应用（games 用）
}
```

- 将 snake / flappybird 从 `games/page.tsx` 搬进 `apps.ts` 中 `games` 条目的 `children`，删除 `miniGames`。
- 新增递归选择器 `findApp(id: string): AppInfo | undefined`（遍历 `apps` 及其 `children`），供 games 页取子列表。

### ② 共享组件 — `src/app/app-card.tsx`（新建）

纯展示型 **Server Component**（无 `"use client"`），严格复刻当前卡片外观：

```ts
function AppCard({ app, index }: { app: AppInfo; index: number })
```

- 有 `externalUrl` → 渲染 `<a href target="_blank" rel="noopener noreferrer">`；否则 `<Link href={path} prefetch>`。
- 渲染：序号 `01/02…` · 图标框 · 名称 · 徽章 · 描述 · `>`。
- 卡片/序号/图标/描述/箭头的 className 与现状逐字一致，确保像素级不变。

### ③ 徽章系统（并入 AppCard）

```ts
const STATUS_LABELS: Record<AppStatus, string> = {
  ready: "READY", new: "NEW", beta: "BETA", wip: "WIP", offline: "OFFLINE",
}

function badgeLabel(app: AppInfo): string {
  if (app.status) return STATUS_LABELS[app.status]   // 显式 status 优先
  if (app.externalUrl) return "EXTERNAL"
  return "READY"
}
```

派生规则保证现有数据**行为不变**：菜谱（有 externalUrl）→ `EXTERNAL`；其余 → `READY`。
配色：`ready` / `beta` / `wip` / `external` 沿用现有暗绿描边；`new` 用亮绿 `#00ff41`；`offline` 用琥珀 `#ffb000`（已定义未用）。

### ④ 改动文件清单

| 文件 | 改动 |
|---|---|
| `src/data/apps.ts` | 扩展 `AppInfo` + `AppStatus`；games 加 `children`；加 `findApp` |
| `src/app/app-card.tsx` | **新建**：共享卡片 + 徽章 |
| `src/app/page.tsx` | 用 `<AppCard>`，删内联卡片标记 |
| `src/app/apps/games/page.tsx` | 从 `findApp("games").children` 读列表，用 `<AppCard>`，删 `miniGames` |

## 验收标准（无测试框架 → 手动核对）

1. 首页与改造前**视觉一致**（4 张卡片、序号、徽章、布局）。
2. games 页正常显示贪吃蛇 + Flappy Bird，徽章 `READY`。
3. 菜谱外链仍在新标签页打开（`target=_blank`）。
4. 开机动画 / 路由进度条 / 头部不受影响。
5. `npm run build` 与 `npm run lint` 均通过。

## 风险

低。纯增可选字段 + 组件抽取。注意点：games 页改为从 registry 取 `children`，`findApp` 需有“找不到则返回空列表”的兜底，避免运行时报错。

## 不在本阶段（后续 Phase）

存储抽象 / launch log（Phase 2+）· 搜索/筛选/命令面板（Phase 3）· 参与度脊柱（Phase 4）· 标签栏/AI/PWA（Phase 5）· `category`/`tags` 字段（Phase 3 接入时再加）。
