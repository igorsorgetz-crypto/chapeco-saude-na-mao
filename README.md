# Chapeco Saude na Mao

Projeto React com Vite exportado do prototipo Figma Make.

## Desenvolvimento local

```bash
npm ci
npm run dev
```

## Build de producao

```bash
npm run build
```

## Deploy automatico no GitHub Pages

O deploy esta configurado em `.github/workflows/deploy-pages.yml`.

- Dispara automaticamente em push para as branches `development` e `main`.
- Pode ser executado manualmente em **Actions > Deploy to GitHub Pages**.
- Publica o build em `dist/` usando as actions oficiais de Pages.
- O roteamento usa `HashRouter`, evitando erro 404 em refresh de paginas internas no GitHub Pages.

Repositorio:

`https://github.com/igorsorgetz-crypto/chapeco-saude-na-mao`

URL de publicacao:

`https://igorsorgetz-crypto.github.io/chapeco-saude-na-mao/`

## Configuracao necessaria no GitHub (uma unica vez)

1. Acesse `Settings > Pages` do repositorio.
2. Em **Build and deployment**, selecione **Source: GitHub Actions**.
3. Faca push na branch `development` ou `main` para disparar o primeiro deploy.
