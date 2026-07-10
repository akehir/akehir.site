# How to do a HTTPS Redirect with Kubernetes Traefik Ingress and get automatic HTTPS Certificates with LetsEncrypt and Infomaniak with a ClusterIssuer

This blog post explores an end-to-end setup of how to automatically generate https certificates on Kubernetes ingresses with the Traefik Ingress controller.

## HTTPS Redirect

In order to redirect an ingress to https, first we have tho create the Traefik Middleware handling the redirect.

**Important:** The apiVersion string is different for Traefik v3. The below applies to Traefik V3; if you're using Traefik V2, then the apiVersion needs to be specified as follows: `apiVersion: traefik.containo.us/v1alpha1`.

````
```yaml
---
apiVersion: traefik.io/v1alpha1
kind: Middleware
metadata:
  name: redirect-https
  namespace: default
spec:
  redirectScheme:
    scheme: https
    permanent: true
---
````

## Ingress Config

With a ClusterIssuer (see below) and the redirect configured, any ingress can be configured to use https (and to redirect all traffik to https) with the following 2 annotations. To use the http challenge instead of the dns challenge, in my setup I just have to change the cluster-issuer to the following: `cert-manager.io/cluster-issuer: letsencrypt-http`.
Overall it's a relatively simple and lean setup to automatically generate certificates via Kubernetes.

```yaml
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: foo-ingress
  namespace: foo
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt
    traefik.ingress.kubernetes.io/router.middlewares: default-redirect-https@kubernetescrd
---
```

## HTTPS Certificates with ClusterIssuer and Infomaniak

The setup for the ClusterIssuer is minimal, provided the required secrets are created. The below are examples for the `dns01` and the `http01` solvers; this allows for https certificates to be generated either via http or via dns challenge. The dns challenge is more powerful, but requires the dns provider to support cert-manager (or at least the cert-manager-webhook). The advantage of the http challenge is that you don't even need to have access to the DNS zone of the domain (so you don't need to be a domain owner). That simplifies the setup.

```yaml
---
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt
spec:
  acme:
    email: 'raphael@akehir.com'
    server: 'https://acme-v02.api.letsencrypt.org/directory'
    privateKeySecretRef:
      name: letsencrypt
    solvers:
      - dns01:
          webhook:
            groupName: acme.infomaniak.com
            solverName: infomaniak
            config:
              apiTokenSecretRef:
                name: infomaniak-api-credentials
                key: api-token
---
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-http
spec:
  acme:
    email: 'raphael@akehir.com'
    server: 'https://acme-v02.api.letsencrypt.org/directory'
    privateKeySecretRef:
      name: letsencrypt-http
    solvers:
      - http01:
          ingress:
            class: traefik
---
```

## Infomaniak WebHook Setup

The below yaml is basically the result of following the instructions by [Infomaniak on Github](https://github.com/Infomaniak/cert-manager-webhook-infomaniak). I created the necessary secrets and applied the below config to have an Infomaniak ClusterIssuer running. It has been solving Letsencrypt https certificates with the dns challenge just nicely.

```yaml
---
# Source: infomaniak-webhook/templates/namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: 'cert-manager-infomaniak'
  labels:
    app: infomaniak-webhook
    chart: infomaniak-webhook-0.2.0
    release: infomaniak-webhook
    heritage: Helm
---
# Source: infomaniak-webhook/templates/rbac.yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: infomaniak-webhook
  namespace: 'cert-manager-infomaniak'
  labels:
    app: infomaniak-webhook
    chart: infomaniak-webhook-0.2.0
    release: infomaniak-webhook
    heritage: Helm
---
# Source: infomaniak-webhook/templates/rbac.yaml
# Grant cert-manager permission to validate using our apiserver
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: infomaniak-webhook:domain-solver
  labels:
    app: infomaniak-webhook
    chart: infomaniak-webhook-0.2.0
    release: infomaniak-webhook
    heritage: Helm
rules:
  - apiGroups:
      - acme.infomaniak.com
    resources:
      - '*'
    verbs:
      - 'create'
---
# Source: infomaniak-webhook/templates/rbac.yaml
# apiserver gets the auth-delegator role to delegate auth decisions to
# the core apiserver
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: infomaniak-webhook:auth-delegator
  labels:
    app: infomaniak-webhook
    chart: infomaniak-webhook-0.2.0
    release: infomaniak-webhook
    heritage: Helm
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: system:auth-delegator
subjects:
  - apiGroup: ''
    kind: ServiceAccount
    name: infomaniak-webhook
    namespace: cert-manager-infomaniak
---
# Source: infomaniak-webhook/templates/rbac.yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: infomaniak-webhook:domain-solver
  labels:
    app: infomaniak-webhook
    chart: infomaniak-webhook-0.2.0
    release: infomaniak-webhook
    heritage: Helm
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: infomaniak-webhook:domain-solver
subjects:
  - apiGroup: ''
    kind: ServiceAccount
    name: cert-manager
    namespace: cert-manager
# Role to access infomaniak-webhook secrets
---
# Source: infomaniak-webhook/templates/rbac.yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: infomaniak-webhook:secret-reader
  namespace: cert-manager
  labels:
    app: infomaniak-webhook
    chart: infomaniak-webhook-0.2.0
    release: infomaniak-webhook
    heritage: Helm
rules:
  - apiGroups: ['']
    resources:
      - 'secrets'
    resourceNames: [infomaniak-api-credentials]
    verbs:
      - 'get'
      - 'watch'
      - 'list'
# Allow infomaniak-webhook ServiceAccount to read its secrets
---
# Source: infomaniak-webhook/templates/rbac.yaml
# Grant the webhook permission to read the ConfigMap containing the Kubernetes
# apiserver's requestheader-ca-certificate.
# This ConfigMap is automatically created by the Kubernetes apiserver.
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: infomaniak-webhook:webhook-authentication-reader
  namespace: kube-system
  labels:
    app: infomaniak-webhook
    chart: infomaniak-webhook-0.2.0
    release: infomaniak-webhook
    heritage: Helm
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: Role
  name: extension-apiserver-authentication-reader
subjects:
  - apiGroup: ''
    kind: ServiceAccount
    name: infomaniak-webhook
    namespace: cert-manager-infomaniak
---
# Source: infomaniak-webhook/templates/rbac.yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: infomaniak-webhook:secret-reader
  namespace: cert-manager
  labels:
    app: infomaniak-webhook
    chart: infomaniak-webhook-0.2.0
    release: infomaniak-webhook
    heritage: Helm
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: Role
  name: infomaniak-webhook:secret-reader
subjects:
  - apiGroup: ''
    kind: ServiceAccount
    name: infomaniak-webhook
    namespace: cert-manager-infomaniak
---
# Source: infomaniak-webhook/templates/service.yaml
apiVersion: v1
kind: Service
metadata:
  name: infomaniak-webhook
  namespace: 'cert-manager-infomaniak'
  labels:
    app: infomaniak-webhook
    chart: infomaniak-webhook-0.2.0
    release: infomaniak-webhook
    heritage: Helm
spec:
  type: ClusterIP
  ports:
    - port: 443
      targetPort: https
      protocol: TCP
      name: https
  selector:
    app: infomaniak-webhook
    release: infomaniak-webhook
---
# Source: infomaniak-webhook/templates/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: infomaniak-webhook
  namespace: 'cert-manager-infomaniak'
  labels:
    app: infomaniak-webhook
    chart: infomaniak-webhook-0.2.0
    release: infomaniak-webhook
    heritage: Helm
spec:
  replicas: 1
  selector:
    matchLabels:
      app: infomaniak-webhook
      release: infomaniak-webhook
  template:
    metadata:
      labels:
        app: infomaniak-webhook
        release: infomaniak-webhook
    spec:
      affinity:
        nodeAffinity:
          preferredDuringSchedulingIgnoredDuringExecution:
            - weight: 1
              preference:
                matchExpressions:
                  - key: kubernetes.io/arch
                    operator: In
                    values:
                      - amd64
      serviceAccountName: infomaniak-webhook
      containers:
        - name: infomaniak-webhook
          image: 'ghcr.io/infomaniak/cert-manager-webhook-infomaniak:latest'
          imagePullPolicy: IfNotPresent
          args:
            - --v=2
            - --tls-cert-file=/tls/tls.crt
            - --tls-private-key-file=/tls/tls.key
          env:
            - name: GROUP_NAME
              value: 'acme.infomaniak.com'
          ports:
            - name: https
              containerPort: 443
              protocol: TCP
          livenessProbe:
            httpGet:
              scheme: HTTPS
              path: /healthz
              port: https
          readinessProbe:
            httpGet:
              scheme: HTTPS
              path: /healthz
              port: https
          volumeMounts:
            - name: certs
              mountPath: /tls
              readOnly: true
          resources: {}
      volumes:
        - name: certs
          secret:
            secretName: infomaniak-webhook-webhook-tls
---
# Source: infomaniak-webhook/templates/apiservice.yaml
apiVersion: apiregistration.k8s.io/v1
kind: APIService
metadata:
  name: v1alpha1.acme.infomaniak.com
  labels:
    app: infomaniak-webhook
    chart: infomaniak-webhook-0.2.0
    release: infomaniak-webhook
    heritage: Helm
  annotations:
    cert-manager.io/inject-ca-from: 'cert-manager-infomaniak/infomaniak-webhook-webhook-tls'
spec:
  group: acme.infomaniak.com
  groupPriorityMinimum: 1000
  versionPriority: 15
  service:
    name: infomaniak-webhook
    namespace: cert-manager-infomaniak
  version: v1alpha1
---
# Source: infomaniak-webhook/templates/pki.yaml
# Generate a CA Certificate used to sign certificates for the webhook
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: infomaniak-webhook-ca
  namespace: 'cert-manager-infomaniak'
  labels:
    app: infomaniak-webhook
    chart: infomaniak-webhook-0.2.0
    release: infomaniak-webhook
    heritage: Helm
spec:
  secretName: infomaniak-webhook-ca
  duration: 43800h
  issuerRef:
    name: infomaniak-webhook-selfsign
  commonName: 'ca.infomaniak-webhook.cert-manager'
  isCA: true
---
# Source: infomaniak-webhook/templates/pki.yaml
# Finally, generate a serving certificate for the webhook to use
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: infomaniak-webhook-webhook-tls
  namespace: 'cert-manager-infomaniak'
  labels:
    app: infomaniak-webhook
    chart: infomaniak-webhook-0.2.0
    release: infomaniak-webhook
    heritage: Helm
spec:
  secretName: infomaniak-webhook-webhook-tls
  duration: 8760h
  issuerRef:
    name: infomaniak-webhook-ca
  dnsNames:
    - infomaniak-webhook
    - infomaniak-webhook.cert-manager-infomaniak
    - infomaniak-webhook.cert-manager-infomaniak.svc
---
# Source: infomaniak-webhook/templates/pki.yaml
# Create a selfsigned Issuer, in order to create a root CA certificate for
# signing webhook serving certificates
apiVersion: cert-manager.io/v1
kind: Issuer
metadata:
  name: infomaniak-webhook-selfsign
  namespace: 'cert-manager-infomaniak'
  labels:
    app: infomaniak-webhook
    chart: infomaniak-webhook-0.2.0
    release: infomaniak-webhook
    heritage: Helm
spec:
  selfSigned: {}
---
# Source: infomaniak-webhook/templates/pki.yaml
# Create an Issuer that uses the above generated CA certificate to issue certs
apiVersion: cert-manager.io/v1
kind: Issuer
metadata:
  name: infomaniak-webhook-ca
  namespace: 'cert-manager-infomaniak'
  labels:
    app: infomaniak-webhook
    chart: infomaniak-webhook-0.2.0
    release: infomaniak-webhook
    heritage: Helm
spec:
  ca:
    secretName: infomaniak-webhook-ca
---
```
