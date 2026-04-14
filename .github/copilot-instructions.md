## Quick context

This repo is a Create React App single-page application (React 19) using React Router v7. The app mounts in `src/index.js` and routes are declared in `src/App.js`.

## Run / build / test

- Development: `npm start` (uses `react-scripts start`) — opens at http://localhost:3000
- Build: `npm run build` (produces `build/`)
- Tests: `npm test` (react-scripts + @testing-library)

Refer to `package.json` for exact scripts and dependencies.

## Architecture & conventions (what to know first)

- Components are grouped under `src/Components/` with one folder per component and a sibling CSS file (e.g. `src/Components/Modal/Modal.js` + `Modal.css`). Prefer adding styles alongside the component.
- Files use a mix of named and default exports. Check the component import site before changing the export type (e.g. `Header` is a named export; `Footer` is default).
- Routing is centralized in `src/App.js`. State for selected film, saved items, search value and pagination is lifted into `App` and passed down via props.

## Data flows & external integrations

- The app calls several external endpoints directly via fetch: examples in `src/App.js` (imdb proxy `https://imdb.iamidiotareyoutoo.com` and `https://api.kinocheck.com`). Treat responses as untrusted: guard for absent fields (the code already uses optional chaining in many places).
- Persistent saved items are stored in `localStorage` under the key `savedFilms` (see `App` initialization and useEffect persisting logic).

## Project-specific patterns and gotchas

- Folder + CSS convention: keep component CSS files next to the component and import them (do not move to a global stylesheet unless intentionally refactoring).
- Naming oddities: some files/folders contain typos (example: `src/Components/Page/Responce/Respponce.js`). Search before renaming to avoid breaking imports.
- Mix of fetch and axios: `axios` is in dependencies but many modules use `fetch`. Be consistent when adding new API calls.
- Watch for inconsistent prop/export patterns and small bugs (example in `src/Components/Modal/Modal.js` the same prop name appears duplicated in the parameter list). When editing components, run the app and check console for runtime errors.

## Helpful file references (examples to inspect)

- App entry & routing: `src/index.js`, `src/App.js`
- Component pattern: `src/Components/Header/Header.js`, `src/Components/Modal/Modal.js`, `src/Components/Page/Page.js`
- API helper: `src/Components/Page/Responce/Respponce.js` (contains `GetGenres` used by `App`)

## How to make safe edits (mini contract)

- Inputs: keep component props and shapes backward-compatible. Check where a component is imported (named vs default).
- Outputs: prefer not to change existing public props or localStorage keys without updating all usages.
- Error modes: network responses may miss fields; add defensive checks and fallbacks.

If anything here is unclear or you'd like me to add examples for a specific file (exports, state shape, or API response shape), tell me which file and I'll expand the guidance.
