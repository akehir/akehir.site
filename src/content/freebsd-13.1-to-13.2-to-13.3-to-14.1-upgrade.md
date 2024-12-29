# freebsd-13.1-to-13.2-to-13.3-to-14.1 upgrade

if not pkg upgrade -f => error missing libraries...

```
1  9:05    sudo freebsd-update fetch
2  9:14    sudo freebsd-update install
3  9:19    sudo reboot
4  9:23    pkg update
5  9:23    sudo pkg update
6  9:23    sudo pkg upgrade
7  9:35    sudo reboot
8  9:54    sudo freebsd-update -r 13.2-RELEASE upgrade
9  10:14   sudo freebsd-update install
10  10:15   sudo reboot
11  10:18   sudo freebsd-update install
12  10:21   sudo freebsd-update install
13  10:21   sudo freebsd-update fetch
14  10:22   sudo freebsd-update install
15  10:25   pkg-static install -f pkg
16  10:25   sudo pkg-static install -f pkg
17  10:25   sudo pkg update
18  10:25   sudo
19  10:26   sudo pkg upgrade
20  10:26   sudo freebsd-update fetch
21  10:26   sudo freebsd-update install
22  10:26   sudo freebsd-update -r 14.1-RELEASE upgrade
23  10:38   sudo freebsd-update install
24  10:38   sudo reboot
25  10:50   sudo freebsd-update install
26  11:18   sudo pkg update
27  11:19   sudo pkg bootstrap -f
28  11:19   sudo pkg update
29  11:19   sudo pkg upgrade
30  11:20   sudo pkg update
31  11:20   sudo pkg bootstrap -f
32  11:20   sudo pkg update -f
33  11:20   sudo freebsd-update install
34  11:21   sudo freebsd-update update
35  11:21   sudo freebsd-update fetch
36  11:21   sudo freebsd-update install
37  11:22   sudo pkg upgrade -f
38  11:23   sudo pkg update
39  11:23   sudo pkg upgrade -f
```
