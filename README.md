# JurisAI — Inteligência Jurídica de Elite

Landing page de alta conversão para automação de petições jurídicas com IA.

## Stack
- React 19 + TypeScript
- Vite 6
- Tailwind CSS v4
- Framer Motion (motion/react)
- Lucide React

## Rodar localmente

```bash
npm install
npm run dev
```

## Deploy no Vercel

1. Extraia este ZIP → entre na pasta → `git init && git add . && git commit -m "init"`
2. Push para GitHub
3. Importe no [vercel.com](https://vercel.com)
4. Framework: **Vite** · Build: `npm run build` · Output: `dist`
5. Deploy — sem variáveis de ambiente necessárias.

## Estrutura

```
jurisai/
├── index.html          ← raiz (NUNCA mover para src/)
├── vite.config.ts
├── package.json
├── tsconfig.json
├── vercel.json
└── src/
    ├── main.tsx
    ├── App.tsx
    └── index.css
```
