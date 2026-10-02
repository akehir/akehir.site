# Internet Service Provider Recommendation: Init7 (Fiber7)

_Published: 2026-06-08_

I've been wanting to write a review (or rather, a recommendation) of Fiber7 as an internet service provider for a while. So this is I; and I outline my reasons in the following text.

If - after reading this article - you want to subscribe to Init7 and save a bit on their hardware - use this referral code:

```
98366827729
```

## Why does the internet provider matter?

Initially, you'd be tempted to go for the cheapest internet service provider (ISP) available. That's a reasonable choice, but I prefer paying a bit more for the provider.

The main reason is not because the internet is faster (it is! see below...), or because the internet is more stable (I never had a major unscheduled outage so far since Init7 has been my ISP in 2017 and if they do have an issue, they are transparent about int and publish them on their [website](https://www.init7.net/en/support/faq/status-info/)).

The biggest point is, that in the bigger scope, Init7 seems to be a provider fighting for their customers rights.

Here are a few examples of what Init7 does.

### Challenge Swisscom Monopoly

Init7 is challenging the abose of it's monopoly by Swisscom, and successfully at that. Read more in the following two press releases:

- https://www.init7.net/de/news/241223-mm-init7-comcom-orders-swisscom-must-operate-zero-settlement-peering-with-init7-en.pdf
- https://www.init7.net/de/news/211005_mm_bvger_p2mp.pdf

It is a fact that every ISP in Switzerland will have to deal with Swisscom at some point, and that fighting Swisscom is also self-serving

### Discussing Illegal State Surveillance

I really recommend reading Republik's reporting about the [swiss state surveillance](https://www.republik.ch/2024/01/09/der-bund-ueberwacht-uns-alle). In any case it is clear that the Swiss government has built a bit of a surveillance apparatus in cooperation with major ISPs in Switzerland. Init7 is directly quoted in the article; while I cannot say that they directly fight the surveillance, their willingness to talk about it publicly at least indicates more transparency.

## What is offered?

The main reason I'm choosing Init7 is that they offer a fixed IPv4 address (for a price). This is practical in my case as I like to have a VPN setup on my router in order to connect to my home network even when I'm travelling. This affords multiple advantages:

- I can easily host services that are only accessible through local network and that I do not want to expose externally (such as `kubectl` or `ssh` access, also `PiKVM` to access my PC with a thin client)
- I can use my local DNS server for adblocking on all devices, including smart phones (with `PiHole`)
- With my private DNS and private encrypted network connection, I have better privacy and protection from malware (via using `9.9.9.9` as the upstream DNS server with `DNSSEC`)
- Even in public WIFI, my internet traffic cannot be intercepted / modified
- I can host my own E-Mail server
- I can host my own servers and websites

I had very good customer support calls, and they were willing to setup a reverse DNS zone for my IP (a requirement for hosting your own e-mail).

I am also hosting my own small librespeed server with which you can check how fast the connection to my servers is: https://speedtest.akehir.com/
Just note that the speedtest is running on a raspberry PI, and therefore the maximum speed that can be achieved is the 1GB/s connection to the raspberry PI. Furthermore it is routed through a reverse proxy with a maximum uplink of 500 MB/s therefore the speed you'll see in the test is even lower. But it is just an example of how the connection is stable enough to host a small speed test server. The blog you're reading is also hosted on a raspberry PI at my home, another example.

Another advantage that no other ISP can offer is raw speed. Init7 offers a symmetrical 25GB/s connection. I have gotten up to 19061.67 Mbps download and 18742.34 Mbps upload from my machine in my testing. The speed is really as fast as advertised. I am sure, my network is not perfectly configured for a maximum speed either. Init7 does have a [fair use policy](https://www.init7.net/de/kleingedrucktes/072021_contractual-conditions-init7.pdf) that would kick in if a single user would be saturating the 25 GB/s link, just be warned about that:

> Init7 reserves the right to temporarily or permanently restrict or discontinue the provision of services for connections whose data volume exceeds 0.5 petabyte (500 terabytes) in a period of 4 weeks, or to take another suitable measure.

But honestly I doubt that it is very realistic to reach that kind of consumption - and I'm pretty confident that such a high use would be punished at other ISPs as well. In any case I've never reached this limit.

From what I've seen, and compared to other providers in a small sample, the ping of Init7 is usually quite low. That can be good for latency-sensitive applications such as gaming.

I have attached various speed test results further down.

### Do not trust just me

Other techies, like [Michael Stapelberg](https://michael.stapelberg.ch/posts/2021-05-28-configured-and-returned-mikrotik-ccr2004-for-fiber7/) use Init7. They are highly recommended generally.

### Conclusion

If you want a solid ISP, and a stable, fast internet connection along with competent support, I can fully recommend Init7.

---

## References

- https://www.republik.ch/2024/01/09/der-bund-ueberwacht-uns-alle
- https://blog.init7.net/de/ueberwachung-im-internet/
- https://www.digitec.ch/en/page/init7-rebels-against-the-public-prosecutors-request-to-block-networks-41720
- https://michael.stapelberg.ch/posts/2021-05-28-configured-and-returned-mikrotik-ccr2004-for-fiber7/
- https://www.init7.net/de/kleingedrucktes/072021_contractual-conditions-init7.pdf

---

## Speedtest

2026-05-08

```bash
speedtest
Speedtest by Ookla
Server: Michael Stapelberg - Zürich (id: 50092)
ISP: Init7
Idle Latency:     0.47 ms   (jitter: 0.01ms, low: 0.47ms, high: 0.48ms)
Download: 19061.67 Mbps (data used: 31.6 GB)
			  1.18 ms   (jitter: 10.02ms, low: 0.48ms, high: 211.07ms)
Upload: 18742.34 Mbps (data used: 22.1 GB)
			  0.99 ms   (jitter: 4.62ms, low: 0.53ms, high: 209.31ms)
Packet Loss:     0.3%
Result URL: https://www.speedtest.net/result/c/24f7cbb1-c87d-4f5c-848f-d40dba7f90c1
```

```bash
speedtest
Speedtest by Ookla
Server: Michael Stapelberg - Zürich (id: 50092)
ISP: Init7   Idle Latency:     0.47 ms   (jitter: 0.00ms, low: 0.47ms, high: 0.48ms)
Download: 13889.12 Mbps (data used: 23.8 GB)
			 22.65 ms   (jitter: 37.53ms, low: 0.57ms, high: 790.95ms)
Upload: 16061.34 Mbps (data used: 8.7 GB)
			  0.70 ms   (jitter: 5.03ms, low: 0.50ms, high: 205.81ms)
Packet Loss:     0.0%
Result URL: https://www.speedtest.net/result/c/7ac96054-37e2-41a6-8dfb-af210a05d868
```

```bash

$ sudo speedtest -s 50092

   Speedtest by Ookla

      Server: Michael Stapelberg - Zurich (id: 50092)
         ISP: Init7
Idle Latency:     0.48 ms   (jitter: 0.01ms, low: 0.47ms, high: 0.50ms)
    Download:  6399.23 Mbps (data used: 5.2 GB)
                  0.66 ms   (jitter: 3.31ms, low: 0.54ms, high: 208.64ms)
      Upload:  9508.56 Mbps (data used: 6.4 GB)
                  1.55 ms   (jitter: 0.26ms, low: 0.69ms, high: 2.19ms)
 Packet Loss:     0.0%
  Result URL: https://www.speedtest.net/result/c/5da48a94-55d9-434d-85b6-56fe3100987d
```

```bash
sudo speedtest -s 54445

   Speedtest by Ookla

      Server: Mete Balci - Zug (id: 54445)
         ISP: Init7
Idle Latency:     1.22 ms   (jitter: 0.09ms, low: 1.15ms, high: 1.36ms)
    Download:  9366.61 Mbps (data used: 10.6 GB)
                  4.17 ms   (jitter: 0.46ms, low: 1.15ms, high: 10.58ms)
      Upload:  3266.34 Mbps (data used: 3.4 GB)
                  3.21 ms   (jitter: 0.54ms, low: 1.22ms, high: 4.90ms)
 Packet Loss:     0.0%
  Result URL: https://www.speedtest.net/result/c/e57a57c9-21fc-4396-88d5-99e82d0b13ff
```

```bash
sudo speedtest -s 50092

   Speedtest by Ookla

      Server: Michael Stapelberg - Zurich (id: 50092)
         ISP: Init7
Idle Latency:     0.49 ms   (jitter: 0.01ms, low: 0.49ms, high: 0.51ms)
    Download:  6363.81 Mbps (data used: 4.1 GB)
                  0.64 ms   (jitter: 0.09ms, low: 0.52ms, high: 1.08ms)
      Upload: 13302.56 Mbps (data used: 17.7 GB)
                  0.79 ms   (jitter: 2.20ms, low: 0.51ms, high: 211.18ms)
 Packet Loss:     0.0%
  Result URL: https://www.speedtest.net/result/c/ea7437b7-7fea-4ea7-bd7c-731ca41ac50f
```

```bash
   Speedtest by Ookla

      Server: Michael Stapelberg - Zurich (id: 50092)
         ISP: Init7
Idle Latency:     0.51 ms   (jitter: 0.01ms, low: 0.50ms, high: 0.52ms)
    Download: 12493.96 Mbps (data used: 21.9 GB)
                  0.81 ms   (jitter: 1.64ms, low: 0.52ms, high: 207.05ms)
      Upload: 10948.15 Mbps (data used: 10.3 GB)
                  0.61 ms   (jitter: 0.05ms, low: 0.53ms, high: 0.76ms)
 Packet Loss:     0.0%
  Result URL: https://www.speedtest.net/result/c/06d12545-774b-4d2b-b3b9-1932dc9a944f
```

2026-05-05

```bash
  Speedtest by Ookla

      Server: iway AG - Zürich (id: 3188)
         ISP: Init7
Idle Latency:     0.93 ms   (jitter: 0.19ms, low: 0.79ms, high: 1.09ms)
    Download: 14008.38 Mbps (data used: 21.0 GB)
                  0.93 ms   (jitter: 0.30ms, low: 0.62ms, high: 6.39ms)
      Upload: 18628.88 Mbps (data used: 34.0 GB)
                  0.90 ms   (jitter: 1.67ms, low: 0.61ms, high: 205.12ms)
 Packet Loss:     0.0%
  Result URL: https://www.speedtest.net/result/c/9663559d-781a-4849-ab79-e7915489c23f

```
