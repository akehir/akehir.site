FROM nginx:mainline-alpine-slim

USER 1337

WORKDIR /app

COPY ./dist/akehir/browser/ .

COPY ./nginx.conf /etc/nginx/nginx.conf
