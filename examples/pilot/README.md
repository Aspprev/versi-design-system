# Aplicação piloto do Design System

Aplicação React/Vite privada, que consome o tarball npm do Design System pelos
entrypoints públicos. Possui package.json, lockfile e node_modules próprios.
Não usa aliases, symlinks ou imports dos fontes do DS e não precisa de Tailwind.

## Preparar e abrir

Na raiz de ds-versi:

```bash
npm run pilot:prepare
npm run pilot:dev
```

Abra http://127.0.0.1:4175. A preparação executa npm pack com as verificações
prepack, instala o .tgz em examples/pilot e copia as 250 bandeiras do pacote
instalado para public/flags. O nome do artefato é derivado do manifesto atual;
a preparação não altera a versão nem publica no npm.

Para testar o resultado de produção:

```bash
npm run test:pilot
```

O comando executa TypeScript strict e vite build, inicia vite preview e roda
Playwright/Axe em Chromium desktop e mobile. É necessário ter instalado o
Chromium do Playwright (`npx playwright install chromium`).

Depois dos testes, é possível abrir manualmente o mesmo build:

```bash
npm --prefix examples/pilot run preview
```

## O que o piloto demonstra

- Formulário Formik com validação, Input, SelectCountry e InputPhone.
- Bandeiras locais servidas pelo consumidor em /flags.
- Table com os contatos adicionados, Notice e confirmação em Modal.
- Temas claro/escuro, alto contraste, paletas e escala tipográfica.
- Fonte system-ui configurada pelo consumidor, sem downloads externos.
- CSS próprio baseado nos tokens públicos; CSS do DS já compilado.

Os dados são fictícios e permanecem na memória da página. Recarregar reinicia
o cadastro. O piloto não possui backend nem envia dados a serviços externos.

## Artefatos e manutenção

`vendor/*.tgz`, `public/flags`, `dist` e `node_modules` são gerados e ignorados
pelo Git. Após uma mudança no DS, rode novamente pilot:prepare para atualizar
o pacote instalado e depois test:pilot. O lockfile do piloto deve ser versionado.

O relatório fica em playwright-report/pilot e capturas em test-results/pilot,
na raiz do repositório. A suíte verifica validação/envio, busca de país por
teclado, Escape e retorno de foco do modal, crescimento da fonte, ausência de
rolagem horizontal da página, bandeiras, erros de runtime/rede e Axe.

A instalação foi projetada para validar core/forms/overlays/countries e CSS;
gráficos e documentos não são usados nesta tela. Todos os entrypoints também
têm o teste isolado geral `npm run test:package` no repositório.
