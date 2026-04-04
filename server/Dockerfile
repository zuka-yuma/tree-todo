FROM node:20-alpine

WORKDIR /app
COPY ./src /app/src
COPY package.json /app
COPY tsconfig.json /app

RUN npm install && npm run build

CMD ["npm", "start"]
