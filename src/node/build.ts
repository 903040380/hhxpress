// 对客户端与服务端同时打包

import { RollupOutput } from 'rollup'
import { build as viteBuild, InlineConfig } from 'vite'
import vitePluginReact from '@vitejs/plugin-react'
import { CLIENT_ENTRY_PATH, SERVER_ENTRY_PATH } from './constants'
import path from 'path'
import { ensureDir, remove, writeFile } from 'fs-extra'

export async function build(root: string) {
  const [clientBundle] = await bundle(root)

  // 提前服务端产物的渲染函数
  const SERVER_BUNDLE_PATH = path.join(root, '.temp', 'server-entry.js')
  const { renderInServer } = require(SERVER_BUNDLE_PATH)

  await renderPage(renderInServer, root, clientBundle)
}

/**
 * 客户端与服务端打包
 */
export async function bundle(root: string) {
  // 配置文件
  const resolveViteConfig = (isServer: boolean): InlineConfig => ({
    root,
    mode: 'production',
    // plugins: [vitePluginReact()],
    build: {
      ssr: isServer,
      outDir: isServer ? '.temp' : 'build',
      rollupOptions: {
        input: isServer ? SERVER_ENTRY_PATH : CLIENT_ENTRY_PATH,
        output: {
          format: isServer ? 'cjs' : 'esm', // TODO 为什么服务端是cjs
        },
      },
    },
  })

  console.log(`Building client + server bundles / 构建客户端与服务端包中 ...`)

  try {
    const [clientBundle, serverBundle] = await Promise.all([
      viteBuild(resolveViteConfig(false)),
      viteBuild(resolveViteConfig(true)),
    ])

    return [clientBundle, serverBundle] as [RollupOutput, RollupOutput]
  } catch (e) {
    console.log(e)
  }
}

/**
 * 服务端渲染出入口html
 */
async function renderPage(
  renderInServer: () => string,
  root: string,
  clientBundle: RollupOutput,
) {
  // 获取客户端入口chunk
  const clientEntryChunk = clientBundle.output.find(
    (chunk) => chunk.type === 'chunk' && chunk.isEntry,
  )

  console.log(`Rendering page in server side / 服务端渲染页面中 ...`)

  // 获取包含react应用的模板html
  const appHtml = renderInServer()

  const html = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width,initial-scale=1">
      <title>title</title>
      <meta name="description" content="xxx">
    </head>
    <body>
      <div id="root">${appHtml}</div>
      <script type="module" src="/${clientEntryChunk?.fileName}"></script>
    </body>
  </html>`.trim()

  await ensureDir(path.join(root, 'build'))
  await writeFile(path.join(root, 'build/index.html'), html)
  await remove(path.join(root, '.temp'))
}
