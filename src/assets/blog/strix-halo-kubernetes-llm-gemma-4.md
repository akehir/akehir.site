# Gemma 4 31B, 26B, and E4B on AMD Ryzen AI Max+ 395 (Strix Halo) via Vulkan (or ROCm) with Kubernetes (or Docker) on Debian Testing on a Minisforum MS-S1

## Summary

Thanks to my previously outlined setup for running `llama-swap` on a Minisforum MS-S1 and the unsloth GGUF files, it has been rather easy to get Gemma 4 running on my setup.

The main steps were: 
- downloading the model
- updating my config

Unfortunately it seems that currently the performance of the 31B model is quite slow at around 3 tokens/s for text generation (or 6 tokens/s for Q8); on the other hand, I'm very happy with the quality of the output so far.

The E4B model performs much better, but the most surprising one is the 26B model which has almost an equivalent performance to the E4B model (both generating at just under 20 tokens/s - or 40 tokens/s in Q8).

I am also positively impressed by the performance of the models. Both handling logic puzzles, coding, and especially multi-lingual tasks especially well.

I also recommend referencing the announcement of Gemma 4 on huggingface [here](https://huggingface.co/blog/gemma4).

## Setup

For the full detail of my setup, you can also read my previous blog entry on GPT-OSS  on kubernetes [here](https://akehir.com/blog/strix-halo-kubernetes-llm-gpt-oss). If you prefer to read about how to setup the same (or an equivalent) setup via docker (and docker-compose), I have two previous blog losts covering the topics [here](https://akehir.com/blog/llama-swap-and-llama-cpp-for-self-hosting-multiple-llm-models) and [here](https://akehir.com/blog/open-webui-llama-server).

I've also included the full config further below, but first let me present the salient bits: I just updated my `llama-swap` config to include the new models for gemma 4 - that is all I needed to do (except downloading the models).

In my homelab, I am using Kubernetes to run the containers on the Strix Halo server I have setup - but it is just as easily possible to run the same setup via docker-compose. I've included alternative examples for this setup as well (as that is how I am running the models on my main desktop with the AMD Radeon RX7900XTX GPU for the comparison with a reasonably powerful discrete GPU).

Furthermore, to keep the docker image size small (2GB) I am using the Vulkan backend. I have also included an example config to run it on a ROCm backend (but there, the docker image size reaches 30+ GB). It is definitely worth trying both bakends in order to review the performance and stability running the models.

Speaking of the models, they can be downloaded from huggingface - I have been using the unsloth quants for my preliminary tests. I have used the following models / repositories (mostly the BF16 and Q8 files directly via wget):
- [Gemma 4 31B](https://huggingface.co/unsloth/gemma-4-31B-it-GGUF)
- [Gemma 4 26B A4B](https://huggingface.co/unsloth/gemma-4-26B-A4B-it-GGUF)
- [Gemma 4 E4B](https://huggingface.co/unsloth/gemma-4-E4B-it-GGUF)

And the yaml can be configured as follows

```yaml
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: llama-swap-config-v13
  namespace: llm
data:
  config.yaml: |
    healthCheckTimeout: 600
    startPort: 14001

    models:
      "gemma-4-31b--q8":
        cmd: /app/llama.cpp/build/bin/llama-server --port ${PORT} --host 0.0.0.0 --model /models/chat/gemma-4-31B-it/gemma-4-31B-it-UD-Q8_K_XL.gguf --jinja --temp 1.0 --top-p 0.95 --top-k 64 -c 255555

      "gemma-4-26b--q8":
        cmd: /app/llama.cpp/build/bin/llama-server --port ${PORT} --host 0.0.0.0 --model /models/chat/gemma-4-26B-A4B/gemma-4-26B-A4B-it-UD-Q6_K_XL.gguf --mmproj /models/chat/gemma-4-26B-A4B/mmproj-BF16.gguf --chat-template-file /app/llama.cpp/models/templates/google-gemma-4-31B-it-interleaved.jinja --jinja --temp 1.0 --top-p 0.95 --top-k 64 -c 255555


```

## Performance

### Gemma 4 31B Performance Summary

The llama-bench test crashed at a 32k context, so here are the performance values for up to 16k context. Even with a Q8 (which uses less overall memory), the bench crashed at the same 32k context test. I read that context requires a lot of memory for gemma 4, but according to my test, the crash happens reliably at 32k context while the VRAM usage remains at under 50GB (so under 50% of the allocated VRAM in my setup).

A prompt processing speed of 100-150 tokens per second as well as a text generation of 3-4 tokens per second is not really overwhelming. Nevertheless, by using a Q8, the performance can be almost doubled, but even at prompt processing of 300 tokens/s and text generation of 6 tokens/s it feels too slow.

As good as this model might be - and as well it might fit into the VRAM of the Minisforum, the performance does not allow serious usage.

### Gemma 4 26B Performance Summary

While the performance of the 31B model was not overwhelming, the real surprise is the 26B model. It was basically as fast as the smaller E4B model, with full precision at ~500 - 600 tokens per second for prompt processing and just under 20 tokens / second for text generation. Using a Q8 instead of the full BF16 precision will yield even more impressive values such as 1000 - 1600 tokens/s prompt processing and up to 44 tokens/s text generation.

### Gemma 4 E4B Performance Summary
At 700-1000 tokens/s prompt processing and 19 tokens/s text generation, this model tracks the performance of the 26B model. For that reason I didn't really follow up on more testing here, as it would appear that the 26B model will be the superior model as long as the hardware to run it is available.

### Gemma 4 31B Performance Benchmark Details

```
root@llm-v20-866684df54-8cc5v:/app/llama.cpp/build/bin# ./llama-bench -m /models/chat/gemma-4-31B-it/gemma-4-31B-it-BF16-00001-of-00002.gguf  -t 1 -fa 1 -b 2048 -ub 2048 -p 2048,8192,16384
ggml_vulkan: Found 1 Vulkan devices:
ggml_vulkan: 0 = Radeon 8060S Graphics (RADV STRIX_HALO) (radv) | uma: 1 | fp16: 1 | bf16: 0 | warp size: 64 | shared memory: 65536 | int dot: 1 | matrix cores: KHR_coopmat
load_backend: loaded Vulkan backend from /app/llama.cpp/build/bin/libggml-vulkan.so
load_backend: loaded CPU backend from /app/llama.cpp/build/bin/libggml-cpu-zen4.so
| model                          |       size |     params | backend    | ngl | threads | n_ubatch | fa |            test |                  t/s |
| ------------------------------ | ---------: | ---------: | ---------- | --: | ------: | -------: | -: | --------------: | -------------------: |
| gemma4 ?B BF16                 |  57.18 GiB |    30.70 B | Vulkan     |  99 |       1 |     2048 |  1 |          pp2048 |        148.33 ± 2.26 |
| gemma4 ?B BF16                 |  57.18 GiB |    30.70 B | Vulkan     |  99 |       1 |     2048 |  1 |          pp8192 |        134.44 ± 0.15 |
| gemma4 ?B BF16                 |  57.18 GiB |    30.70 B | Vulkan     |  99 |       1 |     2048 |  1 |         pp16384 |        106.70 ± 0.68 |
| gemma4 ?B BF16                 |  57.18 GiB |    30.70 B | Vulkan     |  99 |       1 |     2048 |  1 |           tg128 |          3.46 ± 0.00 |

build: 7992aa7c8 (8640)
```

| model                          |       size |     params | backend    | ngl | threads | n_ubatch | fa |            test |                  t/s |
| ------------------------------ | ---------: | ---------: | ---------- | --: | ------: | -------: | -: | --------------: | -------------------: |
| gemma4 ?B BF16                 |  57.18 GiB |    30.70 B | Vulkan     |  99 |       1 |     2048 |  1 |          pp2048 |        148.33 ± 2.26 |
| gemma4 ?B BF16                 |  57.18 GiB |    30.70 B | Vulkan     |  99 |       1 |     2048 |  1 |          pp8192 |        134.44 ± 0.15 |
| gemma4 ?B BF16                 |  57.18 GiB |    30.70 B | Vulkan     |  99 |       1 |     2048 |  1 |         pp16384 |        106.70 ± 0.68 |
| gemma4 ?B BF16                 |  57.18 GiB |    30.70 B | Vulkan     |  99 |       1 |     2048 |  1 |           tg128 |          3.46 ± 0.00 |

With a quant (Q8), it is possible to improve the performance by around half:

```
root@llm-v21-655d6f597-l9hc5:/app/llama.cpp/build/bin# ./llama-bench -m /models/chat/gemma-4-31B-it/gemma-4-31B-it-UD-Q8_K_XL.gguf  -t 1 -fa 1 -b 2048 -ub 2048 -p 2048                 
ggml_vulkan: Found 1 Vulkan devices:
ggml_vulkan: 0 = Radeon 8060S Graphics (RADV STRIX_HALO) (radv) | uma: 1 | fp16: 1 | bf16: 0 | warp size: 64 | shared memory: 65536 | int dot: 1 | matrix cores: KHR_coopmat
load_backend: loaded Vulkan backend from /app/llama.cpp/build/bin/libggml-vulkan.so
load_backend: loaded CPU backend from /app/llama.cpp/build/bin/libggml-cpu-zen4.so
| model                          |       size |     params | backend    | ngl | threads | n_ubatch | fa |            test |                  t/s |
| ------------------------------ | ---------: | ---------: | ---------- | --: | ------: | -------: | -: | --------------: | -------------------: |
| gemma4 ?B Q8_0                 |  32.60 GiB |    30.70 B | Vulkan     |  99 |       1 |     2048 |  1 |          pp2048 |        293.12 ± 0.92 |
| gemma4 ?B Q8_0                 |  32.60 GiB |    30.70 B | Vulkan     |  99 |       1 |     2048 |  1 |           tg128 |          6.20 ± 0.00 |
```

| model          |      size |  params | backend | ngl | threads | n_ubatch |  fa |   test |           t/s |
| -------------- | --------: | ------: | ------- | --: | ------: | -------: | --: | -----: | ------------: |
| gemma4 ?B Q8_0 | 32.60 GiB | 30.70 B | Vulkan  |  99 |       1 |     2048 |   1 | pp2048 | 293.12 ± 0.92 |
| gemma4 ?B Q8_0 | 32.60 GiB | 30.70 B | Vulkan  |  99 |       1 |     2048 |   1 |  tg128 |   6.20 ± 0.00 |

For completion's sake, here is the 2 crashed tests, which both crashed after the 16k context:

```
 ./llama-bench -m /models/chat/gemma-4-31B-it/gemma-4-31B-it-BF16-00001-of-00002.gguf  -t 1 -fa 1 -b 2048 -ub 2048 -p 2048,8192,16384,32768
ggml_vulkan: Found 1 Vulkan devices:
ggml_vulkan: 0 = Radeon 8060S Graphics (RADV STRIX_HALO) (radv) | uma: 1 | fp16: 1 | bf16: 0 | warp size: 64 | shared memory: 65536 | int dot: 1 | matrix cores: KHR_coopmat
load_backend: loaded Vulkan backend from /app/llama.cpp/build/bin/libggml-vulkan.so
load_backend: loaded CPU backend from /app/llama.cpp/build/bin/libggml-cpu-zen4.so
| model                          |       size |     params | backend    | ngl | threads | n_ubatch | fa |            test |                  t/s |
| ------------------------------ | ---------: | ---------: | ---------- | --: | ------: | -------: | -: | --------------: | -------------------: |
| gemma4 ?B BF16                 |  57.18 GiB |    30.70 B | Vulkan     |  99 |       1 |     2048 |  1 |          pp2048 |        147.80 ± 2.45 |
| gemma4 ?B BF16                 |  57.18 GiB |    30.70 B | Vulkan     |  99 |       1 |     2048 |  1 |          pp8192 |        133.52 ± 0.42 |
| gemma4 ?B BF16                 |  57.18 GiB |    30.70 B | Vulkan     |  99 |       1 |     2048 |  1 |         pp16384 |        107.09 ± 0.45 |
radv/amdgpu: The CS has been cancelled because the context is lost. This context is innocent.
```

| model                          |       size |     params | backend    | ngl | threads | n_ubatch | fa |            test |                  t/s |
| ------------------------------ | ---------: | ---------: | ---------- | --: | ------: | -------: | -: | --------------: | -------------------: |
| gemma4 ?B BF16                 |  57.18 GiB |    30.70 B | Vulkan     |  99 |       1 |     2048 |  1 |          pp2048 |        147.80 ± 2.45 |
| gemma4 ?B BF16                 |  57.18 GiB |    30.70 B | Vulkan     |  99 |       1 |     2048 |  1 |          pp8192 |        133.52 ± 0.42 |
| gemma4 ?B BF16                 |  57.18 GiB |    30.70 B | Vulkan     |  99 |       1 |     2048 |  1 |         pp16384 |        107.09 ± 0.45 |

And even with a q8 the bench still fails at 32k context:
```
root@llm-v21-655d6f597-l9hc5:/app/llama.cpp/build/bin# ./llama-bench -m /models/chat/gemma-4-31B-it/gemma-4-31B-it-UD-Q8_K_XL.gguf  -t 1 -fa 1 -b 2048 -ub 2048 -p 2048,8192,16384,32768
ggml_vulkan: Found 1 Vulkan devices:
ggml_vulkan: 0 = Radeon 8060S Graphics (RADV STRIX_HALO) (radv) | uma: 1 | fp16: 1 | bf16: 0 | warp size: 64 | shared memory: 65536 | int dot: 1 | matrix cores: KHR_coopmat
load_backend: loaded Vulkan backend from /app/llama.cpp/build/bin/libggml-vulkan.so
load_backend: loaded CPU backend from /app/llama.cpp/build/bin/libggml-cpu-zen4.so
| model                          |       size |     params | backend    | ngl | threads | n_ubatch | fa |            test |                  t/s |
| ------------------------------ | ---------: | ---------: | ---------- | --: | ------: | -------: | -: | --------------: | -------------------: |
| gemma4 ?B Q8_0                 |  32.60 GiB |    30.70 B | Vulkan     |  99 |       1 |     2048 |  1 |          pp2048 |        293.61 ± 0.98 |
| gemma4 ?B Q8_0                 |  32.60 GiB |    30.70 B | Vulkan     |  99 |       1 |     2048 |  1 |          pp8192 |        244.65 ± 0.29 |
| gemma4 ?B Q8_0                 |  32.60 GiB |    30.70 B | Vulkan     |  99 |       1 |     2048 |  1 |         pp16384 |        165.48 ± 0.49 |
radv/amdgpu: The CS has been cancelled because the context is lost. This context is innocent.
/app/llama.cpp/build/bin/libggml-base.so.0(+0x15965) [0x7fe056615965]
/app/llama.cpp/build/bin/libggml-base.so.0(ggml_print_backtrace+0x1eb) [0x7fe056615d2b]
/app/llama.cpp/build/bin/libggml-base.so.0(+0x283a9) [0x7fe0566283a9]
/usr/lib/x86_64-linux-gnu/libstdc++.so.6(+0xbb5da) [0x7fe055ced5da]
/usr/lib/x86_64-linux-gnu/libstdc++.so.6(_ZSt10unexpectedv+0x0) [0x7fe055cd9749]
/usr/lib/x86_64-linux-gnu/libstdc++.so.6(+0xbb878) [0x7fe055ced878]
/app/llama.cpp/build/bin/libggml-vulkan.so(+0x8bd15) [0x7fe05220fd15]
/app/llama.cpp/build/bin/libggml-vulkan.so(+0x1ac87a) [0x7fe05233087a]
/app/llama.cpp/build/bin/libggml-vulkan.so(+0x1ad431) [0x7fe052331431]
/app/llama.cpp/build/bin/libggml-base.so.0(ggml_backend_sched_graph_compute_async+0x7f3) [0x7fe056631213]
/app/llama.cpp/build/bin/libllama.so.0(_ZN13llama_context13graph_computeEP11ggml_cgraphb+0xa0) [0x7fe05676f130]
/app/llama.cpp/build/bin/libllama.so.0(_ZN13llama_context14process_ubatchERK12llama_ubatch14llm_graph_typeP22llama_memory_context_iR11ggml_status+0xe5) [0x7fe056771705]
/app/llama.cpp/build/bin/libllama.so.0(_ZN13llama_context6decodeERK11llama_batch+0x35f) [0x7fe056777d6f]
/app/llama.cpp/build/bin/libllama.so.0(llama_decode+0xe) [0x7fe0567796ee]
./llama-bench(+0x379fb) [0x55c08cd029fb]
./llama-bench(+0x3448c) [0x55c08ccff48c]
/usr/lib/x86_64-linux-gnu/libc.so.6(+0x29f75) [0x7fe055941f75]
/usr/lib/x86_64-linux-gnu/libc.so.6(__libc_start_main+0x87) [0x7fe055942027]
./llama-bench(+0x362f1) [0x55c08cd012f1]
terminate called after throwing an instance of 'vk::DeviceLostError'
  what():  vk::Queue::submit: ErrorDeviceLost
Aborted                    (core dumped) ./llama-bench -m /models/chat/gemma-4-31B-it/gemma-4-31B-it-UD-Q8_K_XL.gguf -t 1 -fa 1 -b 2048 -ub 2048 -p 2048,8192,16384,32768
```

| model                          |       size |     params | backend    | ngl | threads | n_ubatch | fa |            test |                  t/s |
| ------------------------------ | ---------: | ---------: | ---------- | --: | ------: | -------: | -: | --------------: | -------------------: |
| gemma4 ?B Q8_0                 |  32.60 GiB |    30.70 B | Vulkan     |  99 |       1 |     2048 |  1 |          pp2048 |        293.61 ± 0.98 |
| gemma4 ?B Q8_0                 |  32.60 GiB |    30.70 B | Vulkan     |  99 |       1 |     2048 |  1 |          pp8192 |        244.65 ± 0.29 |
| gemma4 ?B Q8_0                 |  32.60 GiB |    30.70 B | Vulkan     |  99 |       1 |     2048 |  1 |         pp16384 |        165.48 ± 0.49 |


### Gemma 4 26B Performance Benchmark Details

```
/app/llama.cpp/build/bin# ./llama-bench -m /models/chat/gemma-4-26B-A4B/ge -t 1 -fa 1 -b 2048 -ub 2048 -p 2048,8192,16384,32768
gemma-4-26B-A4B-it-BF16-00001-of-00002.gguf  gemma-4-26B-A4B-it-BF16-00002-of-00002.gguf  generation_config.json                       
root@llm-v20-866684df54-8cc5v:/app/llama.cpp/build/bin# ./llama-bench -m /models/chat/gemma-4-26B-A4B/gemma-4-26B-A4B-it-BF16-00001-of-00002.gguf -t 1 -fa 1 -b 2048 -ub 2048 -p 2048,8192,16
384,32768
ggml_vulkan: Found 1 Vulkan devices:
ggml_vulkan: 0 = Radeon 8060S Graphics (RADV STRIX_HALO) (radv) | uma: 1 | fp16: 1 | bf16: 0 | warp size: 64 | shared memory: 65536 | int dot: 1 | matrix cores: KHR_coopmat
load_backend: loaded Vulkan backend from /app/llama.cpp/build/bin/libggml-vulkan.so
load_backend: loaded CPU backend from /app/llama.cpp/build/bin/libggml-cpu-zen4.so
| model                          |       size |     params | backend    | ngl | threads | n_ubatch | fa |            test |                  t/s |
| ------------------------------ | ---------: | ---------: | ---------- | --: | ------: | -------: | -: | --------------: | -------------------: |
| gemma4 ?B BF16                 |  47.02 GiB |    25.23 B | Vulkan     |  99 |       1 |     2048 |  1 |          pp2048 |       627.06 ± 15.78 |
| gemma4 ?B BF16                 |  47.02 GiB |    25.23 B | Vulkan     |  99 |       1 |     2048 |  1 |          pp8192 |        624.89 ± 2.94 |
| gemma4 ?B BF16                 |  47.02 GiB |    25.23 B | Vulkan     |  99 |       1 |     2048 |  1 |         pp16384 |        594.70 ± 3.18 |
| gemma4 ?B BF16                 |  47.02 GiB |    25.23 B | Vulkan     |  99 |       1 |     2048 |  1 |         pp32768 |        514.31 ± 4.08 |
| gemma4 ?B BF16                 |  47.02 GiB |    25.23 B | Vulkan     |  99 |       1 |     2048 |  1 |           tg128 |         18.32 ± 0.01 |
```

| model          |      size |  params | backend | ngl | threads | n_ubatch |  fa |    test |            t/s |
| -------------- | --------: | ------: | ------- | --: | ------: | -------: | --: | ------: | -------------: |
| gemma4 ?B BF16 | 47.02 GiB | 25.23 B | Vulkan  |  99 |       1 |     2048 |   1 |  pp2048 | 627.06 ± 15.78 |
| gemma4 ?B BF16 | 47.02 GiB | 25.23 B | Vulkan  |  99 |       1 |     2048 |   1 |  pp8192 |  624.89 ± 2.94 |
| gemma4 ?B BF16 | 47.02 GiB | 25.23 B | Vulkan  |  99 |       1 |     2048 |   1 | pp16384 |  594.70 ± 3.18 |
| gemma4 ?B BF16 | 47.02 GiB | 25.23 B | Vulkan  |  99 |       1 |     2048 |   1 | pp32768 |  514.31 ± 4.08 |
| gemma4 ?B BF16 | 47.02 GiB | 25.23 B | Vulkan  |  99 |       1 |     2048 |   1 |   tg128 |   18.32 ± 0.01 |

Again, using a Q8 instead of the full BF16 model reduces RAM usage, and doubles the performance.

```
root@llm-v21-655d6f597-l9hc5:/app/llama.cpp/build/bin# ./llama-bench -m /models/chat/gemma-4-26B-A4B/gemma-4-26B-A4B-it-UD-Q8_K_XL.gguf -t 1 -fa 1 -b 2048 -ub 2048 -p 2048,8192,16384,32768
ggml_vulkan: Found 1 Vulkan devices:
ggml_vulkan: 0 = Radeon 8060S Graphics (RADV STRIX_HALO) (radv) | uma: 1 | fp16: 1 | bf16: 0 | warp size: 64 | shared memory: 65536 | int dot: 1 | matrix cores: KHR_coopmat
load_backend: loaded Vulkan backend from /app/llama.cpp/build/bin/libggml-vulkan.so
load_backend: loaded CPU backend from /app/llama.cpp/build/bin/libggml-cpu-zen4.so
| model                          |       size |     params | backend    | ngl | threads | n_ubatch | fa |            test |                  t/s |
| ------------------------------ | ---------: | ---------: | ---------- | --: | ------: | -------: | -: | --------------: | -------------------: |
| gemma4 ?B Q8_0                 |  25.94 GiB |    25.23 B | Vulkan     |  99 |       1 |     2048 |  1 |          pp2048 |      1561.81 ± 36.24 |
| gemma4 ?B Q8_0                 |  25.94 GiB |    25.23 B | Vulkan     |  99 |       1 |     2048 |  1 |          pp8192 |       1441.42 ± 3.66 |
| gemma4 ?B Q8_0                 |  25.94 GiB |    25.23 B | Vulkan     |  99 |       1 |     2048 |  1 |         pp16384 |       1255.60 ± 2.08 |
| gemma4 ?B Q8_0                 |  25.94 GiB |    25.23 B | Vulkan     |  99 |       1 |     2048 |  1 |         pp32768 |        956.61 ± 4.69 |
| gemma4 ?B Q8_0                 |  25.94 GiB |    25.23 B | Vulkan     |  99 |       1 |     2048 |  1 |           tg128 |         44.33 ± 0.11 |

build: b8635075f (8665)
```

| model                          |       size |     params | backend    | ngl | threads | n_ubatch | fa |            test |                  t/s |
| ------------------------------ | ---------: | ---------: | ---------- | --: | ------: | -------: | -: | --------------: | -------------------: |
| gemma4 ?B Q8_0                 |  25.94 GiB |    25.23 B | Vulkan     |  99 |       1 |     2048 |  1 |          pp2048 |      1561.81 ± 36.24 |
| gemma4 ?B Q8_0                 |  25.94 GiB |    25.23 B | Vulkan     |  99 |       1 |     2048 |  1 |          pp8192 |       1441.42 ± 3.66 |
| gemma4 ?B Q8_0                 |  25.94 GiB |    25.23 B | Vulkan     |  99 |       1 |     2048 |  1 |         pp16384 |       1255.60 ± 2.08 |
| gemma4 ?B Q8_0                 |  25.94 GiB |    25.23 B | Vulkan     |  99 |       1 |     2048 |  1 |         pp32768 |        956.61 ± 4.69 |
| gemma4 ?B Q8_0                 |  25.94 GiB |    25.23 B | Vulkan     |  99 |       1 |     2048 |  1 |           tg128 |         44.33 ± 0.11 |
### Gemma 4 E4B Performance Benchmark Details

```
root@llm-v20-866684df54-8cc5v:/app/llama.cpp/build/bin# ./llama-bench -m /models/chat/gemma-4-E4B-it/gemma-4-E4B-it-BF16.gguf -t 1 -fa 1 -b 2048 -ub 2048 -p 2048,8192,16384,32768
ggml_vulkan: Found 1 Vulkan devices:
ggml_vulkan: 0 = Radeon 8060S Graphics (RADV STRIX_HALO) (radv) | uma: 1 | fp16: 1 | bf16: 0 | warp size: 64 | shared memory: 65536 | int dot: 1 | matrix cores: KHR_coopmat
load_backend: loaded Vulkan backend from /app/llama.cpp/build/bin/libggml-vulkan.so
load_backend: loaded CPU backend from /app/llama.cpp/build/bin/libggml-cpu-zen4.so
| model                          |       size |     params | backend    | ngl | threads | n_ubatch | fa |            test |                  t/s |
| ------------------------------ | ---------: | ---------: | ---------- | --: | ------: | -------: | -: | --------------: | -------------------: |
| gemma4 E4B BF16                |  14.00 GiB |     7.52 B | Vulkan     |  99 |       1 |     2048 |  1 |          pp2048 |        920.65 ± 1.76 |
| gemma4 E4B BF16                |  14.00 GiB |     7.52 B | Vulkan     |  99 |       1 |     2048 |  1 |          pp8192 |        879.57 ± 8.27 |
| gemma4 E4B BF16                |  14.00 GiB |     7.52 B | Vulkan     |  99 |       1 |     2048 |  1 |         pp16384 |        828.55 ± 0.55 |
| gemma4 E4B BF16                |  14.00 GiB |     7.52 B | Vulkan     |  99 |       1 |     2048 |  1 |         pp32768 |        755.56 ± 1.47 |
| gemma4 E4B BF16                |  14.00 GiB |     7.52 B | Vulkan     |  99 |       1 |     2048 |  1 |           tg128 |         19.07 ± 0.01 |
```

| model           |      size | params | backend | ngl | threads | n_ubatch |  fa |    test |           t/s |
| --------------- | --------: | -----: | ------- | --: | ------: | -------: | --: | ------: | ------------: |
| gemma4 E4B BF16 | 14.00 GiB | 7.52 B | Vulkan  |  99 |       1 |     2048 |   1 |  pp2048 | 920.65 ± 1.76 |
| gemma4 E4B BF16 | 14.00 GiB | 7.52 B | Vulkan  |  99 |       1 |     2048 |   1 |  pp8192 | 879.57 ± 8.27 |
| gemma4 E4B BF16 | 14.00 GiB | 7.52 B | Vulkan  |  99 |       1 |     2048 |   1 | pp16384 | 828.55 ± 0.55 |
| gemma4 E4B BF16 | 14.00 GiB | 7.52 B | Vulkan  |  99 |       1 |     2048 |   1 | pp32768 | 755.56 ± 1.47 |
| gemma4 E4B BF16 | 14.00 GiB | 7.52 B | Vulkan  |  99 |       1 |     2048 |   1 |   tg128 |  19.07 ± 0.01 |

## Setup and Config

### Dockerfile / Container for Vulkan Backend

My repository for building the container can be found [here](https://git.akehir.com/infra/llama-swap-llama-cpp-vulkan). Actually the container is public and can be pulled directly via `docker pull registry.akehir.com/infra/llama-swap-llama-cpp-vulkan/llama-release:latest`.

The image is based on debian testing, as seen in the Dockerfile in the repositroy.
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

### Dockerfile / Container for ROCm
Just to note that I have only tested this docker image with my dedicated AMD RX7900XTX GPU (gfx1100). You might need to change the GPU reference when compiling llama.cpp. Otherwise it's essentially the same image as the Vulkan image, except for using an older ubuntu based base image, which forces the installation of `nodejs` via `nvm`.

```Dockerfile
FROM rocm/pytorch:rocm7.2.1_ubuntu24.04_py3.12_pytorch_release_2.9.1
ARG NODE_VERSION=24
ENV NVM_DIR /usr/local/nvm
ENV NODE_VERSION v24.14.1

## Container
RUN mkdir /app
RUN mkdir /models
RUN mkdir /conf
RUN mkdir -p /usr/local/nvm

## Install nodejs via nvm
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.4/install.sh | bash
RUN /bin/bash -c "source $NVM_DIR/nvm.sh && nvm install $NODE_VERSION && nvm use --delete-prefix $NODE_VERSION"
ENV NODE_PATH $NVM_DIR/versions/node/$NODE_VERSION/bin
ENV PATH $NODE_PATH:$PATH

## Install Go
RUN curl --output go-linux-amd64.tar.gz --location https://go.dev/dl/go1.26.1.linux-amd64.tar.gz \
    && rm -rf /usr/local/go && tar -C /usr/local -xzf go-linux-amd64.tar.gz \
    && rm go-linux-amd64.tar.gz
ENV PATH=$PATH:/usr/local/go/bin

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
    && apt autoremove -y \
    && apt clean -y \
    && rm -rf /tmp/* /var/tmp/* \
    && find /var/cache/apt/archives /var/lib/apt/lists -not -name lock -type f -delete \
    && find /var/cache -type f -delete

## Setup llama-swap
WORKDIR /app
RUN git clone https://github.com/mostlygeek/llama-swap

## Build llama-swap
WORKDIR /app/llama-swap
RUN make clean all
WORKDIR /app/llama-swap/build

## Setup llama.cpp
WORKDIR /app
RUN git clone https://github.com/ggerganov/llama.cpp.git

## Build llama.cpp
WORKDIR /app/llama.cpp
RUN HIPCXX="$(hipconfig -l)/clang" HIP_PATH="$(hipconfig -R)" \
    cmake -S . -B build -DGGML_HIP=ON -DAMDGPU_TARGETS=gfx1151 -DCMAKE_BUILD_TYPE=Release \
    && cmake --build build --config Release -- -j 16
RUN pip install -r requirements.txt
WORKDIR /app/llama.cpp/build/bin

CMD ["/bin/bash"]


```

### llama-swap config.yaml

Here's a sample config.yaml I have used to run the `llama-swap` container via `docker-compose`. It can serve as a reference for your own setup. It needs to be stored next to the `docker-compose.yaml` in my example.

```yaml

healthCheckTimeout: 600
startPort: 14001

models:
  "gemma-4-31b--q8":
    cmd: /app/llama.cpp/build/bin/llama-server --port ${PORT} --host 0.0.0.0 --model /models/chat/gemma-4-31B-it/gemma-4-31B-it-UD-Q8_K_XL.gguf --jinja --temp 1.0 --top-p 0.95 --top-k 64 -c 255555

  "gemma-4-26b--q8":
    cmd: /app/llama.cpp/build/bin/llama-server --port ${PORT} --host 0.0.0.0 --model /models/chat/gemma-4-26B-A4B/gemma-4-26B-A4B-it-UD-Q6_K_XL.gguf --mmproj /models/chat/gemma-4-26B-A4B/mmproj-BF16.gguf --chat-template-file /app/llama.cpp/models/templates/google-gemma-4-31B-it-interleaved.jinja --jinja --temp 1.0 --top-p 0.95 --top-k 64 -c 255555

```
### docker-compose

Here is a sample `docker-compose` file to run the file use the `docker-compose` command, as follows: `docker-compose -f /path/to/docker-compose.yml up --detach`. To stop the container, you can run `docker-compose -f /path/to/docker-compose.yml stop`.

If your user is not in the `docker` user group, you will have to run the commands as super user (`root`) or via `sudo`, ie. `sudo docker-compose -f ...`.

If docker is not installed, you can install it via the following command (on debian): `sudo apt install docker.io docker-compose docker-buildx`.

```yaml
services:
  server:
    build: .
    ports:
      - "12345:12345"
    volumes:
      - /models:/models
      - /host/path/to/config.yaml:/conf/config.yaml
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

### Kubernetes Manifest
The below 2 Kubernetes manifests are used to both host openwebui and the openapi compatible llm api via llama-swap and llama.cpp.

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
  name: llm-v22
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
          image: registry.akehir.com/infra/llama-swap-llama-cpp-vulkan/llama-release:master-8e703497-1775343366 # {"$imagepolicy": "llm:image-policy"}
          command: ["/app/llama-swap/build/llama-swap-linux-amd64"]
          ports:
            - containerPort: 8080
          volumeMounts:
            - name: llama-swap-config
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
            name: llama-swap-config-v14
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
                      - srv-7
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
apiVersion: image.toolkit.fluxcd.io/v1
kind: ImageRepository
metadata:
  name: image-repository
  namespace: llm
spec:
  image: registry.akehir.com/infra/llama-swap-llama-cpp-vulkan/llama-release
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
  url: https://git.example.com/flux/flux.git
  secretRef:
    name: mr-robot
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: llama-swap-config-v14
  namespace: llm
data:
  config.yaml: |
    healthCheckTimeout: 600
    startPort: 14001

    models:
      "gemma-4-31b--q8":
        cmd: /app/llama.cpp/build/bin/llama-server --port ${PORT} --host 0.0.0.0 --model /models/chat/gemma-4-31B-it/gemma-4-31B-it-UD-Q8_K_XL.gguf --jinja --temp 1.0 --top-p 0.95 --top-k 64 -c 255555

      "gemma-4-26b--q8":
        cmd: /app/llama.cpp/build/bin/llama-server --port ${PORT} --host 0.0.0.0 --model /models/chat/gemma-4-26B-A4B/gemma-4-26B-A4B-it-UD-Q6_K_XL.gguf --mmproj /models/chat/gemma-4-26B-A4B/mmproj-BF16.gguf --chat-template-file /app/llama.cpp/models/templates/google-gemma-4-31B-it-interleaved.jinja --jinja --temp 1.0 --top-p 0.95 --top-k 64 -c 255555

    groups:
       default:
        swap: false
        members:
          - "gemma-4-26b--q8"

    hooks:
      on_startup:
        preload:
          - "gemma-4-26b--q8"
    ---
```

```yaml
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
          image: ghcr.io/open-webui/open-webui:v0.8.12 # {"$imagepolicy": "openwebui:image-policy"}
          securityContext:
            allowPrivilegeEscalation: false
            seccompProfile:
              type: RuntimeDefault
          ports:
            - containerPort: 8080
          volumeMounts:
            - mountPath: "/app/backend/data"
              name: openwebui
---
apiVersion: image.toolkit.fluxcd.io/v1
kind: ImageRepository
metadata:
  name: image-repository
  namespace: openwebui
spec:
  image: ghcr.io/open-webui/open-webui
  interval: 24h
---
apiVersion: image.toolkit.fluxcd.io/v1
kind: ImagePolicy
metadata:
  name: image-policy
  namespace: openwebui
spec:
  policy:
    semver:
      range: '>=0.0.0 <10.0.0'
  imageRepositoryRef:
    name: image-repository
---
apiVersion: image.toolkit.fluxcd.io/v1
kind: ImageUpdateAutomation
metadata:
  name: image-update-automation
  namespace: openwebui
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
  namespace: openwebui
spec:
  interval: 1m0s
  ref:
    branch: master
  url: https://git.example.com/flux/flux.git
  secretRef:
    name: mr-robot

```

