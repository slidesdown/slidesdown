# Available tags: https://hub.docker.com/_/node
FROM node:22-alpine

LABEL org.opencontainers.image.ref.name="slidesdown/slidesdown:1.1.0"
LABEL org.opencontainers.image.licenses="AGPL-3.0-or-later"
LABEL org.opencontainers.image.description="Slideshows as fast as you can type."
LABEL org.opencontainers.image.documentation="https://github.com/slidesdown/slidesdown"
LABEL org.opencontainers.image.version="1.1.0"
LABEL org.opencontainers.image.vendor="Jan Christoph Ebersbach"
LABEL org.opencontainers.image.authors="Jan Christoph Ebersbach <jceb@e-jc.de>"
LABEL org.opencontainers.image.url="https://slidesdown.github.io/"
LABEL org.opencontainers.image.source="https://github.com/slidesdown/slidesdown"
LABEL org.opencontainers.image.revision="1.1.0"

RUN apk -U --no-cache add bash tini

COPY src/entrypoint.sh /

COPY src/multiplex.sh /

ENV NODE_ENV=production

# Configure multiplex
WORKDIR /multiplex
COPY multiplex/package.json .
COPY multiplex/package-lock.json .
RUN npm install; rm -rf /usr/local/share/.cache
COPY multiplex/index.js .

# Configure slidesdown
WORKDIR /srv

COPY package.json .
COPY yarn.lock .
RUN yarn install --prod; rm -rf /usr/local/share/.cache

COPY published public
COPY published/index.html .
COPY vite.config.js .

ENV SERVING_SLIDESDOWN=1

EXPOSE 8080

ENTRYPOINT [ "tini", "/entrypoint.sh" ]
