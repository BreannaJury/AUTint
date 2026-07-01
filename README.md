# Boilerplate

A minimal React + Vite frontend with an Express backend.

## Overview

This repository contains a simple full-stack starter app:

- `src/` - React application built with Vite and Material UI
- `server/` - Express API server
- `vite.config.js` - configures frontend dev server proxying `/api` requests to the backend

The app shows a button that fetches `/api/ping` and displays the backend response.

## Prerequisites

- Node.js 18+ (or a supported LTS version)
- npm

## Install

```bash
npm install
```

## Run locally

```bash
npm run dev
```

This starts both:

- Vite frontend on `http://localhost:5173`
- Express backend on `http://localhost:3001`

The Vite server proxies frontend requests from `/api/*` to the backend.

## Build

```bash
npm run build
```

## Preview

```bash
npm run preview
```

## Format

```bash
npm run format
```

## Project structure

- `index.html` - Vite app entry point
- `package.json` - npm scripts and dependencies
- `vite.config.js` - Vite config and proxy setup
- `src/` - React source files
  - `App.jsx` - main UI and API fetch logic
  - `main.jsx` - React entrypoint
  - `App.css`, `index.css` - styling
- `server/` - Express backend
  - `index.js` - API server with a `/ping` route

## Backend API

- `GET /ping` - returns `{ message: "pong" }`

## Notes

- Frontend fetches `/api/ping` so the Vite proxy rewrites the request to `http://localhost:3001/ping`.
- The app uses Material UI for layout and buttons.
