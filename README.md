# GallerSketch - Deliverable 3 (Final Deliverable)

## Running with Docker
1. Make sure Docker Desktop is running.
2. From the project root, build and run containers:
   ```bash
   docker compose up --build

   Access the application:

Frontend: http://localhost:5173

Backend API: http://localhost:5000/api

Stop Containers: docker compose down

Rebuild: docker compose up --build --force-recreate