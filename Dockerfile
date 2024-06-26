FROM node:20-alpine

LABEL org.opencontainers.image.source=https://github.com/slidesdown/slidesdown
LABEL org.opencontainers.image.description="Slideshows as fast as you can type."
LABEL org.opencontainers.image.licenses=MIT

RUN apk -U --no-cache add bash tini

COPY src/entrypoint.sh /

WORKDIR /srv

ENV NODE_ENV=production

COPY package.json /srv
COPY yarn.lock /srv
RUN yarn install --prod; rm -rf /usr/local/share/.cache

COPY published /srv/public
COPY published/index.html /srv
COPY vite.config.js /srv
RUN sed -i -e 's#.*<!-- DOCKER_LOADER_LINE -->.*#<script type="module" src="loader.js"></script>#' /srv/index.html

ENV SERVING_SLIDESDOWN=1

EXPOSE 8080

ENTRYPOINT [ "/entrypoint.sh" ]
