# Agentic Development Guide

This document provides essential context and instructions for LLM agents working on this repository.

## Project Context

- **Project Name**: Akehir.com
- **Framework**: Angular (v21+)
- **Styling**: Tailwind CSS, Sass
- **Key Features**:
  - WebGL Fluid Animation (background)
  - Integrated Console for application control
  - Progressive Web App (PWA) support
- **Main Goal**: A personal website with high interactivity and a unique user interface.

## Codebase Navigation

- `src/app/core/`: Singleton services, interceptors, guards, and core models.
- `src/app/layout/`: Reusable UI components such as navigation bars, footers, and layout wrappers.
- `src/app/pages/`: Feature-specific components and page-level logic.
- `src/app/app-routing.module.ts`: Central routing configuration.
- `src/assets/`: Static assets like images and icons.
- `src/stylesheets/`: Global styles and SCSS files.

## Development Workflow

Agents should follow these steps when making changes:

1.  **Analyze**: Understand the existing code and its impact.
2.  **Implement**: Apply changes following established patterns.
3.  **Lint & Format**: Run `npm run lint` to ensure code quality and style consistency. If formatting issues are found, use `npm run lint:fix` (Prettier). After completing a task, always run `npm run lint` to ensure no new issues were introduced.
4.  **Test**: Run `npm test` to verify that changes do not break existing functionality.
5.  **Verify**: For UI changes, consider the impact on responsiveness and accessibility.

## Coding Conventions

- **Angular**: Follow standard Angular component, service, and module patterns. Use standalone components where appropriate (if already adopted in the codebase).
- **Styling**: Use **Tailwind CSS** utility classes for styling whenever possible. For complex or global styles, use SCSS in the appropriate files.
- **Naming**:
  - Components: `name.component.ts`
  - Services: `name.service.ts`
  - Modules: `name.module.ts`
  - Interfaces/Models: `name.model.ts`
- **TypeScript**: Use strict typing. Avoid `any` unless absolutely necessary.
- **Comments**: Do NOT add comments unless explicitly requested.

## Common Commands

| Command            | Description                                         |
| :----------------- | :-------------------------------------------------- |
| `npm start`        | Starts the development server                       |
| `npm test`         | Runs unit tests                                     |
| `npm run lint`     | Runs linting (ESLint and Sass-lint)                 |
| `npm run lint:fix` | Runs linting and applies automatic fixes (Prettier) |
| `npm run build`    | Builds the project for production                   |
| `npm run e2e`      | Runs end-to-end tests                               |

## Blog Post Workflow

To create a new blog post, follow these steps:

1.  **Create Markdown Content**: Write the blog post in Markdown and save it to `src/assets/blog/<year>/<slug>.md`. The first line of the file is the `# Title` and is rendered into the entry (replacing the projected title in `BlogEntryComponent`), so keep it in sync with the `title` metadata.
2.  **Generate Component**: Create a new Angular component for the blog entry in `src/app/pages/blog/entries/<year>/<slug>.component.ts`. Use the existing pattern (e.g., importing `BlogEntryContainerComponent`).
3.  **Register Entry**: Add a new entry to the `blogEntries` array in `src/app/pages/blog/blog.module.ts`. Ensure all required metadata (title, author, categories, mainCategory, publishedDate, modifiedDate, routerLink, content, source) is provided.
4.  **Add Prerender Route**: Add the new blog post route (e.g., `/blog/<slug>`) to `prerender-routes.txt`. This file feeds `@angular/ssg` (`prerender.routesFile` in `angular.json`), so a route that is missing here will not be prerendered and will lack static HTML for SEO.
5.  **Update Sitemap**: Add the new blog post URL to `src/assets/sitemap.xml`.

> **Prerendered blog content (build-time markdown):** Blog entries render their markdown via `ngx-markdown`'s `[data]` input, which is populated from a build-time raw import of the `.md` file (e.g. `import rawMarkdown from '../../../../../assets/blog/<year>/<slug>.md?raw'`, exposed to the template as a class member and passed through `[markdown]`). The `?raw`/`.md` imports are inlined at build time thanks to the `loader: { ".md": "text" }` option in `angular.json` — do not remove it. **Never** rely on `ngx-markdown`'s `[src]` for article content: it performs an HTTP fetch that never resolves during prerendering, so the article text would be missing from the static (SEO) HTML. `[src]` is only kept as a fallback for entries without a `content` path.
