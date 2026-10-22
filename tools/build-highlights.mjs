import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_ROOT = path.resolve(SCRIPT_DIR, '..');
const GENERATED = path.join(DEFAULT_ROOT, 'js', 'generated-articles.js');
const EXCLUDED = new Set([
  'index.html', 'categoria.html', 'article.html', 'modelo-artigo.html',
  'sobre.html', 'contato.html', 'equipe.html', 'privacidade.html',
  'politica-de-privacidade.html', 'politica-de-cookies.html', 'cookies.html',
  'termos.html', 'aviso-legal.html', 'preferencias-de-cookies.html',
  'artigos/index.html', 'articles/index.html'
]);

function attributes(tag) {
  const out = {};
  for (const m of tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g)) {
    out[m[1].toLowerCase()] = m[2] ?? m[3] ?? m[4] ?? '';
  }
  return out;
}
function textOnly(value = '') {
  return value.replace(/<[^>]*>/g, ' ').replace(/&nbsp;|&#160;/gi, ' ')
    .replace(/&amp;/gi, '&').replace(/&quot;/gi, '"').replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, '<').replace(/&gt;/gi, '>').replace(/\s+/g, ' ').trim();
}
function tagAttributes(html, pattern) {
  const match = html.match(pattern);
  return match ? attributes(match[0]) : {};
}
function canonicalRoute(canonical, relativeFile) {
  try {
    const url = new URL(canonical, 'https://grid-do-autorama.invalid/');
    let route = decodeURIComponent(url.pathname).replace(/^\/+/, '');
    if (!route || route.endsWith('/')) route += 'index.html';
    return route;
  } catch {
    return relativeFile.replaceAll(path.sep, '/');
  }
}
function discoverHtml(root) {
  const files = [];
  const visit = dir => {
    for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
      if (item.name.startsWith('.') || item.name === 'node_modules') continue;
      const full = path.join(dir, item.name);
      if (item.isDirectory()) visit(full);
      else if (item.isFile() && item.name.toLowerCase().endsWith('.html')) files.push(full);
    }
  };
  visit(root);
  return files.sort((a, b) => a.localeCompare(b, 'en'));
}

export function collectArticles(root = DEFAULT_ROOT, { persistCreatedAt = true } = {}) {
  const byRoute = new Map();
  for (const file of discoverHtml(root)) {
    const relative = path.relative(root, file).replaceAll(path.sep, '/');
    if (EXCLUDED.has(relative) || /\.backup-|\/article\.html$/i.test(relative)) continue;
    let html = fs.readFileSync(file, 'utf8');
    if (/name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(html)) continue;
    const h1Match = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i);
    const canonicalAttrs = tagAttributes(html, /<link\b(?=[^>]*\brel=["']canonical["'])[^>]*>/i);
    if (!h1Match || !canonicalAttrs.href || !/<article\b/i.test(html)) continue;

    const canonical = canonicalAttrs.href.replace('[INSERIR DOMÍNIO]', 'https://grid-do-autorama.invalid');
    const route = canonicalRoute(canonical, relative);
    const slug = route.replace(/\/index\.html$/i, '').replace(/\.html$/i, '').split('/').filter(Boolean).at(-1) || 'index';
    const h1End = h1Match.index + h1Match[0].length;
    const headerStart = html.lastIndexOf('<header', h1Match.index);
    const headerEnd = html.indexOf('</header>', h1End);
    const articleHeader = headerEnd >= 0 ? html.slice(Math.max(0, headerStart), headerEnd + 9) : html.slice(Math.max(0, headerStart), h1End + 2000);
    const headerTail = html.slice(h1End, headerEnd >= 0 ? headerEnd : h1End + 2000);
    const summaryMatch = headerTail.match(/<p\b[^>]*>([\s\S]*?)<\/p>/i);
    const headStart = html.match(/<head\b[^>]*>/i)?.index ?? 0;
    const head = html.slice(headStart, h1Match.index);
    const createdTags = [...head.matchAll(/<meta\b(?=[^>]*\bname=["']article:created_at["'])[^>]*>/gi)];
    const createdTag = createdTags[0]?.[0];
    let createdAt = createdTag ? attributes(createdTag).content : '';
    let htmlChanged = false;
    if (createdTags.length > 1) {
      let kept = false;
      html = html.replace(/<meta\b(?=[^>]*\bname=["']article:created_at["'])[^>]*>/gi, tag => {
        if (!kept) { kept = true; return tag; }
        return '';
      });
      htmlChanged = true;
    }
    if (!createdAt) {
      // Seed once from the file's original filesystem birth time; never read dateModified.
      createdAt = fs.statSync(file).birthtime.toISOString();
      const meta = '<meta name="article:created_at" content="' + createdAt + '">';
      html = html.replace(/(<meta\b[^>]*\bcharset=[^>]*>)/i, (_match, charset) => charset + meta);
      htmlChanged = true;
    }
    if (persistCreatedAt && htmlChanged) fs.writeFileSync(file, html, 'utf8');
    const eyebrowMatch = articleHeader.match(/<div\b(?=[^>]*\bclass=["'][^"']*(?:eyebrow|project-eyebrow)[^"']*["'])[^>]*>([\s\S]*?)<\/div>/i);
    const baseHref = tagAttributes(html, /<base\b[^>]*>/i).href;
    const imageMatch = html.match(/<img\b[^>]*>/i);
    const imageAttrs = imageMatch ? attributes(imageMatch[0]) : {};
    const cardImage = tagAttributes(html, /<meta\b(?=[^>]*\bname=["']article:card_image["'])[^>]*>/i);
    const cardImageAlt = tagAttributes(html, /<meta\b(?=[^>]*\bname=["']article:card_image_alt["'])[^>]*>/i).content;
    let image = cardImage.content || imageAttrs.src || 'assets/autorama-home-hero.png';
    if (!/^(?:https?:)?\/\//i.test(image)) {
      const documentUrl = new URL(relative, 'https://grid-do-autorama.invalid/');
      const baseUrl = baseHref ? new URL(baseHref, documentUrl) : documentUrl;
      image = new URL(image, baseUrl).pathname.replace(/^\/+/, '');
    }
    const article = {
      slug,
      title: textOnly(h1Match[1]),
      summary: textOnly(summaryMatch?.[1]) || textOnly(tagAttributes(html, /<meta\b(?=[^>]*\bname=["']description["'])[^>]*>/i).content) || '',
      category: textOnly(eyebrowMatch?.[1]) || 'Grid do Autorama',
      href: route,
      image,
      alt: cardImage.content ? (cardImageAlt || textOnly(h1Match[1])) : (imageAttrs.alt || textOnly(h1Match[1])),
      width: Number(cardImage.content ? tagAttributes(html, /<meta\b(?=[^>]*\bname=["']article:card_image_width["'])[^>]*>/i).content : imageAttrs.width) || 1200,
      height: Number(cardImage.content ? tagAttributes(html, /<meta\b(?=[^>]*\bname=["']article:card_image_height["'])[^>]*>/i).content : imageAttrs.height) || 675,
      createdAt
    };
    const previous = byRoute.get(route);
    // Prefer the canonical public route (usually its index.html) over a legacy duplicate.
    if (!previous || relative === route || relative.endsWith('/index.html')) byRoute.set(route, article);
  }
  return [...byRoute.values()].sort((a, b) => {
    const dateOrder = Date.parse(b.createdAt) - Date.parse(a.createdAt);
    if (Number.isFinite(dateOrder) && dateOrder !== 0) return dateOrder;
    return a.slug < b.slug ? -1 : a.slug > b.slug ? 1 : 0;
  });
}

export function writeIndex(root = DEFAULT_ROOT, options = {}) {
  const articles = collectArticles(root, options);
  const destination = path.join(root, 'js', 'generated-articles.js');
  const source = `// Generated by tools/build-highlights.mjs. Do not edit this file by hand.\nwindow.GRID_ARTICLES = ${JSON.stringify(articles, null, 2)};\n`;
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  const temporary = `${destination}.tmp`;
  fs.writeFileSync(temporary, source, 'utf8');
  fs.renameSync(temporary, destination);
  return articles;
}

export function watchArticles(root = DEFAULT_ROOT, { debounceMs = 250, onUpdate = console.log, onError = console.error } = {}) {
  let timer;
  const watcher = fs.watch(root, { recursive: true }, (_event, name) => {
    if (!name || !String(name).toLowerCase().endsWith('.html') || String(name).includes('generated-articles')) return;
    clearTimeout(timer);
    timer = setTimeout(() => {
      try { onUpdate('Destaques atualizados: ' + writeIndex(root).length + ' artigos.'); }
      catch (error) { onError('Não foi possível atualizar os Destaques: ' + error.message); }
    }, debounceMs);
  });
  watcher.on('close', () => clearTimeout(timer));
  return watcher;
}

const args = process.argv.slice(2);
const rootArg = args.find(arg => arg.startsWith('--root='));
const root = rootArg ? path.resolve(rootArg.slice('--root='.length)) : DEFAULT_ROOT;
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const articles = writeIndex(root);
  console.log('Destaques atualizados: ' + articles.length + ' artigos.');
  if (args.includes('--watch')) {
    console.log('Observando arquivos HTML em ' + root + '. Um salvamento atualiza os Destaques automaticamente.');
    try { watchArticles(root); }
    catch (error) {
      console.error('Este sistema não permite observação recursiva de arquivos: ' + error.message);
      process.exitCode = 1;
    }
  }
}
