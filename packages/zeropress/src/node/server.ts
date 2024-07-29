import { SRC_PATH } from './consts'
import { createPlugins } from './plugins'
import { tailwindcssConfig } from './tailwind'
import { SiteConfig } from '@/shared/types'
import autoprefixer from 'autoprefixer'
import tailwindcss from 'tailwindcss'
import { createServer } from 'vite'

// 因为是ssg所以dev使用传统的服务模式，如果是ssr dev也需要服务端返回html
export async function createRuntimeDevServer({
  siteConfig,
  restartRuntimeDevServer,
}: {
  siteConfig: SiteConfig
  restartRuntimeDevServer: () => Promise<void>
}) {
  return createServer({
    root: siteConfig.root, // 避免dev服务访问路由时直接访问静态tsx资源，所以在/开启服务，路由一般在/docs内
    server: {
      host: true, // 开启局域网与公网ip
    },
    plugins: createPlugins({
      restartRuntimeDevServer,
      siteConfig,
    }),
    // 配置tailwindcss
    css: {
      postcss: { plugins: [tailwindcss(tailwindcssConfig), autoprefixer({})] },
    },
    resolve: {
      alias: {
        '@': SRC_PATH,
      },
    },
    optimizeDeps: {
      exclude: ['virtual:config', 'virtual:routes'],
    },
  })
}