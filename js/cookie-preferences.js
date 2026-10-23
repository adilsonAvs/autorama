(() => {
  const storageKey = "grid-do-autorama.cookie-preferences.v1";
  const clean = value => ({necessary:true, analytics:value?.analytics === true, advertising:value?.advertising === true, updatedAt:value?.updatedAt || null});
  const read = () => { try { const raw = localStorage.getItem(storageKey); return raw ? clean(JSON.parse(raw)) : null; } catch { return null; } };
  const form = document.querySelector("#cookie-preferences-form");
  const status = document.querySelector("#preference-status");
  let current = read();
  window.SITE_COOKIE_PREFERENCES = current || clean(null);

  const config = window.SITE_CONFIG || {};
  let configuredHost = "";
  try { configuredHost = new URL(config.domain).hostname.toLowerCase(); } catch { /* Sem domínio público válido, o Analytics fica desligado. */ }
  const measurementId = config.analyticsAtivo === true
    && location.hostname.toLowerCase() === configuredHost
    && /^G-[A-Z0-9]+$/.test(config.googleAnalyticsId || "")
    ? config.googleAnalyticsId
    : "";
  let analyticsInitialized = false;
  let analyticsConsent = current?.analytics === true;

  const initializeAnalytics = () => {
    if (!measurementId || analyticsInitialized) return;
    window[`ga-disable-${measurementId}`] = false;
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function gtag(){window.dataLayer.push(arguments);};
    window.gtag("consent", "default", {analytics_storage:"denied"});
    window.gtag("consent", "update", {analytics_storage:"granted"});
    window.gtag("js", new Date());
    window.gtag("config", measurementId);
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
    script.dataset.googleAnalytics = measurementId;
    document.head.append(script);
    analyticsInitialized = true;
  };

  const updateAnalyticsConsent = granted => {
    if (!measurementId || granted === analyticsConsent) return;
    analyticsConsent = granted;
    if (granted) {
      if (!analyticsInitialized) {
        initializeAnalytics();
      } else {
        window[`ga-disable-${measurementId}`] = false;
        window.gtag("consent", "update", {analytics_storage:"granted"});
        window.gtag("event", "page_view", {
          page_title: document.title,
          page_location: location.href,
          page_path: `${location.pathname}${location.search}`
        });
      }
    } else if (analyticsInitialized) {
      window[`ga-disable-${measurementId}`] = true;
      window.gtag("consent", "update", {analytics_storage:"denied"});
    }
  };

  if (analyticsConsent) initializeAnalytics();
  window.addEventListener("site:cookie-preferences-change", event => {
    updateAnalyticsConsent(event.detail?.analytics === true);
  });

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
    notice.innerHTML = '<div><h2 id="cookie-consent-title">Suas preferências</h2><p>O Google Analytics 4 só será carregado se você aceitar análise. Você pode alterar essa escolha a qualquer momento.</p><a href="preferencias-de-cookies.html">Ver opções</a></div><div class="cookie-consent-actions"><button type="button" data-consent="reject">Recusar opcionais</button><button type="button" data-consent="accept">Aceitar opcionais</button></div>';
    document.body.append(notice);
    notice.querySelector('[data-consent="reject"]').addEventListener("click", () => write({analytics:false, advertising:false}));
    notice.querySelector('[data-consent="accept"]').addEventListener("click", () => write({analytics:true, advertising:true}));
  }
})();
