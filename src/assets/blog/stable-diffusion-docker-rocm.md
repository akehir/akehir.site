# How to run Stable Diffusion WebUI or Forge on AMD Radeon RX 7900 XTX via Docker on Linux on Debian with ROCm 6.2 and GPU Acceleration

*Published: 2025-02-28*

It's pretty easy to run Stable Diffusion on an AMD Radeon RX 7900 XTX on Linux. The only necessary dependency is docker. I've done this on Debian, but it should be possible on any Linux version.

## Step 1: Install Docker
```bash
# Install docker from the debian repository.
# Note: sudo is optional and can be removed if not desired.
apt install -y docker.io sudo
```

## Step 2:  Setup Dockerfile
The easiest is to create a new folder (I like to use a git repository)

```Dockerfile
FROM rocm/pytorch:rocm6.2_ubuntu22.04_py3.10_pytorch_release_2.3.0

## Container
RUN mkdir /SD

## Clone SD
WORKDIR /SD
RUN git clone https://github.com/lllyasviel/stable-diffusion-webui-forge

WORKDIR /SD/stable-diffusion-webui-forge

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

## Step 3: Build Docker
In the directory with the Dockerfile, run the following to build the container (depending on your computer / internet connection speed you might need *some* patience).
```bash
sudo docker build . --tag sd-webui-forge
```


## Step 4: Run Docker
After building, run the docker container
```bash
sudo docker run -it \
	--network=host \
	--device=/dev/kfd \
	--device=/dev/dri \
	--group-add=video \
	--ipc=host \
	--cap-add=SYS_PTRACE \
	--security-opt seccomp=unconfined \
	-v ./models:/SD/stable-diffusion-webui-forge/models/ \
	-v ./repositories:/SD/stable-diffusion-webui-forge/repositories/ \
	-v ./extensions:/SD/stable-diffusion-webui-forge/extensions/ \
	-v ./outputs:/SD/stable-diffusion-webui-forge/outputs/ \
	sd-webui-forge
```

## Step 5: Profit
Now, you'll be able to access the Stable Diffusion WebUI Forge under [http://localhost:7860](http://localhost:7860).

However, to do something useful, you'll need to download a model and put it into the `./models` folder (which is mounted into the docker container). The optimal model is best chosen while taking your VRAM into consideration. 

I can recommend flux1-dev with 24GB of VRAM (ie: for instance an RX 7900 XTX). You can download the model via [huggingface](https://huggingface.co/black-forest-labs/FLUX.1-dev/tree/main).

Any image generations will appear under `./outputs`.
