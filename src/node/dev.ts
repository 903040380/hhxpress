import { createServer as createViteDevServer } from 'vite'
import { pluginIndexHtml } from './vite-plugin/index-html'
import pluginReact from '@vitejs/plugin-react'
import { PACKAGE_ROOT_PATH } from './constants'
import { resolveConfig } from './config'
import { pluginConfig } from './vite-plugin/config'
import { pluginRoutes } from './vite-plugin/routes'

/**
 * 创建vite-dev-server实例
 */
export async function createDevServer(
  root: string,
  restartServer: () => Promise<void>
) {
  const config = await resolveConfig(root, 'serve', 'development')

  return createViteDevServer({
    plugins: [
      pluginIndexHtml(),
      pluginReact(),
      pluginConfig(config, restartServer),
      pluginRoutes({
        root: config.root,
      }),
    ],
    server: {
      fs: {
        allow: [PACKAGE_ROOT_PATH],
      },
    },
  })
}
