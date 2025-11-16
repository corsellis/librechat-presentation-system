# LibreChat Presentation System

Professional presentation generation microservice for LibreChat.

## Railway Deployment

This service deploys automatically to Railway using Nixpacks.

## Quick Start

```bash
npm install
npm start
```

## API Endpoints

- `GET /health` - Health check
- `GET /api/presentations/templates` - List available templates
- `POST /api/presentations/generate` - Generate presentation
- `GET /api/presentations/list` - List presentations
- `GET /api/presentations/download/:filename` - Download presentation

## Environment Variables

```
PORT=3000
NODE_ENV=production
PRESENTATION_OUTPUT_DIR=./generated
```

## Features

- McKinsey-style presentations
- Marwyn investment presentations
- Professional formatting
- Automatic file management
