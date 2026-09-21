# Consumidores sem public/flags

Execute `npm run build` e `npm run test:flags-consumers` na raiz do DS.
O script cria um diretório temporário fora do repositório, empacota o dist,
instala o tarball (sem symlink) e dependências e copia somente este fixture.
Não existe diretório public nesse consumidor.

O mesmo formulário é compilado por Next.js (App Router) e Vite. O teste abre
os builds de produção no Chromium, verifica SSR no Next, carregamento real
das imagens, seleção de país, ausência de erros de hidratação e de requisições
para /flags. O diretório temporário é removido no final.

Requer acesso ao npm e Chromium do Playwright instalado. As versões de teste
estão fixadas no script (Next 16.3.5, consultado no npm, e Vite 8.3.0, já usado
pelo piloto); não representam uma versão/release do Design System.

Para desenvolvimento interativo, o piloto Vite completo continua disponível
por `npm run pilot:prepare` e `npm run pilot:dev`, sem copiar bandeiras.
