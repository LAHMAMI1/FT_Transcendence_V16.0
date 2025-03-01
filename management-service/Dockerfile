FROM node:22-alpine

WORKDIR /management-service

COPY package*.json ./

RUN npm install

COPY    . .

RUN npx prisma generate

EXPOSE 3002

CMD ["sh", "-c", "npx prisma migrate dev --name init --create-only && npx prisma migrate deploy && npx ts-node server.ts"]