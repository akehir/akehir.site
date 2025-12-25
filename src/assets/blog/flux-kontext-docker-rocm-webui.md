# Running Flux Kontext and Flux Krea on an AMD RX-7900XTX 24GB GPU Locally via ROCm and Stable-Diffusion-WebUI-Forge

I've been successfully able to get `flux kontext` or `flux krea` running on a local GPU with 24GB VRAM. The following documents my setup.

The same steps also work to run `flux krea`.
## Setup
First, I setup flux with docker and docker-compose.

I created the following directories, and installed the following tools on my host system (running debian testing). You can change the directories (for instance, storing the models also under the `/app` path, you just need to change the mount points in the docker-compose file). I like this separation, as I have `/models` mounted on a separate NVME disk.

Any debian-derived system should work with the same commands, but otherwise you basically just need to install git, docker and docker-compose.

The last step is important (downloading the flux kontext extension), in order to be able to edit images.

```bash
# install prerequisites
apt install -y sudo
sudo apt install -y git docker.io docker-compose

# setup directories
sudo mkdir -p /models/stable-diffusion-webui-forge/Stable-diffusion
sudo mkdir -p /models/stable-diffusion-webui-forge/VAE
sudo mkdir -p /models/stable-diffusion-webui-forge/text_encoder
sudo mkdir -p /app/stable-diffusion-webui-forge/repositories
sudo mkdir -p /app/stable-diffusion-webui-forge/extensions
sudo mkdir -p /app/stable-diffusion-webui-forge/outputs

# add flux kontext extension
cd /app/stable-diffusion-webui-forge/extensions
git clone https://github.com/DenOfEquity/forge2_flux_kontext
```
### Get Models

The next step is to download the models ans the required files for `flux kontext`. That can be done by following these steps:

- Download vae (raw float16, 'ae.safetensors' ) from Flux official [here](https://huggingface.co/black-forest-labs/FLUX.1-dev/tree/main) or [here](https://huggingface.co/black-forest-labs/FLUX.1-schnell).
- Download clip-l and t5-xxl from [here](https://huggingface.co/comfyanonymous/flux_text_encoders/tree/main) or [here](https://huggingface.co/lllyasviel/flux_text_encoders/tree/main)
- Download GGUF models [here](https://huggingface.co/lllyasviel/FLUX.1-dev-gguf) or [here](https://huggingface.co/lllyasviel/FLUX.1-schnell-gguf).
- Put base model in `/models/stable-diffusion-webui-forge/Stable-diffusion`.
- Put vae in `/models/stable-diffusion-webui-forge/VAE`
- Put clip-l and t5 in `/models/stable-diffusion-webui-forge/text_encoder`

See also the original instructions [here](https://github.com/lllyasviel/stable-diffusion-webui-forge/discussions/1050).

## Dockerfile
I used the following `Dockerfile` to run stable diffusion:

```Dockerfile
FROM rocm/pytorch:rocm7.0_ubuntu24.04_py3.12_pytorch_release_2.8.0

## Container
RUN mkdir /sd

## Clone SD
WORKDIR /sd
RUN git clone https://github.com/lllyasviel/stable-diffusion-webui-forge

WORKDIR /sd/stable-diffusion-webui-forge

## Activate VENV / Setup ENV
RUN python -m venv venv --system-site-packages
RUN . venv/bin/activate
ENV PROTOCOL_BUFFERS_PYTHON_IMPLEMENTATION=python

## Install Dependencies
RUN pip install -r requirements_versions.txt
RUN pip install requests==2.29.0

EXPOSE 7860/tcp

## Fix for "detected dubious ownership in repository" by rom1win.
RUN git config --global --add safe.directory '*'

CMD python launch.py --listen --disable-safe-unpickle --no-half-vae --no-half --precision full

```

### docker compose
The following docker-compose is used. You can choose any port instead of 12345 in order to access the files. If you changed the directories, you also have to change the volumes here.

I used the following `docker-compose.yml`.

```yml
services:
  webui:
    build: .
    ports:
      - "12345:7860"
    volumes:
      - /models/stable-diffusion-webui-forge:/sd/stable-diffusion-webui-forge/models/
      - /app/stable-diffusion-webui-forge/repositories:/sd/stable-diffusion-webui-forge/repositories/
      - /app/stable-diffusion-webui-forge/extensions:/sd/stable-diffusion-webui-forge/extensions/
      - /app/stable-diffusion-webui-forge/outputs:/sd/stable-diffusion-webui-forge/outputs/
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

```

### Running the model
Now, running the model is as simple as:

`docker-compose -f /app/stable-diffusion/docker-compose.yml up --detach`

And now the webui can be accessed under `http://localhost:12345`. Pulling the ROCm container can take a while as it's quite big (~10GB compressed).

The container can be stopped with `docker-compose -f /app/stable-diffusion/docker-compose.yml stop`

That's all =)

