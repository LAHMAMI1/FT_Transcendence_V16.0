FROM node:22-alpine

WORKDIR /twofa-service

COPY package*.json ./

RUN npm install

COPY    . .

RUN npx prisma generate

EXPOSE 3003

CMD ["sh", "-c", "npx ts-node src/server.ts"]