export type AppStatus = "ready" | "new" | "beta" | "wip" | "offline"

export interface AppInfo {
  id: string
  name: string
  description: string
  icon: string
  path?: string
  externalUrl?: string
  status?: AppStatus
  children?: AppInfo[]
}

export const apps: AppInfo[] = [
  {
    id: "hello-world",
    name: "Hello World",
    description: "A simple hello world app to get started",
    icon: "👋",
    path: "/apps/hello-world",
  },
  {
    id: "recipes",
    name: "菜谱",
    description: "How to Cook — 菜谱大全",
    icon: "🍳",
    externalUrl: "https://howtocook.aiursoft.com/",
  },
  {
    id: "games",
    name: "小游戏",
    description: "内置迷你游戏合集",
    icon: "🎮",
    path: "/apps/games",
    children: [
      {
        id: "snake",
        name: "贪吃蛇",
        description: "经典 Snake 游戏 · 方向键控制",
        icon: "🐍",
        path: "/apps/games/snake",
      },
      {
        id: "flappybird",
        name: "Flappy Bird",
        description: "按空格/点击飞行 · 经典 flappy bird",
        icon: "🐦",
        path: "/apps/games/flappybird",
      },
      {
        id: "wordhack",
        name: "WORD.HACK",
        description: "辐射终端黑客 · 猜出密码",
        icon: "🖥",
        path: "/apps/games/wordhack",
        status: "new",
      },
    ],
  },
  {
    id: "timer",
    name: "计时器",
    description: "正向计时 · 倒计时 · 番茄钟",
    icon: "⏱",
    path: "/apps/timer",
  },
  {
    id: "converter",
    name: "单位换算",
    description: "长度 · 重量 · 数据 · 温度 实时换算",
    icon: "📐",
    path: "/apps/converter",
    status: "new",
  },
  {
    id: "password",
    name: "密码生成器",
    description: "加密安全 · 熵值评估 · 本地生成",
    icon: "🔑",
    path: "/apps/password",
    status: "new",
  },
  {
    id: "notes",
    name: "便签",
    description: "自动保存的快速暂存板",
    icon: "📝",
    path: "/apps/notes",
    status: "new",
  },
  {
    id: "profile",
    name: "档案",
    description: "Vault Dweller · S.P.E.C.I.A.L. · 成就统计",
    icon: "🧑‍🚀",
    path: "/apps/profile",
    status: "new",
  },
]

/** 在 registry 树（apps 及其 children）中递归查找指定 id 的应用。 */
export function findApp(id: string, list: AppInfo[] = apps): AppInfo | undefined {
  for (const app of list) {
    if (app.id === id) return app
    if (app.children) {
      const found = findApp(id, app.children)
      if (found) return found
    }
  }
  return undefined
}

/** 扁平化所有「可启动」的应用（含嵌套子应用），供搜索 / 命令面板 / 启动匹配使用。 */
export function allApps(list: AppInfo[] = apps): AppInfo[] {
  const out: AppInfo[] = []
  for (const app of list) {
    if (app.path || app.externalUrl) out.push(app)
    if (app.children) out.push(...allApps(app.children))
  }
  return out
}

/** 按内部路由路径反查应用（用于记录"已启动"）。 */
export function findAppByPath(path: string): AppInfo | undefined {
  return allApps().find((a) => a.path === path)
}
