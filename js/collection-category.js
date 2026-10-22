(() => {
  if (new URLSearchParams(location.search).get("tema") !== "colecionismo") return;
  const articles = Array.isArray(window.GRID_ARTICLES) ? window.GRID_ARTICLES : [];
  const collection = articles.filter(article => article.category?.startsWith("Colecionismo"));
  const content = document.querySelector("[data-category-content]");
  const description = document.querySelector("[data-category-description]");
  if (!content || collection.length === 0) return;

  if (description) description.textContent = "Guias para escolher, identificar, organizar e conservar carrinhos de autorama e outros itens de coleção.";
  const escape = value => String(value ?? "").replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[char]);
  content.innerHTML = `<div class="scenario-category-list">${collection.map(article => `<article class="article-result"><a href="${escape(article.href)}"><img src="${escape(article.image)}" width="${Number(article.width) || 1200}" height="${Number(article.height) || 675}" loading="lazy" decoding="async" alt="${escape(article.alt)}"></a><div><div class="eyebrow">Colecionismo</div><h2><a href="${escape(article.href)}">${escape(article.title)}</a></h2><p>${escape(article.summary)}</p><a class="text-link" href="${escape(article.href)}">Ler o artigo ↗</a></div></article>`).join("")}</div>`;
})();
