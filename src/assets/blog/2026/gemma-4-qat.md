# Quick Review of the Gemma 4 QAT Models

Google has come out with another win for their Gemma 4 model family. They have released the models with QAT (Quantization-Aware Training), which improves the model performance at lower quantization.

On one hand, this drastically reduces the required RAM / VRAM to run a specific model, and on the other hand it vastly improves the performance.

For instance, if you remember my earlier benchmarks of the Gemma 4 26B model. At full precision, prompt processing was 500-600 tokens/s, and text generation was at 18 tokens/s. At half precision (Q8), we were at 1000-1600 tokens/s prompt processing and at 44 tokens/s text generation, So half the precision gave me twice the speed.

Now the newly released Gemma 4 26B QAT model promises the same accuracy at one quarter precision (Q4). As for the performance, I now measure 1000-1800 tokens/s prompt processing and 75 tokens/s text generation. While prompt processing does not improve a lot anymore, text generation still gets a great speedup.

The same holds for the 31B model. Unfortunately it still crashes at 32k context. But at full precision, prompt processing was at 100-150 tokens/s and text generation was at 4 tokens/s. At half precision (Q8), prompt processing speed was up to 300 tokens/s and text generation was at 6 tokens/s.

Now with the new QAT version, we have just one quarter of the precision (Q4) promising full accuracy. Prompt processing is still at 150-300 tokens/s, and now text generation speed reached 12 tokens/s.

Unfortunately, I noticed crashes with agentic programming / bigger context sizes. I didn't have these crashes with the normal 8-bit quantizations I've been previously using (at least for the 26B model, for the 31B model I previously already had crashes). Therefore, my current recommendation is still the 'normal' 8-bit quantization of the 26B model which has a good balance of performance and quality.

Even though that is my current recommendation, I do hope the 4-bit QAT models work better in the future, because the smaller memory footprint and the better performance (almost doubled text generation speeds) are definitely promising and would be great to have.

For more information on how I am running the Gemma 4 models, check out my [previous blog entry](https://akehir.com/blog/strix-halo-kubernetes-llm-gemma-4) on the matter (since I switched back to using these models instead of the QAT models anyways). More information on my kubernetes setup can be found [here](https://akehir.com/blog/strix-halo-kubernetes-llm-gpt-oss).

## Benchmarks

### gemma4 26B.A4B Q4_0

| model               |      size |  params | backend | ngl | threads | n_ubatch |  fa |    test |             t/s |
| ------------------- | --------: | ------: | ------- | --: | ------: | -------: | --: | ------: | --------------: |
| gemma4 26B.A4B Q4_0 | 13.26 GiB | 25.23 B | Vulkan  |  -1 |       1 |     2048 |   1 |  pp2048 |  1743.55 ± 4.06 |
| gemma4 26B.A4B Q4_0 | 13.26 GiB | 25.23 B | Vulkan  |  -1 |       1 |     2048 |   1 |  pp8192 |  1539.93 ± 1.35 |
| gemma4 26B.A4B Q4_0 | 13.26 GiB | 25.23 B | Vulkan  |  -1 |       1 |     2048 |   1 | pp16384 |  1336.90 ± 4.41 |
| gemma4 26B.A4B Q4_0 | 13.26 GiB | 25.23 B | Vulkan  |  -1 |       1 |     2048 |   1 | pp32768 | 1015.87 ± 11.14 |
| gemma4 26B.A4B Q4_0 | 13.26 GiB | 25.23 B | Vulkan  |  -1 |       1 |     2048 |   1 |   tg128 |    74.56 ± 0.07 |

```
root@llm-v64-677857cdcb-6gvxx:/app# llama-bench -m /models/chat/gemma-4-26B-A4B-qat/gemma-4-26B-A4B-it-qat-UD-Q4_K_XL.gguf -t 1 -fa 1 -b 2048 -ub 2048 -p 2048,8192,16384,32768
ggml_vulkan: Found 1 Vulkan devices:
ggml_vulkan: 0 = Radeon 8060S Graphics (RADV STRIX_HALO) (radv) | uma: 1 | fp16: 1 | bf16: 0 | warp size: 64 | shared memory: 65536 | int dot: 1 | matrix cores: KHR_coopmat
load_backend: loaded Vulkan backend from /app/llama.cpp/build/bin/libggml-vulkan.so
load_backend: loaded CPU backend from /app/llama.cpp/build/bin/libggml-cpu-zen4.so
| model                          |       size |     params | backend    | ngl | threads | n_ubatch |  fa |            test |                  t/s |
| ------------------------------ | ---------: | ---------: | ---------- | --: | ------: | -------: | --: | --------------: | -------------------: |
| gemma4 26B.A4B Q4_0            |  13.26 GiB |    25.23 B | Vulkan     |  -1 |       1 |     2048 |   1 |          pp2048 |       1743.55 ± 4.06 |
| gemma4 26B.A4B Q4_0            |  13.26 GiB |    25.23 B | Vulkan     |  -1 |       1 |     2048 |   1 |          pp8192 |       1539.93 ± 1.35 |
| gemma4 26B.A4B Q4_0            |  13.26 GiB |    25.23 B | Vulkan     |  -1 |       1 |     2048 |   1 |         pp16384 |       1336.90 ± 4.41 |
| gemma4 26B.A4B Q4_0            |  13.26 GiB |    25.23 B | Vulkan     |  -1 |       1 |     2048 |   1 |         pp32768 |      1015.87 ± 11.14 |
| gemma4 26B.A4B Q4_0            |  13.26 GiB |    25.23 B | Vulkan     |  -1 |       1 |     2048 |   1 |           tg128 |         74.56 ± 0.07 |

```

### gemma4 31B Q4_0 and gemma4 26B.A4B Q4_0

| model               |      size |  params | backend | ngl | threads | n_ubatch |  fa |    test |            t/s |
| ------------------- | --------: | ------: | ------- | --: | ------: | -------: | --: | ------: | -------------: |
| gemma4 26B.A4B Q4_0 | 13.26 GiB | 25.23 B | Vulkan  |  -1 |       1 |     2048 |   1 |  pp2048 | 1747.76 ± 1.99 |
| gemma4 26B.A4B Q4_0 | 13.26 GiB | 25.23 B | Vulkan  |  -1 |       1 |     2048 |   1 |  pp8192 | 1537.66 ± 2.06 |
| gemma4 26B.A4B Q4_0 | 13.26 GiB | 25.23 B | Vulkan  |  -1 |       1 |     2048 |   1 | pp16384 | 1336.15 ± 6.37 |
| gemma4 26B.A4B Q4_0 | 13.26 GiB | 25.23 B | Vulkan  |  -1 |       1 |     2048 |   1 |   tg128 |   74.60 ± 0.21 |
| gemma4 31B Q4_0     | 16.09 GiB | 30.70 B | Vulkan  |  -1 |       1 |     2048 |   1 |  pp2048 |  309.90 ± 2.76 |
| gemma4 31B Q4_0     | 16.09 GiB | 30.70 B | Vulkan  |  -1 |       1 |     2048 |   1 |  pp8192 |  254.59 ± 0.25 |
| gemma4 31B Q4_0     | 16.09 GiB | 30.70 B | Vulkan  |  -1 |       1 |     2048 |   1 | pp16384 |  167.38 ± 0.32 |
| gemma4 31B Q4_0     | 16.09 GiB | 30.70 B | Vulkan  |  -1 |       1 |     2048 |   1 |   tg128 |   12.17 ± 0.01 |

```
llama-bench -m /models/chat/gemma-4-26B-A4B-qat/gemma-4-26B-A4B-it-qat-UD-Q4_K_XL.gguf,/models/chat/gemma-4-31B-qat/gemma-4-31B-it-qat-UD-Q4_K_XL.gguf -t 1 -fa 1 -b 2048 -ub 2048 -p 2048,8192,16384
ggml_vulkan: Found 1 Vulkan devices:
ggml_vulkan: 0 = Radeon 8060S Graphics (RADV STRIX_HALO) (radv) | uma: 1 | fp16: 1 | bf16: 0 | warp size: 64 | shared memory: 65536 | int dot: 1 | matrix cores: KHR_coopmat
load_backend: loaded Vulkan backend from /app/llama.cpp/build/bin/libggml-vulkan.so
load_backend: loaded CPU backend from /app/llama.cpp/build/bin/libggml-cpu-zen4.so
| model                          |       size |     params | backend    | ngl | threads | n_ubatch |  fa |            test |                  t/s |
| ------------------------------ | ---------: | ---------: | ---------- | --: | ------: | -------: | --: | --------------: | -------------------: |
| gemma4 26B.A4B Q4_0            |  13.26 GiB |    25.23 B | Vulkan     |  -1 |       1 |     2048 |   1 |          pp2048 |       1747.76 ± 1.99 |
| gemma4 26B.A4B Q4_0            |  13.26 GiB |    25.23 B | Vulkan     |  -1 |       1 |     2048 |   1 |          pp8192 |       1537.66 ± 2.06 |
| gemma4 26B.A4B Q4_0            |  13.26 GiB |    25.23 B | Vulkan     |  -1 |       1 |     2048 |   1 |         pp16384 |       1336.15 ± 6.37 |
| gemma4 26B.A4B Q4_0            |  13.26 GiB |    25.23 B | Vulkan     |  -1 |       1 |     2048 |   1 |           tg128 |         74.60 ± 0.21 |
| gemma4 31B Q4_0                |  16.09 GiB |    30.70 B | Vulkan     |  -1 |       1 |     2048 |   1 |          pp2048 |        309.90 ± 2.76 |
| gemma4 31B Q4_0                |  16.09 GiB |    30.70 B | Vulkan     |  -1 |       1 |     2048 |   1 |          pp8192 |        254.59 ± 0.25 |
| gemma4 31B Q4_0                |  16.09 GiB |    30.70 B | Vulkan     |  -1 |       1 |     2048 |   1 |         pp16384 |        167.38 ± 0.32 |
| gemma4 31B Q4_0                |  16.09 GiB |    30.70 B | Vulkan     |  -1 |       1 |     2048 |   1 |           tg128 |         12.17 ± 0.01 |
```
