FROM node:24-alpine
WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
EXPOSE 6006
CMD ["sh", "-lc", "npm run generate && npm run dev"]

# MSYS_NO_PATHCONV=1 docker run -d --name assignment5-backend-container --network assignment5-network --env-file .env -e CHOKIDAR_USEPOLLING=1 -e CHOKIDAR_INTERVAL=300 -p 6060:6060 -v "$PWD:/app" -v assignment5-backend-node_modules:/app/node_modules -v assignment5-backend-logs:/app/logs -w //app assignment5-backend:latest sh -lc "CI=true npm install --legacy-peer-deps && npm run generate && npm run dev"

# docker exec -it assignment5-backend-container sh -lc "npx prisma migrate deploy"
