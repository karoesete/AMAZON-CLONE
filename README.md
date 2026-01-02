# AMAZON-CLONE

A small e-commerce example app (frontend + backend) with optional Docker Compose setup.

This README covers:

- Project structure
- Local development (frontend and backend)
- Environment variables
- Docker Compose (recommended) with MongoDB initialization
- API endpoints overview
- Troubleshooting

Project structure

```
backend/
  package.json
  src/
    server.js
    config/
      db.js
    models/
    routes/
frontend/
  package.json
  src/
    main.jsx
    App.jsx
mongo-init/
  init-user.js
docker-compose.yml
.dockerignore
README.md
```

Local development (recommended for rapid iteration)

Prerequisites
- Node.js 18+ (or use nvm)
- MongoDB running locally (or use Docker Compose below)

Run backend

```bash
cd backend
npm install
# starts nodemon for live reload
npm run dev
```

Run frontend

```bash
cd frontend
npm install
# uses Vite in development mode
npm run dev
```

Open the frontend at http://localhost:5173. The backend runs on http://localhost:5000 by default.

Environment variables

Backend uses `backend/.env`. Example (also provided as `backend/.env.example`):

```
PORT=5000
MONGO_URI=mongodb://appuser:AppUserPass123!@127.0.0.1:27017/amazon_clone?authSource=amazon_clone
JWT_SECRET=supersecretjwtkey
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

Adjust `MONGO_URI` if your Mongo server uses a different host, port, or authentication database.

Docker Compose (one-command setup)

The repository includes a `docker-compose.yml` that runs multiple services:

- `mongo` — MongoDB with a data volume and init script
- `mongo-express` — lightweight MongoDB admin UI (mongo-express) for local inspection
- `backend` — Node backend built from `backend/Dockerfile`
- `frontend` — Frontend built from `frontend/Dockerfile` and served with nginx

Quick start

```bash
docker compose up --build
```

This will:

- Build backend and frontend images
- Start a MongoDB container and run `mongo-init/init-user.js` to create the `appuser` in the `amazon_clone` database (only when the data volume is empty)

Access

- Backend API: http://localhost:5000/api
- Frontend: http://localhost:5173
- Mongo Express UI: http://localhost:8081 (mongo-express service)

Note: the frontend container serves the app on container port 80, which is mapped to host port 5173 in the compose file, so the app remains available at http://localhost:5173.

Stopping

```bash
docker compose down
```

Notes about Mongo init

-- The init script `mongo-init/init-user.js` runs only if MongoDB initializes with an empty data directory. If you already have existing data without the `appuser`, use the temporary-container flow described in Troubleshooting below to add the user.
-- The compose file sets the `backend` `MONGO_URI` to `mongodb://appuser:AppUserPass123!@mongo:27017/amazon_clone?authSource=amazon_clone` so the backend connects to the `mongo` service on the Docker network.

There is also an alternate compose file `docker-compose-mongo.yml` in the repository root for mongo-focused workflows (useful if you want to run only Mongo-related services or customize the init flow).

API overview

- GET /api — basic health endpoint returning `{ message: "API running" }`
- Auth endpoints: mounted under `/api/auth` (see `backend/src/routes/authRoutes.js`)
- Product endpoints: mounted under `/api/products` (see `backend/src/routes/productRoutes.js`)
- Order endpoints: mounted under `/api/orders` (see `backend/src/routes/orderRoutes.js`)

Troubleshooting

- "Authentication failed" when starting backend
  - Confirm the `appuser` exists and the password in `MONGO_URI` matches.
  - If MongoDB runs in Docker and the data volume already exists, the `mongo-init` script won't run. Use the temporary no-auth container approach to add the user.

Temporary no-auth container (if you need to add the DB user)

1. Find the mongo container and volume names:

```bash
docker ps
docker inspect <mongo-container> --format '{{json .Mounts}}'
```

2. Stop the original container and start a temporary no-auth container using the same volumes:

```bash
docker stop <mongo-container>
docker run -d --name mongo-temp \
  -v <config_volume>:/data/configdb \
  -v <data_volume>:/data/db \
  -p 27017:27017 mongo --bind_ip_all --noauth
```

3. Create the user:

```bash
docker exec -it mongo-temp mongosh --eval \
  "db.getSiblingDB('amazon_clone').createUser({user:'appuser', pwd:'AppUserPass123!', roles:[{role:'readWrite', db:'amazon_clone'}]})"
```

4. Remove the temp container and restart the original:

```bash
docker stop mongo-temp
docker rm mongo-temp
docker start <mongo-container>
```

Logs and debugging

```bash
# follow backend logs
docker compose logs -f backend

# follow mongo logs
docker compose logs -f mongo

# or run the backend locally and watch nodemon output
cd backend
npm run dev
```

Security notes

- The example uses a plaintext password for local convenience. For production, use a secrets manager or environment injection (Docker secrets, Kubernetes secrets, or vault services).
- Restrict MongoDB network access and use strong credentials in production.

Contributing

- Open an issue or submit a PR.
- Structure: frontend changes go in `frontend/`, backend changes go in `backend/`.

License

This project is for educational/demo purposes. No license specified.
