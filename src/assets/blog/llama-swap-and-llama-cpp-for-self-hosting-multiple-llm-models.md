# Using llama-swap to Self-Host an OpenAI Compatible API with llama.cpp providing Multiple LLM Models with Limited Resources

In my [previous blog entry](https://akehir.com/blog/open-webui-llama-server) I was using llama.cpp to self-host an OpenAI compatible API with the GPT-OSS 20B model.

However, different models might have different strengths and might perform differently. While some tasks can be completed with a smaller and faster model (which also affords a bigger context), larger models might be required for more serious tasks (but suffer a performance penalty).

By using llama-swap, we can have the best of both worlds available whenever we need it. Either using faster model or a slower model on the same hardware, loading / unloading the models as needed.

So for instance, gemma3 might be better for writing emails and coming off as "human". And there are also the qwen line of models, or glm 4.5 / 4.6 for better coding.

In order to achieve that, we can actually use `llama-swap`. By compiling `llama-swap` into the container we can use `llama-swap` to dynamically switch between LLM models.

Otherwise the setup remains the same as in my previous blog entry - but the result is that it's possible to dynamically switch between models even in the same chat.

Further below I'm also sharing my `config,yaml`, which I've used to sucessfully run the following models via ROCm 7.0 on my AMD RX7900XTX (24GB of VRAM) and 64GB of system RAM (in order to run bigger models I'm considering upgrading my RAM though).

I've successfully run the following models so far:

- GPT-OSS-20B
- GPT-OSS-120B
- Qwen-3-coder-30B
- Gemma3 (various model sizes)
- SmolLM
- GLM 4.5 Air
- Mistral Small 3.1 (various model sizes)

I'd like to look into running Kimi k2 and GLM 4.6 in the future, but this selection of models is already a good start for local LLM-ing.
## Configuration

### docker-compose.yml

```yaml
services:
  server:
    build: .
    ports:
      - "12345:12345"
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
    command: /app/llama-swap/build/llama-swap-linux-amd64 --listen 0.0.0.0:12345 --config /conf/config.yaml
```

### Dockerfile

```Dockerfile
FROM rocm/pytorch:rocm7.0_ubuntu24.04_py3.12_pytorch_release_2.8.0
ARG NODE_VERSION=22

## Container
RUN mkdir /app
RUN mkdir /ake
RUN mkdir /gan
RUN mkdir /conf

## Install dependencies
RUN sudo apt update
RUN sudo apt install -y cmake libcurl4-openssl-dev libcpp-httplib-dev libminiaudio-dev nodejs npm
RUN sudo apt clean
RUN sudo apt autoremove -y

## Setup llama.cpp
WORKDIR /app
RUN git clone https://github.com/ggerganov/llama.cpp.git

## Build llama.cpp
WORKDIR /app/llama.cpp
RUN HIPCXX="$(hipconfig -l)/clang" HIP_PATH="$(hipconfig -R)" \
    cmake -S . -B build -DGGML_HIP=ON -DAMDGPU_TARGETS=gfx1100 -DCMAKE_BUILD_TYPE=Release \
    && cmake --build build --config Release -- -j 16
RUN pip install -r requirements.txt
WORKDIR /app/llama.cpp/build/bin

## Setup llama-swap
WORKDIR /app
RUN git clone https://github.com/mostlygeek/llama-swap
RUN curl --output go1.25.1.linux-amd64.tar.gz --location https://go.dev/dl/go1.25.1.linux-amd64.tar.gz
RUN rm -rf /usr/local/go && tar -C /usr/local -xzf go1.25.1.linux-amd64.tar.gz
ENV PATH=$PATH:/usr/local/go/bin

## Build llama-swap
WORKDIR /app/llama-swap
RUN make clean all
WORKDIR /app/llama-swap/build

CMD ["/bin/bash"]

```

### config.yaml

```yaml
# llama-swap YAML configuration example
# -------------------------------------
#
# 💡 Tip - Use an LLM with this file!
# ====================================
#  This example configuration is written to be LLM friendly. Try
#  copying this file into an LLM and asking it to explain or generate
#  sections for you.
# ====================================

# Usage notes:
# - Below are all the available configuration options for llama-swap.
# - Settings noted as "required" must be in your configuration file
# - Settings noted as "optional" can be omitted

# healthCheckTimeout: number of seconds to wait for a model to be ready to serve requests
# - optional, default: 120
# - minimum value is 15 seconds, anything less will be set to this value
healthCheckTimeout: 600

# logLevel: sets the logging value
# - optional, default: info
# - Valid log levels: debug, info, warn, error
logLevel: info

# metricsMaxInMemory: maximum number of metrics to keep in memory
# - optional, default: 1000
# - controls how many metrics are stored in memory before older ones are discarded
# - useful for limiting memory usage when processing large volumes of metrics
metricsMaxInMemory: 1000

# startPort: sets the starting port number for the automatic ${PORT} macro.
# - optional, default: 5800
# - the ${PORT} macro can be used in model.cmd and model.proxy settings
# - it is automatically incremented for every model that uses it
startPort: 14001

# macros: a dictionary of string substitutions
# - optional, default: empty dictionary
# - macros are reusable snippets
# - used in a model's cmd, cmdStop, proxy and checkEndpoint
# - useful for reducing common configuration settings
macros:

# models: a dictionary of model configurations
# - required
# - each key is the model's ID, used in API requests
# - model settings have default values that are used if they are not defined here
# - the model's ID is available in the ${MODEL_ID} macro, also available in macros defined above
# - below are examples of the all the settings a model can have
models:
  # keys are the model names used in API requests
  "gpt-oss-20b":
    # cmd: the command to run to start the inference server.
    # - required
    # - it is just a string, similar to what you would run on the CLI
    # - using `|` allows for comments in the command, these will be parsed out
    # - macros can be used within cmd
    cmd: |
      /app/llama.cpp/build/bin/llama-server --port ${PORT} --host 0.0.0.0 --model /models/gpt-oss-20b/gpt-oss-20B-F16.gguf --threads 16 --n-gpu-layers 777 --ctx-size 7777 --jinja --reasoning-format auto --alias gpt-4.1-mini --no-warmup

    # name: a display name for the model
    # - optional, default: empty string
    # - if set, it will be used in the v1/models API response
    # - if not set, it will be omitted in the JSON model record
    name: "gpt-4.1-mini"

    # description: a description for the model
    # - optional, default: empty string
    # - if set, it will be used in the v1/models API response
    # - if not set, it will be omitted in the JSON model record
    description: "A small but capable model used for quick testing"

    # env: define an array of environment variables to inject into cmd's environment
    # - optional, default: empty array
    # - each value is a single string
    # - in the format: ENV_NAME=value
    env:

    # aliases: alternative model names that this model configuration is used for
    # - optional, default: empty array
    # - aliases must be unique globally
    # - useful for impersonating a specific model
    aliases:
      - "gpt-4.1-mini"
      - "gpt-oss-20b"

    # checkEndpoint: URL path to check if the server is ready
    # - optional, default: /health
    # - endpoint is expected to return an HTTP 200 response
    # - all requests wait until the endpoint is ready or fails
    # - use "none" to skip endpoint health checking
    checkEndpoint: /health

    # ttl: automatically unload the model after ttl seconds
    # - optional, default: 0
    # - ttl values must be a value greater than 0
    # - a value of 0 disables automatic unloading of the model
    ttl: 60

    # useModelName: override the model name that is sent to upstream server
    # - optional, default: ""
    # - useful for when the upstream server expects a specific model name that
    #   is different from the model's ID
    useModelName: "gpt-4.1-mini"

    # filters: a dictionary of filter settings
    # - optional, default: empty dictionary
    # - only strip_params is currently supported
    filters:
      # strip_params: a comma separated list of parameters to remove from the request
      # - optional, default: ""
      # - useful for server side enforcement of sampling parameters
      # - the `model` parameter can never be removed
      # - can be any JSON key in the request body
      # - recommended to stick to sampling parameters
      strip_params: ""

    # concurrencyLimit: overrides the allowed number of active parallel requests to a model
    # - optional, default: 0
    # - useful for limiting the number of active parallel requests a model can process
    # - must be set per model
    # - any number greater than 0 will override the internal default value of 10
    # - any requests that exceeds the limit will receive an HTTP 429 Too Many Requests response
    # - recommended to be omitted and the default used
    concurrencyLimit: 0

  "gpt-oss-120b":
    cmd: |
      /app/llama.cpp/build/bin/llama-server --port ${PORT} --host 0.0.0.0 --model /models/gpt-oss-120b/gpt-oss-120B-F16.gguf --threads 16 --n-gpu-layers 11 --ctx-size 7777 --jinja --reasoning-format auto --alias gpt-oss-120b --no-warmup
    concurrencyLimit: 1
    ttl: 60

  "gpt-oss-20b-big-context":
    cmd: |
      /app/llama.cpp/build/bin/llama-server --port ${PORT} --host 0.0.0.0 --model /models/gpt-oss-20b/gpt-oss-20B-F16.gguf --threads 16 --cpu-moe --n-gpu-layers 777 --ctx-size 55555 --jinja --reasoning-format auto --alias gpt-oss-20b-big-context --no-warmup
    concurrencyLimit: 1
    ttl: 60

  "qwen3-coder-30b":
    cmd: |
      /app/llama.cpp/build/bin/llama-server --port ${PORT} --host 0.0.0.0 --model /models/qwen3-coder-30b/qwen3-coder-30B-F16.gguf --threads 16 --cpu-moe --n-gpu-layers 77 --ctx-size 7777 --jinja --reasoning-format auto --alias qwen3-coder-30b --no-warmup
    concurrencyLimit: 1

  "glm-4.5-air":
    cmd: |
      /app/llama.cpp/build/bin/llama-server --port ${PORT} --host 0.0.0.0 --model /models/glm-4.5-air/Glm-4.5-Air-128x9.4B-F16.gguf --threads 16 --cpu-moe --n-gpu-layers 7 --ctx-size 7777 --jinja --reasoning-format auto --alias glm-4.5-air --no-warmup
    concurrencyLimit: 1
    ttl: 60

  "mistral-small-3.1-24b-q2":
    cmd: |
      /app/llama.cpp/build/bin/llama-server --port ${PORT} --host 0.0.0.0 --model /models/Mistral-Small-3.1-24B-Instruct-2503-GGUF/Mistral-Small-3.1-24B-Instruct-2503-Q2_K_L.gguf --threads 16 --n-gpu-layers 777 --ctx-size 7777 --jinja --reasoning-format auto --alias mistral-small-3.1-24b-q2 --no-warmup
    ttl: 60

  "mistral-small-3.1-24b-q2-big-context":
    cmd: |
      /app/llama.cpp/build/bin/llama-server --port ${PORT} --host 0.0.0.0 --model /models/Mistral-Small-3.1-24B-Instruct-2503-GGUF/Mistral-Small-3.1-24B-Instruct-2503-Q2_K_L.gguf --threads 16 --n-gpu-layers 777 --ctx-size 55555 --jinja --reasoning-format auto --alias mistral-small-3.1-24b-q2-big-context --no-warmup
    concurrencyLimit: 1
    ttl: 60

  "mistral-small-3.1-24b-q6":
    cmd: |
      /app/llama.cpp/build/bin/llama-server --port ${PORT} --host 0.0.0.0 --model /models/Mistral-Small-3.1-24B-Instruct-2503-GGUF/Mistral-Small-3.1-24B-Instruct-2503-Q6_K.gguf --threads 16 --n-gpu-layers 777 --ctx-size 7777 --jinja --reasoning-format auto --alias mistral-small-3.1-24b-q2 --no-warmup
    ttl: 60

  "mistral-small-3.1-24b-q8":
    cmd: |
      /app/llama.cpp/build/bin/llama-server --port ${PORT} --host 0.0.0.0 --model /models/Mistral-Small-3.1-24B-Instruct-2503-GGUF/Mistral-Small-3.1-24B-Instruct-2503-Q8_0.gguf  --threads 16 --n-gpu-layers 33 --ctx-size 7777 --jinja --reasoning-format auto --alias mistral-small-3.1-24b-q8 --no-warmup
    concurrencyLimit: 1
    ttl: 60

  "smollm":
    cmd: |
      /app/llama.cpp/build/bin/llama-server --port ${PORT} --host 0.0.0.0 --model /models/smollm/SmolLM3-Q4_K_M.gguf  --threads 16 --n-gpu-layers 777 --ctx-size 7777 --jinja --reasoning-format auto --alias smollm --no-warmup
    ttl: 60

  "gemma-3-1b":
    cmd: |
      /app/llama.cpp/build/bin/llama-server --port ${PORT} --host 0.0.0.0 --model /models/gemma-3-1b-it/gemma-3-1B-it-F16.gguf --threads 16 --n-gpu-layers 777 --ctx-size 7777 --jinja --reasoning-format auto --alias gemma-3-1b --no-warmup
    ttl: 60

  "gemma-3-4b":
    cmd: |
      /app/llama.cpp/build/bin/llama-server --port ${PORT} --host 0.0.0.0 --model /models/gemma-3-4b-it/gemma-3-4B-it-F16.gguf --threads 16 --n-gpu-layers 777 --ctx-size 7777 --jinja --reasoning-format auto --alias gemma-3-1b --no-warmup
    ttl: 60

  "gemma-3-12b":
    cmd: |
      /app/llama.cpp/build/bin/llama-server --port ${PORT} --host 0.0.0.0 --model /models/gemma-3-12b-it/gemma-3-12B-it-F16.gguf --threads 16 --cpu-moe --n-gpu-layers 7 --ctx-size 7777 --jinja --reasoning-format auto --alias gemma-3-1b --no-warmup
    concurrencyLimit: 1
    ttl: 60

  "gemma-3-27b":
    cmd: |
      /app/llama.cpp/build/bin/llama-server --port ${PORT} --host 0.0.0.0 --model /models/gemma-3-27b-it/gemma-3-27B-it-F16.gguf --threads 16 --cpu-moe --n-gpu-layers 7 --ctx-size 7777 --jinja --reasoning-format auto --alias gemma-3-1b --no-warmup
    concurrencyLimit: 1
    ttl: 60

# groups: a dictionary of group settings
# - optional, default: empty dictionary
# - provides advanced controls over model swapping behaviour
# - using groups some models can be kept loaded indefinitely, while others are swapped out
# - model IDs must be defined in the Models section
# - a model can only be a member of one group
# - group behaviour is controlled via the `swap`, `exclusive` and `persistent` fields
# - see issue #109 for details
#
# NOTE: the example below uses model names that are not defined above for demonstration purposes
groups:

# hooks: a dictionary of event triggers and actions
# - optional, default: empty dictionary
# - the only supported hook is on_startup
hooks:
  # on_startup: a dictionary of actions to perform on startup
  # - optional, default: empty dictionary
  # - the only supported action is preload
  on_startup:
        # preload: a list of model ids to load on startup
        # - optional, default: empty list
        # - model names must match keys in the models sections
        # - when preloading multiple models at once, define a group
        #   otherwise models will be loaded and swapped out
    preload:
      # - "llama"

```

