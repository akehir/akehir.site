# Lenovo Chromebook Plus 14 - First Impressions, and Preliminary Review

Oh man, this Chromebook rocks. It addresses the only pain points I had for the [Lenovo IdeaPad Duet 5 Chromebook Gen 6](https://akehir.com/blog/lenovo-ideapad-duet-5-chromebook), and it succeeds on all counts.

## Experience so far

I didn't expect much coming from another good Chromebook in my view - however, with that bottom line the Lenovo Chromebook Plus 14 really manages to impress.

It's overwhelmingly faster and snappier, while preserving the string battery life I got used to.

It also addresses my main pain points: double the RAM, double the storage, backlit keyboard, better trackpad, better keyboard.

I didn't really expect it to be so much faster in processing power (and I didn't need it to be this fast), but it's really snappy and performant - and opens up the possibility to use (Linux) applications that just weren't usable at all previously.

Especially graphically heavy applications (such as Godot or FreeCAD) were basically impossible to use productively for me on the previous Chromebook, while now they're barely making the Lenovo Chromebook Plus 14 break a sweat.

## Preliminary Performance Testing

I've done some preliminary and simple performance tests in order to get a feel for how good the processor is in this Chromebook.

### Angular App Build Time

A prod build comparison for 2 projects shows that it's around 50% slower than my desktop (AMD 7950X 16 core - but in ECO mode, so performance can be ~33% better if full power). The projects are quite small, but they serve to establish a baseline for light compilation tasks. The first project is my website / blog, which you're reading right now. The source code is available [here](https://git.akehir.com/akehir/akehir.site/), if you want to try running it yourself.

I mainly use it to try out new features and different development approaches, and to write my blog.

The second project is a slightly bigger, but uses nx under the hood, which shows a performance benefit as compared to my plain Angular. It's a bit more realistic as an "enterprisey" Angular setup, but it's still a tiny application. Overall they're just small real-life examples of how the new Mediatek CPU performs.

_Qualcom (Lenovo IdeaPad Duet 5 Chromebook Gen 6):_

- Angular Project 1: 125s build time.
- Angular Project 2: 60s build time.

_MediaTek Kompanio Ultra 910 (Lenovo Chromebook Plus 14):_

- Angular Project 1: 28.5s build time.
- Angular Project 2: 11s build time.

_AMD Ryzen 9 7950X:_

- Angular Project 1: 12.3s build time.
- Angular Project 2: 7s build time.

For a mobile processor it's not a bad result, especially compared to my previous ARM chromebook. Compared to my desktop there's still an obvious performance differential, but it's vastly more responsive than the previous Chromebook. From that perspective it's a huge upgrade, while preserving battery life, so it's very welcome.

I didn't even consider / need the CPU upgrade, since I've remote controlled my desktop (ssh / Jetbrains remote development / PiKVM) whenever I needed more power - however, this CPU speed allows for even more work to be done directly on the Chromebook.

### Linux Kernel 6.15 Compilation Time

As a comparison for Linux Timed Kernel compilation time (which is an example of a much heavier project than a simple Angular compilation). I like this test, because Phoronix uses it in many CPU reviews, so it's a good baseline to see how a computer performs for a heavier task.

_MediaTek Kompanio Ultra 910 (Lenovo Chromebook Plus 14):_ ~30min.

_AMD Ryzen 9 7950X:_ 77s.

The kernel compilation shows that there is still a higer performance differential compared to a (throttled) desktop CPU (and NVME SSD). You can also compare it with the results from [Phoronix](https://www.phoronix.com/review/amd-ryzen9-7950x3d-linux/13) who had 45s on the Ryzen 9 7950X (for Linux 6.1), which is ~40% faster than my result (although for a different kernel version).

In the end, for tasks that require heavy compilation, or faster hard drive speeds, it is quite obvious that they shouldn't be done on this Chromebook; it's just not efficient.

However, if there's an emergency, we can observe that it's quite possible to complete even heavy coding work on this laptop, provided you have a bit of patience.

### llama-bench

Another example of a heavier task that would probably not usually be run on a Chromebook, is running LLM models. I am used to run `llama.cpp` in docker containers, and I wanted to see, if I could run a small model successfully in a docker container within the Linux VM on this Chromebook. Not because I thought it was practical, but more because it's really something that I wouldn't expect to be easily possible on a Chromebook.

I am happy to report, that I got docker running quickly, and that running the `llama.cpp` containers wasn't a problem at all (I just had to compile it myself, because for some reason the docker daemon didn't download the correct ARM docker images). Even compiling the `llama.cpp` project and running it in a docker container didn't really cause the Chromebook to break a sweat.

So I've run llama-bench in a docker container with the SmolPLM3 Q4 model.

#### Result

**tg128: 10 t/s** (compared to **tg128: 155 t/s** on my AMD RX7900XTX).

So while it obviously is rather slow, I find 10 t/s quite respectable for a little chromebook compared to running the model ~15 times faster on my GPU.

## Software that Works

I haven't had the time to really challenge this Chromebook with all kinds of workflows and heavy duty

### FreeCAD

Surprisingly good. Didn't work at all on my previous Chromebook, but it looks like some 3D CAD work for 3D printing is well within the realm of the possible.

### LibreOffice

Solid.

### Godot Engine

Good, performance is great. Again, I was previously unable to run Godot successfully on my previous Chromebook (a game was running at what .5 fps), but on this Chromebook a 3D scene can be rendered surprisingly fluidly.

### llama.cpp

Works, performance is _meh_ at the moment (even disregarding the RAM limit). See my limited performance testing. I would hope to be able to leverage the ML cores of the CPU eventually, though I suspect this will remain challenging due to the triple virtualization (ChromeOS host => Linux VM => docker container).

### WebStorm

Limited size of window (max window size), otherwise works great. Other than the limited window, the performance is solid and I didn't encounter graphical bugs yet.

## Software Issues

### Obsidian

I like to use Obsidian for writing currently. Unfortunately it is plagued by graphical glitches (especially before selecting a vault). Even afterwards, it is mostly working, but occasionally the UI glitches out and you need to scroll around to fix it. It's worse than on my previous ARM Chromebook, so I assume the drivers for this ARM GPU aren't quite as stable yet.

## Hardware Issues

So far the build quality of the Chromebook looks great. The trackpad is very smooth, the keyboard feels great to type on.

I do also like the screen, it seems to be calibrated to be close to SRGB (which means that colors are not over-saturated). I do like this color calibration, but I see how one could dislike it (especially if used to more saturated screens).

However, I've found one major limitation: I connected my USB hub and my USB-C Screen, and the video output to the screen was good. Unfortunately, my USB hub (and thus my keyboard) didn't work, due to "too many USB devices connected". That was really a shame and meant I couldn't use the Chromebook in the way I wanted. I'll have to find a setup that works and doesn't use too many USB devices...

## Spare Parts
One important fact to note is that Lenovo offers spare parts directly on their online store. This [here](https://pcsupport.lenovo.com/ch/en/products/chromebook-laptops/lenovo-chromebooks-series/lenovo-chrome-14m9610/83my/83my000rse/pf5rxhfn/parts/display/buy-now) is the spare part link printed on my device.

This is a big advantage, as the device can live longer by replacing broken or degraded parts (such as the plastic / screen / battery). I think the repairability is a huge advantage as well.

## Pros and Cons

### Pros

- Price / Performance
- Trackpad
- Keyboard
- Screen
- Battery life
- Ease of use
- Spare part availability

### Cons

- Graphical glitches in Linux VM.
- Limit to connected USB devices =(
- Who knows where Google is going with ChromeOS / Android convergence

## Conclusion

So far I'm happy with the laptop. It improves on what I found lacking in my previous Chromebook for a fair price.

It's strengths are it's portability, ChromeOS being relatively mature and easy to use, and it's performance.

The hardware is also quite solid, especially with respect to the screen, keyboard, and trackpad.

We don't know where Google is heading with ChromeOS and the planned Android convergence, which I'm relatively pessimistic about. ChromeOS strikes a great balance in simplicity that just let's you log in and use the device - and Android is much more encumbered and complicated to use. The mobile apps have also never reached parity with desktop apps (just look at mobile Chrome lacking extensions as one example). However, as long as the Linux VM remains well integrated and functioning, I'll be able to deal with it.

In any case, as of now, I can recommend this Chromebook as it definitely punches above it's price class and covers everything I expect from a portable laptop. If my needs or ChromeOS change, I'm ready to switch to another device, but for now I'll see how far I can go with this setup.
