# FoxPage 路线 Phase 1–5 建造记录

**日期：** 2026-06-09
**状态：** 全部实现完成，待验收（**未提交**，改动留在工作区）
**前置：** Phase 0（registry 重构）已完成，见 `2026-06-09-phase0-registry-refactor-design.md`

## 决策回顾（来自 brainstorm）

- 路线 = 用户全选的 4 个方向，按推荐顺序编织成 Phase 1–5。
- 数据库：**先只抽象、暂不接**。落地为 `src/lib/storage.ts` 可替换存储层（今天 localStorage，将来可换 DB，不动调用方）。
- 自主推进、过程中无交互；每个 Phase 用 `build` + `lint` 验证，最后跑 4 视角对抗式审查。

## 基础设施（跨阶段复用）

| 文件 | 作用 |
|---|---|
| `src/lib/storage.ts` | SSR 安全的 K/V 持久化封装（`readRaw/readJSON/writeJSON/subscribe`，前缀 `foxpage:`，同标签页 CustomEvent + 跨标签页 storage 事件）。**这是"先抽象"的落点。** |
| `src/app/use-persistent.ts` | `usePersistent` hook，基于 `useSyncExternalStore` + 按 key 的快照缓存（保证 `getSnapshot` 引用稳定、不死循环；`getServerSnapshot` 返回 fallback 避免水合不一致）。 |
| `src/app/app-screen.tsx` | 子应用共享外壳（Header + RETURN + 标题 + footer），Server Component。 |
| `src/app/app-loading.tsx` | 共享 loading 骨架，各 `loading.tsx` 复用。 |
| `src/lib/launches.ts` | 启动追踪：`recordLaunch`（1.5s 去抖）/`recentIds`/`countsById`。 |

## Phase 1 — 实用工具 ×3
- **单位换算** `/apps/converter`：长度/重量/数据/温度，双向、可交换；温度走 C/F/K 自定义换算。
- **密码生成器** `/apps/password`：`crypto.getRandomValues` 拒绝采样（无模偏置）、长度滑块、字符集开关、熵值评估条、复制。纯本地。
- **便签** `/apps/notes`：`usePersistent` 自动保存、字/词/行计数、保存时间戳。

## Phase 2 — 主题 + 游戏 + 设置
- **Phosphor 换色皮肤**：globals.css 用 `<html>` 全局 `filter: hue-rotate/saturate` 实现绿/琥珀/蓝/白，绕过"组件硬编码 hex"的坑；layout 内联脚本在首帧前应用，无闪烁。
- **WORD.HACK** `/apps/games/wordhack`：辐射终端黑客小游戏（候选词、likeness 反馈、4 次机会、ROBCO 风格内存转储），纯 DOM、词库内置。
- **G.E.C.K. 设置**（`src/app/settings.tsx`）：换色皮肤 + 扫描线开关 + 动效开关，挂在全局 AppShell，设置经 `usePersistent` 持久化 + DOM 属性同步。

## Phase 3 — 发现与导航
- **AppBrowser**（首页升级为客户端）：实时搜索（含嵌套子应用）、RECENT、FAVORITES、卡片星标置顶（星标是 Link 的兄弟节点，不会误导航）。
- **命令面板** `Cmd/Ctrl+K`：模糊搜索全部应用，方向键 + 回车导航，Esc 关闭（openRef 模式，避免 set-state-in-effect）。
- **数字快捷键 1–9**：启动对应序号的顶层应用（在输入框内自动避让）。
- 启动记录接进 AppShell（按 pathname 反查 registry 并记录），驱动 RECENT 与档案统计。

## Phase 4 — 参与度脊柱
- **档案** `/apps/profile`：Vault Dweller 卡（等级/Vault 号/连续天数）、S.P.E.C.I.A.L. 条（由使用数据派生）、快速统计、MOST USED 柱状、7 天活跃度、PERK 成就网格。空数据时显示占位（也保证水合安全）。

## Phase 5 — 安全子集
- **可安装 PWA**：`src/app/manifest.ts`（`display: standalone`、Pip-Boy 主题色、复用 favicon）+ layout 的 `viewport.themeColor` 与 `appleWebApp`。

## 故意未做（需你拍板，留待验收后）

- **Pip-Boy 五标签栏外壳重写**（L）：会推翻刚建好的 1–4 阶布局、风险高，且我此前就建议它在模式验证后再做。
- **BYOK Vault Assistant AI**（M）：需要产品决策（人格、供应商、API key 处理 UX）+ 外部依赖。
- **自动发现 registry / 脚手架**：会改动现有 registry 写法，当前手动注册足够清晰。
- **离线 Service Worker**：Next 文档指出可安装无需离线支持；SW 缓存有内容陈旧风险，故安全子集只做可安装清单。

## 验证

- `npm run build`：全绿，15 条路由静态生成（含 `/manifest.webmanifest`）。
- `npm run lint`：我新增/改动的所有文件**零问题**；仅剩 `flappybird/snake/timer` 的 **5 个既有问题**（数量与动手前一致），属本次范围外的历史遗留。
- 4 视角对抗式审查（hooks / 主题集成 / 水合 / 逻辑）：**我的代码全部判定 SAFE**，无需修改。

## 既有遗留（非本次引入）

`src/app/apps/games/flappybird/page.tsx` 有 3 个 lint error（immutability ×2、set-state-in-effect ×1），`snake`/`timer` 各 1 个未用变量 warning。它们在我动手前就存在、不阻断构建、且属交互式游戏的改动有风险，故未在本次处理——可按需另起一个小提交修复。
