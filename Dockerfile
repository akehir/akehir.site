FROM registry.akehir.com/infra/alpine-nginx/alpine-nginx

USER 1337

WORKDIR /app

COPY ./dist/akehir/browser/ .

COPY ./nginx.conf /etc/nginx/nginx.conf
