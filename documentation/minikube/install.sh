#!/user/bin/env bash

minikube start --memory=8g --insecure-registry "example.org" --driver=hyperkit

minikube addons enable registry
minikube addons enable registry-aliases
minikube addons enable ingress

kubectl apply -f https://storage.googleapis.com/tekton-releases/pipeline/latest/release.yaml
kubectl apply -f https://github.com/tektoncd/dashboard/releases/latest/download/tekton-dashboard-release.yaml

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

kubectl create secret generic redhat-credentials \
    --from-file=.dockerconfigjson=auth.json \
    --type=kubernetes.io/dockerconfigjson -n right-lyrics

kubectl patch sa default -p '{"imagePullSecrets": [{"name": "redhat-credentials"}]}' -n right-lyrics

kubectl apply -f https://raw.githubusercontent.com/leandroberetta/karpenter/master/tasks/git/git.yaml -n right-lyrics
kubectl apply -f https://raw.githubusercontent.com/leandroberetta/karpenter/master/tasks/s2i/s2i.yaml -n right-lyrics
kubectl apply -f https://raw.githubusercontent.com/leandroberetta/karpenter/master/tasks/npm/npm.yaml -n right-lyrics
kubectl apply -f https://raw.githubusercontent.com/leandroberetta/karpenter/master/tasks/kubectl/kubectl.yaml -n right-lyrics

echo "$(minikube ip) right.lyrics" | sudo tee -a /etc/hosts

kubectl apply -f albums-service/k8s/overlays/dev/pipeline.yaml -n right-lyrics

kubectl apply -f hits-service/k8s/overlays/local/pipeline.yaml -n right-lyrics
kubectl apply -f songs-service/k8s/overlays/local/pipeline.yaml -n right-lyrics
kubectl apply -f lyrics-service/k8s/overlays/local/pipeline.yaml -n right-lyrics
kubectl apply -f lyrics-page/k8s/overlays/local/pipeline.yaml -n right-lyrics

tkn pipeline start albums-pipeline \
  -n right-lyrics \ 
  -s build-bot \
  -w name=source,claimName=source,subPath=albums \
  -p GIT_REPOSITORY=http://github.com/leandroberetta/right-lyrics \
  -p GIT_REVISION=master 

tkn pipeline start hits-pipeline -s build-bot -w name=source,claimName=source,subPath=hits -n right-lyrics
tkn pipeline start songs-pipeline -s build-bot -w name=source,claimName=source,subPath=songs -n right-lyrics
tkn pipeline start lyrics-pipeline -s build-bot -w name=source,claimName=source,subPath=lyrics -n right-lyrics
tkn pipeline start albums-pipeline -s build-bot -w name=source,claimName=source,subPath=albums -n right-lyrics
tkn pipeline start page-pipeline -s build-bot -w name=source,claimName=source,subPath=page -n right-lyrics

watch kubectl get pods --field-selector=status.phase=Running -n right-lyrics
