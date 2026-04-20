FROM node:20-alpine
WORKDIR /app
COPY shared/ ./shared/
COPY food-service/package*.json ./
RUN npm ci --production
COPY food-service/ ./food-service/
EXPOSE 8082
CMD ["node", "food-service/server.js"]
