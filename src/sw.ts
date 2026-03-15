/// <reference lib="webworker" />
import { openDB, storeFile } from '@/lib/idb';

const sw = self as unknown as ServiceWorkerGlobalScope;

// Workbox manifest injection placeholder - workbox-build replaces this with precache manifest
void (self as unknown as Record<string, unknown>).__WB_MANIFEST;

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
    redirectUrl.search = '?shared=' + id;

    return Response.redirect(redirectUrl.toString(), 303);
  } catch {
    return new Response('Internal server error', { status: 500 });
  }
}
