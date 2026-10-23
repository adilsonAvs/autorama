(() => {
  const storageKey = "grid-do-autorama.cookie-preferences.v1";
  const clean = value => ({necessary:true, analytics:value?.analytics === true, advertising:value?.advertising === true, updatedAt:value?.updatedAt || null});
  const read = () => { try { const raw = localStorage.getItem(storageKey); return raw ? clean(JSON.parse(raw)) : null; } catch { return null; } };
  const form = document.querySelector("#cookie-preferences-form");
  const status = document.querySelector("#preference-status");
  let current = read();
  window.SITE_COOKIE_PREFERENCES = current || clean(null);

  const write = value => {
    const next = {...clean(value), updatedAt:new Date().toISOString()};
    try { localStorage.setItem(storageKey, JSON.stringify(next)); }
    catch { if (status) status.textContent = "Não foi possível salvar neste navegador. Verifique as permissões de armazenamento."; return false; }
    current = next;
    window.SITE_COOKIE_PREFERENCES = next;
    window.dispatchEvent(new CustomEvent("site:cookie-preferences-change", {detail:next}));
    if (status) status.textContent = `Preferências salvas neste navegador em ${new Date(next.updatedAt).toLocaleString("pt-BR")}.`;
    document.querySelector("#cookie-consent-notice")?.remove();
    return true;
  };

  if (form) {
    form.elements.analytics.checked = current?.analytics === true;
    form.elements.advertising.checked = current?.advertising === true;
    if (current && status) status.textContent = `Preferências encontradas neste navegador, salvas em ${new Date(current.updatedAt).toLocaleString("pt-BR")}.`;
    form.addEventListener("submit", event => { event.preventDefault(); write({analytics:form.elements.analytics.checked, advertising:form.elements.advertising.checked}); });
    form.querySelector('[data-choice="reject"]')?.addEventListener("click", () => { form.elements.analytics.checked = false; form.elements.advertising.checked = false; write({analytics:false, advertising:false}); });
    form.querySelector('[data-choice="accept"]')?.addEventListener("click", () => { form.elements.analytics.checked = true; form.elements.advertising.checked = true; write({analytics:true, advertising:true}); });
  }

  const page = location.pathname.toLowerCase();
  const isPolicyPage = /\/(politica-de-privacidade|politica-de-cookies|preferencias-de-cookies)\.html$/.test(page);
  if (!current && !isPolicyPage && !document.querySelector("#cookie-consent-notice")) {
    const notice = document.createElement("aside");
    notice.id = "cookie-consent-notice";
    notice.className = "cookie-consent-notice";
    notice.setAttribute("aria-labelledby", "cookie-consent-title");
    notice.innerHTML = '<div><h2 id="cookie-consent-title">Suas preferências</h2><p>Esta cópia salva suas escolhas de análise e publicidade no armazenamento local. Nenhuma ferramenta de análise ou anúncio está instalada.</p><a href="preferencias-de-cookies.html">Ver opções</a></div><div class="cookie-consent-actions"><button type="button" data-consent="reject">Recusar opcionais</button><button type="button" data-consent="accept">Aceitar opcionais</button></div>';
    document.body.append(notice);
    notice.querySelector('[data-consent="reject"]').addEventListener("click", () => write({analytics:false, advertising:false}));
    notice.querySelector('[data-consent="accept"]').addEventListener("click", () => write({analytics:true, advertising:true}));
  }
})();
