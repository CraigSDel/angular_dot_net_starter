# Frontend development

The application overview, API reference, backend setup, testing commands, and CI documentation are in the [root README](../README.md). This file covers frontend-specific commands.

## UI stack

The client is an Angular 22 standalone application using Angular Material and
the CDK. It provides a custom rose-and-red theme, responsive toolbar/sidenav
navigation, Material cards and tables, and accessible reactive-form controls.
Bootstrap is not required.

## Commands

- `npm ci` — install the locked dependency set.
- `npm start` — run the Angular development server.
- `npm run build -- --configuration production` — create the production bundle.
- `npm run lint` — lint TypeScript and Angular templates.
- `npm test` — run Vitest unit tests.
- `npm run e2e:install` — install Chromium for Playwright.
- `npm run e2e` — run browser tests.

The Playwright suite expects the ASP.NET Core host to be available at
`http://127.0.0.1:5000` when running locally. It verifies route navigation,
user CRUD, and task/task-group display and CRUD workflows.
