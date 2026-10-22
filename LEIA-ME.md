# Política de Privacidade — manutenção

## Serviços no estado atual

- Google AdSense: sem tag, ID de publisher ou solicitação a anúncios na cópia local; `adsenseAtivo: false` em `js/config.js` reflete o funcionamento verificável deste diretório.
- Google Analytics: desligado; `analyticsAtivo: false` em `js/config.js`.
- Formulário de contato: usa Web3Forms (`api.web3forms.com/submit`) para processar e encaminhar nome, e-mail e mensagem.
- Preferências: `preferencias-de-cookies.html` armazena escolhas de análise e publicidade em `localStorage`; nenhum script de análise ou anúncios está instalado. O controle próprio não é CMP certificada.
- Fontes externas: nenhuma carregada pelo CSS do site.
- Hospedagem: ainda não informada; confirme o provedor, logs, cookies técnicos, retenção e localização do tratamento antes de publicar.

## Atualizar os blocos de estado

As flags não instalam ferramentas nem scripts. Marque AdSense ou Analytics como ativo somente após configurar e verificar a integração real, incluindo consentimento e revogação onde necessários. Atualmente ambos estão desligados na cópia local.

O banner e a página de preferências guardam somente a escolha local; não carregam nem bloqueiam serviços que ainda não existem no projeto. Antes de integrar anúncios ou Analytics, ligue carregamento dos scripts à categoria consentida e valide o fluxo de recusa e revogação. Para anúncios personalizados no EEE, Reino Unido e Suíça, use CMP certificada pelo Google e integrada ao TCF do IAB.

## Dados centrais e publicação

- Complete em `js/config.js`: domínio, e-mail oficial e responsável editorial.
- Atualize `privacyLastUpdated` em `js/config.js` ao revisar as políticas.
- Atualize canônicos, Open Graph, sitemap e `robots.txt` para o domínio real. O JSON-LD da Política de Privacidade é criado quando há domínio configurado ou quando a página é servida por HTTP(S).
- Resolva os marcadores pendentes listados em `RELATORIO-PRIVACIDADE.md`, em especial provedor e retenção.
- A rota pública definitiva é `politica-de-privacidade.html`; `privacidade.html` é um redirecionamento legado. `politica-de-cookies.html` é a rota definitiva de cookies.


O formulário envia dados a um fornecedor externo. Antes da publicação, confirme os termos, a retenção, a localização do processamento e as informações de privacidade do Web3Forms. A chave de acesso enviada pelo responsável foi inserida no HTML público do formulário.
