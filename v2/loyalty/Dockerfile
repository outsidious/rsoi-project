FROM node:14-alpine3.12 as build
WORKDIR /app
COPY package*.json ./
RUN npm i
COPY . /app
RUN npm run build

FROM node:14-alpine3.12 as prod
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
COPY --from=build /app/dist ./dist

CMD ["npm", "run", "start:prod"]