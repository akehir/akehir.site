FROM nginx:1.30-alpine-slim

RUN apk upgrade --no-cache

USER 1337

WORKDIR /app

COPY ./dist/akehir/browser/ .

COPY ./nginx.conf /etc/nginx/nginx.conf
