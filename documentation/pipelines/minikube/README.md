# Deploy in Minikube (DEV) with Tekton Pipelines

Right Lyrics can be developed locally on Minikube building and deploying the services (and its related dependencies) using:

* Tekton Pipelines
* Karpenter Tasks
* Kustomize Manifests

A Postman collection is available for testing the services:

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/c9b134cf391caba635d7)

### Prerequisites

* Minikube
* Tekton CLI (tkn)

### Usage

#### Minikube

Start a Minikube instance:

```bash
minikube start --memory=8g --insecure-registry "example.org" --driver=hyperkit --container-runtime=cri-o
```

Notes:

* An internal registry (example.org) will be used to store the built images
* Hypekit is used for macOS, change to other virtualization driver based on the base OS
* CRI-O will be used as the container technology

Then install some addons:

```bash
minikube addons enable registry
minikube addons enable registry-aliases
minikube addons enable ingress
```

The *registry* and *registry-aliases* addons provides the registry service to store the built images. 

The *ingress* provides the entry point to the cluster (port 80 and 443). To use the application, add an entry to the */etc/hosts* file to map a host name with the minikube ip.

```bash  
echo "$(minikube ip) right.lyrics" | sudo tee -a /etc/hosts
```

#### Tekton

Install Tekton Pipelines with the following command:

```bash
kubectl apply --filename https://storage.googleapis.com/tekton-releases/pipeline/latest/release.notags.yaml
```

#### Right Lyrics

Create the namespace to deploy the services:

```bash
kubectl create namespace right-lyrics
```

Create extra resources for the pipelines:

```bash
echo "apiVersion: v1
kind: ServiceAccount
metadata:
  name: pipeline" | kubectl apply -f - -n right-lyrics

echo "apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: pipeline-edit
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: edit
subjects:
  - kind: ServiceAccount
    name: pipeline" | kubectl apply -f - -n right-lyrics

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

##### Keycloak

Keycloak is used to provide authentication and authorization.

```bash
kubectl apply -k ./keycloak/k8s/overlays/dev -n right-lyrics
```

##### Karpenter

The pipelines use Karpenter tasks for the clone, build and deploy tasks.

```bash
kubectl apply -f https://raw.githubusercontent.com/leandroberetta/karpenter/master/tasks/git/git.yaml -n right-lyrics
kubectl apply -f https://raw.githubusercontent.com/leandroberetta/karpenter/master/tasks/s2i/s2i.yaml -n right-lyrics
kubectl apply -f https://raw.githubusercontent.com/leandroberetta/karpenter/master/tasks/kubectl/kubectl.yaml -n right-lyrics
```

##### Pipelines

Create the pipelines:

```bash
kubectl apply -f pipelines -n right-lyrics
````

Start Albums pipeline:

```bash
tkn pipeline start albums-pipeline \
  -s pipeline \
  -w name=source,claimName=source,subPath=albums \
  -p GIT_REPOSITORY=https://github.com/leandroberetta/right-lyrics \
  -p GIT_REVISION=master \
  -p IMAGE=example.org/right-lyrics/albums-service:latest \
  -p OVERLAY=dev \
  --showlog \
  -n right-lyrics
```

Start Hits pipeline:

```bash
tkn pipeline start hits-pipeline \
  -s pipeline \
  -w name=source,claimName=source,subPath=hits \
  -p GIT_REPOSITORY=https://github.com/leandroberetta/right-lyrics \
  -p GIT_REVISION=master \
  -p IMAGE=example.org/right-lyrics/hits-service:latest \
  -p OVERLAY=dev \
  --showlog \
  -n right-lyrics
```

Start Lyrics pipeline:

```bash
tkn pipeline start lyrics-pipeline \
  -s pipeline \
  -w name=source,claimName=source,subPath=lyrics \
  -p GIT_REPOSITORY=https://github.com/leandroberetta/right-lyrics \
  -p GIT_REVISION=master \
  -p IMAGE=example.org/right-lyrics/lyrics-service:latest \
  -p OVERLAY=dev \
  --showlog \
  -n right-lyrics
```

Start Songs pipeline:

```bash
tkn pipeline start songs-pipeline \
  -s pipeline \
  -w name=source,claimName=source,subPath=songs \
  -p GIT_REPOSITORY=https://github.com/leandroberetta/right-lyrics \
  -p GIT_REVISION=master \
  -p IMAGE=example.org/right-lyrics/songs-service:latest \
  -p OVERLAY=dev \
  --showlog \
  -n right-lyrics
```

Start Import pipeline:

```bash
tkn pipeline start import-pipeline \
  -s pipeline \
  -w name=source,claimName=source,subPath=import \
  -p GIT_REPOSITORY=https://github.com/leandroberetta/right-lyrics \
  -p GIT_REVISION=master \
  -p IMAGE=example.org/right-lyrics/import-service:latest \
  -p OVERLAY=dev \
  --showlog \
  -n right-lyrics
```

Start Page pipeline:

```bash
tkn pipeline start page-pipeline \
  -s pipeline \
  -w name=source,claimName=source,subPath=page \
  -p GIT_REPOSITORY=https://github.com/leandroberetta/right-lyrics \
  -p GIT_REVISION=master \
  -p IMAGE=example.org/right-lyrics/lyrics-page:latest \
  -p OVERLAY=dev \
  --showlog \
  -n right-lyrics
```

After all the services are up and running, import some data:

```bash
kubectl apply -f import-service/k8s/base/import-configmap.yaml -n right-lyrics
kubectl apply -f import-service/k8s/base/import-job.yaml -n right-lyrics
```

Finally, the application will be available at:

```bash
echo "http://$(kubectl get ingress page -o jsonpath='{.spec.rules[0].host}' -n right-lyrics)"
```