FROM node:12 AS build
WORKDIR ./build
COPY ["package.json", "yarn.lock", "./"]
RUN yarn install --production=false --silent
COPY . .
RUN yarn build


FROM node:12
WORKDIR ./app
COPY ["package.json", "yarn.lock", "./"]
RUN yarn install --production --silent
COPY --from=build ./build/dist ./dist
EXPOSE 8080
CMD yarn serve
