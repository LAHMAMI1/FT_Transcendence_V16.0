FROM node:22-alpine

WORKDIR /auth-service

COPY package*.json ./

RUN npm install

COPY    . .

RUN npx prisma generate

EXPOSE 3001

CMD ["sh", "-c", "npx prisma migrate dev --name init --create-only && npx prisma migrate deploy && npx ts-node src/server.ts"]