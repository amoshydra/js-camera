/// <reference lib="webworker" />
import { openDB, storeFile } from '@/lib/idb';

const BUILD_SHA = import.meta.env.VITE_GIT_SHA;
console.log('[SW] Build SHA:', BUILD_SHA);
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';

declare const self: ServiceWorkerGlobalScope;
const sw = self;

type WBManifestEntry = { url: string; revision: string | null };
const filteredManifest = (
  self as unknown as { __WB_MANIFEST: WBManifestEntry[] }
).__WB_MANIFEST.filter((entry) => !entry.url.includes('/experimental'));
precacheAndRoute(filteredManifest);

registerRoute(
  /\.(?:wasm)$/i,
  new CacheFirst({
    cacheName: 'wasm-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 10,
        maxAgeSeconds: 60 * 60 * 24 * 365,
      }),
    ],
  }),
);

registerRoute(
  /\/assets\/experimental-.*\.js$/,
  new CacheFirst({
    cacheName: 'experimental-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 1,
        maxAgeSeconds: 60 * 60 * 24 * 365,
      }),
    ],
  }),
);

sw.addEventListener('install', () => sw.skipWaiting());
sw.addEventListener('activate', () => sw.clients.claim());

sw.addEventListener('fetch', (event: FetchEvent) => {
  const url = new URL(event.request.url);

  if (event.request.method === 'POST' && url.pathname.endsWith('/share-target')) {
    event.respondWith(handleShare(event));
  }
});

async function handleShare(event: FetchEvent): Promise<Response> {
  try {
    const formData = await event.request.formData();
    const file = formData.get('file');

    if (!(file instanceof File)) {
      return new Response('No file provided', { status: 400 });
    }

    const id = crypto.randomUUID();
    const db = await openDB();
    await storeFile(db, id, file);

    const redirectUrl = new URL(event.request.url);
    redirectUrl.pathname = redirectUrl.pathname.replace('/share-target', '');
    redirectUrl.hash = '?shared=' + id;

    return Response.redirect(redirectUrl.toString(), 303);
  } catch {
    return new Response('Internal server error', { status: 500 });
  }
}
