FROM node:20-alpine

WORKDIR /usr/src

COPY . .

RUN npm install

EXPOSE 3000

CMD ["npm", "run", "start:dev"]
