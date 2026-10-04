# Qwen 3.8 27B on AMD Ryzen AI Max+ 395 (Strix Halo) via Vulkan with Kubernetes

_Published: 2026-10-03_

I know that I am a bit late writing about Qwen 3.8 27B; since the model was released in August, and it already being October.

However, thanks to this delay, I can base my reporting on expansive experience using the model for various agentic programming tasks. I have processed a couple 100 million input tokens (most of it cached, though), and generated a couple of million tokens.

## Conclusion

The conclusion is that this is my favourite local coding model on Strix Halo so far. I was not a big fan of Qwen 3.6 - I preferred to use Gemma 4 26B. However, nowadays I'm only using Gemma 4 26B for tasks where speed is more important, and for non-coding related tasks. For coding and tool-calling, Qwen 3.8 27B is where I spend most of my time. And a big part of that is that Qwen 3.8 27B is very slow.

In the benchmarks below you can see more detail, but at Q8, prompt processing / prefill is around 300 - 400 tokens per second and text generation is at 7 t/s. At full precision both values drop by around 50%. And 7 t/s is painfully slow for any kind of coding tasks. Luckily, a single parameter can double that performance: `--spec-type draft-mtp` yields up to ~20 t/s. On average I get around 10 - 12 t/s generation with this setting, which around double of the benchmarked performance. I am keeping the baseline benchmark without `mtp`, in order to afford comparability with my earlier evaluations of other LLM models - just keep in mind that either `draft-mtp` or `draft-dflash` can double your performance.

In practice, this means that for realistic agentic coding, in a sample over 24 hours, I have processed 19.6M cached tokens, processed 1.042M prompt tokens, and generated 0.585M output tokens. Since the 24h are split between processing and generating tokens, and since there are downtimes where the agent is waiting for input; the hardware is not fully used to the maximum potential. Yet I think this is a representative sample for what can be achieved locally with Qwen 3.8 27B on Strix Halo.

Electricity consumption varies mostly between 60W and 120W, but it can go as low as 20W or as high as 160W. Calculating with an average of 100W consumption, my effective costs for running the model are ~1 USD per day.

Comparing to prices on OpenRouter, in the best case, the model is ~ $1.5 cheaper to run locally per day, in many cases it is just as expensive (in electricity costs) for me to run the model locally. Since I've paid ~ $2500 for the Strix Halo, in the best case a break even is reached after 5 years. Currently the same hardware costs more than $ 4k.

So unfortunately, running models locally is not significantly cheaper than running them in the cloud. What we gain are stability (no one can take away the model / nerf the model / ban the model), and privacy (I would be rather reluctant to send any confidential data to the model providers).

So overall, I prefer Qwen 3.8 for better coding quality, and fall back to Gemma 4 26B in case I need better performance. I notice a similar picture for tool calling where I prefer Qwen 3.8. Luckily, the Strix Halo has enough RAM to keep both models loaded at full context.

## Setup

I have not greatly changed my setup for running the model. I am still running the model via **llama-swap** on my kubernetes cluster, as discussed [here](https://akehir.com/blog/strix-halo-kubernetes-llm-gpt-oss). I am still using _opencode_ and _openwebui_ for coding. I initially discussed OpenWebUI [here](https://akehir.com/blog/open-webui-llama-server), but recently I have added a _SearxNG_ instance and an _open-terminal_ instance in order to add web search and coding capabilities. With this setup, my AI can search the web, and has a coding environment available - and I can control everything from my mobile phone with the _Conduit_ app. I have also added image generation, text to speech and speech to text capabilities - to basically have the full set of OpenAI capabilities available.

So my workflow basically consists of giving Qwen 3.8 27B some instructions on my phone and going about my day while the model works - checking in on the progress occasionally. This way the slow speed is not really such a drawback, because it can just run in the background.

I am planning to write a more detailed blog post about my setup later.

For hosting Qwen 3.8, the steps are easy. First, download the desired model from huggingface, for instance from [here](https://huggingface.co/unsloth/Qwen3.8-27B-GGUF).

Once the model is on the server, adapt the _llama-swap_ config as follows, deploy the config, and then you're ready to start using the model.

```yaml
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
      qwen-3.8-27b:
        cmd: llama-server --port ${PORT} --host 0.0.0.0 --model /models/chat/qwen-3.8-27b/Qwen3.8-27B-UD-Q8_K_XL.gguf --mmproj /models/chat/qwen-3.8-27b/mmproj-BF16.gguf --jinja --temp 1.0 --top-p 0.95 --min-p 0 --top-k 20 --repeat-penalty 1.0 --presence-penalty 0.0 -c 262144 --spec-type draft-mtp --batch-size 4096 --ubatch-size 4096
```

## Performace

I have already detailed the performance in the conclusion. There is not much to add. Below is the performance, tested with the following command: `llama-bench -m /models/chat/qwen-3.8-27b/Qwen3.8-27B-UD-Q8_K_XL.gguf -t 1 -fa 1 -b 2048 -ub 2048 -p 16384`. Notice that the model name is not recognized correctly; but I have in fact run the tests for the Qwen 3.8 models.

The full performance tests and the comparison with full float 16 precision is further below. But this shows us the text generation at 7 t/s and the prompt processing at 300 t/s. Thanks to `draft-mtp` doubling the performance, the performance gets into an usable range. I think I would avoid any slower model (and full precision) due to the slow speed.

Performance is probably the biggest drawback of this model, but it makes up for it in quality.

| model                    |      size |  params | backend | ngl | threads | n_ubatch |  fa |    test |           t/s |
| ------------------------ | --------: | ------: | ------- | --: | ------: | -------: | --: | ------: | ------------: |
| qwen35 27B Q4_K - Medium | 29.29 GiB | 27.32 B | Vulkan  |  -1 |       1 |     2048 |   1 | pp16384 | 297.30 ± 0.23 |
| qwen35 27B Q4_K - Medium | 29.29 GiB | 27.32 B | Vulkan  |  -1 |       1 |     2048 |   1 |   tg128 |   7.21 ± 0.00 |

## Technical Details and Full Performance data

llama-bench -m /models/chat/qwen-3.8-27b/Qwen3.8-27B-UD-Q8_K_XL.gguf,/models/chat/qwen-3.8-27b/Qwen3.8-27B-BF16-00001-of-00002.gguf -t 1 -fa 1 -b 2048 -ub 2048 -p 2048,8192,16384

```
llama-bench -m /models/chat/qwen-3.8-27b/Qwen3.8-27B-UD-Q8_K_XL.gguf,/models/chat/qwen-3.8-27b/Qwen3.8-27B-BF16-00001-of-00002.gguf -t 1 -fa 1 -b 2048 -ub 2048 -p 2048,8192,16384
ggml_vulkan: Found 1 Vulkan devices:
ggml_vulkan: 0 = AMD Radeon 8060S Graphics (RADV STRIX_HALO) (radv) | uma: 1 | fp16: dot2 | bf16: 0 | fp4: 0 | warp size: 64 | shared memory: 65536 | int dot: 1 | matrix cores: KHR_coopmat
load_backend: loaded Vulkan backend from /app/llama.cpp/build/bin/libggml-vulkan.so
load_backend: loaded CPU backend from /app/llama.cpp/build/bin/libggml-cpu-zen4.so
| model                          |       size |     params | backend    | ngl | threads | n_ubatch |  fa |            test |                  t/s |
| ------------------------------ | ---------: | ---------: | ---------- | --: | ------: | -------: | --: | --------------: | -------------------: |
| qwen35 27B Q4_K - Medium       |  29.29 GiB |    27.32 B | Vulkan     |  -1 |       1 |     2048 |   1 |          pp2048 |        394.63 ± 1.59 |
| qwen35 27B Q4_K - Medium       |  29.29 GiB |    27.32 B | Vulkan     |  -1 |       1 |     2048 |   1 |          pp8192 |        348.63 ± 0.44 |
| qwen35 27B Q4_K - Medium       |  29.29 GiB |    27.32 B | Vulkan     |  -1 |       1 |     2048 |   1 |         pp16384 |        297.30 ± 0.23 |
| qwen35 27B Q4_K - Medium       |  29.29 GiB |    27.32 B | Vulkan     |  -1 |       1 |     2048 |   1 |           tg128 |          7.21 ± 0.00 |
| qwen35 27B BF16                |  50.89 GiB |    27.32 B | Vulkan     |  -1 |       1 |     2048 |   1 |          pp2048 |        165.82 ± 1.12 |
| qwen35 27B BF16                |  50.89 GiB |    27.32 B | Vulkan     |  -1 |       1 |     2048 |   1 |          pp8192 |        157.13 ± 0.13 |
| qwen35 27B BF16                |  50.89 GiB |    27.32 B | Vulkan     |  -1 |       1 |     2048 |   1 |         pp16384 |        145.79 ± 0.11 |
| qwen35 27B BF16                |  50.89 GiB |    27.32 B | Vulkan     |  -1 |       1 |     2048 |   1 |           tg128 |          4.34 ± 0.00 |

build: 81bc6b83f (11200)
```

| model                    |      size |  params | backend | ngl | threads | n_ubatch |  fa |    test |           t/s |
| ------------------------ | --------: | ------: | ------- | --: | ------: | -------: | --: | ------: | ------------: |
| qwen35 27B Q4_K - Medium | 29.29 GiB | 27.32 B | Vulkan  |  -1 |       1 |     2048 |   1 |  pp2048 | 394.63 ± 1.59 |
| qwen35 27B Q4_K - Medium | 29.29 GiB | 27.32 B | Vulkan  |  -1 |       1 |     2048 |   1 |  pp8192 | 348.63 ± 0.44 |
| qwen35 27B Q4_K - Medium | 29.29 GiB | 27.32 B | Vulkan  |  -1 |       1 |     2048 |   1 | pp16384 | 297.30 ± 0.23 |
| qwen35 27B Q4_K - Medium | 29.29 GiB | 27.32 B | Vulkan  |  -1 |       1 |     2048 |   1 |   tg128 |   7.21 ± 0.00 |
| qwen35 27B BF16          | 50.89 GiB | 27.32 B | Vulkan  |  -1 |       1 |     2048 |   1 |  pp2048 | 165.82 ± 1.12 |
| qwen35 27B BF16          | 50.89 GiB | 27.32 B | Vulkan  |  -1 |       1 |     2048 |   1 |  pp8192 | 157.13 ± 0.13 |
| qwen35 27B BF16          | 50.89 GiB | 27.32 B | Vulkan  |  -1 |       1 |     2048 |   1 | pp16384 | 145.79 ± 0.11 |
| qwen35 27B BF16          | 50.89 GiB | 27.32 B | Vulkan  |  -1 |       1 |     2048 |   1 |   tg128 |   4.34 ± 0.00 |
| build: 81bc6b83f (11200) |
