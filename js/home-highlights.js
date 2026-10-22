(() => {
  const grid = document.querySelector('[data-featured-grid]');
  const source = Array.isArray(window.GRID_ARTICLES) ? window.GRID_ARTICLES : [];
  if (!grid || source.length === 0) return;

  // Keep the order deterministic in the browser too; edits never affect createdAt.
  const articles = [...source].sort((a, b) => {
    const delta = Date.parse(b.createdAt) - Date.parse(a.createdAt);
    if (Number.isFinite(delta) && delta !== 0) return delta;
    return a.slug < b.slug ? -1 : a.slug > b.slug ? 1 : 0;
  });
  const make = (tag, className, value) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (value !== undefined) node.textContent = value;
    return node;
  };

  const cards = articles.map(article => {
    const card = make('article', 'featured-card');
    const imageLink = make('a', 'featured-card-image');
    imageLink.href = article.href;
    const image = make('img');
    image.src = article.image;
    image.width = article.width;
    image.height = article.height;
    image.loading = 'lazy';
    image.decoding = 'async';
    image.alt = article.alt;
    imageLink.append(image);

    const content = make('div', 'featured-card-content');
    content.append(make('div', 'eyebrow', article.category));
    const heading = make('h3');
    const titleLink = make('a', '', article.title);
    titleLink.href = article.href;
    heading.append(titleLink);
    content.append(heading, make('p', '', article.summary));

    const readLink = make('a', 'text-link');
    readLink.href = article.href;
    readLink.append(document.createTextNode('Ler o artigo '));
    const arrow = make('span', '', '↗');
    arrow.setAttribute('aria-hidden', 'true');
    readLink.append(arrow);
    content.append(readLink);
    card.append(imageLink, content);
    return card;
  });
  grid.replaceChildren(...cards);
})();
