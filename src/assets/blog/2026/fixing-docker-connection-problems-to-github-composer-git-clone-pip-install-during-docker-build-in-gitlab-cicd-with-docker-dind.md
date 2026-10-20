# Fixing Docker Connection Problems to Github (composer, git clone, pip install) During Docker Build in Gitlab CICD with docker-dind

As recently as yesterday, I have been dealing with a rather hairy issue for some builds of my docker containers. I fully admit that [yesterday's](/blog/how-to-get-a-shell-and-execute-dynamic-linux-commands-in-a-docker-container-during-a-docker-build) blog post might have a lot to do with this current blog post.

The observed failures were timeouts / errors when connecting to github, either during `git clone` commands, during `composer install`, or during `pip install` commands.

I quickly suspected that `mtu` size could be the issue, but it was difficult to debug from within the pod. It was especially strange that most web requests were indeed working as intended, but the connection to github was causing me issues.

## Observed failures

In the following I document the errors that were thrown in my pipelines. If you observe similar errors, they might indicate a similar problem/

### composer install

```
#19 97.85 - Syncing symfony/filesystem (v7.4.18) into cache
#19 97.85 Failed to download symfony/config from dist: curl error 28 while downloading [https://codeload.github.com/symfony/config/legacy.zip/696e12da8eea497a1a3808d714b43ff67a7df43e](https://codeload.github.com/symfony/config/legacy.zip/696e12da8eea497a1a3808d714b43ff67a7df43e): Connection timed out after 10008 milliseconds
#19 97.85 Now trying to download from source
```

### git clone

```
> [ 9/33] RUN git clone [https://github.com/ggml-org/llama.cpp.git](https://github.com/ggml-org/llama.cpp.git):
0.324 Cloning into 'llama.cpp'...
151.6 fatal: unable to access '[https://github.com/ggml-org/llama.cpp.git/](https://github.com/ggml-org/llama.cpp.git/)': Recv failure: Connection reset by peer
```

### pip install & uv sync

```
> [28/38] RUN uv venv --python 3.12 && uv sync --extra cpu --no-cache:
0.281 Using CPython 3.12.15
0.281 Creating virtual environment at: .venv
49.52 error: Failed to download `en-core-web-sm @ [https://github.com/explosion/spacy-models/releases/download/en_core_web_sm-3.8.0/en_core_web_sm-3.8.0-py3-none-any.whl](https://github.com/explosion/spacy-models/releases/download/en_core_web_sm-3.8.0/en_core_web_sm-3.8.0-py3-none-any.whl)`
49.52 cause: Request failed after 3 retries in 49.1s
49.52 cause: Failed to fetch: [https://github.com/explosion/spacy-models/releases/download/en_core_web_sm-3.8.0/en_core_web_sm-3.8.0-py3-none-any.whl](https://github.com/explosion/spacy-models/releases/download/en_core_web_sm-3.8.0/en_core_web_sm-3.8.0-py3-none-any.whl)
49.52 cause: error sending request for url ([https://github.com/explosion/spacy-models/releases/download/en_core_web_sm-3.8.0/en_core_web_sm-3.8.0-py3-none-any.whl](https://github.com/explosion/spacy-models/releases/download/en_core_web_sm-3.8.0/en_core_web_sm-3.8.0-py3-none-any.whl))
49.52 cause: client error (Connect)
49.52 cause: operation timed out
```

## Debugging MTP

I started running `ping github.com -c 4` which worked. However, `tracepath github.com` showed an MTU of 1450; and the `ip a` output showed an mtu of 1500, similar to the below:

```
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
    inet6 ::1/128 scope host proto kernel_lo
       valid_lft forever preferred_lft forever
4: eth0@if5: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue state UP group default qlen 0
    link/ether 00:00:00:00:00:00 brd ff:ff:ff:ff:ff:ff link-netnsid 0
    inet 172.17.0.2/16 brd 172.17.255.255 scope global eth0
       valid_lft forever preferred_lft forever
```

Even `curl -v github.com` was giving the expected output:

```
6 4.824 * Host github.com:80 was resolved.
#6 4.824 * IPv6: (none)
#6 4.824 * IPv4: 20.250.119.67
#6 4.824 * Trying 20.250.119.67:80...
#6 4.826 * Established connection to github.com (20.250.119.67 port 80) from 172.17.0.2 port 51680
```

However, `curl -v https://github.com` failed with the following output

```
#6 56.34 * Host github.com:443 was resolved.
#6 56.34 * IPv6: (none)
#6 56.34 * IPv4: 20.250.119.67
#6 56.34 * Trying 20.250.119.67:443...
#6 56.34 * ALPN: curl offers h2,http/1.1
#6 56.34 } [5 bytes data]
#6 56.34 * TLSv1.3 (OUT), TLS handshake, Client hello (1):
#6 56.34 } [1563 bytes data]
#6 56.34 * SSL Trust Anchors:
#6 56.34 * CAfile: /etc/ssl/certs/ca-certificates.crt
#6 56.34 * CApath: /etc/ssl/certs
#6 207.5 * Recv failure: Connection reset by peer
#6 207.5 * TLS connect error: error:00000000:lib(0)::reason(0)
#6 207.5 * OpenSSL SSL_connect: Connection reset by peer in connection to github.com:443
#6 207.5 * closing connection #0
#6 207.5 curl: (35) Recv failure: Connection reset by peer
```

Basically, the client hello was `1563 bytes` long, and the client hello from curl got dropped along the line, which is why after `TLSv1.3 (OUT), TLS handshake, Client hello (1)`, nothing happens anymore, and we run into a timeout after a while (150s in the above example).

## Fixing the docker-dind config

Finally, I found the following article by gitlab [Docker-in-Docker jobs on GitLab.com hosted runners fail to reach NuGet API due to MTU mismatch](https://support.gitlab.com/hc/en-us/articles/27528955698972-Docker-in-Docker-jobs-on-GitLab-com-hosted-runners-fail-to-reach-NuGet-API-due-to-MTU-mismatch). This finally gave me the breakthrough I needed. I needed to configure the docker-dind service in the `.gitlab-ci.yml` file and afterwards everything worked.

So the fix is in the `.gitlab-ci.yml`, where the MTU has to be reduced to 1450,

Before, I had the following:

```yml
variables:
  DOCKER_HOST: tcp://docker:2376
  DOCKER_TLS_CERTDIR: "/certs"
  DOCKER_TLS_VERIFY: 1
  DOCKER_CERT_PATH: "$DOCKER_TLS_CERTDIR/client"

build:
  stage: build
  image: docker:29.2.1
    services:
      - docker:29.2.1-dind
```

And it works with the following, updated configuration:

```yml
variables:
  DOCKER_HOST: tcp://docker:2376
  DOCKER_TLS_CERTDIR: "/certs"
  DOCKER_TLS_VERIFY: 1
  DOCKER_CERT_PATH: "$DOCKER_TLS_CERTDIR/client"
  BUILDX_NO_DEFAULT_ATTESTATIONS: "1"

build:
  stage: build
  image: docker:29.9.1
    services:
      - name: docker:29.9.1-dind
        command: ["--mtu=1450"]
```

Now, the `ip a` command shows the lower MTU:

```
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
    inet6 ::1/128 scope host proto kernel_lo
       valid_lft forever preferred_lft forever
4: eth0@if5: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1450 qdisc noqueue state UP group default qlen 0
    link/ether 00:00:00:00:00:00 brd ff:ff:ff:ff:ff:ff link-netnsid 0
    inet 172.17.0.2/16 brd 172.17.255.255 scope global eth0
       valid_lft forever preferred_lft forever
```

And `curl -v https://github.com` yields the full web page.

After upgrading `docker-dind` from `29.2.1` to `29.9.1`, I additionally encountered the following error: `error from registry: blob unknown to registry - sha256:c6e2310a296954250088977787bea139032a1bcc42dd810cd5810cc1a038c80e`. This led me to the following forum [post](https://forum.gitlab.com/t/started-yesterday-docker-push-error-from-registry-blob-unknown-to-registry/134733), and adding `BUILDX_NO_DEFAULT_ATTESTATIONS: "1"`, as documented there fixed the issue for me as well.

The pipelines are passing, and everything is green.
