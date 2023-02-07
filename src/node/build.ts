import { build as viteBuild, InlineConfig } from 'vite'
import { CLIENT_ENTRY_PATH, SERVER_ENTRY_PATH } from './constants'
import pluginReact from '@vitejs/plugin-react'
import path from 'path'
import type { RollupOutput } from 'rollup'
import fs from 'fs-extra'

/**
 * 构建
 */
export async function build(root: string = process.cwd()) {
  // 打包代码，包括 client 端 + server 端
  const [clientBundle, serverBundle] = await bundle(root)
  // 引入 server-entry 产物 js
  const serverEntryPath = path.join(root, '.temp', 'ssr-entry.js')
  const { renderInServer } = require(serverEntryPath)
  // 服务端渲染，产出
  await renderPage(renderInServer, root, clientBundle)
}

/**
 * 打包双端代码
 */
export async function bundle(root: string) {
  // 获取打包配置
  const resolveViteConfig = (isServer: boolean): InlineConfig => ({
    mode: 'production',
    root,
    // 注意加上这个插件，自动注入 import React from 'react'，避免 React is not defined 的错误
    plugins: [pluginReact()],
    build: {
      ssr: isServer,
      outDir: isServer ? '.temp' : 'build',
      rollupOptions: {
        input: isServer ? SERVER_ENTRY_PATH : CLIENT_ENTRY_PATH,
        output: {
          format: isServer ? 'cjs' : 'esm',
        },
      },
    },
  })

  console.log(
    `Building client + server bundles... / 构建客户端与服务端中。。。`
  )

  try {
    // 获取双端产物，并发速度更快
    const [clientBundle, serverBundle] = await Promise.all([
      // client
      viteBuild(resolveViteConfig(false)),
      // server
      viteBuild(resolveViteConfig(true)),
    ])
    return [clientBundle, serverBundle] as [RollupOutput, RollupOutput]
  } catch (e) {
    console.log(e)
  }
}

/**
 * 渲染服务端产物
 */
export async function renderPage(
  render: () => string,
  root: string,
  clientBundle: RollupOutput
) {
  //
  const clientChunk = clientBundle.output.find(
    (chunk) => chunk.type === 'chunk' && chunk.isEntry
  )
  console.log(`Rendering page in server side... / 服务端渲染页面中。。。`)

  // 获取服务端的react组件字符串
  const appHtml = render()
  // 服务端html模板
  const html = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>server</title>
    <meta name="description" content="xxx">
  </head>
  <body>
    <div id="root">${appHtml}</div>
    <script type="module" src="/${clientChunk?.fileName}"></script>
  </body>
</html>`.trim()

  await fs.ensureDir(path.join(root, 'build'))
  // 生成服务端html入口
  await fs.writeFile(path.join(root, 'build/index.html'), html)
  // 移除服务端产物，因为已经写入服务端html，客户端产物留下进行访问时同构
  await fs.remove(path.join(root, '.temp'))
}
