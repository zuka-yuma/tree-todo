FROM node:20-alpine

WORKDIR /var/www
COPY ./src /var/www/src
COPY package.json /var/www
COPY tsconfig.json /var/www

RUN npm install
RUN npm run build

CMD ["npm", "start"]
