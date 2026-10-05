# Vibing from the Comfort of your Mobile Phone with OpenWebUI, Conduit, Open-Terminal, and SearxNG

_Published: 2026-10-05_

## Introduction

This blog posts builds upon the foundation of my previous blog post about providing a fully OpenAI compatible API with `llama-swap`. Read more about that [here](https://akehir.com/blog/strix-halo-kubernetes-full-openai-compatible-api). Furthermore, I mostly use Qwen 3.8 27B for coding. You can review my detailed review of the model [here](https://akehir.com/blog/strix-halo-kubernetes-llm-qwen-3.8).

Once we have these foundations in place (a [model](https://akehir.com/blog/strix-halo-kubernetes-llm-qwen-3.8), and a way of providing that model over a [REST API](https://akehir.com/blog/strix-halo-kubernetes-full-openai-compatible-api)), the question is, how can that model be accessed in the most comfortable way. A year ago I've written about [OpenWebUI](https://akehir.com/blog/open-webui-llama-server), and now I am taking the same idea even further.

With the setup I am detailing now, the whole stack can be accessed from the phone (even the terminal where the AI is executing it's tool calls). With this setup, it is possible to collaborate with a self-hosted AI agent on a complex coding project directly from the phone.

This means that we have the full power of last years state-of-the art models accessible at the tips and taps of our fingers, in a fully private, secure environment of our own.

As a side-note: I am not claiming that this setup is without edges or hitches: There are bugs here and there, and it is a bit of work to have everything properly setup and configured. However, even with these bugs, it is possible to work quite efficiently directly from the phone - no need to leave a laptop semi-open and running claude-code or opencode.

And I would also like to point out that I am not a proponent of `vibe coding`, this whole setup is done out of intellectual curiosity, to find out what a locally hosted AI agent can actually do; and where the limits are. I do not think it is a good idea to let AI agents run wild and accept whatever code they might be proposing without understanding it.

**In other words: peruse the information presented here and the capabilities of LLMs at your own risk.**

## Detailing my Setup

In the following paragraphs I am detailing the core parts contributing to my artificial intelligence lab. I'll describe each part, and in the end we will see how everything fits together.

## Open-Terminal

The first part, what I would call the "brains of the operation", is the Open Terminal container. It is the execution environment, where AI agents have access to a linux container and can run commands and code. I created my own build of the open terminal project, in order to customize what's available to the agent. You can check out the custom repository [here](https://git.akehir.com/infra/open-terminal).

So basically this is the AIs playground, and I add all the tools / repositories I want the AI to have access to into this container.

This affords isolation (the agent only has access to what I provide in the image); while giving enough freedom for the agent to run commands independently. Note: this does not automatically give perfect security - the agent is still vulnerable to prompt injection - for example. It just limits the damage the agent can do (only within this container), and the data he can potentially leak (only data mounted into the container).

Below I have the config for the `open-terminal` kubernetes namespace with hosts the custom built image that I've linked above. Once the terminal is hosted on kubernetes, it can be linked to Open WebUI. As a side note: I'm reverting one specific commit `f0edc9e` with `git revert f0edc9e` in my Dockerfile, as that has caused issues with my terminal connection to Conduit.

### Open WebUI

If the "Open-Terminal" is the brain, then OpenWebUI is the heart. It provides the browser interface used to chat with the LLM APIs. It provides a few tools, it provides persistent storage for the chats, and the connection to the terminal. It also offers further tools / integration, such as image generation, web access, web search, and others. It is as if you would be having access to your own private chatgpt.com website. I've written in more detail about it [here](https://akehir.com/blog/open-webui-llama-server). I recommend that article for more detail.

In any case, the key part is setting up and configuring Open WebUI in order to have a persistent chat with the AI agents.

I have referenced the kubernetes configuration for the Open WebUI configuration further below.

### Conduit

On the mobile phone, it is possible to just open the Open WebUI browser page. However, for using the terminal inside the browser, it is not very comfortable or useable. This is where the conduit app comes into play. It has the teminal integrated into a separate tab; and offers a few buttons to help interacting with the terminal, making terminal usage on the go quite possible.

Secondly, having an app means it is possible to replace your _assistant_ on Android. So instead of having Gemini pop up whenever the assistant is called, it is possible to open a chat with conduit, which will run on your own infrastructure. Note: I have experimented doing the same with the Home Assistant App, which also works in principle - but so far Conduit offers the better experience.

Overall, it is not a necessary component, but recommended if you're planning to use your agent on the go.

Link to the Google Play Store [here](https://play.google.com/store/apps/details?id=app.cogwheel.conduit).

# SearxNG

SearxNG is another optional component for the setup. Installing and configuring SearxNG gives the agents a web search tool. This is very convenient in order to allow the agent to do web searches and research. Therefore I recommend
Web Search / Investigative capabilities for the AI Agent.

## Configuring the Setup

### Kubernetes

#### Open-Terminal

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: open-terminal
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: open-terminal
  namespace: open-terminal
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt
    traefik.ingress.kubernetes.io/router.middlewares: default-redirect-https@kubernetescrd
spec:
  ingressClassName: traefik
  rules:
    - host: open-terminal.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: open-terminal
                port:
                  number: 8000
  tls:
    - hosts:
        - open-terminal.example.com
      secretName: open-terminal-example-com
---
kind: Service
apiVersion: v1
metadata:
  name: open-terminal
  namespace: open-terminal
spec:
  selector:
    app: open-terminal
  ports:
    - protocol: TCP
      port: 8000
      targetPort: 8000
---
kind: PersistentVolumeClaim
apiVersion: v1
metadata:
  name: open-terminal-v5
  namespace: open-terminal
spec:
  storageClassName: openebs-hostpath
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 77G
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: open-terminal-v6
  namespace: open-terminal
spec:
  selector:
    matchLabels:
      app: open-terminal
  replicas: 1
  template:
    metadata:
      labels:
        app: open-terminal
    spec:
      securityContext:
        fsGroup: 1000
        runAsNonRoot: true
        runAsUser: 1000
      containers:
        - name: open-terminal
          image: registry.akehir.com/infra/open-terminal/terminal:master-14aa9e92-1790199109 # {"$imagepolicy": "open-terminal:image-policy"}
          securityContext:
            capabilities:
              drop:
                - ALL
            allowPrivilegeEscalation: false
            readOnlyRootFilesystem: true
            runAsNonRoot: true
            privileged: false
            seccompProfile:
              type: RuntimeDefault
          ports:
            - containerPort: 8000
          lifecycle:
            postStart:
              exec:
                command:
                  - /bin/sh
                  - '-c'
                  - >-
                    mkdir -p /home/user/.local/bin /home/user/.config /home/user/.local/state /home/user/.cache
          env:
            - name: OPEN_TERMINAL_API_KEY
              valueFrom:
                secretKeyRef:
                  name: open-terminal
                  key: OPEN_TERMINAL_API_KEY
          volumeMounts:
            - mountPath: '/home/user'
              name: userhome
            - mountPath: /tmp
              name: tmp
            - mountPath: /run
              name: run
      volumes:
        - name: userhome
          persistentVolumeClaim:
            claimName: open-terminal-v5
        - name: tmp
          emptyDir:
            sizeLimit: 777Mi
        - name: run
          emptyDir:
            sizeLimit: 7Mi
      affinity:
        nodeAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
            nodeSelectorTerms:
              - matchExpressions:
                  - key: kubernetes.io/arch
                    operator: In
                    values:
                      - amd64
        podAntiAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
            - labelSelector:
                matchExpressions:
                  - key: module
                    operator: In
                    values:
                      - open-terminal
              topologyKey: 'kubernetes.io/hostname'
---
apiVersion: image.toolkit.fluxcd.io/v1
kind: ImageRepository
metadata:
  name: image-repository
  namespace: open-terminal
spec:
  image: registry.akehir.com/infra/open-terminal/terminal
  interval: 5m
---
apiVersion: image.toolkit.fluxcd.io/v1
kind: ImagePolicy
metadata:
  name: image-policy
  namespace: open-terminal
spec:
  filterTags:
    pattern: '^master-[a-fA-F0-9]+-(?P<ts>[1-9][0-9]*)'
    extract: '$ts'
  policy:
    numerical:
      order: asc
  imageRepositoryRef:
    name: image-repository
---
apiVersion: image.toolkit.fluxcd.io/v1
kind: ImageUpdateAutomation
metadata:
  name: image-update-automation
  namespace: open-terminal
spec:
  interval: 5m
  sourceRef:
    kind: GitRepository
    name: flux
  git:
    checkout:
      ref:
        branch: master
    commit:
      author:
        email: nobody@example.com
        name: nobody
      messageTemplate: |
        Automated image update

        Automation name: {{ .AutomationObject }}

        Files:
        {{ range $filename, $_ := .Changed.FileChanges -}}
        - {{ $filename }}
        {{ end -}}

        Objects:
        {{ range $resource, $changes := .Changed.Objects -}}
        - {{ $resource.Kind }} {{ $resource.Name }}
          Changes:
        {{- range $_, $change := $changes }}
            - {{ $change.OldValue }} -> {{ $change.NewValue }}
        {{ end -}}
        {{ end -}}
    push:
      branch: master
  update:
    path: ./clusters/k8s-cluster-1
    strategy: Setters
---
apiVersion: source.toolkit.fluxcd.io/v1
kind: GitRepository
metadata:
  name: flux
  namespace: open-terminal
spec:
  interval: 1m0s
  ref:
    branch: master
  url: https://git.example.com/group/repository.git
  secretRef:
    name: mysecret
```

#### Open WebUI

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: openwebui
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: openwebui
  namespace: openwebui
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt
    traefik.ingress.kubernetes.io/router.middlewares: default-redirect-https@kubernetescrd
spec:
  ingressClassName: traefik
  rules:
    - host: chat.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: openwebui
                port:
                  number: 8080
  tls:
    - hosts:
        - chat.example.com
      secretName: chat-example-com
---
kind: Service
apiVersion: v1
metadata:
  name: openwebui
  namespace: openwebui
spec:
  selector:
    app: openwebui
  ports:
    - protocol: TCP
      port: 8080
      targetPort: 8080
---
kind: PersistentVolumeClaim
apiVersion: v1
metadata:
  name: openwebui
  namespace: openwebui
spec:
  storageClassName: openebs-hostpath
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 7G
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: openwebui
  namespace: openwebui
spec:
  selector:
    matchLabels:
      app: openwebui
  replicas: 1
  template:
    metadata:
      labels:
        app: openwebui
    spec:
      volumes:
        - name: openwebui
          persistentVolumeClaim:
            claimName: openwebui
      containers:
        - name: openwebui
          image: ghcr.io/open-webui/open-webui:v0.11.4 # {"$imagepolicy": "openwebui:image-policy"}
          securityContext:
            allowPrivilegeEscalation: false
            seccompProfile:
              type: RuntimeDefault
          ports:
            - containerPort: 8080
          volumeMounts:
            - mountPath: '/app/backend/data'
              name: openwebui
---
apiVersion: image.toolkit.fluxcd.io/v1
kind: ImageRepository
metadata:
  name: image-repository
  namespace: openwebui
spec:
  image: ghcr.io/open-webui/open-webui
  interval: 24h
---
apiVersion: image.toolkit.fluxcd.io/v1
kind: ImagePolicy
metadata:
  name: image-policy
  namespace: openwebui
spec:
  policy:
    semver:
      range: '>=0.0.0 <10.0.0'
  imageRepositoryRef:
    name: image-repository
---
apiVersion: image.toolkit.fluxcd.io/v1
kind: ImageUpdateAutomation
metadata:
  name: image-update-automation
  namespace: openwebui
spec:
  interval: 5m
  sourceRef:
    kind: GitRepository
    name: flux
  git:
    checkout:
      ref:
        branch: master
    commit:
      author:
        email: nobody@example.com
        name: nobody
      messageTemplate: |
        Automated image update

        Automation name: {{ .AutomationObject }}

        Files:
        {{ range $filename, $_ := .Changed.FileChanges -}}
        - {{ $filename }}
        {{ end -}}

        Objects:
        {{ range $resource, $changes := .Changed.Objects -}}
        - {{ $resource.Kind }} {{ $resource.Name }}
          Changes:
        {{- range $_, $change := $changes }}
            - {{ $change.OldValue }} -> {{ $change.NewValue }}
        {{ end -}}
        {{ end -}}
    push:
      branch: master
  update:
    path: ./clusters/k8s-cluster-1
    strategy: Setters
---
apiVersion: source.toolkit.fluxcd.io/v1
kind: GitRepository
metadata:
  name: flux
  namespace: openwebui
spec:
  interval: 1m0s
  ref:
    branch: master
  url: https://git.example.com/group/repository.git
  secretRef:
    name: mysecret
```

#### SearxNG

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: search
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: search
  namespace: search
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt
    traefik.ingress.kubernetes.io/router.middlewares: default-redirect-https@kubernetescrd
spec:
  ingressClassName: traefik
  rules:
    - host: search.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: search
                port:
                  number: 25500
  tls:
    - hosts:
        - search.example.com
      secretName: search-example-com
---
kind: Service
apiVersion: v1
metadata:
  name: search
  namespace: search
spec:
  selector:
    app: search
  ports:
    - protocol: TCP
      port: 25500
      targetPort: 25500
---
kind: Service
apiVersion: v1
metadata:
  name: search-valkey
  namespace: search
spec:
  selector:
    app: search-valkey
  ports:
    - protocol: TCP
      port: 25501
      targetPort: 25501
---
kind: PersistentVolumeClaim
apiVersion: v1
metadata:
  name: search
  namespace: search
spec:
  storageClassName: openebs-hostpath
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 3G
---
kind: PersistentVolumeClaim
apiVersion: v1
metadata:
  name: search-valkey-data
  namespace: search
spec:
  storageClassName: openebs-hostpath
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 3G
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: search-v7
  namespace: search
spec:
  selector:
    matchLabels:
      app: search
  template:
    metadata:
      labels:
        app: search
    spec:
      securityContext:
        fsGroup: 977
        runAsNonRoot: true
        runAsUser: 977
      containers:
        - name: search
          image: docker.io/searxng/searxng:2026.9.30-a9d990033 # {"$imagepolicy": "search:image-policy"}
          securityContext:
            capabilities:
              drop:
                - ALL
            allowPrivilegeEscalation: false
            readOnlyRootFilesystem: true
            runAsNonRoot: true
            privileged: false
            seccompProfile:
              type: RuntimeDefault
          ports:
            - containerPort: 25500
          env:
            - name: SEARXNG_PORT
              value: '25500'
            - name: SEARXNG_SECRET
              valueFrom:
                secretKeyRef:
                  name: search
                  key: SEARXNG_SECRET
          volumeMounts:
            - mountPath: '/var/cache/searxng'
              name: data
            - name: search-config-v7
              mountPath: /etc/searxng/settings.yml
              subPath: settings.yml
            - mountPath: /tmp
              name: tmp
      volumes:
        - name: tmp
          emptyDir:
            sizeLimit: 500Mi
        - name: data
          persistentVolumeClaim:
            claimName: search
        - name: search-config-v7
          configMap:
            name: search-config-v7
            items:
              - key: settings.yml
                path: settings.yml
      affinity:
        nodeAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
            nodeSelectorTerms:
              - matchExpressions:
                  - key: kubernetes.io/arch
                    operator: In
                    values:
                      - amd64
        podAntiAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
            - labelSelector:
                matchExpressions:
                  - key: module
                    operator: In
                    values:
                      - search
              topologyKey: 'kubernetes.io/hostname'
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: search-valkey
  namespace: search
spec:
  selector:
    matchLabels:
      app: search-valkey
  replicas: 1
  template:
    metadata:
      labels:
        app: search-valkey
    spec:
      containers:
        - name: search-valkey
          image: docker.io/valkey/valkey:9.1.2 # {"$imagepolicy": "search:image-policy-valkey"}
          ports:
            - containerPort: 25501
          command: ['valkey-server']
          args: ['--port', '25501']
          volumeMounts:
            - mountPath: '/data'
              name: search-valkey-data
      volumes:
        - name: search-valkey-data
          persistentVolumeClaim:
            claimName: search-valkey-data
      affinity:
        nodeAffinity:
          preferredDuringSchedulingIgnoredDuringExecution:
            - weight: 1
              preference:
                matchExpressions:
                  - key: kubernetes.io/arch
                    operator: In
                    values:
                      - amd64
---
apiVersion: image.toolkit.fluxcd.io/v1
kind: ImageRepository
metadata:
  name: image-repository
  namespace: search
spec:
  image: docker.io/searxng/searxng
  interval: 8h
  secretRef:
    name: dockerhub
---
apiVersion: image.toolkit.fluxcd.io/v1
kind: ImageRepository
metadata:
  name: image-repository-valkey
  namespace: search
spec:
  image: docker.io/valkey/valkey
  interval: 8h
  secretRef:
    name: dockerhub
---
apiVersion: image.toolkit.fluxcd.io/v1
kind: ImagePolicy
metadata:
  name: image-policy-valkey
  namespace: search
spec:
  policy:
    semver:
      range: '>=9.0.0 <42.0.0'
  imageRepositoryRef:
    name: image-repository-valkey
---
apiVersion: image.toolkit.fluxcd.io/v1
kind: ImagePolicy
metadata:
  name: image-policy
  namespace: search
spec:
  filterTags:
    pattern: '^(?P<ver>[0-9]*\.[0-9]*\.[0-9]*)-(?P<githash>[a-z0-9]*)$'
    extract: '$ver'
  policy:
    semver:
      range: '>=2026.0.0 <2100.0.0'
  imageRepositoryRef:
    name: image-repository
---
apiVersion: image.toolkit.fluxcd.io/v1
kind: ImageUpdateAutomation
metadata:
  name: image-update-automation
  namespace: search
spec:
  interval: 5m
  sourceRef:
    kind: GitRepository
    name: flux
  git:
    checkout:
      ref:
        branch: master
    commit:
      author:
        email: nobody@example.com
        name: nobody
      messageTemplate: |
        Automated image update

        Automation name: {{ .AutomationObject }}

        Files:
        {{ range $filename, $_ := .Changed.FileChanges -}}
        - {{ $filename }}
        {{ end -}}

        Objects:
        {{ range $resource, $changes := .Changed.Objects -}}
        - {{ $resource.Kind }} {{ $resource.Name }}
          Changes:
        {{- range $_, $change := $changes }}
            - {{ $change.OldValue }} -> {{ $change.NewValue }}
        {{ end -}}
        {{ end -}}
    push:
      branch: master
  update:
    path: ./clusters/k8s-cluster-1
    strategy: Setters
---
apiVersion: source.toolkit.fluxcd.io/v1
kind: GitRepository
metadata:
  name: flux
  namespace: search
spec:
  interval: 1m0s
  ref:
    branch: master
  url: https://git.example.com/group/repository.git
  secretRef:
    name: mysecret
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: search-config-v7
  namespace: search
data:
  settings.yml: |
    use_default_settings: true
    server:
      port: 25500
      base_url: "https://search.example.com"
    search:
      formats:
        - html
        - csv
        - json
        - rss
    valkey:
      url: valkey://search-valkey.search.svc.cluster.local:25501
    engines:
      - name: google
        disabled: false
      - name: gitlab
        engine: gitlab
        base_url: https://gitlab.com
        shortcut: gl
        disabled: false
      - name: npm
        disabled: false
      - name: github code
        inactive: false
        categories: [general, it]
        ghc_auth:
          type: "bearer"
          token: "foo"
      - name: kiwix--wikipedia-2025
        engine: xpath
        disabled: false
        shortcut: wake
        base_url: http://kiwix.example.com/content/wikipedia_en_all_maxi_2025-08
        categories: [general]
        search_url: https://kiwix.example.com/search?books.name=wikipedia_en_all_maxi_2025-08&userlang=en&start={pageno}&pageLength=25&pattern={query}
        title_xpath: //div[@class="results"]/ul/li/a/text()
        url_xpath: //div[@class="results"]/ul/li/a/@href
        content_xpath: //div[@class="results"]/ul/li/cite/text()
        timeout: 42.0
        weight: 1
        display_error_messages: true
        about:
          website: https://kiwix.example.com/content/wikipedia_en_all_maxi_2025-08
          results: HTML
          use_official_api: false
          require_api_key: false
```
