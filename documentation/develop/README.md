# Developing Right Lyrics

Right Lyrics can be developed locally on Minikube deploying the services (and its related dependencies) using:

* Tekton Pipelines
* Karpenter tasks
* Kustomize Manifests

## Prerequisites

* Minikube (and some addons) installed
* A namespace to deploy the services (**right-lyrics**)
* Tekton pipelines installed
* Tekton CLI (tkn) installed
* Karpenter tasks created in the **right-lyrics** namespace
* A secret for pulling Red Hat images

### Minikube

```bash
minikube start --memory=8g --insecure-registry "example.org" --driver=hyperkit

minikube addons enable registry
minikube addons enable registry-aliases
```

### Namespace

```bash
kubectl create namespace right-lyrics

echo "apiVersion: v1
kind: ServiceAccount
metadata:
  name: build-bot" | kubectl apply -f - -n right-lyrics

echo "apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: build-bot-edit
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: edit
subjects:
  - kind: ServiceAccount
    name: build-bot" | kubectl apply -f - -n right-lyrics
```

### Tekton

```bash
kubectl apply -f https://storage.googleapis.com/tekton-releases/pipeline/latest/release.yaml
kubectl apply -f https://github.com/tektoncd/dashboard/releases/latest/download/tekton-dashboard-release.yaml
```

### Karpenter

```bash
kubectl apply -f https://raw.githubusercontent.com/leandroberetta/karpenter/master/tasks/git/git.yaml -n right-lyrics
kubectl apply -f https://raw.githubusercontent.com/leandroberetta/karpenter/master/tasks/s2i/s2i.yaml -n right-lyrics
kubectl apply -f https://raw.githubusercontent.com/leandroberetta/karpenter/master/tasks/buildah/buildah.yaml -n right-lyrics
kubectl apply -f https://raw.githubusercontent.com/leandroberetta/karpenter/master/tasks/kubectl/kubectl.yaml -n right-lyrics
kubectl apply -f https://raw.githubusercontent.com/leandroberetta/karpenter/master/tasks/mvn/mvn.yaml -n right-lyrics
```

### Secret

The following secret contains a **config.json** file with the token needed to authenticate to **registry.redhat.io** where the base images used by Right Lyris are stored.

To generate this file, the recommended approach is as follows:

```bash
minikube ssh

docker login registry.redhat.io
```

Complete the username and password and then get the content of the **config.json** file located in */home/docker/.docker/config.json* and create the file needed by the secret (in the example is called **auth.json**).

```bash
kubectl create secret generic redhat-credentials \
    --from-file=.dockerconfigjson=auth.json \
    --type=kubernetes.io/dockerconfigjson -n right-lyrics

kubectl patch sa default -p '{"imagePullSecrets": [{"name": "redhat-credentials"}]}' -n right-lyrics
```

## Building the Microservices

* [Hits Service](../../hits-service/README.md)
* [Songs Service](../../songs-service/README.md)
* [Lyrics Service](../../lyrics-service/README.md)
* [Albums Service](../../albums-service/README.md)