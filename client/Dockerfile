FROM node:22-alpine

WORKDIR /app

COPY package.json /app/

RUN npm install

COPY tsconfig*.json /app/
COPY index.html /app/
COPY vite.config.ts /app/
COPY ./public /app/public
COPY package-lock.json /app/
COPY ./src /app/src

CMD ["npm", "run", "dev"]