param(
  [Parameter(Mandatory = $true)]
  [ValidateSet('Enviar', 'Publicar')]
  [string]$Etapa
)

$ErrorActionPreference = 'Stop'
Set-Location (Split-Path $PSScriptRoot -Parent)

function Invoke-Git {
  & git @args
  if ($LASTEXITCODE -ne 0) { throw "Git falhou: $args" }
}

if ($Etapa -eq 'Enviar') {
  $branch = git branch --show-current
  if ($LASTEXITCODE -ne 0 -or $branch -ne 'release/0.8.0') {
    throw 'Execute na branch release/0.8.0 preparada para esta entrega.'
  }
  npm run check:release -- v0.8.0
  if ($LASTEXITCODE -ne 0) { throw 'Manifestos divergentes.' }
  # Escopo da entrega; preserva .vscode e arquivos locais ignorados.
  Invoke-Git add -- .github CHANGELOG.md README.md package.json package-lock.json docs examples/pilot/package.json examples/pilot/package-lock.json scripts src stories tests tokens playwright.reconciliation.config.ts
  Invoke-Git diff --cached --check
  Invoke-Git diff --cached --stat
  Invoke-Git commit -m 'feat: consolidar temas, graficos e ilustracoes e preparar 0.8.0'
  Invoke-Git push -u origin release/0.8.0
  Write-Host 'Abra a PR, aguarde os checks e faca o merge:'
  Write-Host 'https://github.com/Aspprev/versi-design-system/compare/master...release/0.8.0?expand=1'
  Write-Host 'Somente depois do merge execute este script com -Etapa Publicar.'
  exit 0
}

# Publicar: executar somente apos o merge da PR e todos os checks aprovados.
$pending = git status --porcelain --untracked-files=no
if ($LASTEXITCODE -ne 0 -or $pending) { throw 'Existem alteracoes rastreadas sem commit.' }
Invoke-Git switch master
Invoke-Git pull --ff-only origin master
npm run check:release -- v0.8.0
if ($LASTEXITCODE -ne 0) { throw 'A master ainda nao contem os manifestos da 0.8.0.' }
$remoteTag = git ls-remote --tags origin refs/tags/v0.8.0
if ($LASTEXITCODE -ne 0) { throw 'Nao foi possivel conferir a tag remota.' }
if ($remoteTag) { throw 'v0.8.0 ja existe no remoto. Acompanhe a Action; nao recrie a tag.' }
$localTag = git tag --list v0.8.0
if ($LASTEXITCODE -ne 0) { throw 'Nao foi possivel conferir a tag local.' }
if ($localTag) { throw 'v0.8.0 ja existe localmente. Confira seu destino antes de continuar.' }
Invoke-Git tag -a v0.8.0 -m 'Release 0.8.0'
Invoke-Git push origin v0.8.0
Write-Host 'A tag aciona a validacao e a publicacao automatica no npm:'
Write-Host 'https://github.com/Aspprev/versi-design-system/actions'
Write-Host 'Aguarde o job publish concluir antes de instalar a 0.8.0 no consumidor.'
