FROM nginx:mainline-alpine-slim

WORKDIR /app

COPY ./dist/akehir/ .

COPY ./nginx.conf /etc/nginx/nginx.conf
