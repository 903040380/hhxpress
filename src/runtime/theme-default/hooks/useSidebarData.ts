import { SidebarItem } from 'shared/types'
import { usePageData } from '../../usePageData'

export function useSidebarData() {
  const { routes } = usePageData()

  const paths = routes
    .map((route) => route.path)
    .filter((path) => path.startsWith('/docs'))

  const sidebarData = paths2tree(paths).items

  // console.log(routes)
  // console.log(sidebarData)

  return { data: sidebarData }
}

// ---

function paths2tree(paths: string[]): SidebarItem {
  // TODO
  const root = {
    text: 'docs',
    link: '/docs/',
    items: [
      {
        text: 'test',
        items: [
          {
            text: 'md',
            link: '/docs/test/md',
          },
          {
            text: 'mdx',
            link: '/docs/test/mdx',
          },
          {
            text: 'tsx',
            link: '/docs/test/tsx',
          },
        ],
      },
    ],
  }

  return root
}

// path: '/docs/depth/next/floor'
// path: '/docs/depth/set'
// path: '/docs/'
// path: '/docs/intro'
// path: '/docs/sec/'
// path: '/docs/test/md'
// path: '/docs/test/mdx'
// path: '/docs/test/tsx'
// path: '/'

// const root = {
//   text: 'docs',
//   link: '/docs/',
//   items: [
//     {
//       text: 'depth',
//       items: [
//         {
//           text: 'next',
//           items: [{ text: 'floor', link: '/docs/depth/next/floor' }],
//         },
//         {
//           text: 'set',
//           link: '/docs/depth/next/set',
//         },
//       ],
//     },
//     {
//       text: 'intro',
//       link: '/docs/intro',
//     },
//     {
//       text: 'sec',
//       link: '/docs/sec/',
//     },
//     {
//       text: 'test',
//       items: [
//         {
//           text: 'md',
//           link: '/docs/test/md',
//         },
//         {
//           text: 'mdx',
//           link: '/docs/test/mdx',
//         },
//         {
//           text: 'tsx',
//           link: '/docs/test/tsx',
//         },
//       ],
//     },
//   ],
// }