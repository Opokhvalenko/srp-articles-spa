# SRP Articles SPA

Single Page Application на React + TypeScript, побудований за принципом **Single Responsibility Principle**.

## Стек

- **Vite + React + TypeScript**
- **Material UI** для UI-компонентів
- **SASS (SCSS)** як CSS-препроцесор
- **React Router** для маршрутизації
- **ESLint + Prettier + Biome** для якості коду

## Гілки

- `feat/01-project-setup` – базове налаштування проєкту:
  - Vite + React + TS
  - ESLint + Prettier + Biome
  - Material UI, SASS
  - Базовий Layout, Router, сторінки Home / Article

Наступні гілки будуть містити:

- реалізацію API-шару та кастомного hook
- головну сторінку зі списком статей, фільтром і підсвіткою
- сторінку статті
- простий state management (Context + Reducer або інше рішення)
