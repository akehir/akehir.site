FROM nginx:mainline-alpine-slim

WORKDIR /app

COPY ./dist/akehir/browser .

COPY ./nginx.conf /etc/nginx/nginx.conf
