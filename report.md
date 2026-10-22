# Relatório — artigo de manutenção de autorama

## Verificações

- **Contagem do corpo:** OK — 1.276 palavras, dentro da faixa de 1.200 a 1.400. Contagem por script do texto editorial visível; título principal, navegação, legendas, dados de autoria, referências, rodapé e metadados foram excluídos.
- **HTML e hierarquia:** OK — HTML5 em `pt-BR`, viewport, CSS responsivo embutido, um H1 e hierarquia H2/H3.
- **Palavra-chave principal:** OK — no título H1, no início do corpo, em um H2 e no alt da imagem principal.
- **Texto:** OK — não encontrei as fórmulas automáticas proibidas no corpo. O texto diferencia procedimentos conforme o modelo e orienta consulta ao manual.
- **SEO:** OK — title com 46 caracteres; meta description com 143 caracteres; slug `/manutencao-carros-de-autorama/`; Open Graph e Twitter Card presentes.
- **Dados estruturados:** OK — JSON-LD Article e FAQPage são JSON válido e correspondem às perguntas visíveis. Substitua data e autor pelos valores verdadeiros antes da publicação.
- **Imagens:** OK — nove imagens originais, cada uma posicionada junto à seção correspondente, com alt, dimensões 1600 × 900 e legenda. Todas têm versões WebP abaixo de 200 KB e cópias JPG de reserva. Nenhuma imagem contém texto ou logo legível.
- **Links internos:** OK — há links para conteúdo existente no site e três marcadores `{{LINK_INTERNO: ...}}` para futuras páginas internas.
- **AdSense:** OK na revisão editorial — não há conteúdo proibido, promessa exagerada ou incentivo a clique. Há dois pontos reservados apenas por comentários HTML; nenhum anúncio real foi instalado. Isso não garante aprovação do Google.
- **Segurança e precisão:** OK — produtos, lixamento, abertura do motor, escovas e lubrificação são condicionados ao manual e à compatibilidade das peças; sinais de aquecimento anormal orientam interromper o uso.
- **HTML, arquivos e scripts:** OK — imagens e rotas foram verificadas localmente; JSON-LD, `seo.json`, sitemap e sintaxe do JavaScript foram validados.

## Para concluir antes de publicar

O domínio real ainda está como `[INSERIR DOMÍNIO]`. Preencha-o em canonical, metadados e dados estruturados. Troque `{{DATA_DE_PUBLICAÇÃO_ISO}}`, `{{NOME_DO_AUTOR}}` e `{{MINIBIO}}` por informações confirmadas. Os três marcadores de links internos podem ser substituídos à medida que existirem artigos relacionados.

## Arquivos

- `article.html`: página editorial completa e independente, com CSS embutido.
- `manutencao-carros-de-autorama/index.html`: rota SEO solicitada (`/manutencao-carros-de-autorama`).
- `seo.json`: metadados, palavras-chave, textos alternativos e schemas.
- `images/`: nove WebP e nove JPG de reserva.


# Série de pilotagem: curvas sem sair da pista

## Resultados por artigo

| Artigo | Corpo (palavras) | Title | Meta description | Imagens | SEO / HTML / AdSense |
|---|---:|---:|---:|---:|---|
| `controle-acelerador-autorama` | 961 | 56 caracteres | 145 caracteres | 5 WebP + JPG | ok |
| `frenagem-autorama-curvas` | 939 | 51 caracteres | 151 caracteres | 5 WebP + JPG | ok |
| `trajetoria-autorama-curvas` | 930 | 53 caracteres | 146 caracteres | 5 WebP + JPG | ok |
| `aderencia-pneus-autorama` | 958 | 47 caracteres | 152 caracteres | 5 WebP + JPG | ok |
| `tracado-pista-autorama-velocidade-curvas` | 955 | 44 caracteres | 149 caracteres | 5 WebP + JPG | ok |


## Sobreposição textual

Comparação dos conjuntos de sequências distintas de cinco palavras (5-gramas) extraídos do corpo editorial. Percentual = interseção dividida pelo conjunto menor de cada par. Os menus, sumários, figuras/legendas, tabelas, rodapés, metadados e créditos não entram na contagem.

| Par | Compartilhadas | Sobreposição |
|---|---:|---:|
| 1 × 2 | 0 | 0.00% |
| 1 × 3 | 1 | 0.11% |
| 1 × 4 | 3 | 0.32% |
| 1 × 5 | 0 | 0.00% |
| 2 × 3 | 0 | 0.00% |
| 2 × 4 | 0 | 0.00% |
| 2 × 5 | 0 | 0.00% |
| 3 × 4 | 0 | 0.00% |
| 3 × 5 | 5 | 0.54% |
| 4 × 5 | 0 | 0.00% |


Todas as comparações ficaram abaixo de 3%; as cinco aberturas são diferentes.

## Checklist editorial e técnico

- Contagem de cada corpo entre 900 e 1.100 palavras: **ok**; números acima.
- Um H1 por artigo, hierarquia H2/H3, frase-chave no início, H2 e alt principal: **ok**.
- Expressões automáticas proibidas e aberturas repetidas: **ok**, não encontradas.
- Tempos, pesquisas, modelos/marcas, preços e promessas inventadas: **ok**, ausentes.
- Title ≤60 caracteres, meta description entre 140–160, slug, canonical, OG/Twitter e Article/FAQPage JSON-LD válidos: **ok**.
- Interligação de cada artigo aos outros quatro e a manutenção, projeto de pista e comparação analógico/digital: **ok**.
- 25 imagens originais exclusivas, 16:9 (1672 × 941), WebP e JPG, alt, dimensões e figcaption: **ok**. Maior WebP: 197.914 bytes; nenhuma imagem foi reutilizada entre os artigos.
- Imagens sem logos/textos identificáveis e cenas revisadas visualmente: **ok**.
- Conteúdo restrito, afiliados, chamadas de compra, incentivo a anúncios e slots de anúncio: **ok**, ausentes.
- Avisos de segurança e limites por fabricante/modelo: **ok**.
- HTML com tags equilibradas, JSON-LD/JSON parseáveis, arquivos e links locais presentes, sitemap XML válido: **ok**.
- Responsividade, fonte e contraste pelo sistema visual do site; largura de leitura aproximada de 720 px: **ok**.

O domínio público continua como `[INSERIR DOMÍNIO]`, igual à configuração vigente. Cada `articles/<pasta>/article.html` é um artefato editorial `noindex,follow`; as rotas públicas nos slugs correspondentes têm `index,follow` e canonical próprio. Datas e autoria permanecem como placeholders para preenchimento com dados confirmados.
