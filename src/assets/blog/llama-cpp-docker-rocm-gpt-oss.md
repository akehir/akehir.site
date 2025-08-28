# How to run GPT-OSS (20B and 120B) with llama.cpp via Docker and ROCm on an AMD Radeon RX 7900 XTX and AMD Ryzen 9 7950X

*Published: 2025-08-28*

OpenAI has made headlines with their newly released open source models models. They are actually running great - even on less powerful hardware; and have comparatively high quality output.

The setup I describe in the following achieves ~110 tokens/s for the smaller model, and ~4-6 tokens/s for the bigger model.

Before following the instructions, you'll have to download the models. I suggest getting them directly from Huggingface.

- https://huggingface.co/openai/gpt-oss-120b
- https://huggingface.co/openai/gpt-oss-20b

## Step 1: Install Docker
```bash
# Install docker from the debian repository.
# Note: sudo is optional and can be removed if not desired.
apt install -y docker.io sudo
```

## Step 2:  Setup Dockerfile
The easiest is to create a new folder (I like to use a git repository)

```Dockerfile
FROM rocm/pytorch:rocm6.4.3_ubuntu24.04_py3.12_pytorch_release_2.6.0

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

Remember that you'll need to download the models first:
- https://huggingface.co/openai/gpt-oss-120b
- https://huggingface.co/openai/gpt-oss-20b

Furthermore, you'll have to convert the models to use with llama.cpp. Inside the container, run the following:

```shell
pip install -r requirements.txt
./convert_hf_to_gguf.py /models/gpt-oss-120b/
./convert_hf_to_gguf.py /models/gpt-oss-20b/
```


Then you can run the bigger model as follows:

```bash
./build/bin/llama-cli \
    --model /models/gpt-oss-120b/gpt-oss-120B-F16.gguf \
    --threads 16 \
    --prio 2 \
    --temp 0.6 \
    --n-gpu-layers 13 \
    --prompt "<｜User｜>How many r's are in the word blueberry?"
```

This gives the following speeds:
> llama_perf_sampler_print: sampling time = 49.46 ms / 763 runs ( 0.06 ms per token, 15426.61 tokens per second)
> llama_perf_context_print: load time = 21390.35 ms
> llama_perf_context_print: prompt eval time = 2225.93 ms / 44 tokens ( 50.59 ms per token, 19.77 tokens per second)
> llama_perf_context_print: eval time = 131869.31 ms / 718 runs ( 183.66 ms per token, 5.44 tokens per second)
> llama_perf_context_print: total time = 146719.76 ms / 762 tokens
> llama_perf_context_print: graphs reused = 695

The smaller model completely fits into 24GB of VRAM, I was able to increase the context size to 70k-80k tokens. If you have less VRAM, you will need to reduce the context size.

```bash
./build/bin/llama-cli \
    --model /models/gpt-oss-20b/gpt-oss-20B-F16.gguf \
    --threads 16 \
    --prio 2 \
    --temp 0.6 \
    --n-gpu-layers 777 \
    --ctx-size 77777 \
    --prompt "<｜User｜>How many r's are in the word blueberry?"
```

Which gives us the following (blazing fast) speeds:
llama_perf_sampler_print: sampling time = 49.46 ms / 763 runs ( 0.06 ms per token, 15426.61 tokens per second)

llama_perf_context_print: load time = 21390.35 ms

llama_perf_context_print: prompt eval time = 2225.93 ms / 44 tokens ( 50.59 ms per token, 19.77 tokens per second)

llama_perf_context_print: eval time = 131869.31 ms / 718 runs ( 183.66 ms per token, 5.44 tokens per second)

llama_perf_context_print: total time = 146719.76 ms / 762 tokens

llama_perf_context_print: graphs reused = 695
> llama_perf_sampler_print: sampling time = 118.94 ms / 1997 runs ( 0.06 ms per token, 16789.41 tokens per second)
> llama_perf_context_print: load time = 2705.01 ms
> llama_perf_context_print: prompt eval time = 157.61 ms / 24 tokens ( 6.57 ms per token, 152.27 tokens per second)
> llama_perf_context_print: eval time = 17789.35 ms / 1972 runs ( 9.02 ms per token, 110.85 tokens per second)
> llama_perf_context_print: total time = 26950.18 ms / 1996 tokens
> llama_perf_context_print: graphs reused = 1909

Overall, this makes the small model very usable for quick queries, and the bigger model remains suitable for more complex tasks - although requiring much more time.

Happy LLM-ing!
