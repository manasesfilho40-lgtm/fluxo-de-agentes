Nota: workflow criado para publicar o diretório templates/advocacia na branch gh-pages ao dar push nesta branch (convert/dental-to-advocacia). O GitHub Actions usará o GITHUB_TOKEN automático para criar/atualizar a branch gh-pages.

Como ativar:
- Faça push para a branch convert/dental-to-advocacia (já feita). O workflow será disparado e atualizará gh-pages com os arquivos estáticos.
- Ou execute o workflow manualmente em Actions -> Deploy Advocacia Site -> Run workflow.

URL prevista (após o Actions criar gh-pages):
https://manasesfilho40-lgtm.github.io/fluxo-de-agentes/

Se preferir que o site seja publicado em outro diretório (templates/index.html) ou com outro branch, eu atualizo o workflow.
