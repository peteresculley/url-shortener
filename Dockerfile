FROM node:12

WORKDIR /app

COPY ["package.json", "package-lock.json", "tsconfig.json", "webpack.config.js", "./src", "./frontend"]

RUN yarn install --production --silent && mv node_modules ../

COPY . .

EXPOSE 8080

CMD yarn start
