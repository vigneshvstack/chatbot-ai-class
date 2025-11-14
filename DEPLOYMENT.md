# Deployment notes

## Render (recommended for full container)
- Create a new Web Service, connect to GitHub repo.
- Set build and start commands for server:
  - Build: `cd server && npm install`
  - Start: `cd server && node index.js`
- Add environment variable `OPENAI_API_KEY` in Render dashboard.

## Vercel (frontend) + Serverless (backend)
- Frontend: use Vercel to deploy `frontend` folder.
- Backend: convert `server/index.js` into serverless function or deploy as a separate service.

## Docker
- Use `docker-compose.yml` included in repo to build both services locally or push the images to a container registry.
