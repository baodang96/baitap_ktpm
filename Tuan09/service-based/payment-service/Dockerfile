FROM node:20-alpine
WORKDIR /app
COPY shared/ ./shared/
COPY payment-service/package*.json ./
RUN npm ci --production
COPY payment-service/ ./payment-service/
EXPOSE 8084
CMD ["node", "payment-service/server.js"]
