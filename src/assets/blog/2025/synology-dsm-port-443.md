# How to Map Port 443 to DSM on Synology NAS

Synology as a company is not above making questionable decisions (such as only allowing their own harddrives on specific models), so it might not be the most opportune time to write about them. I do have and use a Synology NAS, and I'm going to get as much value out of it as I can, so I do use it and learn about it. And therefore I'll obviously document my learnings as well.

Anyways, their products are still very solid storage devices, and together with being able to host docker containers, they can be powerful in spite of what Synology decides to do.

One small annoyance I've had is that Synology makes it much harder than necessary to host Synology DSM (their management software) on port 443. They might have good reasons for it, but for my use case and my hardware I prefer to decide how I'd like to set it up.

Now I've finally found an elegant enough, and more importantly, a working workaround for this.

The prerequisites are the following 2 packages:
- Web Station
- Container Manager

Then we create a nginx reverse proxy via docker container, which will proxy our DSM domain from port 443 to the internal domain.

First, create an `nginx.conf`, such as the below to proxy any random port (here, 4444) to the DSM port (here the default of 5001). I assume, that DSM is using https and has a certificate installed.

```
events {
    worker_connections 1024;
}

http {
    include mime.types;
    sendfile on;

    server {
        listen 4444;
        listen [::]:4444;
        resolver 127.0.0.1;
        autoindex off;
        server_name _;
        server_tokens off;
        client_max_body_size 999m;
        
        location / {
            proxy_http_version 1.1;
            proxy_set_header   Upgrade $http_upgrade;
            proxy_set_header   Connection "upgrade";
            proxy_set_header   X-Real-IP        $remote_addr;
            proxy_set_header   X-Forwarded-For  $proxy_add_x_forwarded_for;
            proxy_set_header   Host             $host;
            proxy_pass         https://foo.example.com:5001/;
        }
    }
}
```

With the `nginx.conf` prepared, we can go to the container manager and create a new service. The `docker-compose.yml` should be similar to the following.
Since we're using `network_mode: host`, theoretically the `ports` section would not be required; however for Web Station to pick up the port, we need to include it. In the wizard, we create a web station reverse proxy (http) that maps our DSM domain (here foo.example.com) from port 80 and 443 to our docker port (4444). The docker will then reverse proxy the whole thing to 5001. 

```yaml
services:
    foo:
         image: nginx:mainline-alpine-slim
         ports:
            - "4444:4444"
         restart: unless-stopped
         volumes:
            - "/volume1/docker/foo/nginx.conf:/etc/nginx/nginx.conf"
         extra_hosts:
             - "foo.example.com:127.0.0.1"
         network_mode: host
```

And voila, with our double reverse proxying, we can make DSM available on port 443.
