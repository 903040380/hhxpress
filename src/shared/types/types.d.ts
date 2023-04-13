/// <reference types="vite/client" />

declare module 'hhx-docs:site-data' {
  import type { UserConfig } from 'shared/types'
  const siteData: UserConfig
  export default siteData
}
declare module 'hhx-docs:routes' {
  import type { Route } from 'node/vitePlugins/routes'
  export const routes: Route[]
}
