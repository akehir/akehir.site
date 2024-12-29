# opnsense 24.7 bootstrap / install on freebsd 14.1

error: 

```
sudo su -
pkg delete -fya

(will delete sudo)

fetch https://raw.githubusercontent.com/opnsense/update/master/src/bootstrap/opnsense-bootstrap.sh.in
sh ./opnsense-bootstrap.sh.in -r 24.7

```
