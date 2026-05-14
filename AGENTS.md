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
3.  **Lint**: Run `npm run lint` to ensure code quality and style consistency.
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

| Command | Description |
| :--- | :--- |
| `npm start` | Starts the development server |
| `npm test` | Runs unit tests |
| `npm run lint` | Runs linting (ESLint and Sass-lint) |
| `npm run build` | Builds the project for production |
| `npm run e2e` | Runs end-to-end tests |
