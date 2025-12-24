# LuxuryCars - Frontend Application

A modern, responsive React-based luxury car dealership platform with real-time inventory management, user authentication, test drive scheduling, and customer engagement features.

## 📋 Project Overview

LuxuryCars is a full-stack web application designed to provide a seamless experience for luxury car enthusiasts. The platform allows users to:
- Browse and filter premium vehicle inventory
- Schedule test drives
- Manage user profiles
- Add cars to favorites
- Submit contact inquiries
- Real-time chat support widget

The frontend communicates with a Node.js/Express backend API to persist all user data, inventory, and bookings to a MySQL database.

## 🚀 Technologies Used

### Frontend Stack
- **React 18** - UI library for building interactive components
- **Tailwind CSS** - Utility-first CSS framework for responsive design
- **Lucide React** - Icon library for modern, minimal icons
- **Vite** - Lightning-fast build tool and dev server
- **JavaScript ES6+** - Modern JavaScript with hooks and async/await
- **HTML5** - Semantic markup

### Development Tools
- **npm** - Package manager
- **ESLint** - Code quality linter
- **PostCSS** - CSS processing
- **Tailwind CLI** - CSS utility compilation

## Prerequisites
- Node.js (>= 16 recommended)
- npm (comes with Node) or yarn/pnpm

Verify with:

```powershell
node --version
npm --version
```

## Install & run (development)
From the project root (`c:\projects\web\facebook_assignment\facebook-page`):

```powershell
npm install
npm run dev
```

This starts Vite's dev server (default: http://localhost:5173). Open the URL printed in the terminal.

To build a production bundle:

```powershell
npm run build
```

To preview the production build locally:

```powershell
npm run preview
```

## Tailwind CSS setup (how this project is configured)
This project already includes Tailwind configuration files (`tailwind.config.js`, `postcss.config.js`) and `index.css` imports Tailwind. The relevant files are:

- `tailwind.config.js` — Tailwind configuration (content paths, theme customizations)
- `postcss.config.js` — PostCSS + Tailwind plugin config
- `src/index.css` — imports Tailwind base/components/utilities and includes a few custom styles

If you need to update Tailwind content paths (so classes in new files are picked up), edit `tailwind.config.js` and add/adjust the `content` globs to include any new folders.

Example tailwind usage is in `src/index.css`:
```css
@import "tailwindcss";
/* plus project-specific rules */
```

If you add new components or JSX files under `src/`, Tailwind should pick those classes up automatically as long as `tailwind.config.js` content points to `src/**/*.jsx` or similar.

## Project structure (important files)
- `index.html` — Vite entry
- `package.json` — scripts and dependencies
- `tailwind.config.js` & `postcss.config.js` — Tailwind setup
- `src/`
  - `main.jsx` — app entry (renders the app)
  - `AppContainer.jsx` — app container (holds app-level state and imports components)
  - `App.jsx` — (backup/legacy) original file — the project uses `AppContainer.jsx` from `main.jsx` by default
  - `index.css` — Tailwind imports + defensive rules
  - `components/` — UI components
    - `Header.jsx`, `Hero.jsx`, `Features.jsx`, `CarCard.jsx`, `InventoryPage.jsx`, `ProductView.jsx`, `Footer.jsx`, `ChatWidget.jsx`

Notes:
- The app entry uses `AppContainer.jsx`. If you prefer to keep working with the original `App.jsx`, update `src/main.jsx` to import it instead.

## How to add or use local images
Currently car images use external Unsplash URLs. To use local images:
1. Place images in the `public/` folder (e.g. `public/images/audi-a8-1.jpg`).
2. Update the `cars` data in `src/AppContainer.jsx` (or `src/App.jsx` if you prefer) so the image path is relative to `/`, e.g.: `'/images/audi-a8-1.jpg'`.

Example:
```js
images: ['/images/audi-a8-1.jpg', '/images/audi-a8-2.jpg']
```

Vite serves the `public/` directory at the root of the dev server, so `/images/yourfile.jpg` will work.

## Chat widget (front-end only)
- Component: `src/components/ChatWidget.jsx`
- Behavior: Floating button at the bottom-right; opens a small chat window with mocked bot replies (no network requests).
- To hook it to a real backend or chat API: replace the mock `setTimeout` reply in `ChatWidget.jsx` with a `fetch`/`axios` call to your API endpoint and handle responses.

## Common tweaks
- Make a button or icon always visible: adjust `z-index` or the class (e.g. `z-50` → `z-[9999]`) in the component file.
- Global button styles live in `src/index.css` — the app includes a defensive rule that forces black text when an element has a white background plus white text to avoid white-on-white issues.

## Troubleshooting
- Vite import errors about unresolved components: ensure the file exists and the import path is correct (relative to the importing file). Example: `import ChatWidget from './components/ChatWidget'` requires `src/components/ChatWidget.jsx`.
- If Tailwind classes don't apply: check `tailwind.config.js` `content` globs include the file paths where you used classes (e.g. `./index.html`, `./src/**/*.{js,jsx,ts,tsx}`).
- If you see stale styles after edits, restart the dev server.

## Useful npm scripts (from package.json)
- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run preview` — preview production build

## Next steps / suggestions
- Extract a shared `Button` component to keep styles consistent.
- Add a small backend (or serverless function) for the chat widget and wire `ChatWidget.jsx` to it.
- Add PropTypes or migrate to TypeScript for better maintainability.

---

If you'd like, I can:
- Replace `src/App.jsx` with the new container (`AppContainer.jsx`) so the old file is removed; or
- Add a `components/index.js` barrel export; or
- Add a short developer checklist to the README with the most common edits you make locally.

Tell me which you prefer and I'll follow up.
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
