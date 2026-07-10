# How to run DeepSeek R1 with llama.cpp via Docker and ROCm on an AMD Radeon RX 7900XTX

_Published: 2025-02-28_

Just like it is possible to run stable diffusion with docker / rocm easily on an AMD Radeon RX 7900 XTX, it is also possible to run llama.cpp and models such as DeepSeek R1 on the GPU. However, I do have to note that if the model doesn't fit into VRAM, the performance will not be great. Smaller models that completely fit into the VRAM will work perfectly though.

## Step 1: Install Docker

```bash
# Install docker from the debian repository.
# Note: sudo is optional and can be removed if not desired.
apt install -y docker.io sudo
```

## Step 2: Setup Dockerfile

The easiest is to create a new folder (I like to use a git repository)

```Dockerfile
FROM rocm/pytorch:rocm6.2_ubuntu22.04_py3.10_pytorch_release_2.3.0

## Container
RUN mkdir /app

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

## Step 3: Build Docker

In the directory with the Dockerfile, run the following to build the container (depending on your computer / internet connection speed you might need _some_ patience).

```bash
sudo docker build . --tag llama.cpp
```

## Step 4: Run Docker

After building, run the docker container

```bash
sudo docker run -it \
   --network=host \
   --group-add=video \
   --ipc=host \
   --cap-add=SYS_PTRACE \
   --security-opt seccomp=unconfined \
   --device /dev/kfd \
   --device /dev/dri \
   -v ./models:/models \
   llama.cpp \
   bash
```

## Step 5: Profit

Now, you'll be inside the container. Inside, the container, you can use the command line to run commands on llama.cpp.

You'll need to download a model for this first. I've tested some of the smaller DeepSeek R1 models provided by Unsloth, you can get it from [Huggingface](https://huggingface.co/unsloth/DeepSeek-R1-GGUF/tree/main/DeepSeek-R1-UD-IQ1_S), for example.

To run the above Unsloth DeepSeek model, you can use the following command (it'll use ~23GB of VRAM for 7 layers on the GPU). I was getting ~0.4 tokens / second.

```bash
./build/bin/llama-cli \
    --model /models/chat/deepseek/unsloth/1.58bit/DeepSeek-R1-UD-IQ1_S-00001-of-00003.gguf \
    --cache-type-k q4_0 \
    --threads 16 \
    --prio 2 \
    --temp 0.6 \
    --ctx-size 8192 \
    --n-gpu-layers 7 \
    -no-cnv \
    --prompt "<｜User｜>Tell me a couple of dad jokes in different languages. I'd like 7 in English, 3 in Spanish and 7 in German<｜Assistant｜>"
```

If the model completely fits into GPU VRAM, the performance will be a lot better (although the quality might be lower then).
