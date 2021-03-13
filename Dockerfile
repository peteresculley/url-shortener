FROM node:12

WORKDIR /app

COPY ["package.json", "yarn.lock", "./"]

RUN yarn install --production=false --silent

COPY . .

EXPOSE 8080

CMD yarn start
