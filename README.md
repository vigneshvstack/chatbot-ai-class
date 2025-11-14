# Professional Chatbot by Vignesh V 22BME1206 (React + Node/Express)

This repository contains a production-oriented chatbot application made for AI class:
- **Frontend:** React (Vite), modern responsive UI
- **Backend:** Node.js + Express, secure proxy to OpenAI Chat Completions
- **Docker:** Dockerfiles + docker-compose for local development
- **CI:** GitHub Actions workflow to run tests & build
- **Extras:** `.env.example`, LICENSE, and deployment notes

## Features
- Conversation UI with message history
- Safe server-side OpenAI key usage
- Docker-ready for one-command local startup
- Ready for deployment on Render / Heroku / Vercel (serverless / container options)

## Quick local run (Docker)
1. Copy `.env.example` -> `.env` and set `OPENAI_API_KEY`
2. Build and run with docker-compose:
   ```bash
   docker-compose up --build
   ```
3. Open https://localhost:3000 (or http://localhost:5173 depending on Vite)

## Quick local run (without Docker)
- Start backend:
  ```bash
  cd server
  npm install
  cp ../.env.example .env
  # set OPENAI_API_KEY in .env
  node index.js
  ```
- Start frontend:
  ```bash
  cd frontend
  npm install
  npm run dev
  ```

## Production & Deployment
See `DEPLOYMENT.md` for example steps to deploy to Render and Vercel.

## Security Notes
- **Never** commit your real `OPENAI_API_KEY` to GitHub.
- Use environment variables or secret managers in production.

