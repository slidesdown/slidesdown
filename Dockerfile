# Documentation: https://docs.docker.com/reference/dockerfile
# Available tags: https://hub.docker.com/_/node
FROM node:24-alpine

LABEL org.opencontainers.image.ref.name="slidesdown/slidesdown:1.3.1"
LABEL org.opencontainers.image.licenses="AGPL-3.0-or-later"
LABEL org.opencontainers.image.description="Presentations at the speed of Markdown"
LABEL org.opencontainers.image.documentation="https://github.com/slidesdown/slidesdown"
LABEL org.opencontainers.image.version="1.3.1"
LABEL org.opencontainers.image.vendor="Jan Christoph Ebersbach"
LABEL org.opencontainers.image.authors="Jan Christoph Ebersbach <jceb@e-jc.de>"
LABEL org.opencontainers.image.url="https://slidesdown.github.io/"
LABEL org.opencontainers.image.source="https://github.com/slidesdown/slidesdown"
LABEL org.opencontainers.image.revision="1.3.1"

RUN apk -U --no-cache add bash tini
RUN wget -o - -O /usr/local/bin/cloudflared https://github.com/cloudflare/cloudflared/releases/download/2025.11.1/cloudflared-linux-amd64; chmod a+x /usr/local/bin/cloudflared
RUN wget -o - -O /tmp/nu.tar.gz https://github.com/nushell/nushell/releases/download/0.108.0/nu-0.108.0-x86_64-unknown-linux-musl.tar.gz; tar xzf /tmp/nu.tar.gz nu-0.108.0-x86_64-unknown-linux-musl/nu; mv nu-0.108.0-x86_64-unknown-linux-musl/nu /usr/local/bin; rmdir nu-0.108.0-x86_64-unknown-linux-musl

ENV NODE_ENV=production

# Configure multiplex
WORKDIR /multiplex
COPY multiplex/package-lock.json multiplex/package.json .
RUN npm install; rm -rf /usr/local/share/.cache
COPY multiplex/index.js .

# Configure slidesdown
WORKDIR /srv

COPY package.json yarn.lock .
RUN yarn install --prod; rm -rf /usr/local/share/.cache

COPY published public
COPY published/index.html .
# Disable analytics in docker container
RUN sed -i -e '/simpleanalyticscdn.com/d' index.html
COPY vite.config.js .

ENV SERVING_SLIDESDOWN=1

EXPOSE 8080

COPY src/entrypoint.nu /

ENTRYPOINT [ "tini", "/entrypoint.nu" ]
