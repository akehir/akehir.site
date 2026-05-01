# How to Fix SSH (and git) Not Working Over Wireguard on Mobile Hotspot

I had the issue on my ChromeOS, that through the Wireguard VPN internet connections were working, but `ssh` was not working - and neither was `git pull`, since I was cloning via SSH.

The command `ssh $ip -vvv` got stuck on `debug1: expecting SSH2_MSG_KEX_ECDH_REPLY`, which apparently is an issue commonly caused by the MTU being to  big.

I first couldn't debug the issue, since the SSH in the ChromeOS terminal was working - it was only not working from within the Linux VM in ChromeOS. Therefore, the root cause was the MTU value not being propagated properly into the Linux VM within ChromeOS.

I could find a suitable value by using the following ping command `ping -M do $ip -s 1337`, where the value of `1337` was adjusted until it didn't work anymore. Linux had an MTU of 1500 set (found by using `ip a | grep mtu`),  and the highest working packet size for me was `1392`.

Then I just adjusted the MTU size as follows: 

```
sudo ip link set dev eth0 mtu 1337
```

And afterwards everything was working from within the Linux VM over wireguard!
