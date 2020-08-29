# Deploy a Canary version with Service Mesh

Canary deployments can be managed with OpenShift Service Mesh (Istio).

### Overview

The new version of Songs adds a YouTube preview to show in the Lyrics Page.

So as a result of doing a Canary deployment, sometimes the YouTube preview will appear and sometimes it won't.

This situation can be observed in Kiali too:

![canary](../images/canary.png)

### Prerequisites

* OpenShift (4.2 or higher)
* OpenShift Pipelines
* OpenShift Service Mesh
* Tekton CLI (tkn)

### Usage

#### Right Lyrics (with Songs 1.2)

Create the project to deploy the services:

```bash
oc create namespace right-lyrics
```

Deploy the application from a template:

```bash
oc process -f right-lyrics.yaml -p NAMESPACE=right-lyrics -p WILDCARD_DOMAIN=<complete.your.wildcard.domain> | oc apply -f - -n right-lyrics
```

#### Right Lyrics (with Songs 1.3)

##### Karpenter

The pipelines use Karpenter tasks for the clone, build and deploy tasks.

```bash
kubectl apply -f https://raw.githubusercontent.com/leandroberetta/karpenter/master/tasks/git/git.yaml -n right-lyrics
kubectl apply -f https://raw.githubusercontent.com/leandroberetta/karpenter/master/tasks/s2i/s2i.yaml -n right-lyrics
kubectl apply -f https://raw.githubusercontent.com/leandroberetta/karpenter/master/tasks/kubectl/kubectl.yaml -n right-lyrics
```

##### Pipelines

Create extra resources for the pipelines:

```bash
echo "apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: source
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 1Gi" | kubectl apply -f - -n right-lyrics
```

Create Songs pipeline:

```bash
kubectl apply -f pipelines/songs-pipeline.yaml -n right-lyrics
```

Start Songs pipeline to deploy the new version (1.3):

```bash
tkn pipeline start songs-pipeline \
  -w name=source,claimName=source,subPath=songs \
  -p GIT_REPOSITORY=https://github.com/leandroberetta/right-lyrics \
  -p GIT_REVISION=master \
  -p IMAGE=image-registry.openshift-image-registry.svc.cluster.local:5000/right-lyrics/songs-service:1.3 \
  -p OVERLAY=prod \
  --showlog \
  -n right-lyrics
```

