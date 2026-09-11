# Documentation: https://docs.docker.com/reference/dockerfile
# Available tags: https://hub.docker.com/_/node
FROM node:24-alpine

LABEL org.opencontainers.image.ref.name="slidesdown/slidesdown:1.4.6"
LABEL org.opencontainers.image.licenses="AGPL-3.0-or-later"
LABEL org.opencontainers.image.description="Presentations at the speed of Markdown"
LABEL org.opencontainers.image.documentation="https://github.com/slidesdown/slidesdown"
LABEL org.opencontainers.image.version="1.4.6"
LABEL org.opencontainers.image.vendor="Jan Christoph Ebersbach"
LABEL org.opencontainers.image.authors="Jan Christoph Ebersbach <jceb@e-jc.de>"
LABEL org.opencontainers.image.url="https://slidesdown.github.io/"
LABEL org.opencontainers.image.source="https://github.com/slidesdown/slidesdown"
LABEL org.opencontainers.image.revision="1.4.6"

# Install dependencies
RUN apk -U --no-cache add bash tini
# Releases https://github.com/cloudflare/cloudflared/releases
RUN VERSION=2026.9.1; wget -o - -O /usr/local/bin/cloudflared https://github.com/cloudflare/cloudflared/releases/download/${VERSION}/cloudflared-linux-amd64; chmod a+x /usr/local/bin/cloudflared
# Releases https://github.com/nushell/nushell/releases
RUN VERSION=0.115.1; wget -o - -O /tmp/nu.tar.gz https://github.com/nushell/nushell/releases/download/${VERSION}/nu-${VERSION}-x86_64-unknown-linux-musl.tar.gz; tar xzf /tmp/nu.tar.gz nu-${VERSION}-x86_64-unknown-linux-musl/nu; mv nu-${VERSION}-x86_64-unknown-linux-musl/nu /usr/local/bin; rmdir nu-${VERSION}-x86_64-unknown-linux-musl

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
COPY vite.config.js .
# enables seperate vite configuration inside the container
ENV SERVING_SLIDESDOWN=1
# Disable analytics in docker container
RUN sed -i -e '/simpleanalyticscdn.com/d' index.html


EXPOSE 8080

COPY src/entrypoint.nu /

ENTRYPOINT [ "tini", "/entrypoint.nu" ]
