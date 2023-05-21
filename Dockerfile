FROM node:14.5.0-alpine

RUN apk add --no-cache bash

RUN npm config set cache /home/node/app/.npm-cache --global

RUN npm i -g @nestjs/cli@7.2.0

USER node

WORKDIR /home/node/app