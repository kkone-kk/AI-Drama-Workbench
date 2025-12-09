import { getAssetFromKV, mapRequestToAsset } from '@cloudflare/kv-asset-handler'

addEventListener('fetch', event => {
  try {
    event.respondWith(handleEvent(event))
  } catch (e) {
    event.respondWith(new Response('Error fetching asset', { status: 500 }))
  }
})

async function handleEvent(event) {
  const url = new URL(event.request.url)
  let request = event.request

  // 单页应用路由支持：所有路径都返回 index.html
  if (url.pathname.startsWith('/') && !url.pathname.includes('.')) {
    request = new Request(`${url.origin}/index.html`, request)
  }

  try {
    return await getAssetFromKV(event, {
      mapRequestToAsset: req => mapRequestToAsset(req)
    })
  } catch (e) {
    return new Response('Asset not found', { status: 404 })
  }
}
