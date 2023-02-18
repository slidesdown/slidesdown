FROM node:18-alpine

RUN apk -U --no-cache add bash

COPY src/entrypoint.sh /

WORKDIR /srv

COPY package.json /srv
COPY yarn.lock /srv
RUN npm install

COPY docs /srv/public
COPY docs/index.html /srv
COPY vite.config.js /srv
RUN sed -i -e 's#.*<!-- DOCKER_LOADER_LINE -->.*#<script type="module" src="loader.js"></script>#' /srv/index.html

ENV SERVING_SLIDESDOWN=1

ENTRYPOINT [ "/entrypoint.sh" ]
