# ChromeOS - Remote Debugging with Firefox on an Android Phone via Crostini on ChromeOS

I mainly use ChromeOS/ARM on the go (as they are compact, portable and reasonably priced devices with the Linux tools I require).

On my phone, I mainly use the Firefox browser (in order to have vital browser extensions, such as uBlock Origin 😏).

It recently happened that I needed to debug a browser tab on my phone. Consequently, I had to use my  ChromeOS device.

Unfortunately I faced a few minor issues, until I got the debugging party started.

Which is why I'm writing this short guide on how to get started with remote debugging with Firefox on Android on ChromeOS!

## Setup

I'll assume that the Linux VM is enabled and activated - otherwise you'll have to do so by following [Google's instructions](https://support.google.com/chromebook/answer/9145439?hl=en).

Then you'll have to install both `adb` and `firefox` (or `firefox-esr` if `firefox` is not available). I also tried the adb toggle in ChromeOS itself, but that didn't lead to the desired results and didn't enable adb from within Linux. If installing `adb` in Linux is not sufficient, it might additionally be required to enable adb in ChromeOS as per [Google's instructions](https://chromeos.dev/en/android-environment/deploying-apps).

```
sudo apt install adb firefox-esr # you can choose 'firefox' or 'firefox-esr' depending on availability
```

Once the programs are installed, open Firefox and head to the [about:debugging](about:debugging) page in Firefox. There you'll have to follow the [instructions](https://firefox-source-docs.mozilla.org/devtools-user/about_colon_debugging/index.html) in order to enable USB devices. Well, the "instructions" can be reduced to "click the 'Enable USB Devices"-button.

Now you should have a green check on the left side of the screen stating "USB enabled". Without adb installed, that check will not appear, and the text will continue to say "USB disabled", so if it's missing, ensure that `adb` is installed and working.

Finally, you're ready to debug, just connect your Phone via USB and mount it to the Linux VM (there are some controls in the Linux settings for it - or there might be a popup asking you to do so).

That's it.

---



PS: The main issue I had, was that I had to install `adb`, the rest is quite straightforward with Firefox / Linux enabled.
PPS: You can also check your connected devices under
[chrome://inspect/#devices](chrome://inspect/#devices) .
