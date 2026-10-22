(() => {
  const articles = Array.isArray(window.GRID_ARTICLES) ? window.GRID_ARTICLES : [];
  const groups = {
    pilotagem: article => article.category.startsWith("Técnica de pilotagem"),
    mecanica: article => article.category === "Mecânica e Preparação dos Carrinhos",
    montagem: article => article.category.startsWith("Montagem e Projetos de Pistas") || article.category.startsWith("Montagem ·"),
    colecionismo: article => article.category.startsWith("Colecionismo"),
    historia: article => article.category === "História do Autorama",
    cenarios: article => article.category === "Cenários e Modelismo"
  };

  for (const [key, matches] of Object.entries(groups)) {
    const count = articles.filter(article => typeof article.category === "string" && matches(article)).length;
    const element = document.querySelector(`[data-category-count="${key}"]`);
    if (element) element.textContent = `${count} ${count === 1 ? "artigo" : "artigos"}`;
  }
})();
