# Full OpenAPI Compatible API including multimodal text generation, text to speech, speech to text, and image generation with cutting edge open source models and llama-swap on Kubernetes on a Strix Halo (AMD Ryzen AI Max+ 395) and Vulkan with llama.cpp, whisper.cpp, stablediffusion.cpp, Kokoro-FastAPI, and Qwen3 TTS OpenAI FastAPI

_Published: 2026-10-04_

In the following blog post I am describing my setup for self-hosting a almost fully compatible OpenAI server on a Strix Halo computer with 128GB of RAM. The computer has enough RAM to run everything together at the same time in an efficient manner. This setup is the basis upon which all my other AI projects are built.

Overall, there are quite a few components that need to be built into a single docker image - yielding an image size of around 3 - 4 GB. However, thanks to using the Vulkan backend, the size is still manageable - and compared to LLM model sizes the images are a drop in the ocean.

On the other hand, this setup offers all of the following:

- Chatting with an OpenAI compatible API based Chatbot, including multimodal capabilities (such as transcribing scanned images, or reasoning about embedded pdfs)
- Generating diffusion based AI images
- Editing images
- Converting speech to text
- Converting text to speech

The only major open feature I have not yet expored deeply is video and audio generation. I am sure I will be looking into these blank spots in the future - for now I am happy that I can run all the above features concurrently on my little AI box.

By any means the setup is not complete; I need to look into [audio.cpp](https://github.com/0xShug0/audio.cpp) and [gufo](https://github.com/gufo-org/gufo) next, those are great projects that should offer clear performance / dependency size benefits for my strix halo setup. However, the current setup covers enough in order to be valuable and usable for chatting / vibing.

First I am building a base image for llama-swap, including llama.cpp, wbisper.cpp, stablediffusion.cpp, Kokoto-FastAPI and Qwen3 TTS OpenAI FastAPI. The repository / image are publicly available [here](https://git.akehir.com/infra/llama-swap-llama-cpp-vulkan). However, you probably want to customize the `Dockerfile`. I have copied the `Dockerfile` as a reference further below. The `Dockerfile` creates an image that is around 3GB to 4GB big, which is much smaller thanks to the Vulkan backend rather than using a ROCm backend for instance. The second advantage is that the image should be hardware agnostic - but I've only tested it on AMD hardware.

Afterwards, I am running the image on my Strix Halo node via my Kubernetes cluster. Further below I have also included the full kubernetes config of the `llm`-namespace which is controlling & running the image on my cluster. If you want to use it you'll have to adapt a few things (such as the node selection), and I am also using flux for keeping the deployed image updated with the latest published image in the repository. You'd have to setup your own docker registry / flux repository references and secrets. Still, if you're running a kubernetes cluster I am sure this example can be a good starting point.

For anyone else, the easiest setup is probably via `docker-compose`, a setup which I have previously described [here](https://akehir.com/blog/llama-swap-and-llama-cpp-for-self-hosting-multiple-llm-models). Most of that should still remain true with the newer llama-swap image. Basically you can apply the same `docker-compose` file and update the `config.yaml` and `Dockerfile` to match the current examples, download the necessary models, and you're good to go. In the end of the blog post, I have also included these config files as examples. They're not fully tested though, so there could be some issues.

I have also added the example files to the repository. To get started, you just need to clone the repository [here](https://git.akehir.com/infra/llama-swap-llama-cpp-vulkan), clone all the desired models as per the config, and run `docker compose up`.

Have fun! In a future blog post, I will show how I use this setup together with opencode, but for now, you could just point any tool (such as opencode) at the OpenAI-compatible REST endpoints. Or you can open the llama-swap UI under the local port, such as [http://localhost:12345/](http://localhost:12345/), or [https://llm.example.com](https://llm.example.com).

## Dockerfile

```Dockerfile
FROM debian:testing
ARG NODE_VERSION=24
ENV DEBIAN_FRONTEND=noninteractive \
    PHONEMIZER_ESPEAK_PATH=/usr/bin \
    PHONEMIZER_ESPEAK_DATA=/usr/share/espeak-ng-data \
    ESPEAK_DATA_PATH=/usr/share/espeak-ng-data \
    PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    NUMBA_CACHE_DIR=/tmp/numba_cache

## Container
RUN mkdir /models
RUN mkdir /conf

## Install dependencies
RUN apt update \
    && apt upgrade -y \
    && apt install -y \
        build-essential \
        git \
        wget \
        cmake \
        npm \
        curl \
        glslc \
        nodejs \
        python3 \
        xz-utils \
        python3-pip \
        python3-wheel \
        spirv-headers \
        libcurl4-openssl-dev \
        libcpp-httplib-dev \
        libminiaudio-dev \
        libxcb-xinput0 \
        libxcb-xinerama0 \
        libxcb-cursor-dev \
        libvulkan-dev \
        libavcodec-dev \
        libavformat-dev \
        libavutil-dev \
        espeak-ng \
        espeak-ng-data \
        ffmpeg \
        zstd \
        g++ \
        libsndfile1 \
        libgomp1 \
        libvulkan1 \
        mesa-vulkan-drivers \
        libsox-dev \
        sox \
        vulkan-tools \
        radeontop \
    && apt autoremove -y \
    && apt clean -y \
    && rm -rf /tmp/* /var/tmp/* \
    && find /var/cache/apt/archives /var/lib/apt/lists -not -name lock -type f -delete \
    && find /var/cache -type f -delete

## Install Go
RUN curl --output go-linux-amd64.tar.gz --location https://go.dev/dl/go1.26.1.linux-amd64.tar.gz \
    && rm -rf /usr/local/go && tar -C /usr/local -xzf go-linux-amd64.tar.gz \
    && rm go-linux-amd64.tar.gz
ENV PATH=$PATH:/usr/local/go/bin

## Install Rust
RUN curl https://sh.rustup.rs -sSf | sh -s -- -y

ENV PATH=$PATH:/root/.cargo/bin

## Install UV
RUN curl -LsSf https://astral.sh/uv/install.sh | sh \
    && mv /root/.local/bin/uv /usr/local/bin/ \
    && mv /root/.local/bin/uvx /usr/local/bin/

## Clone repositories
WORKDIR /app
RUN git clone https://github.com/ggml-org/llama.cpp.git
RUN git clone https://github.com/ggml-org/whisper.cpp.git
RUN git clone https://github.com/mostlygeek/llama-swap
RUN git clone https://github.com/remsky/Kokoro-FastAPI.git
RUN git clone https://github.com/leejet/stable-diffusion.cpp.git
RUN git clone https://github.com/groxaxo/Qwen3-TTS-Openai-Fastapi.git

## Build Qwen3 TTS
WORKDIR /app/Qwen3-TTS-Openai-Fastapi
RUN uv venv --python 3.12 \
    && uv pip install --no-cache-dir --upgrade pip setuptools wheel \
    && uv pip install --no-cache-dir \
    torch>=2.0.0 \
    torchaudio>=2.0.0 \
    --index-url https://download.pytorch.org/whl/cpu \
    && uv pip install --no-cache-dir \
    transformers>=4.40.0 \
    accelerate>=1.0.0 \
    librosa \
    soundfile \
    pydub \
    numpy \
    scipy \
    einops \
    onnxruntime \
    fastapi>=0.109.0 \
    uvicorn[standard]>=0.27.0 \
    python-multipart \
    pydantic>=2.0.0 \
    inflect \
    aiofiles \
    && uv pip install --no-cache-dir -e .
RUN mkdir -p /tmp/numba_cache

## Build stable-diffusion.cpp
WORKDIR /app/stable-diffusion.cpp
RUN  git submodule sync --recursive && git submodule update --init --recursive
RUN cmake . -B ./build -DSD_VULKAN=ON && \
    cmake --build ./build --config Release --parallel
ENV PATH=$PATH:/app/stable-diffusion.cpp/build/bin

## Build kokoro-fastapi
WORKDIR /app/Kokoro-FastAPI
RUN uv venv --python 3.12 && \
    uv sync --extra cpu --no-cache

ENV PATH=$PATH:/app/Kokoro-FastAPI/.venv/bin

## Build Whisper.cpp
WORKDIR /app/whisper.cpp
RUN cmake -B build -DGGML_VULKAN=1 -D WHISPER_FFMPEG=yes && \
    cmake --build build --config Release -j$(nproc)

ENV PATH=$PATH:/app/whisper.cpp/build/bin

## Build llama.cpp
WORKDIR /app/llama.cpp
RUN cmake -B build -DGGML_NATIVE=OFF -DGGML_VULKAN=ON -DLLAMA_BUILD_TESTS=OFF -DGGML_BACKEND_DL=ON -DGGML_CPU_ALL_VARIANTS=ON && \
    cmake --build build --config Release -j$(nproc)
RUN uv venv && uv pip install -r requirements.txt --index-strategy unsafe-best-match

ENV PATH=$PATH:/app/llama.cpp/build/bin

## Build llama-swap
WORKDIR /app/llama-swap
RUN make clean all

ENV PATH=$PATH:/app/llama-swap/build

WORKDIR /app

CMD ["/bin/bash"]
```

## Kubernetes Config

```yaml
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
                  number: 15463
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
      port: 15463
      targetPort: 15463
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: llm
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
          image: registry.example.com/infra/llama-swap-llama-cpp-vulkan/llama-release:master-3cf447df-1790412791 # {"$imagepolicy": "llm:image-policy"}
          command: ['/app/llama-swap/build/llama-swap-linux-amd64']
          args: ['--config', '/app/config.yaml', '--listen', '0.0.0.0:15463']
          ports:
            - containerPort: 15463
          volumeMounts:
            - name: llama-swap-config
              mountPath: /app/config.yaml
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
            - name: run-lactd
              mountPath: /run/lactd.sock
              securityContext:
                privileged: true
            - name: models
              mountPath: /models
            - name: huggingface
              mountPath: /root/.cache/huggingface
      volumes:
        - name: llama-swap-config
          configMap:
            name: llama-swap-config-v73
            items:
              - key: config.yaml
                path: config.yaml
        - name: dev-kfd
          hostPath:
            path: /dev/kfd
        - name: dev-dri
          hostPath:
            path: /dev/dri
        - name: run-lactd
          hostPath:
            path: /run/lactd.sock
        - name: models
          hostPath:
            path: /models
        - name: huggingface
          hostPath:
            path: /models/hf
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
  image: registry.example.com/infra/llama-swap-llama-cpp-vulkan/llama-release
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
        email: mr.robot@example.com
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
  url: https://git.example.com/scope/repo.git
  secretRef:
    name: secretname
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: llama-swap-config-v73
  namespace: llm
data:
  config.yaml: |
    healthCheckTimeout: 600
    startPort: 14001
    globalTTL: 1337
    path: /models/metrics/llama-swap.sqlite
    metricsMaxInMemory: 10000
    captureBuffer: 33

    models:
      gemma-4-26b:
        cmd: llama-server --port ${PORT} --host 0.0.0.0 --model /models/chat/gemma-4-26B-A4B-qat/gemma-4-26B-A4B-it-qat-UD-Q4_K_XL.gguf --mmproj /models/chat/gemma-4-26B-A4B-qat/mmproj-F32.gguf --chat-template-file /app/llama.cpp/models/templates/google-gemma-4-31B-it-interleaved.jinja --jinja --image-min-tokens 560 --image-max-tokens 2240 --batch-size 4096 --ubatch-size 4096 --temp 1.0 --top-p 0.95 --top-k 64 -c 255555
        aliases:
          - "gpt-4.1-mini"
          - "default"

      gpt-oss-120b:
        cmd: llama-server --port ${PORT} --host 0.0.0.0 --model /models/chat/gpt-oss-120b/gpt-oss-120b-UD-Q8_K_XL-00001-of-00002.gguf --jinja --temp 1.0 --top-p 1.0 --top-k 0 -c 111111

      qwen-3.8-27b:
        cmd: llama-server --port ${PORT} --host 0.0.0.0 --model /models/chat/qwen-3.8-27b/Qwen3.8-27B-UD-Q8_K_XL.gguf --mmproj /models/chat/qwen-3.8-27b/mmproj-BF16.gguf --jinja --temp 1.0 --top-p 0.95 --min-p 0 --top-k 20 --repeat-penalty 1.0 --presence-penalty 0.0 -c 262144 --spec-type draft-mtp --batch-size 4096 --ubatch-size 4096

      automatic-speech-recognition--whisper:
        checkEndpoint: /v1/audio/transcriptions/
        cmd: /app/whisper.cpp/build/bin/whisper-server --port ${PORT} --host 0.0.0.0 --convert --request-path /v1/audio/transcriptions --inference-path "" --model /models/audio/whisper/ggml-large-v3.bin

      tts--kokoro:
        useModelName: kokoro
        env:
          - "USE_GPU=false"
          - "USE_ONNX=false"
          - "UV_PYTHON=3.12"
          - "UV_WORKING_DIR=/app/Kokoro-FastAPI"
          - "PYTHONPATH=/app/Kokoro-FastAPI:/app/Kokoro-FastAPI/api"
          - "MODEL_DIR=/models/audio/kokoro"
          - "VOICES_DIR=/models/audio/kokoro/voices"
          - "WEB_PLAYER_PATH=/app/Kokoro-FastAPI/web"
          - "ESPEAK_DATA_PATH=/usr/lib/x86_64-linux-gnu/espeak-ng-data"
        cmd: uv run uvicorn api.src.main:app --port ${PORT} --host 0.0.0.0

      tts--qwen-3:
        useModelName: tts-1
        env:
          - "UV_PYTHON=3.12"
          - "UV_NO_PROJECT=1"
          - "UV_WORKING_DIR=/app/Qwen3-TTS-Openai-Fastapi"
          - "PYTHONPATH=/app/Qwen3-TTS-Openai-Fastapi"
          - "TTS_BACKEND=official" # TTS_BACKEND=pytorch
          - "TTS_MODEL_NAME=Qwen/Qwen3-TTS-12Hz-1.7B-CustomVoice"
        cmd: uv run uvicorn api.main:app --port ${PORT} --host 0.0.0.0

      stable-diffusion--flux2-klein:
        checkEndpoint: /
        cmd: sd-server --diffusion-model /models/image/flux2-klein/flux-2-klein-4b-Q8_0.gguf --vae /models/image/flux2-klein/full_encoder_small_decoder.safetensors --llm /models/chat/qwen-3.0-4b-it/Qwen3-4B-Instruct-2507-UD-Q8_K_XL.gguf --cfg-scale 1.0 --diffusion-fa -v --listen-ip 0.0.0.0 --listen-port ${PORT} --vae-tiling

      stable-diffusion--z-image:
        checkEndpoint: /
        cmd: sd-server --diffusion-model /models/image/z-image/z-image-Q8_0.gguf --vae /models/image/z-image/ae.safetensors --llm /models/chat/qwen-3.0-4b-it/Qwen3-4B-Instruct-2507-UD-Q8_K_XL.gguf --cfg-scale 1.0 --diffusion-fa -v --listen-ip 0.0.0.0 --listen-port ${PORT} --vae-tiling

      stable-diffusion--z-image-turbo:
        checkEndpoint: /
        cmd: sd-server --diffusion-model /models/image/z-image-turbo/z_image_turbo-Q8_0.gguf --vae /models/image/z-image-turbo/ae.safetensors --llm /models/chat/qwen-3.0-4b-it/Qwen3-4B-Instruct-2507-UD-Q8_K_XL.gguf --cfg-scale 1.0 --diffusion-fa -v --listen-ip 0.0.0.0 --listen-port ${PORT} --vae-tiling

      stable-diffusion--qwen-image:
        checkEndpoint: /
        cmd: sd-server --diffusion-model /models/image/qwen-image/Qwen_Image-Q8_0.gguf --vae /models/image/qwen-image/qwen_image_vae.safetensors --llm /models/chat/qwen-2.5-vl-7b/Qwen2.5-VL-7B-Instruct.Q8_0.gguf --llm_vision /models/chat/qwen-2.5-vl-7b/Qwen2.5-VL-7B-Instruct.mmproj-f16.gguf --cfg-scale 2.5 --sampling-method euler --flow-shift 3 --qwen-image-zero-cond-t --diffusion-fa -v --listen-ip 0.0.0.0 --listen-port ${PORT} --vae-tiling

      stable-diffusion--qwen-image-edit:
        checkEndpoint: /
        cmd: sd-server --diffusion-model /models/image/qwen-image-edit/Qwen_Image_Edit-Q8_0.gguf --vae /models/image/qwen-image-edit/qwen_image_vae.safetensors --llm /models/chat/qwen-2.5-vl-7b/Qwen2.5-VL-7B-Instruct.Q8_0.gguf --llm_vision /models/chat/qwen-2.5-vl-7b/Qwen2.5-VL-7B-Instruct.mmproj-f16.gguf --cfg-scale 2.5 --sampling-method euler --flow-shift 3 --diffusion-fa -v --listen-ip 0.0.0.0 --listen-port ${PORT} --vae-tiling

    groups:
       default:
        swap: false
        members:
          - "gemma-4-26b"
          - "qwen-3.8-27b"
          - "stable-diffusion--flux2-klein"
          - "stable-diffusion--qwen-image-edit"
          - "stable-diffusion--qwen-image"
          - "tts--kokoro"
          - "tts--qwen-3"
          - "automatic-speech-recognition--whisper"

    hooks:
      on_startup:
        preload:
          - "gemma-4-26b"
    ---
```

## docker-compose

### docker-compose.yml

```yml
services:
  server:
    build: ..
    ports:
      - '12345:12345'
    volumes:
      - /models:/models
      - ./config.yaml:/conf/config.yaml
    devices:
      - '/dev/kfd:/dev/kfd'
      - '/dev/dri:/dev/dri'
    security_opt:
      - seccomp:unconfined
    group_add:
      - video
    cap_add:
      - SYS_PTRACE
    ipc: 'host'
    command: /app/llama-swap/build/llama-swap-linux-amd64 --listen 0.0.0.0:12345 --config /conf/config.yaml
```

### config.yaml

```yaml
healthCheckTimeout: 600
startPort: 14001
globalTTL: 1337
path: /models/metrics/llama-swap.sqlite
metricsMaxInMemory: 10000
captureBuffer: 33

models:
  gemma-4-26b:
	cmd: llama-server --port ${PORT} --host 0.0.0.0 --model /models/chat/gemma-4-26B-A4B-qat/gemma-4-26B-A4B-it-qat-UD-Q4_K_XL.gguf --mmproj /models/chat/gemma-4-26B-A4B-qat/mmproj-F32.gguf --chat-template-file /app/llama.cpp/models/templates/google-gemma-4-31B-it-interleaved.jinja --jinja --image-min-tokens 560 --image-max-tokens 2240 --batch-size 4096 --ubatch-size 4096 --temp 1.0 --top-p 0.95 --top-k 64 -c 255555
	aliases:
	  - "gpt-4.1-mini"
	  - "default"

  gpt-oss-120b:
	cmd: llama-server --port ${PORT} --host 0.0.0.0 --model /models/chat/gpt-oss-120b/gpt-oss-120b-UD-Q8_K_XL-00001-of-00002.gguf --jinja --temp 1.0 --top-p 1.0 --top-k 0 -c 111111

  qwen-3.8-27b:
	cmd: llama-server --port ${PORT} --host 0.0.0.0 --model /models/chat/qwen-3.8-27b/Qwen3.8-27B-UD-Q8_K_XL.gguf --mmproj /models/chat/qwen-3.8-27b/mmproj-BF16.gguf --jinja --temp 1.0 --top-p 0.95 --min-p 0 --top-k 20 --repeat-penalty 1.0 --presence-penalty 0.0 -c 262144 --spec-type draft-mtp --batch-size 4096 --ubatch-size 4096

  automatic-speech-recognition--whisper:
	checkEndpoint: /v1/audio/transcriptions/
	cmd: /app/whisper.cpp/build/bin/whisper-server --port ${PORT} --host 0.0.0.0 --convert --request-path /v1/audio/transcriptions --inference-path "" --model /models/audio/whisper/ggml-large-v3.bin

  tts--kokoro:
	useModelName: kokoro
	env:
	  - "USE_GPU=false"
	  - "USE_ONNX=false"
	  - "UV_PYTHON=3.12"
	  - "UV_WORKING_DIR=/app/Kokoro-FastAPI"
	  - "PYTHONPATH=/app/Kokoro-FastAPI:/app/Kokoro-FastAPI/api"
	  - "MODEL_DIR=/models/audio/kokoro"
	  - "VOICES_DIR=/models/audio/kokoro/voices"
	  - "WEB_PLAYER_PATH=/app/Kokoro-FastAPI/web"
	  - "ESPEAK_DATA_PATH=/usr/lib/x86_64-linux-gnu/espeak-ng-data"
	cmd: uv run uvicorn api.src.main:app --port ${PORT} --host 0.0.0.0

  tts--qwen-3:
	useModelName: tts-1
	env:
	  - "UV_PYTHON=3.12"
	  - "UV_NO_PROJECT=1"
	  - "UV_WORKING_DIR=/app/Qwen3-TTS-Openai-Fastapi"
	  - "PYTHONPATH=/app/Qwen3-TTS-Openai-Fastapi"
	  - "TTS_BACKEND=official" # TTS_BACKEND=pytorch
	  - "TTS_MODEL_NAME=Qwen/Qwen3-TTS-12Hz-1.7B-CustomVoice"
	cmd: uv run uvicorn api.main:app --port ${PORT} --host 0.0.0.0

  stable-diffusion--flux2-klein:
	checkEndpoint: /
	cmd: sd-server --diffusion-model /models/image/flux2-klein/flux-2-klein-4b-Q8_0.gguf --vae /models/image/flux2-klein/full_encoder_small_decoder.safetensors --llm /models/chat/qwen-3.0-4b-it/Qwen3-4B-Instruct-2507-UD-Q8_K_XL.gguf --cfg-scale 1.0 --diffusion-fa -v --listen-ip 0.0.0.0 --listen-port ${PORT} --vae-tiling

  stable-diffusion--z-image:
	checkEndpoint: /
	cmd: sd-server --diffusion-model /models/image/z-image/z-image-Q8_0.gguf --vae /models/image/z-image/ae.safetensors --llm /models/chat/qwen-3.0-4b-it/Qwen3-4B-Instruct-2507-UD-Q8_K_XL.gguf --cfg-scale 1.0 --diffusion-fa -v --listen-ip 0.0.0.0 --listen-port ${PORT} --vae-tiling

  stable-diffusion--z-image-turbo:
	checkEndpoint: /
	cmd: sd-server --diffusion-model /models/image/z-image-turbo/z_image_turbo-Q8_0.gguf --vae /models/image/z-image-turbo/ae.safetensors --llm /models/chat/qwen-3.0-4b-it/Qwen3-4B-Instruct-2507-UD-Q8_K_XL.gguf --cfg-scale 1.0 --diffusion-fa -v --listen-ip 0.0.0.0 --listen-port ${PORT} --vae-tiling

  stable-diffusion--qwen-image:
	checkEndpoint: /
	cmd: sd-server --diffusion-model /models/image/qwen-image/Qwen_Image-Q8_0.gguf --vae /models/image/qwen-image/qwen_image_vae.safetensors --llm /models/chat/qwen-2.5-vl-7b/Qwen2.5-VL-7B-Instruct.Q8_0.gguf --llm_vision /models/chat/qwen-2.5-vl-7b/Qwen2.5-VL-7B-Instruct.mmproj-f16.gguf --cfg-scale 2.5 --sampling-method euler --flow-shift 3 --qwen-image-zero-cond-t --diffusion-fa -v --listen-ip 0.0.0.0 --listen-port ${PORT} --vae-tiling

  stable-diffusion--qwen-image-edit:
	checkEndpoint: /
	cmd: sd-server --diffusion-model /models/image/qwen-image-edit/Qwen_Image_Edit-Q8_0.gguf --vae /models/image/qwen-image-edit/qwen_image_vae.safetensors --llm /models/chat/qwen-2.5-vl-7b/Qwen2.5-VL-7B-Instruct.Q8_0.gguf --llm_vision /models/chat/qwen-2.5-vl-7b/Qwen2.5-VL-7B-Instruct.mmproj-f16.gguf --cfg-scale 2.5 --sampling-method euler --flow-shift 3 --diffusion-fa -v --listen-ip 0.0.0.0 --listen-port ${PORT} --vae-tiling

groups:
   default:
	swap: false
	members:
	  - "gemma-4-26b"
	  - "qwen-3.8-27b"
	  - "stable-diffusion--flux2-klein"
	  - "stable-diffusion--qwen-image-edit"
	  - "stable-diffusion--qwen-image"
	  - "tts--kokoro"
	  - "tts--qwen-3"
	  - "automatic-speech-recognition--whisper"

hooks:
  on_startup:
	preload:
	  - "gemma-4-26b"
```
