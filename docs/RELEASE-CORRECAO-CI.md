# Corrigir a publicação bloqueada da 0.5.8

As duas Actions falharam em `npm run check:security`: o Vite 8.3.0 do Storybook e do piloto estava associado a três alertas de `launch-editor`. O build do DS passou e as dependências de produção estavam sem alertas. A etapa de publicação foi corretamente pulada; a conclusão do deployment da Vercel não significa publicação no npm.

Logs consultados:

- [Publicação](https://github.com/Aspprev/versi-design-system/actions/runs/39525468751/job/118978930626).
- [Segurança](https://github.com/Aspprev/versi-design-system/actions/runs/39525468759/job/118978930482).

Vite atualizado para 8.3.4 no lockfile do DS e no manifesto/lockfile do piloto. As quatro auditorias locais passaram sem alertas; os 203 testes unitários passaram, o Storybook compilou e o piloto foi preparado com o tarball 0.5.8, instalado e compilado. Nenhum gate foi removido e nenhum componente ou placeholder foi alterado nesta correção.

## Preparar manualmente a 0.5.9

O manifesto ainda está em 0.5.8. Os comandos abaixo preparam a próxima versão sem mover a tag existente. Execute na raiz do DS, no PowerShell. Este fluxo considera a master atual com a correção local ainda sem commit.

```powershell
git switch -c fix/vite-security-0.5.9
npm version 0.5.9 --no-git-tag-version --ignore-scripts
```

Em `CHANGELOG.md`, troque apenas o título `## Não lançado` por `## 0.5.9 — correção da validação de segurança`.

```powershell
npm run check:release -- v0.5.9
git add package.json package-lock.json examples/pilot/package.json examples/pilot/package-lock.json CHANGELOG.md docs/EVOLUCAO-DESIGN-SYSTEM.md docs/RELEASE-CORRECAO-CI.md
git commit -m "fix: atualizar Vite e preparar release 0.5.9"
git push -u origin fix/vite-security-0.5.9
```

Abra a [PR pelo navegador](https://github.com/Aspprev/versi-design-system/compare/master...fix/vite-security-0.5.9?expand=1). Título sugerido: `fix: corrigir auditoria do Vite e publicar 0.5.9`. Os arquivos pessoais e alterações locais do guia anterior não entram no commit acima.

Após mesclar a PR:

```powershell
git switch master
git pull --ff-only origin master
npm run check:release -- v0.5.9
git tag -a v0.5.9 -m "Release 0.5.9"
git push origin v0.5.9
```

Acompanhe [Actions](https://github.com/Aspprev/versi-design-system/actions) e espere **Publish package / publish** terminar com sucesso. Não basta somente validar ou ter a Vercel verde. Reexecutar a Action da v0.5.8 usa o commit antigo e não resolve esse bloqueio.

Depois da publicação, na pasta do consumidor:

```powershell
npm install @aspprev/versi-ds@0.5.9
```
