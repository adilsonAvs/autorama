(() => {
  const config = window.SITE_CONFIG || {};
  const valid = value => typeof value === "string" && value.trim() !== "" && !value.includes("[");
  const domain = valid(config.domain) ? config.domain.replace(/\/$/, "") : (location.protocol === "http:" || location.protocol === "https:" ? location.origin : "");
  if (domain) {
    const url = `${domain}/politica-de-cookies.html`;
    const canonical = document.querySelector('link[rel="canonical"]'); if (canonical) canonical.href = url;
    const og = document.querySelector('meta[property="og:url"]'); if (og) og.content = url;
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(config.privacyLastUpdated || "")) {
    const date = document.querySelector("[data-privacy-date]");
    if (date) { date.dateTime = config.privacyLastUpdated; date.textContent = new Date(`${config.privacyLastUpdated}T12:00:00`).toLocaleDateString("pt-BR", {day:"numeric",month:"long",year:"numeric",timeZone:"UTC"}); }
  }
  document.querySelectorAll("[data-contact-email]").forEach(node => { if (valid(config.contactEmail)) { node.textContent = config.contactEmail; node.href = `mailto:${config.contactEmail}`; } });
})();
