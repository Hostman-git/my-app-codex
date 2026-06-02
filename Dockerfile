FROM node:24-alpine AS build

WORKDIR /app

COPY package*.json ./
COPY frontend/package*.json ./frontend/
COPY backend/package*.json ./backend/

RUN npm install
RUN npm install --prefix frontend
RUN npm install --prefix backend

COPY frontend ./frontend
COPY backend ./backend
COPY README.md ./
COPY .env.example ./

RUN npm run build --prefix frontend
RUN npm run build --prefix backend

FROM node:24-alpine AS runtime

WORKDIR /app/backend

ENV NODE_ENV=production
ENV PORT=4000

COPY backend/package*.json ./
RUN npm install --omit=dev

COPY --from=build /app/backend/dist ./dist
COPY --from=build /app/frontend/dist ./public

EXPOSE 4000

CMD ["npm", "run", "start"]
