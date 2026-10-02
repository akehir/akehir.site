# Using Bitnami Sealed Secrets with Flux on Kubernetes

_Published: 2026-02-22_

I have long planned to setup sealed secrets in order to store the secrets of my apps together with their manifests in order to be able to manage the whole state of my cluster via code repositories.

Until now I've manually added the secrets (or avoided their use). The end goal would be that my flux repository could be public as it shouldn't contain any secret data.

For the longest time, sealed secrets was the missing piece to achieve this.

I have now installed them, and while the installation process is so straightforward that it takes 5 minutes and is barely worth writing about - after the installation I did encounter quite a few roadblocks which I am documenting below.

Here are some initial takeaways:

- Installation is much simpler than I thought
- Usage is as easy as creating 'normal' kubernetes secrets
- If the secrets do not get created, some digging in the logs may be required
- Old secrets need to be deleted before they can be overwritten by the sealed secrets controller
- Secrets can not be unsealed in a different namespace.

Suffice to say, I'm happy that I can now directly commit the sealed secrets to my flux repository to sync them with my cluster. This means I can remove any hardcoded credentials from my flux repo and directly use sealed secrets. This simplifies my config and reduces the risk that a mistake on my part can expose my secret values.

## Usage

Once installed, you can create new sealed secrets as follows:

```
kubeseal --format=yaml --cert=sealed-secrets.pem < ~/path/to/your/secret/your_secret.yaml > ./secrets/your_sealed_secret.yaml

```

So in my case, I use the following base command (to copy paste the command and add the name):

```
kubeseal --format=yaml --cert=sealed-secrets.pem < ~/ake/machina/k8s-cluster-1/secrets/ > ./secrets/
```

## Installation

I followed the guide over at [fluxcd](https://fluxcd.io/flux/guides/sealed-secrets/), which entails setting up the below manifests in flux and installing the `kubeseal` command line from here. No problems here.

```yaml
---
apiVersion: source.toolkit.fluxcd.io/v1
kind: HelmRepository
metadata:
  name: sealed-secrets
  namespace: flux-system
spec:
  interval: 24h0m0s
  url: https://bitnami-labs.github.io/sealed-secrets
---
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: sealed-secrets-controller
  namespace: flux-system
spec:
  releaseName: sealed-secrets-controller
  targetNamespace: flux-system
  chart:
    spec:
      chart: sealed-secrets
      sourceRef:
        kind: HelmRepository
        name: sealed-secrets
        namespace: flux-system
  interval: 1h0m0s
  install:
    crds: Create
    remediation:
      retries: 3
  upgrade:
    crds: CreateReplace
---
```

## Problems and Solutions

### Reviewing the Logs

First, you need to find the name of your pod with:

```
kubectl get pods -n flux-system
```

You should have a `sealed-secrets-controller`, for instance: `sealed-secrets-controller-88748bf4b-5xszv`.

Then you can see the logs with:

```
kubectl logs sealed-secrets-controller-88748bf4b-5xszv -f -n flux-system
```

You will either see the secrets being unsealed successfully (or not). That should give you hints.

You can then get the content of the unsealed secrets via kubectl to verify that they are correct.

First, you can see whether the secret has been created with:

```
kubectl get secret -n your_namespace
```

And then you can verify the content of your secret with:

```
kubectl get secret your_secret_name -n your_namespace -o yaml
```

### Cannot get Certificate

Immediately after installing the sealed secrets controller, I got into a problem when executing the below command to get started:

```
kubeseal --fetch-cert \
--controller-name=sealed-secrets-controller \
--controller-namespace=flux-system \
> pub-sealed-secrets.pem
```

I got the following error:

```
error: cannot fetch certificate: error trying to reach service: proxy error from 127.0.0.1:6443 while dialing 10.42.10.237:8080, code 502: 502 Bad Gateway

```

#### Solution

I found the solution in the discussion on github [here](https://github.com/bitnami-labs/sealed-secrets/issues/368). Just use the following (alternative) command to get the certificate.

```
kubectl get secret \
  --namespace flux-system \
  --selector sealedsecrets.bitnami.com/sealed-secrets-key=active \
  --output jsonpath='{.items[0].data.tls\.crt}' \
| base64 -d
```

**!Important:** Avoid a new line at the end of the file.

### Existing secrets do not get updated

If you are trying to overwrite an existing secret with a sealed secret, it will not be possible, because the sealed-secret annotation is missing. You'll see an error in the sealed secret controller logs. The easiest solution is to first delete any existing secret you might want to overwrite.

First get the secrets:

```
kubectl get secret -n your_namespace
```

And then delete the secrets:

```
kubectl delete secret -n your_namespace your_secret
```

### Secrets can not get unsealed in a different namespace

Seeing the namespace field in the sealed secret might tempt you to change the namespace to unseal the secret in a different namespace (for instance after renaming / moving an app, or part of it).

Unfortunately, that is wrong, and the unsealing will fail. You need to specify the correct namespace before sealing the secret!
