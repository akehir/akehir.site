# Kubernetes Dashboard without Kong Proxy (nginx bind to port 8444 failed)

With updating k3s to the newest version (`1.32.3`), my Kubernetes Dashboard (installed via Helm chart) stopped working. The reason was the Kong Proxy pod nod starting anymore.

Checking the logs led me to the following error:

```
nginx: [emerg] bind() to [::1]:8444 failed (99: Cannot assign requested address)
```

The error was also reported on [Github Issue #8765](https://github.com/kubernetes/dashboard/issues/8765), with the resolution to disable the Kong Proxy as it is not required. This means I had to disable the Kong Proxy in my `values.yaml` and update the ingresses for the Kong Proxy.

## Update Kubernetes Dashboard Ingresses to not use Kong Proxy

The Kubernetes Dashboard Ingresses can be updated to not use the Kong Proxy (I had to add the `/api` Ingress and change the `/` ingress from the Kong Proxy to the web service).

```yaml
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: kubernetes-dashboard-ingress
  namespace: kubernetes-dashboard
spec:
  ingressClassName: traefik
  rules:
    - host: kockpit.k8s
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: kubernetes-dashboard-web
                port:
                  number: 8000
          - path: /api
            pathType: Prefix
            backend:
              service:
                name: kubernetes-dashboard-api
                port:
                  number: 8000
---
```

## Disable Kong Proxy via Helm Chart

And disable the Kong Proxy via values:

```yaml
---
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: kubernetes-dashboard
  namespace: kubernetes-dashboard
spec:
  releaseName: kubernetes-dashboard
  chart:
    spec:
      chart: kubernetes-dashboard
      sourceRef:
        kind: HelmRepository
        name: kubernetes-dashboard
        namespace: kubernetes-dashboard
  interval: 1h0m0s
  install:
    remediation:
      retries: 3
  values:
    kong:
      enabled: false
---
```

## Login

Now it was _almost_ possible to use the kubernetes dashboard normally. However, the login didn't fully work anymore. To login without using the Kong Proxy, you need to do the following:

First, create a token normally:

```shell
kubectl -n kubernetes-dashboard create token admin-user
```

And then with the generated token, use it to create a cookie named `token` with the value of the JWT provided by the above command.

With the cookie setup, it should be possible to use the Kubernetes Dashboard without the normal authentication flow (which gives a 404 with my setup).

## Alternative Resolution Changing the Bind Address

Another resolution of a duplicate of the issue ([issue #9052](https://github.com/kubernetes/dashboard/issues/9052)) recommends setting the following:

```yaml
proxy:
  addresses:
    - '127.0.0.1'
admin:
  addresses:
    - '127.0.0.1'
```

I haven't tried this myself, as I'm quite happy to have 1 component less running for the Kubernetes Dashboard (especially if it is not required). But it's a promising solution for those needing to continue running the Kong Proxy.
