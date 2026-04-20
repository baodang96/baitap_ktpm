FROM node:20-alpine
WORKDIR /app
COPY shared/ ./shared/
COPY order-service/package*.json ./
RUN npm ci --production
COPY order-service/ ./order-service/
EXPOSE 8083
CMD ["node", "order-service/server.js"]
