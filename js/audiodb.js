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

/**
 * Save a recording; resolves to its key, or null when storage is unavailable. The Blob is stored with its
 * format (webm/Opus from Chrome and Android, mp4/AAC from iPhone Safari) and the text of the line it was recorded for.
 */
export async function saveAudio(blob, key = `a-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`, { text = '' } = {}) {
  if (!blob) return null;
  try { await run('readwrite', (s) => s.put({ blob, mime: blob.type || '', text, saved: Date.now() }, key)); return key; } catch { return null; }
}
/** The recording as a Blob, or null. Recordings saved by earlier versions are bare Blobs. */
export async function loadAudio(key) {
  if (!key) return null;
  try { const v = await run('readonly', (s) => s.get(key)); return v instanceof Blob ? v : v?.blob || null; } catch { return null; }
}
export async function audioKeys() {
  try { return await run('readonly', (s) => s.getAllKeys()); } catch { return []; }
}
export async function deleteAudio(key) {
  if (!key) return;
  try { await run('readwrite', (s) => s.delete(key)); } catch { /* ignore */ }
}
export async function clearAudio() {
  try { await run('readwrite', (s) => s.clear()); } catch { /* ignore */ }
}
