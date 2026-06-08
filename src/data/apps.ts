export interface AppInfo {
  id: string
  name: string
  description: string
  icon: string
  path: string
}

export const apps: AppInfo[] = [
  {
    id: "hello-world",
    name: "Hello World",
    description: "A simple hello world app to get started",
    icon: "👋",
    path: "/apps/hello-world",
  },
]
