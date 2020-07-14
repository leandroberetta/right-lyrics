# Building Right Lyrics

## Minikube

Right Lyrics can be developed locally on Minikube deploying the services (and its related dependencies) using:

* Tekton Pipelines
* Karpenter Tasks
* Kustomize Manifests

A Postman collection is available for testing (with Kubernetes proxy):

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/c9b134cf391caba635d7)

### Prerequisites

* Minikube (and some addons) installed
* A namespace to deploy the services (**right-lyrics**)
* Tekton pipelines installed
* Tekton CLI (tkn) installed
* Karpenter tasks created in the **right-lyrics** namespace
* Some RBAC and PVC configuration needed by the pipelines
* A secret for pulling Red Hat images

#### Minikube

```bash
minikube start --memory=8g --insecure-registry "example.org" --driver=hyperkit

minikube addons enable registry
minikube addons enable registry-aliases
```

#### Namespace and Other Resources

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

#### Tekton

```bash
kubectl apply -f https://storage.googleapis.com/tekton-releases/pipeline/latest/release.yaml
kubectl apply -f https://github.com/tektoncd/dashboard/releases/latest/download/tekton-dashboard-release.yaml
```

#### Karpenter

```bash
kubectl apply -f https://raw.githubusercontent.com/leandroberetta/karpenter/master/tasks/git/git.yaml -n right-lyrics
kubectl apply -f https://raw.githubusercontent.com/leandroberetta/karpenter/master/tasks/s2i/s2i.yaml -n right-lyrics
kubectl apply -f https://raw.githubusercontent.com/leandroberetta/karpenter/master/tasks/kubectl/kubectl.yaml -n right-lyrics
```

#### Pull Secret

**Note**: For this step a free Red Hat Developer Subscription is needed.

The secret contains a **config.json** file with the token needed to authenticate to **registry.redhat.io** where the base images used by Right Lyrics are stored.

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

### Building and Deploying with Pipelines

```bash  
kubectl apply -f hits-service/k8s/overlays/local/pipeline.yaml -n right-lyrics
kubectl apply -f songs-service/k8s/overlays/local/pipeline.yaml -n right-lyrics
kubectl apply -f lyrics-service/k8s/overlays/local/pipeline.yaml -n right-lyrics
kubectl apply -f albums-service/k8s/overlays/local/pipeline.yaml -n right-lyrics

tkn pipeline start hits-pipeline -s build-bot -w name=source,claimName=source,subPath=hits -n right-lyrics
tkn pipeline start songs-pipeline -s build-bot -w name=source,claimName=source,subPath=songs -n right-lyrics
tkn pipeline start lyrics-pipeline -s build-bot -w name=source,claimName=source,subPath=lyrics -n right-lyrics
tkn pipeline start albums-pipeline -s build-bot -w name=source,claimName=source,subPath=albums -n right-lyrics

watch kubectl get pods --field-selector=status.phase=Running
```