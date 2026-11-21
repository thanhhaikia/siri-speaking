// Saved voice recordings live in IndexedDB (localStorage cannot hold audio). Everything stays on this device.
const DB = 'siri-speaking', STORE = 'audio';
let dbp = null;

function open() {
  dbp ||= new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') return reject(new Error('no-indexeddb'));
    const req = indexedDB.open(DB, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return dbp;
}
const run = (mode, fn) => open().then((db) => new Promise((resolve, reject) => {
  const tx = db.transaction(STORE, mode);
  const req = fn(tx.objectStore(STORE));
  tx.oncomplete = () => resolve(req.result);
  tx.onerror = () => reject(tx.error);
}));

/** Save a recording; resolves to its key, or null when storage is unavailable. */
export async function saveAudio(blob, key = `a-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`) {
  if (!blob) return null;
  try { await run('readwrite', (s) => s.put(blob, key)); return key; } catch { return null; }
}
export async function loadAudio(key) {
  if (!key) return null;
  try { return (await run('readonly', (s) => s.get(key))) || null; } catch { return null; }
}
export async function deleteAudio(key) {
  if (!key) return;
  try { await run('readwrite', (s) => s.delete(key)); } catch { /* ignore */ }
}
export async function clearAudio() {
  try { await run('readwrite', (s) => s.clear()); } catch { /* ignore */ }
}
