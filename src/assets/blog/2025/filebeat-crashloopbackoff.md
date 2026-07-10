# How to fix filebeat CrashLoopBackoff (due to OOMKiller) by increasing resource limits

I had an issue with my EKS stack running on Kubernetes, where 1 of the pods of filebeat was stuck in a `CrashLoopBackoff`-state. Luckily I discovered that the pod sometimes crashed because of the OOMKiller.

This led me to discover the following issues / questions:

- https://stackoverflow.com/questions/71341773/filebeat-pod-getting-killed-due-to-oom-issue
- https://github.com/elastic/beats/issues/26464

The gist of it is that apparently large log events (bigger than the default memory limits) will trigger the OOMKiller leading to the pod ending up stuck. It's a bit annoying to debug since the pod appears to be working correctly, and only crashes when it encounters a big event.

The resolution is to increase the memory limits (to whatever you're comfortable with). Important is that you allocate more memory than your log events are expected to trigger.

```yaml
resources:
  limits:
    memory: 4Gi
  requests:
    cpu: 100m
    memory: 512Mi
```

## DaemonSet

Below is the full DaemonSet I use for filebeat.
I should still migrate the password to a secret, but otherwise it's working and collecting logs.

```yaml
---
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: filebeat
  namespace: kube-system
  labels:
    k8s-app: filebeat
spec:
  selector:
    matchLabels:
      k8s-app: filebeat
  template:
    metadata:
      labels:
        k8s-app: filebeat
    spec:
      serviceAccountName: filebeat
      terminationGracePeriodSeconds: 30
      hostNetwork: true
      dnsPolicy: ClusterFirstWithHostNet
      containers:
        - name: filebeat
          image: docker.elastic.co/beats/filebeat-wolfi:8.16.0
          args: ['-c', '/etc/filebeat.yml', '-e']
          env:
            - name: ELASTICSEARCH_HOST
              value: quickstart-es-http.elastic-system.svc.cluster.local
            - name: ELASTICSEARCH_PORT
              value: '9200'
            - name: ELASTICSEARCH_USERNAME
              value: elastic
            - name: ELASTICSEARCH_PASSWORD
              value: foo
            - name: NODE_NAME
              valueFrom:
                fieldRef:
                  fieldPath: spec.nodeName
          securityContext:
            runAsUser: 0
          resources:
            limits:
              memory: 4Gi
            requests:
              cpu: 100m
              memory: 512Mi
          volumeMounts:
            - name: config
              mountPath: /etc/filebeat.yml
              readOnly: true
              subPath: filebeat.yml
            - name: data
              mountPath: /usr/share/filebeat/data
            - name: varlibdockercontainers
              mountPath: /var/lib/docker/containers
              readOnly: true
            - name: varlog
              mountPath: /var/log
              readOnly: true
      volumes:
        - name: config
          configMap:
            defaultMode: 0640
            name: filebeat-config
        - name: varlibdockercontainers
          hostPath:
            path: /var/lib/docker/containers
        - name: varlog
          hostPath:
            path: /var/log
        # data folder stores a registry of read status for all files, so we don't send everything again on a Filebeat pod restart
        - name: data
          hostPath:
            # When filebeat runs as non-root user, this directory needs to be writable by group (g+w).
            path: /var/lib/filebeat-data
            type: DirectoryOrCreate
---
```
