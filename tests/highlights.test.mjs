import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import vm from 'node:vm';
import { collectArticles, watchArticles, writeIndex } from '../tools/build-highlights.mjs';

function article({ slug, createdAt, modifiedAt, title = slug, canonical }) {
  const canon = canonical || '[INSERIR DOMÍNIO]/' + slug + '/';
  return '<!doctype html><html><head><meta charset="utf-8"><meta name="article:created_at" content="' + createdAt + '"><meta name="description" content="Resumo ' + slug + '"><link rel="canonical" href="' + canon + '"></head><body><main><article><header class="article-header"><div class="eyebrow">Categoria teste</div><h1>' + title + '</h1><p>Resumo de ' + title + '.</p></header><figure><img src="images/' + slug + '.webp" width="1200" height="675" alt="Imagem de ' + title + '."></figure><p>Texto.</p></article></main><script type="application/ld+json">{"dateModified":"' + modifiedAt + '"}</script></body></html>';
}

const root = fs.mkdtempSync(path.join(os.tmpdir(), 'grid-highlights-'));
try {
  fs.mkdirSync(path.join(root, 'old'), { recursive: true });
  fs.mkdirSync(path.join(root, 'same'), { recursive: true });
  fs.writeFileSync(path.join(root, 'old', 'index.html'), article({
    slug: 'old', createdAt: '2024-02-01T10:00:00Z', modifiedAt: '2035-01-01T00:00:00Z', title: 'Artigo antigo'
  }));
  fs.writeFileSync(path.join(root, 'same', 'index.html'), article({
    slug: 'same', createdAt: '2025-01-01T10:00:00Z', modifiedAt: '2025-01-01T10:00:00Z', title: 'Artigo existente'
  }));
  let items = writeIndex(root);
  assert.deepEqual(items.map(item => item.slug), ['same', 'old']);
  const createdAtBeforeEdit = items.find(item => item.slug === 'old').createdAt;
  const oldFile = path.join(root, 'old', 'index.html');
  const oldHtml = fs.readFileSync(oldFile, 'utf8').replace('2035-01-01T00:00:00Z', '2040-01-01T00:00:00Z');
  fs.writeFileSync(oldFile, oldHtml);
  fs.mkdirSync(path.join(root, 'new'), { recursive: true });
  fs.writeFileSync(path.join(root, 'new', 'index.html'), article({
    slug: 'new', createdAt: '2026-10-16T12:00:00Z', modifiedAt: '2026-10-16T12:00:00Z', title: 'Artigo recém-criado'
  }));
  items = writeIndex(root);
  assert.deepEqual(items.map(item => item.slug), ['new', 'same', 'old']);
  assert.equal(items.find(item => item.slug === 'old').createdAt, createdAtBeforeEdit);
  assert.equal(items.length, new Set(items.map(item => item.href)).size);
  console.log('PASS inclusão de artigo novo, ordenação por criação, edição sem reordenação e ausência de duplicatas');
} finally {
  fs.rmSync(root, { recursive: true, force: true });
}

const tieRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'grid-highlights-tie-'));
try {
  for (const slug of ['zeta', 'alfa']) {
    fs.mkdirSync(path.join(tieRoot, slug), { recursive: true });
    fs.writeFileSync(path.join(tieRoot, slug, 'index.html'), article({
      slug, createdAt: '2026-05-01T00:00:00Z', modifiedAt: '2026-05-02T00:00:00Z'
    }));
  }
  fs.mkdirSync(path.join(tieRoot, 'legacy'), { recursive: true });
  fs.writeFileSync(path.join(tieRoot, 'legacy', 'copy.html'), article({
    slug: 'legacy-copy', createdAt: '2026-05-01T00:00:00Z', modifiedAt: '2026-05-02T00:00:00Z',
    canonical: '[INSERIR DOMÍNIO]/alfa/'
  }));
  const items = collectArticles(tieRoot, { persistCreatedAt: false });
  assert.deepEqual(items.map(item => item.slug), ['alfa', 'zeta']);
  console.log('PASS empate com slug estável e deduplicação por URL canônica');
} finally {
  fs.rmSync(tieRoot, { recursive: true, force: true });
}


const watchRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'grid-highlights-watch-'));
let watcher;
try {
  fs.mkdirSync(path.join(watchRoot, 'js'), { recursive: true });
  fs.mkdirSync(path.join(watchRoot, 'old'), { recursive: true });
  fs.writeFileSync(path.join(watchRoot, 'old', 'index.html'), article({
    slug: 'old', createdAt: '2024-01-01T00:00:00Z', modifiedAt: '2024-01-01T00:00:00Z'
  }));
  writeIndex(watchRoot);
  let resolveUpdate;
  let rejectUpdate;
  const updated = new Promise((resolve, reject) => { resolveUpdate = resolve; rejectUpdate = reject; });
  watcher = watchArticles(watchRoot, {
    debounceMs: 30,
    onUpdate: resolveUpdate,
    onError: error => rejectUpdate(new Error(error))
  });
  fs.mkdirSync(path.join(watchRoot, 'new'), { recursive: true });
  fs.writeFileSync(path.join(watchRoot, 'new', 'index.html'), article({
    slug: 'new', createdAt: '2026-10-16T12:00:00Z', modifiedAt: '2026-10-16T12:00:00Z'
  }));
  await Promise.race([
    updated,
    new Promise((_resolve, reject) => setTimeout(() => reject(new Error('watcher did not rebuild in time')), 3000))
  ]);
  const generated = fs.readFileSync(path.join(watchRoot, 'js', 'generated-articles.js'), 'utf8');
  assert.ok(generated.indexOf('"slug": "new"') < generated.indexOf('"slug": "old"'));
  console.log('PASS watcher atualiza os Destaques após salvar um novo artigo');
} finally {
  watcher?.close();
  fs.rmSync(watchRoot, { recursive: true, force: true });
}


class FakeElement {
  constructor(tagName = '#text') { this.tagName = tagName; this.children = []; this.attributes = {}; this._text = ''; }
  set textContent(value) { this._text = String(value); this.children = []; }
  get textContent() { return this._text + this.children.map(child => child.textContent || '').join(''); }
  append(...nodes) { this.children.push(...nodes); }
  replaceChildren(...nodes) { this.children = nodes; }
  setAttribute(name, value) { this.attributes[name] = value; }
}
const fakeGrid = new FakeElement('div');
const fakeDocument = {
  querySelector: () => fakeGrid,
  createElement: tag => new FakeElement(tag),
  createTextNode: value => { const node = new FakeElement('#text'); node.textContent = value; return node; }
};
const fakeArticles = [
  { slug: 'old', title: 'Antigo', summary: 'Resumo antigo', category: 'Pistas', href: 'old/index.html', image: 'old.webp', alt: 'Pista antiga', width: 1200, height: 675, createdAt: '2024-01-01T00:00:00Z' },
  { slug: 'new', title: 'Novo', summary: 'Resumo novo', category: 'Montagem', href: 'new/index.html', image: 'new.webp', alt: 'Pista nova', width: 1200, height: 675, createdAt: '2026-01-01T00:00:00Z' }
];
vm.runInNewContext(fs.readFileSync(new URL('../js/home-highlights.js', import.meta.url), 'utf8'), {
  document: fakeDocument,
  window: { GRID_ARTICLES: fakeArticles }
});
assert.equal(fakeGrid.children.length, 2);
assert.equal(fakeGrid.children[0].children[1].children[1].textContent, 'Novo');
assert.equal(fakeGrid.children[1].children[1].children[1].textContent, 'Antigo');
assert.equal(fakeGrid.children[0].children[0].children[0].loading, 'lazy');
const styles = fs.readFileSync(new URL('../css/styles.css', import.meta.url), 'utf8');
assert.ok(styles.includes('@media(max-width:700px){.featured-grid{grid-template-columns:1fr'));
console.log('PASS renderização dinâmica dos cards e grade responsiva para celular');
