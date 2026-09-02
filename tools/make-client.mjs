// Персональная страница демо под бренд конкретного агентства.
//
//   node tools/make-client.mjs --name "WOW-WEDDING" --slug wow-wedding
//   node tools/make-client.mjs --name "Свадьбы Веры" --slug svadby-very --ru --email hi@svadby.ru
//
// Зачем отдельный файл, если есть ?planner=: краулеры Telegram и WhatsApp не
// исполняют JS и не видят query-параметр. Карточку превью задаёт статический
// <head>, поэтому под бренд её можно подогнать только отдельной страницей —
// со своими og-тегами и своей картинкой, на которой уже стоит имя агентства.

import { spawn } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://xenaja.github.io/wedding-planner-suite/';
const CHROME = process.env.CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe';

// --- аргументы ---
const args = process.argv.slice(2);
const flag = (k) => { const i = args.indexOf('--' + k); return i >= 0 ? args[i + 1] : null; };
const name = flag('name');
const slug = flag('slug');
const email = flag('email');
const ru = args.includes('--ru');

if (!name || !slug) {
  console.error('Нужны --name и --slug. Пример:\n  node tools/make-client.mjs --name "WOW-WEDDING" --slug wow-wedding');
  process.exit(1);
}
if (!/^[a-z0-9][a-z0-9-]*$/.test(slug)) {
  console.error('slug должен быть латиницей в нижнем регистре, цифрами и дефисами: ' + slug);
  process.exit(1);
}

// Имя попадёт и в JS-литерал, и в JSON внутри HTML-атрибута, и в og:content.
// Кавычки и угловые скобки убираем сразу, чтобы не думать о трёх экранированиях.
const clean = Array.from(name)
  .filter((ch) => { const c = ch.charCodeAt(0); return c > 31 && c !== 127; })
  .join('').replace(/["'<>&]/g, '').replace(/\s+/g, ' ').trim().slice(0, 28);
if (!clean) { console.error('Имя пустое после очистки'); process.exit(1); }
if (clean !== name.trim()) console.log('Имя приведено к безопасному виду:', JSON.stringify(clean));

if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
  console.error('Похоже, это не адрес почты: ' + email);
  process.exit(1);
}

// --- собираем страницу ---
const baseName = ru ? 'index-ru.html' : 'index.html';
const basePath = resolve(ROOT, baseName);
if (!existsSync(basePath)) { console.error('Нет файла ' + baseName); process.exit(1); }
let html = readFileSync(basePath, 'utf8');

const before = html;
const swap = (re, to, what) => {
  const hit = html.match(re);
  if (!hit) { console.error('Не найден фрагмент: ' + what); process.exit(1); }
  html = html.replace(re, to);
};

// имя по умолчанию — и в логике, и в редактируемых пропах
swap(/(this\.props\.plannerName \?\? ')[^']*(')/, `$1${clean}$2`, 'plannerName в логике');
swap(/(&quot;plannerName&quot;:\{[^}]*?&quot;default&quot;:&quot;)[^&]*(&quot;)/, `$1${clean}$2`, 'plannerName в data-props');
if (email) {
  swap(/(this\.props\.plannerEmail \?\? ')[^']*(')/, `$1${email}$2`, 'plannerEmail в логике');
  swap(/(&quot;plannerEmail&quot;:\{[^}]*?&quot;default&quot;:&quot;)[^&]*(&quot;)/, `$1${email}$2`, 'plannerEmail в data-props');
}

const title = ru
  ? `Кабинет агентства ${clean}: все свадьбы в одном месте`
  : `A cabinet for every wedding ${clean} runs`;
const desc = ru
  ? `Демо под ${clean}: у каждой пары свой план, счета и бюджет считаются сами, ответы гостей с сайта попадают сразу к вам. Экскурсия занимает минуту.`
  : `A demo dressed as ${clean}: a board per couple, invoices and budget that keep themselves current, and a guest site whose RSVPs land straight back. The tour takes a minute.`;
const pageUrl = SITE + slug + '.html';
const imgUrl = SITE + 'assets/og-' + slug + '.png';

swap(/<title>[^<]*<\/title>/, `<title>${title}</title>`, '<title>');
swap(/(<meta name="description" content=")[^"]*(">)/, `$1${desc}$2`, 'description');
swap(/(<meta property="og:title" content=")[^"]*(">)/, `$1${title}$2`, 'og:title');
swap(/(<meta property="og:description" content=")[^"]*(">)/, `$1${desc}$2`, 'og:description');
swap(/(<meta property="og:url" content=")[^"]*(">)/, `$1${pageUrl}$2`, 'og:url');
swap(/(<meta property="og:image" content=")[^"]*(">)/, `$1${imgUrl}$2`, 'og:image');
swap(/(<meta name="twitter:title" content=")[^"]*(">)/, `$1${title}$2`, 'twitter:title');
swap(/(<meta name="twitter:description" content=")[^"]*(">)/, `$1${desc}$2`, 'twitter:description');
swap(/(<meta name="twitter:image" content=")[^"]*(">)/, `$1${imgUrl}$2`, 'twitter:image');

if (html === before) { console.error('Ничего не изменилось — проверь базовый файл'); process.exit(1); }

const outPage = resolve(ROOT, slug + '.html');
writeFileSync(outPage, html, 'utf8');
console.log('Страница:', slug + '.html');

// --- картинка превью: на ней уже стоит бренд клиента ---
const outImg = resolve(ROOT, 'assets', 'og-' + slug + '.png');
const PORT = 9400 + Math.floor(Math.random() * 300);
const chrome = spawn(CHROME, ['--headless', '--disable-gpu', '--no-sandbox',
  `--remote-debugging-port=${PORT}`, `--user-data-dir=${ROOT.split('\\').join('/')}/tools/.chrome`,
  'about:blank'], { stdio: 'ignore' });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let ws, id = 0; const pending = new Map();
const send = (method, params = {}) => new Promise((res) => {
  const i = ++id; pending.set(i, res);
  ws.send(JSON.stringify({ id: i, method, params }));
});

try {
  let target;
  for (let i = 0; i < 40; i++) {
    try {
      const list = await (await fetch(`http://127.0.0.1:${PORT}/json`)).json();
      target = list.find((t) => t.type === 'page');
      if (target) break;
    } catch {}
    await sleep(250);
  }
  if (!target) throw new Error('Chrome не отозвался — задай путь через CHROME=');

  ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((r) => ws.addEventListener('open', r));
  ws.addEventListener('message', (ev) => {
    const m = JSON.parse(ev.data);
    if (m.id && pending.has(m.id)) { pending.get(m.id)(m.result); pending.delete(m.id); }
  });

  await send('Page.enable');
  await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: 1200, height: 630, deviceScaleFactor: 2, mobile: false });
  try { await send('Emulation.setScrollbarsHidden', { hidden: true }); } catch {}
  // экскурсия не должна закрыть собой карточку превью
  await send('Page.addScriptToEvaluateOnNewDocument', {
    source: "try{localStorage.setItem('wedding-suite-en-tour','1');localStorage.setItem('wedding-suite-ru-tour','1')}catch(e){}",
  });
  await send('Page.navigate', { url: 'file:///' + outPage.split('\\').join('/') });
  await sleep(9000);
  await send('Runtime.evaluate', {
    expression: "(()=>{const b=[...document.querySelectorAll('button')].find(x=>['Tour','Экскурсия'].includes(x.textContent.trim()));if(b)b.remove();})()",
  });
  await sleep(400);
  const shot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
  writeFileSync(outImg, Buffer.from(shot.data, 'base64'));
  console.log('Картинка:', 'assets/og-' + slug + '.png');
  console.log('\nПосле git push страница будет тут:\n  ' + pageUrl);
} finally {
  try { ws?.close(); } catch {}
  chrome.kill();
}
