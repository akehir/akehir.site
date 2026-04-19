# GPT-OSS 120B & 20B on AMD Ryzen AI Max+ 395 (Strix Halo) via Vulkan with Kubernetes on Debian Testing on a Minisforum MS-S1

In order to run bigger Machine Learning / LLM Models, I've wanted to upgrade the RAM of my computer. Unfortunately the rising DDR5 prices made that prohibitively expensive.

Therefore I've pivoted to using a *Minisforum MS-S1* which I could get for a reasonable price. I have to say, I'm positively surprised of the capabilities of this device, especially seen as compared to it's power consumption.

Here is how I've integrated it into my kubernetes cluster and how I'm running the GPT-OSS 20B and the GPT-OSS 120B models on the node, as well as the performance I'm getting on my setup.

I had a few challenges to solve:
- Network cards not working properly
- How to increase shared memory size
- How to configure kubernetes correctly to allow hardware access

## Setup and Configuration
### BIOS Config

- Limited CPU temperature to 77 degrees.
- 96GB VRAM allocated.

The limited temperature is the easiest way to limit power consumption without tuning many values in the BIOS. I'll take the performance loss for efficiency.

The maximum VRAM allocation solved my performance issues on context sizes greater than 8k.

### Installing Debian Testing and K3S
Before installing Debian on the MS-S1, I knew from reviews and Reddit discussions that the wired chips are requiring a cutting edge kernel. So instead of installing Debian stable (as I usually would), I setup a bootable Debian testing USB stick.

I also replaced the NVMe SSD of the MS-S1 with a bigger SSD before installing Linux (I'm keeping the other SSD in case I want to use Windows, or another OS).

During setup, I just followed the wizard, setup my partition layout (everything in one partition), and only installed the SSH server (no GUI).

Then I've installed the basic programs I require on my kubernetes hosts (including docker and other cluster prerequisites), some software for creating backups and some for seeing the GPU state (such as `radeontop`).

The full install command is:

```
apt install sudo docker.io docker-compose htop rsync nfs-common curl open-iscsi earlyoom git git-lfs smartmontools lm-sensors imagemagick restic rear radeontop vulkan-tools
```


Then I could join my existing `k3s` cluster:

```
sudo curl -sfL https://get.k3s.io | K3S_TOKEN=ABCXYZ sh -s - agent --server https://192.168.0.1:6443 --docker
```

Afterwards I needed to change some kernel parameters in order to configure how much memory is accessible as shared memory (for the CPU and GPU). The easiest way of verifying the shared memory is checking the GTT size with `radeontop`.

To achieve that, first, run `sudo nano /etc/default/grub`, then edit the file with the values below, and then enable it by running `sudo update-grub` and `sudo reboot`.

```
GRUB_CMDLINE_LINUX_DEFAULT="quiet amdttm.pages_limit=32768 amdttm.page_pool_size=32768 amdgpu.gttsize=32768"
```

After setting up the OS and joining the cluster, I was ready of running workloads on the machine via kubernetes.

But before I could run the workloads, I had to create the docker images I wanted to run on the machine.

### Dockerfile

I'm using the following `Dockerfile` to run both llama.cpp and llama.swap with a Vulkan backend on my computer. I choose Vulkan for my tests, because the ROCm docker images are very big.

The images and the code can be seen here: https://git.akehir.com/infra/llama-swap-llama-cpp-vulkan .


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
### Kubernetes Config

I've deployed both `openwebui` and `llama-swap` / `llama.cpp` (in one container as seen above) to the cluster.

To re-use the config you probably want to remove the `traefik.ingress.kubernetes.io/router.middlewares: default-redirect-https@kubernetescrd`, depending on your ingress controller (or you'll need to create that redirect rule).

Of interest is mainly the llama config, the openwebui just provides an easy chat ui. To use my config of openwebui, you will need to install openebs, or provide a different volume (the easiest probably being hostpath).

I use flux to synchronize the config to my cluster, but you can also just create the files below and run `kubectl apply -f ...`.
#### llama-swap & llama.cpp

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
  name: llm-v1
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
            capabilities:
              add:
                - SYS_PTRACE
          image: registry.example.com/infra/llama-swap-llama-cpp-vulkan/llama-release:latest
          command: ["/app/llama-swap/build/llama-swap-linux-amd64"]
          ports:
            - containerPort: 8080
          volumeMounts:
            - name: llama-swap-config-v1
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
            name: llama-swap-config
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
                      - srv
        podAntiAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
            - labelSelector:
                matchExpressions:
                  - key: module
                    operator: In
                    values:
                      - llm
              topologyKey: "kubernetes.io/hostname"
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: llama-swap-config-v1
  namespace: llm
data:
  config.yaml: |
    healthCheckTimeout: 600
    startPort: 14001

    models:
      gpt-oss-20b:
        cmd: |
          /app/llama.cpp/build/bin/llama-server --port ${PORT} --host 0.0.0.0 --model /models/chat/gpt-oss-20b/gpt-oss-20B-F16.gguf --jinja

      gpt-oss-120b:
        cmd: /app/llama.cpp/build/bin/llama-server --port ${PORT} --host 0.0.0.0 --model /models/chat/gpt-oss-120b/gpt-oss-120b-UD-Q8_K_XL-00001-of-00002.gguf --jinja --temp 1.0 --top-p 1.0 --top-k 0 -c 111111

    groups:
       default:
        swap: false
        members:
          - "gpt-oss-20b"
          - "gpt-oss-120b"

    hooks:
      on_startup:
        preload:
          - "gpt-oss-20b"
          - "gpt-oss-120b"
    ---
---

```

#### OpenWebUI

```yaml
---
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
          image: ghcr.io/open-webui/open-webui:v0.6.43
          ports:
            - containerPort: 8080
          volumeMounts:
            - mountPath: "/app/backend/data"
              name: openwebui
---
```

### Docker-Compose

If kubernetes is too heavy, the same Dockerfile I provided can be run via a simple docker-compose file (created in the same directory). You just need to create a correct config file for llama-swap. You can find an example in my blog post about llama-swap [here](https://akehir.com/blog/llama-swap-and-llama-cpp-for-self-hosting-multiple-llm-models).

```docker-compose.yml
services:
  server:
    build: .
    ports:
      - "12345:8080"
    volumes:
      - /models:/models
      - /app/llama-swap/config.yaml:/conf/config.yaml
    devices:
      - '/dev/kfd:/dev/kfd'
      - '/dev/dri:/dev/dri'
    security_opt:
      - seccomp:unconfined
    group_add:
      - video
    cap_add:
      - SYS_PTRACE
    ipc: "host"
    command: /app/llama-swap/build/llama-swap-linux-amd64 --listen 0.0.0.0:8080 --config /conf/config.yaml
```

## Conclusion & Results
### Issues
#### No Network after Installing the OS
While the network cards were working fine during the installation, after removing the USB drive and rebooting the computer, they didn't work anymore. Even rebooting didn't help.
Thanks to a Google search, I figured out a solution: The computer needs to be completely shut off - and not just rebooted. So I turned it off, removed the power cable, and waited a bit before turning it on. Afterwards it worked perfectly.

#### Low Performance on Bigger Context Sizes (>8k)
The default allocation of 2GB VRAM didn't work out for me, because as soon as context sizes were greater than 8k and the context didn't fit into the GPU RAM, the performance was horrible.

First I've increased the shared memory, but that didn't seem to help immediately.

In the end I've just changed the VRAM to a fixed allocation of 96GB, and left the remaining 32GB as shared RAM.

#### How to increase shared memory size
The default shared memory for the GPU was set to ~64GB in my kernel.

I've changed it by changing the defaults in, `sudo nano /etc/default/grub`, with the values below, and then enable it by running `sudo update-grub` and `sudo reboot`.

```
GRUB_CMDLINE_LINUX_DEFAULT="quiet amdttm.pages_limit=126000 amdttm.page_pool_size=126000 amdgpu.gttsize=126000"
```

In the end, I've chosen to allocate the GPU memory in the BIOS and not gone the route of shared memory for the moment, due to performance issues with larger context sizes; this is something I'd like to revisit in the future though.
#### How to configure kubernetes correctly to allow hardware access
This had me stumped for a while. You can see the working config above. But I didn't have the right approach to enabling access to the host devices inside the container.

One (safer) approach would be to use device plugins for kubernetes - for instance the [AMD GPU device plugin for Kubernetes](https://github.com/ROCm/k8s-device-plugin).

However, I'm not particularly concerned about the safety, since the cluster isn't used by untrusted applications and this particular container isn't accessible from outside my network. I'm also building the applications by myself.

And since I've chosen to run the Vulkan backend, I can get away with running the container as `privileged: true`, which allows the device access to work. The complete config is already posted above, there are quite a few flags I had to set in order to run the workload I wanted.

In the future I do want to look into the AMD device plugin, but that's a story for another time. For another year, I dare say.

### Performance

I've chosen the GPT-OSS models because they're popular, performant, and provide a baseline performance as a means to compare this to other devices.

The results are with GPT-OSS-20B and GPT-OSS-120B preloaded. This takes around ~80GB of the VRAM assigned to the card.

#### GPT-OSS-20B
Firstly, I've checked the performance I'm getting on some requests as captured by llama-swap in real-world usage.

Prompt processing: ~1000 - 1500 tokens / second.
Generation: ~45 tokens / second.

And then I've used `llama-bench` to run a few benchmarks to have a comparable result to those posted on `gpt-oss` discussions on the `llama.cpp` [here](https://github.com/ggml-org/llama.cpp/discussions/15396).

The command was `/app/llama.cpp/build/bin# ./llama-bench -m /models/chat/gpt-oss-20b/gpt-oss-20B-F16.gguf  -t 1 -fa 1 -b 2048 -ub 2048 -p 2048,8192,16384,32768`

```
root@llm-v15-76d5bf569c-jdgr9:/app/llama.cpp/build/bin# ./llama-bench -m /models/chat/gpt-oss-20b/gpt-oss-20B-F16.gguf  -t 1 -fa 1 -b 2048 -ub 2048 -p 2048,8192,16384,32768
ggml_vulkan: Found 1 Vulkan devices:
ggml_vulkan: 0 = Radeon 8060S Graphics (RADV GFX1151) (radv) | uma: 1 | fp16: 1 | bf16: 0 | warp size: 64 | shared memory: 65536 | int dot: 1 | matrix cores: KHR_coopmat
load_backend: loaded Vulkan backend from /app/llama.cpp/build/bin/libggml-vulkan.so
load_backend: loaded CPU backend from /app/llama.cpp/build/bin/libggml-cpu-icelake.so

```

| model                          |       size |     params | backend    | ngl | threads | n_ubatch | fa |            test |                  t/s |
| ------------------------------ | ---------: | ---------: | ---------- | --: | ------: | -------: | -: | --------------: | -------------------: |
| gpt-oss 20B F16                |  12.83 GiB |    20.91 B | Vulkan     |  99 |       1 |     2048 |  1 |          pp2048 |       1274.95 ± 1.29 |
| gpt-oss 20B F16                |  12.83 GiB |    20.91 B | Vulkan     |  99 |       1 |     2048 |  1 |          pp8192 |       1055.64 ± 1.35 |
| gpt-oss 20B F16                |  12.83 GiB |    20.91 B | Vulkan     |  99 |       1 |     2048 |  1 |         pp16384 |        828.95 ± 0.55 |
| gpt-oss 20B F16                |  12.83 GiB |    20.91 B | Vulkan     |  99 |       1 |     2048 |  1 |         pp32768 |        546.66 ± 1.35 |
| gpt-oss 20B F16                |  12.83 GiB |    20.91 B | Vulkan     |  99 |       1 |     2048 |  1 |           tg128 |         46.45 ± 0.14 |


#### GPT-OSS-120B
Again, I've run some real usage benchmarks to get a feeling for the performance of the model on my setup:

Prompt processing: ~400 tokens / second.
Generation: ~30 - 33 tokens / second.

And then I've run llama-bench from within the container (via `kubectl -n llm exec -it llm-v15-76d5bf569c-jdgr9 -- /bin/bash`) to get benchmark results comparable  to those posted on the `gpt-oss` discussions on the `llama.cpp` [here](https://github.com/ggml-org/llama.cpp/discussions/15396).

```
root@llm-v15-76d5bf569c-jdgr9:/app/llama.cpp/build/bin# ./llama-bench -m /models/chat/gpt-oss-120b/gpt-oss-120B-F16.gguf  -t 1 -fa 1 -b 2048 -ub 2048 -p 2048,8192,16384,32768
ggml_vulkan: Found 1 Vulkan devices:
ggml_vulkan: 0 = Radeon 8060S Graphics (RADV GFX1151) (radv) | uma: 1 | fp16: 1 | bf16: 0 | warp size: 64 | shared memory: 65536 | int dot: 1 | matrix cores: KHR_coopmat
load_backend: loaded Vulkan backend from /app/llama.cpp/build/bin/libggml-vulkan.so
load_backend: loaded CPU backend from /app/llama.cpp/build/bin/libggml-cpu-icelake.so

```

| model                          |       size |     params | backend    | ngl | threads | n_ubatch | fa |            test |                  t/s |
| ------------------------------ | ---------: | ---------: | ---------- | --: | ------: | -------: | -: | --------------: | -------------------: |
| gpt-oss 120B F16               |  60.87 GiB |   116.83 B | Vulkan     |  99 |       1 |     2048 |  1 |          pp2048 |        447.08 ± 6.63 |
| gpt-oss 120B F16               |  60.87 GiB |   116.83 B | Vulkan     |  99 |       1 |     2048 |  1 |          pp8192 |        412.02 ± 0.79 |
| gpt-oss 120B F16               |  60.87 GiB |   116.83 B | Vulkan     |  99 |       1 |     2048 |  1 |         pp16384 |        354.80 ± 0.55 |
| gpt-oss 120B F16               |  60.87 GiB |   116.83 B | Vulkan     |  99 |       1 |     2048 |  1 |         pp32768 |        265.68 ± 1.11 |
| gpt-oss 120B F16               |  60.87 GiB |   116.83 B | Vulkan     |  99 |       1 |     2048 |  1 |           tg128 |         34.12 ± 0.12 |


### Final Words
As you can see, prompt processing performance falls off as compared to dedicated GPUs, but the generation speed is quite solid comparatively.

For power efficiency, it's a good result for ~100 Watts of sustained use (and ~10W idle).

I'm particularly happy to see that the 120B model performs almost as good as the 20B model while being a much more powerful model. For my usage, this is basically making the smaller model redundant.

This is a stark contrast to running both models on my discrete GPU with 24GB of VRAM (an AMD RX 7900XTX), where I've gotten more than 100 tokens per second on the smaller model, but less than 10 tokens per second for the bigger model when generating text.

Where the dedicated GPU can really outshine the APU here is prompt processing, which is significantly faster.

For me, the conclusion is, that a model that fits on the GPU will be much faster running on the dedicated GPU, however big trade-offs have to be made with context size and model size / quantization.

The performance of the APU is good enough, and the higher GPU memory affords bigger context sizes and models. In particular for GPT-OSS, the difference between the 20B and the 120B models is huge. For my tests, the 20B model is palatable for chatting; however it falls apart in more complex tasks, such as coding - for one the output it provides is more error prone, and for two it gets easily confused.

From this point of view, the investment into the MS-S1 was absolutely worth it, because it allows me to run larger LLM models with better performance and less power consumption than on my desktop computer.
