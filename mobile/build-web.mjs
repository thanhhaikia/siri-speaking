// Copies the web app (one folder up) into www/ for the Android wrapper and adds the two native helper scripts.
import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const here = (p) => fileURLToPath(new URL(p, import.meta.url));
await rm(here('www'), { recursive: true, force: true });
await mkdir(here('www/native'), { recursive: true });
for (const item of ['css', 'js', 'audio', 'favicon.svg']) await cp(here(`../${item}`), here(`www/${item}`), { recursive: true });
await cp(here('node_modules/@capacitor/core/dist/capacitor.js'), here('www/native/capacitor.js'));
await cp(here('native/native-speech.js'), here('www/native/native-speech.js'));

const app = '<script type="module" src="js/app.js"></script>';
const html = await readFile(here('../index.html'), 'utf8');
if (!html.includes(app)) throw new Error('index.html no longer has the app script tag this build looks for');
await writeFile(here('www/index.html'), html.replace(app, `<script src="native/capacitor.js"></script>\n  <script src="native/native-speech.js"></script>\n  ${app}`));
console.log('www/ is ready');
