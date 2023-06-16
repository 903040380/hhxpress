export function isArrayEmpty(arr: any) {
  return !Array.isArray(arr) || arr.length === 0
}
export const isProduction = () => import.meta.env.PROD
export const isDevlopment = () => import.meta.env.DEV

export function isBrowser() {
  return (
    typeof window !== 'undefined' &&
    !!window.document &&
    !!window.document.createElement
  )
}

export function normalizeHref(url?: string) {
  if (!url) {
    return '/'
  }

  let suffix = '.html'
  if (url.endsWith('/')) {
    suffix = 'index' + suffix
  }
  const prodUrl = addLeadingSlash(`${encodeURI(url)}${suffix}`)
  console.log(url, prodUrl)

  if (isDevlopment() || url.startsWith('http')) {
    return url
  }

  return prodUrl
}

export function addLeadingSlash(url: string) {
  return url.charAt(0) === '/' || url.startsWith('https') ? url : '/' + url
}
