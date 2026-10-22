# Relatório do artigo: projetar pista de autorama

## Contagem e SEO

- **Contagem do corpo:** 1.474 palavras. Contagem por script com `split()` no conteúdo principal; inclui título, introdução, avisos, títulos de seção, respostas e nota técnica; exclui sumário, figuras/legendas, tempo de leitura e bloco de autoria.
- **H1 e hierarquia:** ok — um H1; H2 para seções e H3 apenas nas perguntas frequentes.
- **Palavra-chave principal:** ok — aparece no início do texto, em um H2 e no texto alternativo da imagem principal.
- **Palavras-chave secundárias:** ok — inseridas no texto sem repetição mecânica.
- **Expressões automáticas proibidas:** ok — checagem por script não encontrou as expressões listadas no pedido.
- **Title e description:** ok — title com 43 caracteres; meta description com 149 caracteres.
- **Slug, canonical, Open Graph e Twitter Card:** ok — rota `/como-projetar-pista-de-autorama/`; o canonical mantém o marcador de domínio já usado no projeto.
- **Arquivo `article.html`:** entregue como cópia completa com `noindex` e canonical para a rota principal em `index.html`, para evitar conteúdo duplicado nos buscadores.
- **Dados estruturados:** ok — JSON-LD Article e FAQPage analisados como JSON válido e coerentes com o conteúdo.

## Imagens e AdSense

- **Imagens:** ok — dez imagens originais geradas para o artigo, em 1672 × 941 px, com WebP e cópia JPG de reserva; cada cena acompanha a seção correspondente e tem alt, dimensões e legenda. O HTML oferece WebP com fallback JPG. A imagem principal tem `fetchpriority="high"`; as outras nove usam carregamento lazy.
- **Tamanho dos WebP:** ok — todos abaixo de 200 KB.
- **Marcas, logos e texto embutido:** ok — imagens revisadas; cenas genéricas, sem marcas reconhecíveis, logotipos, textos ou marcas d'água.
- **Conteúdo e segurança:** ok — material educativo de hobby, sem promessas de desempenho; cuidados remetem ao manual do conjunto, com orientação sobre estabilidade, cabos, líquidos e ventilação da fonte.
- **Afirmações e referências:** ok — sem estudos, preços, depoimentos ou marcas inventados; exemplos de espaço estão identificados como pontos de partida que dependem das peças reais. Nenhum link externo foi incluído.
- **Slots de anúncio:** ok — dois comentários de espaço para anúncio, entre seções e fora de listas.
- **Autoria e publicação:** marcadores mantidos (`{{NOME_DO_AUTOR}}`, `{{MINIBIO}}`, `{{DATA_DE_PUBLICAÇÃO_ISO}}`) porque o projeto não confirma esses dados.

## Verificações

- **HTML:** ok — parser estrutural encontrou tags balanceadas; um H1; alvos do sumário existentes; imagens e rotas internas verificadas.
- **JSON-LD e SEO JSON:** ok — ambos analisados por script.
- **Mobile:** ok — CSS responsivo embutido; conteúdo limitado a aproximadamente 760 px e ajustado para telas estreitas.
- **Público:** hobbistas de autorama, de iniciantes a pessoas com experiência, conforme a abordagem do texto. **Abrangência geográfica:** não declarada no projeto; não foi presumido um território exclusivo.

**Pendência antes de publicar:** substituir o marcador de domínio, a data real, o nome do autor e a minibio por dados confirmados.
