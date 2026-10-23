# Guia de publicação

Este é um site estático: não há CMS, banco de dados nem servidor que publique artigos sozinho. Os artigos são arquivos HTML. A rotina de Destaques automatiza a descoberta e a ordenação desses arquivos quando o modo de observação está ativo ou durante a etapa de build/publicação.

## Publicar um artigo

1. Copie `modelo-artigo.html` para um novo arquivo HTML com slug simples, por exemplo `como-montar-uma-pista.html`, ou crie uma pasta de rota com `index.html`.
2. Edite título, descrição, URL canônica, categoria, conteúdo, autoria e datas. Não use a data de atualização como data de criação.
3. Troque a imagem demonstrativa por uma imagem licenciada, otimizada e com texto alternativo descritivo. Ajuste dimensões e legenda.
4. Remova `noindex,nofollow` e o aviso interno do modelo. Confira todos os campos entre colchetes.
5. Durante a edição, deixe `npm run highlights:watch` ativo no diretório do site. Ao salvar o HTML do artigo, o gerador detecta a página, grava `article:created_at` uma única vez e atualiza `js/generated-articles.js`. O artigo aparece automaticamente nos Destaques da página inicial.
6. Antes de publicar ou gerar uma cópia final, execute `npm run highlights:build`. Não edite `js/generated-articles.js` manualmente: ele é gerado a partir das páginas de artigo.
7. Adicione a URL canônica real ao `sitemap.xml` e confira links, navegação móvel e renderização.
8. Publique o novo arquivo junto com os demais no serviço de hospedagem.

## Datas e ordem dos Destaques

O gerador usa exclusivamente o campo `article:created_at`. Para páginas antigas sem esse campo, ele grava uma única vez a data de criação original do arquivo, preservada pelo sistema de arquivos local. Nunca usa `dateModified` ou a última alteração como substituto. Os artigos mais novos aparecem primeiro; quando os horários coincidem, o slug em ordem alfabética decide a posição, de forma estável. Artigos duplicados com a mesma URL canônica aparecem uma única vez.

## Comandos

- `npm run highlights:watch`: observa salvamentos de arquivos HTML e atualiza o índice durante a edição.
- `npm run highlights:build`: atualiza o índice antes de visualizar/publicar a versão estática.
- `npm run test:highlights`: testa inclusão, ordem, empate, edição de artigo antigo e eliminação de duplicatas.

## Configuração antes de lançar

Edite `js/config.js` para preencher domínio, slogan, e-mail oficial e responsável editorial com dados verdadeiros. Atualize o sitemap com o domínio escolhido; os canônicos usam o domínio configurado ou o host público quando servidos por HTTP(S). Não preencha IDs de Analytics ou AdSense até configurar esses serviços, revisar privacidade/consentimento e confirmar aprovação aplicável. O controle local de preferências não é CMP certificada nem ativa scripts: integre cada serviço para respeitar escolhas antes de publicar.

## Artigos e publicidade

O modelo contém estrutura editorial e um espaço de publicidade inicialmente oculto. Não o ative antes de aprovação e configuração da conta. Mantenha anúncios distinguíveis do conteúdo e longe de controles de navegação ou interação.
