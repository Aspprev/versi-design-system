# Publicar 0.5.8

Manifestos e changelog preparados. Execute no PowerShell, na raiz do repositório. Os comandos abaixo fazem commit de todas as alterações atuais; não execute `npm version` novamente.

## Commit, push e PR

```powershell
npm run check:release -- v0.5.8
git add .
git commit -m "release: preparar versi-ds 0.5.8"
git push -u origin docs/storybook-colors
gh pr create --base master --head docs/storybook-colors --title "release: versi-ds 0.5.8" --body-file docs/PR-0.5.8.md
```

Se a PR dessa branch já estiver aberta, use-a; não é necessário criar outra. Também pode abrir e mesclar pela interface do GitHub.

## Após mesclar a PR

Execute somente depois da mesclagem. A tag deve apontar para o commit de release na master, inclusive se a PR foi mesclada por squash.

```powershell
git switch master
git pull --ff-only origin master
npm run check:release -- v0.5.8
git tag -a v0.5.8 -m "Release 0.5.8"
git push origin v0.5.8
gh run list --workflow publish.yml --limit 5
```

O push da tag aciona **Publish package**. O workflow valida, constrói o pacote e publica o artefato validado via npm trusted publishing. Não é necessário executar `npm publish` localmente. Se o ambiente `npm-publish` solicitar aprovação no GitHub, aprove o deployment para liberar a publicação.

Após o workflow terminar com sucesso, no projeto consumidor:

```powershell
npm install @aspprev/versi-ds@0.5.8
```

No portal, desative a prévia antiga com `?previewTema=0` para avaliar os novos tokens sem as sobrescritas inline anteriores. Consulte `correcao-legibilidade/RELATORIO.md` para sincronizar a prévia.
