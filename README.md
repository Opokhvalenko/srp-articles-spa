# SRP Articles SPA

Single Page Application на **React + TypeScript**, побудований за принципом **Single Responsibility Principle**.

## Вимоги з ТЗ, які реалізовані

### Home
- Завантаження **100** статей з відкритого API (Spaceflight News API v4)
- Список карток з:
  - **title**
  - **truncated description** (до 100 символів)
- Клік по картці відкриває **Article page**

### Article page
- Відображає **title** та **full description** обраної статті

### Filter
- Поле вводу для **кількох ключових слів**
- Показує статті, де хоча б **один keyword** є в `title` або `description`
- **Пріоритет title над description** при сортуванні результатів
- **Підсвітка збігів** (жовтим) у `title` та `description`

## Технічні вимоги

- **TypeScript**
- **SCSS (SASS)**
- **Material UI**
- Приклад **custom hook** (`useSelectedArticle`)
- Приклад **state management** (Zustand store)

## Архітектура

- **API layer**: `src/api/articlesApi.ts`
  - універсальний `fetchJson` + `fetchAndParse`
  - валідація відповідей через **Zod**
- **Single source of truth**: `src/features/articles/store/useArticlesStore.ts`
  - list state + filter state + selected article state
  - derived state (filtered + keywords) обчислюється в одному місці
- **Utils**: `src/features/articles/utils/filterArticles.ts`
  - парсинг keywords, фільтрація, скоринг/сортування, truncate
- **UI**:
  - сторінки мінімальні (“тонкі”), логіка в store/hooks/utils
  - `HighlightedText` відповідає тільки за підсвітку
- **Routing**: `src/router/index.tsx`
  - `/` і `/articles/:id`
  - `React.lazy` + `Suspense` (code-splitting)

## Запуск локально

```bash
npm ci
npm run dev
```

## Перевірка якості

```bash
npm run verify
```
## Additional improvements
- **Persistence (sessionStorage)**: filter and selected article state are persisted via Zustand `persist` middleware.
- **ErrorBoundary**: global error boundary to gracefully handle unexpected runtime UI errors.
- **404 fallback**: unknown routes redirect to `/`.