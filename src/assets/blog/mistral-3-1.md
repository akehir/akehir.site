# How to run Mistral-Small-3.1-24B with llama.cpp via Docker and ROCm on an AMD Radeon RX 7900XTX

*Published: 2025-03-23*

Mistral has just released a small model, that will completely fit into a 24GB VRAM GPU when quantized. The full precision models released by Mistral will still require more than 50 GB of VRAM, however, we can run Q6 versions on a radeon RX 7900XTX fully in VRAM.
This is great news for performance, as I achieved ~30 tokens / second in my tests.
The instructions are the same as for DeepSeek V1, just a different model is used this time. So in just 5 simple steps, you can have your own local and personal LLM!

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
In the directory with the Dockerfile, run the following to build the container (depending on your computer / internet connection speed you might need *some* patience).
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

Now you'll need some quantized models of Mistral 3.1 to run on a 24GB VRAM GPU. Luckily for us, unsloth has uploaded such models ready to use to Huggingface here: https://huggingface.co/unsloth/Mistral-Small-3.1-24B-Instruct-2503-GGUF/tree/main . For the best performance / quality ratio you can use the Q6 model (19.3GB).

To run the above Unsloth Mistral 3.1 model, you can use the following command (it'll use ~22GB of VRAMU). I was getting ~30 tokens / second.  So far this is definitely the best performance / quality ratio for a locally run LLM model I've been able to find.

```bash
./build/bin/llama-cli \
    --model /models/chat/Mistral-Small-3.1-24B-Instruct-2503-GGUF/Mistral-Small-3.1-24B-Instruct-2503-Q6_K.gguf \
    --cache-type-k q4_0 \
    --threads 16 \
    --prio 2 \
    --temp 0.6 \
    --ctx-size 8192 \
    --n-gpu-layers 999 \
    -no-cnv \
    --prompt "<｜User｜>Tell me a couple of dad jokes in different languages. I'd like 7 in English, 3 in Spanish and 5 in German<｜Assistant｜>"
```

With this model on 24GB VRAM, I've been able to get up to around ~20k tokens context size. If you need bigger context sizes, you could try the smaller models (the bigger context requires more VRAM). For example, you could run the below command to use the Q2 version of Mistral 3.1 from unsloth:
```shell
./build/bin/llama-cli \
    --model /models/chat/Mistral-Small-3.1-24B-Instruct-2503-GGUF/Mistral-Small-3.1-24B-Instruct-2503-Q2_K_L.gguf \
    --cache-type-k q4_0 \
    --threads 16 \
    --prio 2 \
    --temp 0.6 \
    --ctx-size 8192 \
    --n-gpu-layers 999 \
    -no-cnv \
    --prompt "<｜User｜>Tell me a couple of dad jokes in different languages. I'd like 7 in English, 3 in Spanish and 5 in German<｜Assistant｜>"
```

This example will use ~11GiB of VRAM. This means, it'll even run on an 16GB or 12GB VRAM GPU. On a RX 7900 XTX with 24GB VRAM, this means that the context size can be increased even more. For example, using an 80k token context size will require around ~22 GiB of VRAM and therefore fit into our budget of 24GB.


For the Q8 version, unfortunately this model doesn't fully fit into the 24GB VRAM budget. Using the 8k token context window, ~36 layers of the LLM fit into the GPU. This uses ~22GiB VRAM and results in ~8 tokens / second. So this means the performance is just about 1/3rd of the Q6 (and smaller) models which fully fit into the VRAM. I used the below command to test this.


```shell
./build/bin/llama-cli \
    --model /models/chat/Mistral-Small-3.1-24B-Instruct-2503-GGUF/Mistral-Small-3.1-24B-Instruct-2503-Q8_0.gguf \
    --cache-type-k q4_0 \
    --threads 16 \
    --prio 2 \
    --temp 0.6 \
    --ctx-size 8192 \
    --n-gpu-layers 36 \
    -no-cnv \
    --prompt "<｜User｜>Tell me a couple of dad jokes in different languages. I'd like 7 in English, 3 in Spanish and 5 in German<｜Assistant｜>"
```

