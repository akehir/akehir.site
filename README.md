# Akehir.com

The personal website for [akehir.com](https://akehir.com).

## Todos:

- add blog entries
- add llms.txt (https://developer.chrome.com/docs/lighthouse/agentic-browsing/llms-txt?utm_source=lighthouse&utm_medium=lr)
- ...

## Features

### WebGL Fluid Animation

- Interactive fluid simulation running in the background.
- Fully controllable via the application console.

### Integrated Application Console

A powerful command-line interface within the application that allows for deep control and interaction.

- **Typeahead Support**: Provides intelligent suggestions as you type.
- **Interactive Queries**: The console can pose questions to the user.
- **Performance**: Virtual scrolling enabled for high-performance logging.

#### Console Capabilities:

- **Language Management**: Change the application language.
- **PWA Management**: Trigger PWA installation prompts.
- **User Session**: Trigger login and logout flows.
- **Navigation**: Navigate directly to specific project details.
- **Project Management**: Create new projects or notes.
- **Animation Control**: Configure, pause, or take screenshots of the WebGL animation.
- **Project Browsing**: List, filter, and search projects in text form.

## Quickstart

### Prerequisites

- [Node.js](https://nodejs.org/) (latest LTS recommended)
- [npm](https://www.npmjs.com/)

### Installation

```bash
npm install
```

### Development

```bash
# Start the development server
npm start
```

### Testing & Quality

```bash
# Run unit tests (Jest, one-shot; no browser required)
npm test

# Run unit tests in interactive watch mode
npm run test:watch

# Run unit tests with a coverage report (html + text-summary into coverage/)
npm run test:coverage

# Run linting
npm run lint

# Run end-to-end tests
npm run e2e
```

## Acknowledgements

- WebGL Fluid Simulation by [PavelDoGreat](https://github.com/PavelDoGreat/WebGL-Fluid-Simulation).
