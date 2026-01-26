
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

- Pushes to `main` (and the manual `workflow_dispatch`) run `.github/workflows/gh-pages.yml`, which installs dependencies, executes `npm run generate`, and publishes `.output/public` to the `gh-pages` branch.
- Enable GitHub Pages on the repository root so that the `gh-pages` branch serves `https://<your-user-or-org>.github.io/jointoit-tw/`.
- `nuxt.config.ts` already sets `app.baseURL` to `/jointoit-tw/`, so the generated assets assume that subpath.
