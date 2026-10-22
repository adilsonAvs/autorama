# Revisão institucional e privacidade — Grid do Autorama

**Revisão:** 15 de outubro de 2026. **Idioma:** português do Brasil.

## Estado verificado no diretório

- `js/config.js` traz `[INSERIR DOMÍNIO]`, sem domínio público configurado. Nenhum endereço foi inventado; canônicos mantêm o marcador em arquivo e usam domínio configurado ou host público corrente quando servido por HTTP(S).
- O conteúdo e as categorias indicam público editorial interessado em autorama/automobilismo em miniatura. O idioma está em `pt-BR`; o recorte geográfico e o perfil de visitantes reais não estão confirmados. Não há Analytics nem artigos efetivamente publicados que permitam afirmar audiência medida.
- A cópia não contém tag de AdSense, publisher ID nem código de anúncio; Analytics também está desligado. A flag de AdSense foi alinhada para `false`.
- Contato envia nome, e-mail e mensagem ao Web3Forms. A política agora explica o fornecedor, a retenção divulgada pelo fornecedor e seu possível processamento internacional.
- Preferências ficam em `localStorage` no navegador. O banner e a página de preferências permitem aceitar, recusar ou alterar categorias opcionais. Nenhum script de publicidade ou análise é instalado ou ativado pelas escolhas, pois esses serviços não existem nesta cópia.
- O controle próprio não se declara CMP certificada. Se anúncios personalizados forem exibidos no EEE, Reino Unido ou Suíça, os requisitos atuais do Google pedem CMP certificada e integrada ao TCF.

## Seis páginas revisadas

- `equipe.html`: público editorial, idioma, alcance geográfico não confirmado e responsabilidade editorial sem inventar nomes ou credenciais.
- `politica-de-privacidade.html`: formulário Web3Forms, armazenamento local, terceiros, ausência de tags e direitos.
- `politica-de-cookies.html`: cookies próprios ausentes, `localStorage` para escolhas, categorias e serviço externo.
- `termos.html`: uso do conteúdo, envio de mensagens, serviços externos e cuidados para informações técnicas.
- `aviso-legal.html`: limites editoriais e status real da implementação publicitária.
- `preferencias-de-cookies.html`: novo controle de preferências, não indexado, com persistência local e ações de aceitar, recusar e salvar.

O rodapé aponta para a página de preferências. O domínio continua a ser preenchido em `js/config.js`, nos canônicos e no sitemap quando confirmado pelo responsável.

## Fontes externas consultadas

- [Política de Privacidade do Web3Forms](https://web3forms.com/privacy) — descreve processamento de submissões, infraestrutura, transferências e retenção máxima publicada de três anos (sujeita às condições do plano e exclusão anterior).
- [Google AdSense: requisitos de CMP certificada](https://support.google.com/adsense/answer/13554116?hl=pt-BR) — requisitos para anúncios personalizados no EEE, Reino Unido e Suíça.
- [LGPD — Lei nº 13.709/2018, texto compilado](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm).

## Pendências para publicação

- Definir o domínio público; nome do responsável pelo tratamento e canal direto de privacidade.
- Confirmar hospedagem, logs e retenção; revisar a configuração/condições do Web3Forms e definir armazenamento/retirada das mensagens no destino de e-mail.
- Se anúncios ou Analytics forem ativados, instalar e validar os scripts com bloqueio até a escolha adequada, recusa e revogação; atualizar políticas. Para anúncios personalizados nas regiões cobertas, configurar CMP certificada e TCF.
- Completar revisão jurídica das bases e avisos segundo a operação real.

## Validação técnica

- Sintaxe verificada com `node --check` para JavaScript alterado.
- Verificado que rotas locais das seis páginas existem e que o link de preferências não aponta mais para uma seção informativa da política.
- Preferências implementadas com gravação/leitura em `localStorage`, estado inicial seguro (opcionais desligadas), rejeição, aceitação e alteração posterior; eventos `site:cookie-preferences-change` ficam disponíveis para integração futura.
- Não foi feita validação visual no navegador por a navegação local `file://` estar bloqueada nesta sessão. A inspeção visual em produção deve ocorrer depois de preencher o domínio.
