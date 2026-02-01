
## Requirements
- Node.js 20+

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## GitHub Pages Deployment

- Pushes to `main` (and the manual `workflow_dispatch`) run `.github/workflows/nuxtjs.yml`, which installs dependencies, executes `npm run generate`, and publishes `.output/public` to the `github-pages` branch.
- Enable GitHub Pages on the repository root so that the `nuxtjs` branch serves `https://qqqyara.github.io/jointoit-tw/`.


## Technologies

- [Nuxt 3](https://nuxt.com/) for server-rendered/static site structure, routing, and build tooling
- [Vue 3](https://vuejs.org/) + TypeScript for composable frontend components
- [FullCalendar](https://fullcalendar.io/) and `@fullcalendar/vue3` for the scheduling UI
- [Floating UI](https://floating-ui.com/) for positioning popovers and tooltips
- ESLint with the official Nuxt TypeScript config for linting
