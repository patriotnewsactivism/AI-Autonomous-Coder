# Repository Guidelines

## Project Structure & Module Organization

- `index.html` / `index-simple.html`: entry points for the static PWA UI.
- `enhanced-ui.js`, `autonomous-agents.js`, `ai-providers.js`: core browser-side logic (agent orchestration, UI, provider adapters).
- `enhanced-styles.css`, `sw.js`, `manifest.json`, icons: PWA assets and styling.
- `functions/`: Firebase Cloud Functions (`functions/index.js`) and its own `functions/package.json`.
- `.github/workflows/`: CI (HTML validation, build/test/lint placeholders, deploy pipelines).
- `firebase.json`, `.firebaserc`, `firestore.rules`, `database.rules.json`: Firebase hosting + security rules.

## Build, Test, and Development Commands

```bash
npm ci
npm run dev        # local server with live reload (serve)
npm start          # local server on :3000
npm run format     # prettier --write .

cd functions
npm install
npm run serve      # Firebase emulators (functions)
npm run deploy     # deploy functions
```

CI also runs `npx html-validate index.html` (see `.github/workflows/deploy.yml`).

## Coding Style & Naming Conventions

- Indentation: 2 spaces (HTML/CSS/JS).
- JavaScript: keep existing style (classes `PascalCase`, functions/vars `camelCase`, constants `UPPER_SNAKE_CASE`).
- File naming: prefer `kebab-case` for new JS/CSS/HTML files (e.g., `enhanced-ui.js`).
- Formatting: run `npm run format` on touched files; avoid reformatting unrelated code.

## Testing Guidelines

- Root `npm test` is currently a placeholder; validate changes by:
  - Running `npx html-validate index.html`
  - Manually loading `index.html` and exercising affected flows
- If you add automated tests, name them `*.test.js` and update `package.json` scripts accordingly.

## Commit & Pull Request Guidelines

- Commit messages follow an imperative style (e.g., `Add ...`, `Fix ...`, `Refactor: ...`).
- PRs should include: a clear description, testing notes, and screenshots for UI changes.
- Keep changes scoped; update docs (`README.md`, `DEPLOYMENT.md`) when behavior or config changes.

## Security & Configuration Tips

- Never commit API keys or tokens. Prefer local settings or environment variables in local tooling.
- Treat `firestore.rules` and `database.rules.json` as security-critical; changes require explicit justification.

## Agent-Specific Instructions

- Do not edit `node_modules/`.
- Prefer small, reviewable patches and keep generated output deterministic.

## Cursor Cloud specific instructions

- Install with `npm ci`. Node on the default image satisfies `engines` (`>=14`); CI pins Node 18.
- The app is a static PWA. `npm start` serves it on `0.0.0.0:3000` (`serve` listens there by default). `npm run dev` is the same server with live reload. There is no compile step (`npm run build` only prints that the site is static).
- Provider API keys are typed into the in-app Config modal and stored in browser `localStorage`. They are not required to boot the server. Submitting a task with no key shows the real-data configuration error; that is expected. Clicking Start with no key also opens a browser alert: "System is ready! Please configure your API key first."
- `npm test` and `npm run lint` are placeholders. `npx html-validate index.html` matches CI, and the current `index.html` fails that check on existing markup (implicit button types, inline styles, trailing whitespace, password autocomplete).
- `functions/` is a separate package. `firebase.json` only configures hosting, so the functions emulator is not part of the static app boot.
