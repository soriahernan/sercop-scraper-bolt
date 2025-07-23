# SERCOP Scraper Bolt

Aplicación web desarrollada con **Next.js + Puppeteer**, desplegada para Bolt.dev, que permite buscar procesos de contratación pública en el portal del SERCOP mediante RUC.

## 🔍 Funcionalidad
- Ingresas el RUC de una entidad pública.
- Realiza scraping con Puppeteer al portal del SERCOP.
- Muestra los procesos encontrados en una interfaz moderna.

## 🚀 Tecnologías
- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Puppeteer](https://pptr.dev/)
- [Bolt.dev](https://bolt.dev)

## 🛠 Instalación

```bash
npm install
npm run dev
```

## ⚠️ Notas
- Puppeteer requiere entorno compatible con Chromium.
- Para producción en Vercel o entornos serverless, considera usar `puppeteer-core` + `chrome-aws-lambda`.

---

Desarrollado por [Tu Nombre].
