FROM node:15.5.1-alpine

ENV BASE_URL=https://get.helm.sh
ENV TAR_FILE=helm-v3.5.0-linux-amd64.tar.gz

RUN VERSION=3.5.0 apk add --update --no-cache curl ca-certificates && \
    curl -L ${BASE_URL}/${TAR_FILE} |tar xvz && \
    mv linux-amd64/helm /usr/bin/helm && \
    chmod +x /usr/bin/helm && \
    rm -rf linux-amd64 && \
    apk del curl && \
    rm -f /var/cache/apk/*

WORKDIR /var/apps/src

COPY package*.json ./

RUN npm install

COPY ./ ./

ENTRYPOINT [ "npm", "test" ]
