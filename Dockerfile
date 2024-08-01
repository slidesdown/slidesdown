FROM node:20-alpine

LABEL org.opencontainers.image.ref.name="slidesdown/slidesdown:0.16.0"
LABEL org.opencontainers.image.licenses="AGPL-3.0-or-later"
LABEL org.opencontainers.image.description="Slideshows as fast as you can type."
LABEL org.opencontainers.image.documentation="https://github.com/slidesdown/slidesdown"
LABEL org.opencontainers.image.version="0.16.0"
LABEL org.opencontainers.image.vendor="Jan Christoph Ebersbach"
LABEL org.opencontainers.image.authors="Jan Christoph Ebersbach <jceb@e-jc.de>"
LABEL org.opencontainers.image.url="https://slidesdown.github.io/"
LABEL org.opencontainers.image.source="https://github.com/slidesdown/slidesdown"
LABEL org.opencontainers.image.revision="0.16.0"

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

ENV SERVING_SLIDESDOWN=1

EXPOSE 8080

ENTRYPOINT [ "/entrypoint.sh" ]
