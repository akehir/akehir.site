# Debugging Kubernetes Traefik Ingress Issues by Reading the Traefik Logs

In order to see the logs of the Traefik ingress controller for Kubernetes, you can do the following steps:

```shell
kubectl namespace kube-system
kubectl get pods --selector "app.kubernetes.io/name=traefik" -n kube-system
# NAME                       READY   STATUS    RESTARTS       AGE
# traefik-7fc4dd95bc-bxwjx   1/1     Running   1 (3d9h ago)   5d2h
kubectl logs traefik-7fc4dd95bc-bxwjx -n kube-system
```

Obviously the flag `-n kube-system` is not required, if you did switch the namespace in the beginning (`kubectl namespace kube-system`), but for the convenience of copy-pasting the commands I've left it there.

If you have Splunk installed in your cluster, you can probably use the following search query to get a similar result:

```shell
sourcetype="kube:container:traefik"
```

With access to the logs of traefik, it should be easy (or at least easier!) to debug your problems.
