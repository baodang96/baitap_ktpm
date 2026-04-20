FROM node:20-alpine
WORKDIR /app
COPY shared/ ./shared/
COPY user-service/package*.json ./
RUN npm ci --production
COPY user-service/ ./user-service/
EXPOSE 8081
CMD ["node", "user-service/server.js"]
