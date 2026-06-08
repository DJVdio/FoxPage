export interface AppInfo {
  id: string
  name: string
  description: string
  icon: string
  path?: string
  externalUrl?: string
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
]
