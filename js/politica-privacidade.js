(() => {
  const config = window.SITE_CONFIG || {};
  const valid = value => typeof value === "string" && value.trim() !== "" && !value.includes("[");
  const configuredDomain = valid(config.domain) ? config.domain.replace(/\/$/, "") : "";
  const domain = configuredDomain || (location.protocol === "http:" || location.protocol === "https:" ? location.origin : "");
  const absolute = path => domain ? `${domain}/${path.replace(/^\//, "")}` : new URL(path, location.href).href;
  const setText = (selector, value) => { if (valid(value)) document.querySelectorAll(selector).forEach(node => node.textContent = value); };
  setText("[data-site-domain]", config.domain);
  setText("[data-editor-name]", config.editorName);
  document.querySelectorAll("[data-contact-email]").forEach(node => {
    if (valid(config.contactEmail)) { node.textContent = config.contactEmail; node.href = `mailto:${config.contactEmail}`; }
  });
  const updated = document.querySelector("[data-privacy-date]");
  if (updated && /^\d{4}-\d{2}-\d{2}$/.test(config.privacyLastUpdated || "")) {
    updated.dateTime = config.privacyLastUpdated;
    updated.textContent = new Date(`${config.privacyLastUpdated}T12:00:00`).toLocaleDateString("pt-BR", {day:"numeric", month:"long", year:"numeric", timeZone:"UTC"});
  }
  const setState = (name, active) => document.querySelectorAll(`[data-${name}-state]`).forEach(node => { node.hidden = node.dataset[`${name}State`] === (active ? "off" : "on"); });
  setState("adsense", config.adsenseAtivo === true);
  setState("analytics", config.analyticsAtivo === true);

  if (domain) {
    const pageUrl = absolute("politica-de-privacidade.html");
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.href = pageUrl;
    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.content = pageUrl;
    const breadcrumb = {"@type":"BreadcrumbList","itemListElement":[
      {"@type":"ListItem","position":1,"name":"Início","item":absolute("index.html")},
      {"@type":"ListItem","position":2,"name":"Política de Privacidade","item":pageUrl}
    ]};
    const webpage = {"@type":"WebPage","@id":`${pageUrl}#webpage`,"url":pageUrl,"name":document.title,"description":document.querySelector('meta[name="description"]').content,"inLanguage":config.language || "pt-BR","about":{"@type":"Thing","name":"Privacidade e tratamento de dados pessoais"},"breadcrumb":{"@id":`${pageUrl}#breadcrumb`}};
    const jsonld = document.createElement("script"); jsonld.type = "application/ld+json"; jsonld.textContent = JSON.stringify({"@context":"https://schema.org","@graph":[webpage,{...breadcrumb,"@id":`${pageUrl}#breadcrumb`}]}); document.head.append(jsonld);
  }
})();
