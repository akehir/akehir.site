# How to get a Shell and Execute Dynamic Linux Commands in a Docker Container During a Docker Build

If you have ever wanted to run some arbitrary commands during a docker build, but thought that it was cumbersome to manually add commands in the `Dockerfile`, then I have an elegant solution.
If you create a reverse shell, you can directly run the docker build and have a shell inside it.

The easy solution is to open a reverse shell and connect to it from a host computer. For instance, in a debian host / container, you will need to install `apt install -y netcat-traditional` for this to work. As long as you have the `nc` command available, you have everything you need.

On the host (the computer where you will be entering commands), you open the shell by typing the following:

```shell
nc -lvnp 1337
```

In addition to that, you need to open the port on your firewall, and the host computer needs to be reachable by the docker container.

Inside the container, you run a build command that will connect to the host as follows:

```Dockerfile
RUN nc -c sh 192.168.0.100 1337
```

As soon as the docker build reaches this step, you will get a notification on the host that a connection has been established (such as `Connection received on 192.168.0.1 3913`). Any commands you run within the shell now get executed directly on the container during build time. Do note, that you might need to redirect the terminal output of the programs to see it (such as by adding `2>&1`, resulting in a command like this: `curl -v github.com 2>&1`).

Now you can profit and debug whatever issues you might have had (in my case, connection problems). I like to start by running `ls` or `pwd`, or `ip a`. Any commands available within the container will work.

Note: the above Dockerfile is incomplete and just showing the minimal command to execute, a full docker file would be as follows:

```Dockerfile
FROM debian:testing
ENV DEBIAN_FRONTEND=noninteractive
ARG REVERSE_SHELL_CONNECT_IP=192.168.0.100
ARG REVERSE_SHELL_CONNECT_PORT=1337

RUN apt update && apt install -y netcat-traditional
RUN nc -c sh $REVERSE_SHELL_CONNECT_IP $REVERSE_SHELL_CONNECT_PORT
```
