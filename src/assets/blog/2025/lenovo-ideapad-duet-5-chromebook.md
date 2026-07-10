# Lenovo IdeaPad Duet 5 Chromebook Gen 6 (13" QCOM) - Review

I've now had this convertible Chromebook for 2 years, and now that I'm switching to the [Lenovo Chromebook Plus 14](https://akehir.com/blog/lenovo-chromebook-plus-14), it's time to review my time with the _Lenovo IdeaPad Duet 5 Chromebook Gen 6_.

I purchased this device, as a temporary device, for travelling, and because my previous laptop started a second life as a node in my experimental kubernetes cluster in my homelab. My plan was to buy another laptop, but since the laptops I was interested in weren't in stock, I decided to go for this Chromebook while I see how the market for Linux laptops develops.

Initially I got into ChromeOS just out of curiosity, to see how much work could actually get done on a rather limited device - and to understand why many schools are purchasing Chromebooks for their pupils. Additionally, the ability to run Android apps intrigued me, and I wanted to know how all of that would work in a system (I've played around with waydroid, but I was interested to see Google's implementation).

So I've previously played around with a 10", 4GB RAM Chromebook convertible, and while the low specs limited what was possible with the convertible, I could see the potential of Chromebooks (especially the Linux subsystem).

The IdeaPad Duet 5 promised a faster processor, double the RAM, and a bigger screen (as 10" is definitely too small for productive work). So I thought, it would be beneficial to have a portable device promising a strong battery life for travelling and while I was looking into which Linux laptop to purchase.

And to preempt the conclusion of my review: The Chromebook was so good and productive that I never even bought another laptop as I had initially planned.

## Workflow

I've mainly used the laptop (or rather, convertible) on the road (travelling), for writing, coding, webapps, and by using the Linux subsystem (programming, operations, linux software).

Whenever I needed more processing power than the Chromebook offered, I connected via PiKVM or SSH to my servers / my desktop at home. This solution works quite well, when the internet speed for my Chromebook was good enough.

In Switzerland, that's generally the case (via 4g / 5g mobile hotspot, as long as reception is acceptable). When travelling abroad, or in the train (especially in tunnels), unfortunately the internet is not fast / stable enough for remote access. In those situations, I could easily bring the Chromebook to it's knees by multitasking too much (or having to heavy tasks).

I had to be concerned with RAM usage, as the Chromebook often completely crashed if I had multiple programs or too many tabs open. However, by limiting multitasking, it was a stable device with a long battery life.

ChromeOS itself was surprisingly good: WebApps can cover a lot of my immediate needs (for instance, eBanking, eGov, eMail, eTc); and everything else I could cover via the Linux VM (kubectl, git, ssh, flux, Sublime, Obsidian, and the works). Occasionally I sprinkled some Android App usage in there, but that was nary a concern.

## Pros and Cons

### Pros

- 8GB RAM, enough for a few tabs, Linux / Android subsystem
- battery life
- OLED screen
- value

### Cons

- 8GB RAM (not enough for heavier multitasking)
- 128 GB storage felt limiting after a while
- no keyboard backlight
- trackpad is okay at best
- display out over usb-c limited

## Conclusion

As I've previously written, the _IdeaPad Duet 5 Chromebook Gen 6_ is a really solid convertible laptop.

It shines in the portability department (lightweight, great battery life, gorgeous screen), and the keyboard is usable enough.

On the other hand it's lacking power for heavier tasks.

ChromeOS echoes the same: It's quickly set up, and gets out of your way to allow you to be productive as soon as possible - though for more advanced use cases it might lack some tooling (even if I was able to go quite far with the Linux Subsystem).

In the past, I was of the opinion that I would not need a desktop computer anymore, and just have a powerful enough laptop to complete all my computing tasks. Considering that, my use of ChromeOS devices has been quite a paradigm shift:

Instead, I prefer to use a portable, lightweight laptop backed by a more powerful server (cloud based, or self-hosted in my case). The reason is that especially more advanced tasks (using a lot of CPU / GPU compute) are directly detrimental to what I now value in laptops most (portability). The more powerful a laptop is, the bigger and heavier it will be - and battery life will suffer as well.

A MacBook pro probably comes closest to an _ideal_ device that has just enough compute to make a desktop computer obsolete while remaining reasonably portable (although the weight difference still is significant).

I couldn't get used to MacOS though, and my last Mac sucked (crappy butterfly keyboard and Intel Processors), so I've decided against a Mac for now (apart from the pricing bordering the unaffordable).

Compared to that, the _IdeaPad Duet 5 Chromebook Gen 6_ always brought a smile to my lips, with known limitations, but with a price excusing those limitations - and with covering the most important needs of a portable computing device.
