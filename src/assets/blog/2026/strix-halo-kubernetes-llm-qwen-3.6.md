# Qwen 3.6 35B A3B on AMD Ryzen AI Max+ 395 (Strix Halo) via Vulkan with Kubernetes

_Published: 2026-04-19_

## Summary

April has been quite a month for local LLMs! Shortly after Gemma 4 26B was released, it quickly became my favorite model to use.
However, just as Gemma 4 26B established itself, Qwen released the new Qwen 3.6 35B A3B model.

I haven not yet done much in depth testing; and I find Qwen 3.6 to be worse at linguistic tasks than Gemma 4 for instance, the model promises to be a strong contender - especially for agentic coding tasks. From a performance perspective, it is in the same ballpark as Gemma 4 26B. So interestingly, both models released in April are very similar in size, active parameters, performance, and compute requirements.

Since I have already established my llama.cpp server with GPT OSS 120B (read more [here](https://akehir.com/blog/strix-halo-kubernetes-llm-gpt-oss)), and more recently, with Gemma 4 ([here](https://akehir.com/blog/strix-halo-kubernetes-llm-gemma-4)), adding Qwen 3.6 was quite straightforward as well. I did have to add the `spirv-headers` to the Dockerfile in order to rebuild `llama.cpp`, as they are now required.

## Setup

As usual, the first step is downloading the models from huggingface - I recommend using the Unsloth Quant at Q8, which can be found [here](https://huggingface.co/unsloth/Qwen3.6-35B-A3B-GGUF/blob/main/Qwen3.6-35B-A3B-UD-Q8_K_XL.gguf).

Afterwards, updating / rebuilding `llama.cpp` is recommended; but otherwise we're ready to go.

Here's the command I use in `llama-swap`, which can also be used to run the `llama.cpp` web interface directly.

```
      qwen-3.6-35b-a3b:
        cmd: /app/llama.cpp/build/bin/llama-server --port ${PORT} --host 0.0.0.0 --model /models/chat/qwen-3.6-35b-a3b/Qwen3.6-35B-A3B-UD-Q8_K_XL.gguf --mmproj /models/chat/qwen-3.6-35b-a3b/mmproj-BF16.gguf --jinja --temp 1.0 --top-p 0.95 --min-p 0 --top-k 20 --repeat-penalty 1.0 --presence-penalty 1.5 --reasoning-budget -1 -c 262144
```

The command can probably still be optimized, but at least it works without issue / looping.

## Performance

During the performance test, the models are incorrectly recognized as qwn35moe models; but that does not matter, as the loaded models are in fact the new qwen 3.6 models.

Prompt processing seems to be a bit slower than expected, but text generation speed is quite good.

On my setup I do recommend Q8 instead of BF16 in order to achieve optimal performance. With that quantization, prompt processing hovers around 600 - 800 tokens / s, and text generation lands at 44 tokens / s. So comparing it to Gemma 4 26B, it is slower on prompt processing, but faster in text generation. On BF16, the prompt processing performance drops to around 50%, which is about expected. The text generation drops even more to just 25% of the Q8 performance, which is a speed where it definitely starts to hurt - at around 10 tokens / s.

As for Qwen 27B dense at Q8, the raw performance is unfortunately a bit lacking - as expected for a dense model. But it can run, and it runs well enough if necessary, and if a higher quality output is absolutely required.

### Qwen 3.6 27B Q8

| model           |      size |  params | backend | ngl | threads | n_ubatch |  fa |    test |           t/s |
| --------------- | --------: | ------: | ------- | --: | ------: | -------: | --: | ------: | ------------: |
| qwen35 27B Q8_0 | 32.89 GiB | 26.90 B | Vulkan  |  99 |       1 |     2048 |   1 |  pp2048 | 263.53 ± 1.63 |
| qwen35 27B Q8_0 | 32.89 GiB | 26.90 B | Vulkan  |  99 |       1 |     2048 |   1 |  pp8192 | 260.32 ± 1.31 |
| qwen35 27B Q8_0 | 32.89 GiB | 26.90 B | Vulkan  |  99 |       1 |     2048 |   1 | pp16384 | 229.73 ± 0.57 |
| qwen35 27B Q8_0 | 32.89 GiB | 26.90 B | Vulkan  |  99 |       1 |     2048 |   1 | pp32768 | 141.32 ± 1.47 |
| qwen35 27B Q8_0 | 32.89 GiB | 26.90 B | Vulkan  |  99 |       1 |     2048 |   1 |   tg128 |   6.25 ± 0.00 |

```
llama-bench -m /models/chat/qwen-3.6-27b/Qwen3.6-27B-UD-Q8_K_XL.gguf -t 1 -fa 1 -b 2048 -ub 2048 -p 2048,8192,16384,32768
ggml_vulkan: Found 1 Vulkan devices:
ggml_vulkan: 0 = Radeon 8060S Graphics (RADV STRIX_HALO) (radv) | uma: 1 | fp16: 1 | bf16: 0 | warp size: 64 | shared memory: 65536 | int dot: 1 | matrix cores: KHR_coopmat
load_backend: loaded Vulkan backend from /app/llama.cpp/build/bin/libggml-vulkan.so
load_backend: loaded CPU backend from /app/llama.cpp/build/bin/libggml-cpu-zen4.so
| model                          |       size |     params | backend    | ngl | threads | n_ubatch | fa |            test |                  t/s |
| ------------------------------ | ---------: | ---------: | ---------- | --: | ------: | -------: | -: | --------------: | -------------------: |
| qwen35 27B Q8_0                |  32.89 GiB |    26.90 B | Vulkan     |  99 |       1 |     2048 |  1 |          pp2048 |        263.53 ± 1.63 |
| qwen35 27B Q8_0                |  32.89 GiB |    26.90 B | Vulkan     |  99 |       1 |     2048 |  1 |          pp8192 |        260.32 ± 1.31 |
| qwen35 27B Q8_0                |  32.89 GiB |    26.90 B | Vulkan     |  99 |       1 |     2048 |  1 |         pp16384 |        229.73 ± 0.57 |
| qwen35 27B Q8_0                |  32.89 GiB |    26.90 B | Vulkan     |  99 |       1 |     2048 |  1 |         pp32768 |        141.32 ± 1.47 |
| qwen35 27B Q8_0                |  32.89 GiB |    26.90 B | Vulkan     |  99 |       1 |     2048 |  1 |           tg128 |          6.25 ± 0.00 |
```

### Qwen 3.6 35B A3B Q8

| model                  |      size |  params | backend | ngl | threads | n_ubatch |  fa |    test |            t/s |
| ---------------------- | --------: | ------: | ------- | --: | ------: | -------: | --: | ------: | -------------: |
| qwen35moe 35B.A3B Q8_0 | 35.80 GiB | 34.66 B | Vulkan  |  99 |       1 |     2048 |   1 |  pp2048 | 777.48 ± 11.72 |
| qwen35moe 35B.A3B Q8_0 | 35.80 GiB | 34.66 B | Vulkan  |  99 |       1 |     2048 |   1 |  pp8192 |  794.97 ± 3.63 |
| qwen35moe 35B.A3B Q8_0 | 35.80 GiB | 34.66 B | Vulkan  |  99 |       1 |     2048 |   1 | pp16384 |  735.51 ± 4.80 |
| qwen35moe 35B.A3B Q8_0 | 35.80 GiB | 34.66 B | Vulkan  |  99 |       1 |     2048 |   1 | pp32768 |  660.42 ± 3.08 |
| qwen35moe 35B.A3B Q8_0 | 35.80 GiB | 34.66 B | Vulkan  |  99 |       1 |     2048 |   1 |   tg128 |   44.58 ± 0.08 |

```
./llama-bench -m /models/chat/qwen-3.6-35b-a3b/Qwen3.6-35B-A3B-UD-Q8_K_XL.gguf -t 1 -fa 1 -b 2048 -ub 2048 -p 2048,8192,16384,32768
ggml_vulkan: Found 1 Vulkan devices:
ggml_vulkan: 0 = Radeon 8060S Graphics (RADV STRIX_HALO) (radv) | uma: 1 | fp16: 1 | bf16: 0 | warp size: 64 | shared memory: 65536 | int dot: 1 | matrix cores: KHR_coopmat
load_backend: loaded Vulkan backend from /app/llama.cpp/build/bin/libggml-vulkan.so
load_backend: loaded CPU backend from /app/llama.cpp/build/bin/libggml-cpu-zen4.so
| model                          |       size |     params | backend    | ngl | threads | n_ubatch | fa |            test |                  t/s |
| ------------------------------ | ---------: | ---------: | ---------- | --: | ------: | -------: | -: | --------------: | -------------------: |
| qwen35moe 35B.A3B Q8_0         |  35.80 GiB |    34.66 B | Vulkan     |  99 |       1 |     2048 |  1 |          pp2048 |       777.48 ± 11.72 |
| qwen35moe 35B.A3B Q8_0         |  35.80 GiB |    34.66 B | Vulkan     |  99 |       1 |     2048 |  1 |          pp8192 |        794.97 ± 3.63 |
| qwen35moe 35B.A3B Q8_0         |  35.80 GiB |    34.66 B | Vulkan     |  99 |       1 |     2048 |  1 |         pp16384 |        735.51 ± 4.80 |
| qwen35moe 35B.A3B Q8_0         |  35.80 GiB |    34.66 B | Vulkan     |  99 |       1 |     2048 |  1 |         pp32768 |        660.42 ± 3.08 |
| qwen35moe 35B.A3B Q8_0         |  35.80 GiB |    34.66 B | Vulkan     |  99 |       1 |     2048 |  1 |           tg128 |         44.58 ± 0.08 |

build: 59accc886 (8837)
```

### Qwen 3.6 35B A3B BF16

| model                  |      size |  params | backend | ngl | threads | n_ubatch |  fa |    test |           t/s |
| ---------------------- | --------: | ------: | ------- | --: | ------: | -------: | --: | ------: | ------------: |
| qwen35moe 35B.A3B BF16 | 64.60 GiB | 34.66 B | Vulkan  |  99 |       1 |     2048 |   1 |  pp2048 | 363.12 ± 2.70 |
| qwen35moe 35B.A3B BF16 | 64.60 GiB | 34.66 B | Vulkan  |  99 |       1 |     2048 |   1 |  pp8192 | 356.65 ± 3.86 |
| qwen35moe 35B.A3B BF16 | 64.60 GiB | 34.66 B | Vulkan  |  99 |       1 |     2048 |   1 | pp16384 | 346.26 ± 3.68 |
| qwen35moe 35B.A3B BF16 | 64.60 GiB | 34.66 B | Vulkan  |  99 |       1 |     2048 |   1 | pp32768 | 325.38 ± 1.87 |
| qwen35moe 35B.A3B BF16 | 64.60 GiB | 34.66 B | Vulkan  |  99 |       1 |     2048 |   1 |   tg128 |  10.66 ± 0.01 |

```
./llama-bench -m /models/chat/qwen-3.6-35b-a3b/Qwen3.6-35B-A3B-BF16-00001-of-00002.gguf -t 1 -fa 1 -b 2048 -ub 2048 -p 2048,8192,16384,3
2768
ggml_vulkan: Found 1 Vulkan devices:
ggml_vulkan: 0 = Radeon 8060S Graphics (RADV STRIX_HALO) (radv) | uma: 1 | fp16: 1 | bf16: 0 | warp size: 64 | shared memory: 65536 | int dot: 1 | matrix cores: KHR_coopmat
load_backend: loaded Vulkan backend from /app/llama.cpp/build/bin/libggml-vulkan.so
load_backend: loaded CPU backend from /app/llama.cpp/build/bin/libggml-cpu-zen4.so
| model                          |       size |     params | backend    | ngl | threads | n_ubatch | fa |            test |                  t/s |
| ------------------------------ | ---------: | ---------: | ---------- | --: | ------: | -------: | -: | --------------: | -------------------: |
| qwen35moe 35B.A3B BF16         |  64.60 GiB |    34.66 B | Vulkan     |  99 |       1 |     2048 |  1 |          pp2048 |        363.12 ± 2.70 |
| qwen35moe 35B.A3B BF16         |  64.60 GiB |    34.66 B | Vulkan     |  99 |       1 |     2048 |  1 |          pp8192 |        356.65 ± 3.86 |
| qwen35moe 35B.A3B BF16         |  64.60 GiB |    34.66 B | Vulkan     |  99 |       1 |     2048 |  1 |         pp16384 |        346.26 ± 3.68 |
| qwen35moe 35B.A3B BF16         |  64.60 GiB |    34.66 B | Vulkan     |  99 |       1 |     2048 |  1 |         pp32768 |        325.38 ± 1.87 |
| qwen35moe 35B.A3B BF16         |  64.60 GiB |    34.66 B | Vulkan     |  99 |       1 |     2048 |  1 |           tg128 |         10.66 ± 0.01 |

build: 59accc886 (8837)
```

## Setup and Config

As said previously, only the Dockerfile is updated with the added `spirv-headers`, otherwise everything stays the same as for Gemma 4. I'll just leave the link to the Gemma 4 setup [here](https://akehir.com/blog/strix-halo-kubernetes-llm-gemma-4) for more details. Especially if you want to run the setup with docker-compose or on ROCm, please refer to the other blog.

### Dockerfile / Container for Vulkan Backend

```Dockerfile
FROM debian:testing
ARG NODE_VERSION=24

## Container
RUN mkdir /models
RUN mkdir /conf

## Install dependencies
RUN apt update \
    && apt upgrade -y \
    && apt install -y \
        build-essential \
        git \
        python3 \
        python3-pip \
        python3-wheel \
        cmake \
        wget \
        xz-utils \
        npm \
        nodejs \
        curl \
        libcurl4-openssl-dev \
        libcpp-httplib-dev \
        libminiaudio-dev \
        glslc \
        libxcb-xinput0 \
        libxcb-xinerama0 \
        libxcb-cursor-dev \
        libvulkan-dev \
        vulkan-tools \
        radeontop \
        spirv-headers \
    && apt autoremove -y \
    && apt clean -y \
    && rm -rf /tmp/* /var/tmp/* \
    && find /var/cache/apt/archives /var/lib/apt/lists -not -name lock -type f -delete \
    && find /var/cache -type f -delete

RUN curl --output go-linux-amd64.tar.gz --location https://go.dev/dl/go1.26.1.linux-amd64.tar.gz \
    && rm -rf /usr/local/go && tar -C /usr/local -xzf go-linux-amd64.tar.gz \
    && rm go-linux-amd64.tar.gz
ENV PATH=$PATH:/usr/local/go/bin

## Clone repositories
WORKDIR /app
RUN git clone https://github.com/ggerganov/llama.cpp.git
RUN git clone https://github.com/mostlygeek/llama-swap

## Build llama.cpp
WORKDIR /app/llama.cpp
RUN cmake -B build -DGGML_NATIVE=OFF -DGGML_VULKAN=ON -DLLAMA_BUILD_TESTS=OFF -DGGML_BACKEND_DL=ON -DGGML_CPU_ALL_VARIANTS=ON && \
    cmake --build build --config Release -j$(nproc)
RUN pip install --break-system-packages --upgrade setuptools
RUN pip install --break-system-packages -r requirements.txt
WORKDIR /app/llama.cpp/build/bin

## Build llama-swap
WORKDIR /app/llama-swap
RUN make clean all
WORKDIR /app/llama-swap/build

CMD ["/bin/bash"]

```

### Kubernetes Manifest

The following Kubernetes manifest sets up the whole llm magic on the kubernetes cluster. As a note, there are some flux specific configurations, so if you do not use flux in your cluster, remove those.

```yaml
---
apiVersion: v1
kind: Namespace
metadata:
  name: llm
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: llm
  namespace: llm
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt
    traefik.ingress.kubernetes.io/router.middlewares: default-redirect-https@kubernetescrd
spec:
  ingressClassName: traefik
  rules:
    - host: llm.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: llm
                port:
                  number: 8080
  tls:
    - hosts:
        - llm.example.com
      secretName: llm-example-com
---
kind: Service
apiVersion: v1
metadata:
  name: llm
  namespace: llm
spec:
  selector:
    app: llm
  ports:
    - protocol: TCP
      port: 8080
      targetPort: 8080
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: llm-v42
  namespace: llm
spec:
  selector:
    matchLabels:
      app: llm
  replicas: 1
  template:
    metadata:
      labels:
        app: llm
    spec:
      securityContext:
        seccompProfile:
          type: Unconfined
        fsGroup: 0
        runAsUser: 0
        runAsGroup: 0
        runAsNonRoot: false
        supplementalGroups:
          - 44
          - 991
      hostIPC: true
      containers:
        - name: llm
          securityContext:
            privileged: true
            allowPrivilegeEscalation: true
            capabilities:
              add:
                - SYS_PTRACE
          image: registry.akehir.com/infra/llama-swap-llama-cpp-vulkan/llama-release:master-ce8f1363-1776414432 # {"$imagepolicy": "llm:image-policy"}
          command: ['/app/llama-swap/build/llama-swap-linux-amd64']
          ports:
            - containerPort: 8080
          volumeMounts:
            - name: llama-swap-config
              mountPath: /app/llama-swap/build/config.yaml
              subPath: config.yaml
              readOnly: true
            - name: dev-kfd
              mountPath: /dev/kfd
              securityContext:
                privileged: true
            - name: dev-dri
              mountPath: /dev/dri
              securityContext:
                privileged: true
            - name: models
              mountPath: /models
      volumes:
        - name: llama-swap-config
          configMap:
            name: llama-swap-config-v42
            items:
              - key: config.yaml
                path: config.yaml
        - name: dev-kfd
          hostPath:
            path: /dev/kfd
        - name: dev-dri
          hostPath:
            path: /dev/dri
        - name: models
          hostPath:
            path: /models
      affinity:
        nodeAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
            nodeSelectorTerms:
              - matchExpressions:
                  - key: kubernetes.io/arch
                    operator: In
                    values:
                      - amd64
                  - key: kubernetes.io/hostname
                    operator: In
                    values:
                      - srv-7
        podAntiAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
            - labelSelector:
                matchExpressions:
                  - key: module
                    operator: In
                    values:
                      - llm
              topologyKey: 'kubernetes.io/hostname'
---
apiVersion: image.toolkit.fluxcd.io/v1
kind: ImageRepository
metadata:
  name: image-repository
  namespace: llm
spec:
  image: registry.akehir.com/infra/llama-swap-llama-cpp-vulkan/llama-release
  interval: 5m
---
apiVersion: image.toolkit.fluxcd.io/v1
kind: ImagePolicy
metadata:
  name: image-policy
  namespace: llm
spec:
  imageRepositoryRef:
    name: image-repository
  filterTags:
    pattern: '^master-[a-fA-F0-9]+-(?P<ts>[1-9][0-9]*)'
    extract: '$ts'
  policy:
    numerical:
      order: asc
---
apiVersion: image.toolkit.fluxcd.io/v1
kind: ImageUpdateAutomation
metadata:
  name: image-update-automation
  namespace: llm
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
        email: mr.robot@akehir.com
        name: mr.robot
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
  namespace: llm
spec:
  interval: 1m0s
  ref:
    branch: master
  url: https://git.akehir.com/machina/flux.git
  secretRef:
    name: mr-robot
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: llama-swap-config-v42
  namespace: llm
data:
  config.yaml: |
    healthCheckTimeout: 600
    startPort: 14001

    models:
      gemma-4-26b:
        cmd: /app/llama.cpp/build/bin/llama-server --port ${PORT} --host 0.0.0.0 --model /models/chat/gemma-4-26B-A4B/gemma-4-26B-A4B-it-UD-Q8_K_XL.gguf --mmproj /models/chat/gemma-4-26B-A4B/mmproj-BF16.gguf --chat-template-file /app/llama.cpp/models/templates/google-gemma-4-31B-it-interleaved.jinja --jinja --temp 1.0 --top-p 0.95 --top-k 64 -c 255555
        aliases:
          - "gpt-4.1-mini"
          - "gemma-4-26b--q8"
          - "default"

      gpt-oss-120b:
        cmd: /app/llama.cpp/build/bin/llama-server --port ${PORT} --host 0.0.0.0 --model /models/chat/gpt-oss-120b/gpt-oss-120b-UD-Q8_K_XL-00001-of-00002.gguf --jinja --temp 1.0 --top-p 1.0 --top-k 0 -c 111111

      gemma-4-31b:
        cmd: /app/llama.cpp/build/bin/llama-server --port ${PORT} --host 0.0.0.0 --model /models/chat/gemma-4-31B-it/gemma-4-31B-it-UD-Q8_K_XL.gguf --jinja --temp 1.0 --top-p 0.95 --top-k 64 -c 255555

      qwen-3.6-35b-a3b:
        cmd: /app/llama.cpp/build/bin/llama-server --port ${PORT} --host 0.0.0.0 --model /models/chat/qwen-3.6-35b-a3b/Qwen3.6-35B-A3B-UD-Q8_K_XL.gguf --mmproj /models/chat/qwen-3.6-35b-a3b/mmproj-BF16.gguf --jinja --temp 1.0 --top-p 0.95 --min-p 0 --top-k 20 --repeat-penalty 1.0 --presence-penalty 1.5 --reasoning-budget -1 -c 262144

      glm-4.7-flash:
        cmd: /app/llama.cpp/build/bin/llama-server --port ${PORT} --host 0.0.0.0 --model /models/chat/glm-4.7-flash/GLM-4.7-Flash-UD-Q8_K_XL.gguf --jinja --temp 1.0 --top-p 0.95 --top-k 20 --repeat-penalty 1.0 -c 131072

      minimax-2.7:
        cmd: /app/llama.cpp/build/bin/llama-server --port ${PORT} --host 0.0.0.0 --model /models/chat/minimax-2.7/MiniMax-M2.7-UD-IQ4_XS-00001-of-00004.gguf --jinja --temp 1.0 --top-p 0.95 --top-k 40 -c 42000

    groups:
       default:
        swap: false
        members:
          - "gemma-4-26b"

    hooks:
      on_startup:
        preload:
          - "gemma-4-26b"
    ---
```
