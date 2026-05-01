# How to Self-Host your own private ChatGPT: Open WebUI with a GPU Accelerated llama.cpp Backend and the OpenAI GPT-20B Model

*Published:  2025-09-09*

With  OpenAI publishing a fast and good open weights model (gpt-20b), you might ask yourself the following question as a natural consequence:

> What if I could self-host a chat platform like openai - just private and secure.

There's actually an answer for that: OpenWebUI. It's a nice little wrapper for openai-compatible API providers (such as `llama-server` or `vLLM`).

In order to provide the whole package, I've created a `docker-compose.yml` - file, a few dockerfiles, and a systemd service in order to provide everything as a convenient package.

I've made the OpenWebUI accessible only via [pangolin](https://akehir.com/blog/how-to-make-your-homelab-accessible-via-pangolin); so the `docker-compose.yml` also contains a `newt` container.

As a side-note: The `llama-server` can be opened directly to provide a chat UI similar to what

The only drawback of my example is that ~16GB VRAM is reserved by `llama-server`; but you can practically move the `llama-server` into a separate `docker-compose.yml`; and only start it if required. More memory is required for a bigger context, and less memory for a smaller context. Memory can also be reduced, if less layers are loaded to the GPU RAM. See the `command` in the `llamacpp` service in the docker-compose.

## File structure
The following file structure is given on the host system:
A top-level folder `/app`, containing the folders `open-webui`, `models` (with the openai gpt model in the gguf format, see also my other blog entry for how to get the model from huggingface [here](https://akehir.com/blog/llama-cpp-docker-rocm-gpt-oss)). In the app folder, there is also the `docker-compose.yml`, the `Dockerfile` with the contents as per the following. You'll also need to install docker.

You can start by:
```bash
sudo apt install -y docker.io git
sudo mkdir /app
cd /app
mkdir open-webui
mkdir models
touch docker-compose.yml
touch Dockerfile
cd models 
git clone https://huggingface.co/openai/gpt-oss-20b
```
## docker-compose

The docker-compose contains all services we provide.

```yaml
services:
  newt:
    image: fosrl/newt:1.4.4
    container_name: newt
    restart: unless-stopped
    extra_hosts:
      - "host.docker.internal:host-gateway"
    environment:
      - PANGOLIN_ENDPOINT=https://pangolin.example.com
      - NEWT_ID=___VALUE___
      - NEWT_SECRET=___VALUE___
  openwebui:
    image: ghcr.io/open-webui/open-webui:main
    ports:
      - "13562:8080"
    volumes:
      - /app/open-webui:/app/backend/data
  llamacpp:
    build: ..
    ports:
      - "13563:13563"
    volumes:
      - /app/models:/models
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
    command: /app/llama.cpp/build/bin/llama-server --port 13563 --host 0.0.0.0 --model /models/gpt-oss-20b/gpt-oss-20B-F16.gguf --threads 16 --n-gpu-layers 777 --ctx-size 7777
```
## Dockerfile
A Dockerfile is only required for the `llama.cpp` container to build `llama.cpp`. The other containers can be used as is.
```Dockerfile
FROM rocm/pytorch:rocm6.4.3_ubuntu24.04_py3.12_pytorch_release_2.6.0

## Container
RUN mkdir /app
RUN mkdir /models

## Clone llama.cpp
WORKDIR /app
RUN git clone https://github.com/ggerganov/llama.cpp.git

WORKDIR /app/llama.cpp

## Activate VENV / Setup ENV
RUN HIPCXX="$(hipconfig -l)/clang" HIP_PATH="$(hipconfig -R)" \
    cmake -S . -B build -DGGML_HIP=ON -DAMDGPU_TARGETS=gfx1100 -DCMAKE_BUILD_TYPE=Release \
    && cmake --build build --config Release -- -j 16

CMD ["/bin/bash"]
```

## systemd service

```
[Unit]
Description=An all you can eat AI buffet service managed via docker-compose.
After=docker.service
Requires=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
ExecStart=/bin/bash -c "docker-compose -f /app/docker-compose.yml up --detach"
ExecStop=/bin/bash -c "docker-compose -f /app/docker-compose.yml stop"

[Install]
WantedBy=multi-user.target

```

You can paste the service file into it's correct location as follows:
```bash
sudo nano /etc/systemd/system/ai.service
```

And enable / start it:
```bash
sudo systemctl enable ai.service
```

To see what's happening, use the following:

```bash
sudo service ai status
sudo docker ps
sudo journalctl -fu ai
```

## Conclusion
After starting the containers the first time, it'll take a while (`llama.cpp` as to be built from source), and the Open WebUI docker container is quite big, so the download can take a while.

In pangolin, you'll have to create a new resource to access your new containers. For instance, chat.example.com ; and you can enter the target to be  `http | host.docker.internal | 13562`.

Once everything is running, you can login to Open WebUI, where you'll first create your admin user. Then you'll have to configure the backend to use (see the instructions here). So, you can go to http://localhost:13562/admin/settings/connections (or via your domain, such as https://chat.example.com/admin/settings/connections ); add a new OpenAI API Connection and enter `http://host.docker.internal:13563/v1`.

But you should now have access to your own local-first ChatGPT - and in my initial testing, both performance, and output have been quite good. For even better output, you can host a different model (such as the 120B model). I think the 20B model has made a good balance between quality and speed (and hardware requirements); and it also allows for a bigger context.

