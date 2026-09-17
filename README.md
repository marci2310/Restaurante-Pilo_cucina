# Pilo Cucina — Landing Page

Código-fonte da landing page one-page do restaurante Pilo Cucina.

## Stack

- React + TypeScript + Vite
- Tailwind CSS
- Lucide React
- Google Fonts: Cormorant Garamond e Plus Jakarta Sans

## Executar localmente

```bash
pnpm install
pnpm dev
```

Depois, abra o endereço local exibido pelo Vite.

## Build de produção

```bash
pnpm check
pnpm build
```

## Estrutura principal

- `client/src/pages/Home.tsx`: landing page completa, conteúdo do menu e interações.
- `client/src/index.css`: identidade visual global.
- `client/index.html`: título, descrição e fontes.
- `client/public/assets/`: imagens usadas no hero e na seção “A Casa”.
- `package.json`: dependências e scripts.

## Personalizações importantes

Os links de WhatsApp, iFood, Instagram, Spotify, telefone e horários estão em `client/src/pages/Home.tsx` e devem ser substituídos pelos dados oficiais do restaurante antes da publicação.

A página usa imagens locais em `client/public/assets/` nesta cópia do código-fonte. No projeto WebDev original, os mesmos assets são servidos pelo armazenamento privado do projeto.
