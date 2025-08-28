# How to make your Homelab Accessible via Pangolin

If you are hosting services on a server in your homelab, then the easiest way to setup access to your services is just by port opening and forwarding the necessary ports (mainly ports 80 and 443) from your router to your home server.

However, that may not always be possible or desirable, for example in the following cases:

- You're behind CGNAT from your ISP
- Your ISP doesn't allow port forwarding through their firewall
- You don't have access to your ISP's router
- You don't have a fixed IPv4 / IPv6 address from your ISP (it might still be possible via services such as DynDNS)
- You would like to protect the resources you're exposing additionally (they might not have full authentication implemented, or might not have 2FA authentication, or you might require fine-granular authorization via user roles)
- You'd like SSO (Single Sign On) for your resources
- You'd like to make some resources only available temporarily
- You'd like to manage different home labs / servers from one entry point
- The service doesn't have a https version, but you still need to access the service securely
- You don't want to give out VPN access to everyone who wants to use your service.

While big providers such as Cloudflare and Tailscale provide solutions for this; [Pangolin](https://fossorial.io/) can do the same via a self-hosted approach. Whether you setup Pangolin in a cheap VPS in the cloud, or in a DMZ in your homelab, it'll be able to connect the dots of your homelab and manage entry to your services.

In the following, I will describe how I've setup pangolin for my use case and the pitfalls I've faced.

Before Pangolin, I've just forwarded all the ports from my router directly to my kubernetes cluster. Therefore everything available on my cluster could be accessed without any further authentication layer, even if I didn't necessarily want that.

Now I'm not forwarding any ports from my firewall anymore. My domains point to a small [Infomaniak `VPS Lite`](https://www.infomaniak.com/en/hosting/vps-lite) and from there the traffic is redirected via Pangolin to the appropriate servers. I can control who has access to which resources via Pangolin, as well as quickly enable / disable access. I've also enabled the [crowdsec traefik plugin](https://plugins.traefik.io/plugins/6335346ca4caa9ddeffda116/crowdsec-bouncer-traefik-plugin) for intrusion detection and prevention. It works so well that I've even locked myself out a couple of times ;-)

So far it seems pretty stable, with more than 15GB traffic in/out since the installation and an uptime of 97-99% as measured with [Uptime Kuma](https://github.com/louislam/uptime-kuma).
## Installation

See also the [official install guide](https://docs.fossorial.io/Getting%20Started/quick-install). Additionally, I setup a systemd service to always start pangolin when the server boots (and to be able to easily manage the service).
I'm using the lowest tier of [infomaniak's VPS Lite](https://www.infomaniak.com/en/hosting/vps-lite). It's sufficient, and uses usually less than 30% of the CPU and around 80% of the system RAM.

```shell
sudo apt install -y docker.io
mkdir pangolin && cd pangolin
wget -O installer "https://github.com/fosrl/pangolin/releases/download/1.6.2/installer_linux_$(uname -m | sed 's/x86_64/amd64/;s/aarch64/arm64/')" && chmod +x ./installer
sudo ./installer
sudo nano docker-compose.yml # customize, ex. to add api keys for dns challenge or additional ports
sudo nano config/config.yml # customize, ex. to add additional domains
sudo nano config/traefik/traefik_config.yml # customize to add additional ports
sudo nano /etc/systemd/system/pangolin.service # see below for content
sudo service pangolin enable
sudo service pangolin start
```

#### Crowdsec (optional)
```shell
sudo docker exec crowdsec cscli bouncers add crowdsec-traefik-bouncer
sudo docker exec crowdsec cscli console enroll -e context ___value___ # optional
sudo docker exec crowdsec cscli decisions delete -i 9.9.9.9 # unban an ip
sudo docker exec -it crowdsec cscli decisions list # see banned clients

# create a allowlist to prevent certain ips from being banned.
# in my experience I've banned myself quite quickly...
sudo docker exec crowdsec cscli allowlist create allowlist1 -d 'description of whitelist'
sudo docker exec crowdsec cscli allowlist add allowlist1 9.9.9.9
sudo docker exec crowdsec cscli allowlist inspect allowlist1

```
## Hints / Gotchas
 - In the docker-compose, some ports need to be quoted (ex: ssh) in order to work.
 - The `installer` can be run in an existing directory and it'll update / merge the config. This can be used to upgrade to a newer version of pangolin, or add additional features such as crowdsec.

## Debugging
### Systemd Service
```shell
 journalctl -xeu pangolin
```

### Docker
```shell
sudo docker ps
sudo docker logs $container
sudo docker exec -it $container $command
```

### Crowdsec
```shell
sudo docker exec -it crowdsec cscli decisions list 
sudo docker exec crowdsec cscli allowlist inspect allowlist1
```

## Setup
### Systemd Service
```
[Unit]
Description=Pangolin via Docker compose
After=docker.service
Requires=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
ExecStart=/bin/bash -c "docker-compose -f /home/debian/pangolin/docker-compose.yml up --detach"
ExecStop=/bin/bash -c "docker-compose -f /home/debian/pangolin/docker-compose.yml stop"

[Install]
WantedBy=multi-user.target
```

### docker-compose.yml
```
networks:
  default:
    driver: bridge
    name: pangolin
services:
  crowdsec:
    command: -t
    container_name: crowdsec
    environment:
      ACQUIRE_FILES: /var/log/traefik/*.log
      COLLECTIONS: crowdsecurity/traefik crowdsecurity/appsec-virtual-patching crowdsecurity/appsec-generic-rules
      ENROLL_INSTANCE_NAME: pangolin-crowdsec
      ENROLL_TAGS: docker
      GID: "1000"
      PARSERS: crowdsecurity/whitelists
    expose:
      - 6060
    healthcheck:
      interval: 10s
      retries: 15
      timeout: 10s
      test:
        - CMD
        - cscli
        - capi
        - status
    image: crowdsecurity/crowdsec:latest
    labels:
      - traefik.enable=false
    ports:
      - 6060:6060
    restart: unless-stopped
    volumes:
      - ./config/crowdsec:/etc/crowdsec
      - ./config/crowdsec/db:/var/lib/crowdsec/data
      - ./config/crowdsec_logs/auth.log:/var/log/auth.log:ro
      - ./config/crowdsec_logs/syslog:/var/log/syslog:ro
      - ./config/crowdsec_logs:/var/log
      - ./config/traefik/logs:/var/log/traefik
  gerbil:
    cap_add:
      - NET_ADMIN
      - SYS_MODULE
    command:
      - --reachableAt=http://gerbil:3003
      - --generateAndSaveKeyTo=/var/config/key
      - --remoteConfig=http://pangolin:3001/api/v1/gerbil/get-config
      - --reportBandwidthTo=http://pangolin:3001/api/v1/gerbil/receive-bandwidth
    container_name: gerbil
    depends_on:
      pangolin:
        condition: service_healthy
    image: fosrl/gerbil:1.0.0
    ports:
      - 51820:51820/udp
      - 443:443
      - 80:80
    #  - "22:22" # attention: needs to be wrapped in quotes
    #  - "25:25" # attention: needs to be wrapped in quotes
    #  - 110:110
    #  - 143:143
    #  - 465:465
    #  - 587:587
    #  - 993:993
    #  - 995:995
    restart: unless-stopped
    volumes:
      - ./config/:/var/config
  pangolin:
    container_name: pangolin
    healthcheck:
      interval: 10s
      timeout: 10s
      retries: 15
      test:
        - CMD
        - curl
        - -f
        - http://localhost:3001/api/v1/
      timeout: 3s
    image: fosrl/pangolin:1.7.0
    restart: unless-stopped
    volumes:
      - ./config:/app/config
  traefik:
    command:
      - --configFile=/etc/traefik/traefik_config.yml
    container_name: traefik
    depends_on:
      pangolin:
        condition: service_healthy
    image: traefik:v3.4.4
    network_mode: service:gerbil
    restart: unless-stopped
    volumes:
      - ./config/traefik:/etc/traefik:ro
      - ./config/letsencrypt:/letsencrypt
      - ./config/traefik/logs:/var/log/traefik
    environment:
      INFOMANIAK_ACCESS_TOKEN: "___VALUE___"
  newt:
    image: fosrl/newt:1.3.3
    container_name: newt
    restart: unless-stopped
    environment:
      - PANGOLIN_ENDPOINT=https://pangolin.example.com
      - NEWT_ID=___VALUE___
      - NEWT_SECRET=___VALUE___
    extra_hosts:
      - "host.docker.internal:host-gateway"

```


### Pangolin config.yaml
```yaml
app:
  dashboard_url: https://pangolin.example.com
  log_level: info
  save_logs: false
domains:
  domain1:
    base_domain: example.com
    cert_resolver: letsencrypt
  domain2:
    base_domain: foo.ai
    cert_resolver: letsencrypt
  domain3:
    base_domain: bar.in
    cert_resolver: letsencrypt
server:
  external_port: 3000
  internal_port: 3001
  next_port: 3002
  internal_hostname: pangolin
  session_cookie_name: p_session_token
  resource_access_token_param: p_token
  resource_access_token_headers:
    id: P-Access-Token-Id
    token: P-Access-Token
  resource_session_request_param: p_session_request
  cors:
    origins:
      - https://pangolin.example.com
    methods:
      - GET
      - POST
      - PUT
      - DELETE
      - PATCH
    headers:
      - X-CSRF-Token
      - Content-Type
    credentials: false
  secret: foo123
traefik:
  cert_resolver: letsencrypt
  http_entrypoint: web
  https_entrypoint: websecure
gerbil:
  start_port: 51820
  base_endpoint: pangolin.example.com
  use_subdomain: false
  block_size: 24
  site_block_size: 30
  subnet_group: 100.89.137.0/20
rate_limits:
  global:
    window_minutes: 1
    max_requests: 500
email:
  smtp_host: smtp.example.com
  smtp_port: 587
  smtp_user: foo
  smtp_pass: password123456
  no_reply: foo@example.com
flags:
  require_email_verification: true
  disable_signup_without_invite: true
  disable_user_create_org: false
  allow_raw_resources: true
  allow_base_domain_resources: true

```


### Traefik traefik_config.yaml

```yaml
accessLog:
  bufferingSize: 100
  fields:
    defaultMode: drop
    headers:
      defaultMode: drop
      names:
        Authorization: redact
        Content-Type: keep
        Cookie: redact
        User-Agent: keep
        X-Forwarded-For: keep
        X-Forwarded-Proto: keep
        X-Real-Ip: keep
    names:
      ClientAddr: keep
      ClientHost: keep
      DownstreamContentSize: keep
      DownstreamStatus: keep
      Duration: keep
      RequestMethod: keep
      RequestPath: keep
      RequestProtocol: keep
      RetryAttempts: keep
      ServiceName: keep
      StartUTC: keep
      TLSCipher: keep
      TLSVersion: keep
  filePath: /var/log/traefik/access.log
  filters:
    minDuration: 100ms
    retryAttempts: true
    statusCodes:
      - 200-299
      - 400-499
      - 500-599
  format: json
api:
  dashboard: true
  insecure: true
certificatesResolvers:
  letsencrypt:
    acme:
      caServer: https://acme-v02.api.letsencrypt.org/directory
      email: foo@example.com
      storage: /letsencrypt/acme.json
      dnsChallenge:
        provider: "infomaniak"
entryPoints:
  tcp-22:
    address: :22/tcp
  tcp-25:
    address: :25/tcp
  tcp-110:
    address: :110/tcp
  tcp-143:
    address: :143/tcp
  tcp-465:
    address: :465/tcp
  tcp-587:
    address: :587/tcp
  tcp-993:
    address: :993/tcp
  tcp-995:
    address: :995/tcp
  web:
    address: :80
  websecure:
    address: :443
    http:
      middlewares:
        - crowdsec@file
      tls:
        certResolver: letsencrypt
    transport:
      respondingTimeouts:
        readTimeout: 30m
experimental:
  plugins:
    badger:
      moduleName: github.com/fosrl/badger
      version: v1.2.0
    crowdsec:
      moduleName: github.com/maxlerebourg/crowdsec-bouncer-traefik-plugin
      version: v1.4.4
log:
  format: json
  level: INFO
providers:
  file:
    filename: /etc/traefik/dynamic_config.yml
  http:
    endpoint: http://pangolin:3001/api/v1/traefik-config
    pollInterval: 5s
serversTransport:
  insecureSkipVerify: true

```


### Traefik dynamic_config.yaml

```yaml
http:
  middlewares:
    crowdsec:
      plugin:
        crowdsec:
          clientTrustedIPs:
            - 10.0.0.0/8
            - 172.16.0.0/12
            - 192.168.0.0/16
            - 100.89.137.0/20
          crowdsecAppsecEnabled: true
          crowdsecAppsecFailureBlock: true
          crowdsecAppsecHost: crowdsec:7422
          crowdsecAppsecUnreachableBlock: true
          crowdsecLapiHost: crowdsec:8080
          crowdsecLapiKey: "foo123"
          crowdsecLapiScheme: http
          crowdsecMode: live
          defaultDecisionSeconds: 15
          enabled: true
          forwardedHeadersTrustedIPs:
            - 0.0.0.0/0
          httpTimeoutSeconds: 10
          logLevel: INFO
          updateIntervalSeconds: 15
          updateMaxFailure: 0
    default-whitelist:
      ipWhiteList:
        sourceRange:
          - 10.0.0.0/8
          - 192.168.0.0/16
          - 172.16.0.0/12
    redirect-to-https:
      redirectScheme:
        scheme: https
    security-headers:
      headers:
        contentTypeNosniff: true
        customFrameOptionsValue: SAMEORIGIN
        customResponseHeaders:
          Server: ""
          X-Forwarded-Proto: https
          X-Powered-By: ""
        forceSTSHeader: true
        hostsProxyHeaders:
          - X-Forwarded-Host
        referrerPolicy: strict-origin-when-cross-origin
        sslProxyHeaders:
          X-Forwarded-Proto: https
        stsIncludeSubdomains: true
        stsPreload: true
        stsSeconds: 63072000
  routers:
    api-router:
      entryPoints:
        - websecure
      middlewares:
        - security-headers
      rule: Host(`pangolin.example.com`) && PathPrefix(`/api/v1`)
      service: api-service
      tls:
        certResolver: letsencrypt
    main-app-router-redirect:
      entryPoints:
        - web
      middlewares:
        - redirect-to-https
      rule: Host(`pangolin.example.com`)
      service: next-service
    next-router:
      entryPoints:
        - websecure
      middlewares:
        - security-headers
      rule: Host(`pangolin.example.com`) && !PathPrefix(`/api/v1`)
      service: next-service
      tls:
        certResolver: letsencrypt
    ws-router:
      entryPoints:
        - websecure
      middlewares:
        - security-headers
      rule: Host(`pangolin.example.com`)
      service: api-service
      tls:
        certResolver: letsencrypt
  services:
    api-service:
      loadBalancer:
        servers:
          - url: http://pangolin:3000
    next-service:
      loadBalancer:
        servers:
          - url: http://pangolin:3002
```

