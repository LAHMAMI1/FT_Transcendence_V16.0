FROM node:22-alpine

WORKDIR /gateway

COPY package*.json ./

RUN npm install

COPY    . .

EXPOSE 3000

CMD ["npx", "ts-node", "server.ts"]