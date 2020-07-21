#!/user/bin/env bash

minikube start --memory=8g --insecure-registry "example.org" --driver=hyperkit --container-runtime=cri-o

minikube addons enable registry
minikube addons enable registry-aliases
minikube addons enable ingress

kubectl apply --filename https://storage.googleapis.com/tekton-releases/pipeline/latest/release.notags.yaml

kubectl create namespace right-lyrics

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

kubectl create secret generic redhat-credentials \
    --from-file=.dockerconfigjson=auth.json \
    --type=kubernetes.io/dockerconfigjson -n right-lyrics

kubectl patch sa default -p '{"imagePullSecrets": [{"name": "redhat-credentials"}]}' -n right-lyrics

kubectl apply -f https://raw.githubusercontent.com/leandroberetta/karpenter/master/tasks/git/git.yaml -n right-lyrics
kubectl apply -f https://raw.githubusercontent.com/leandroberetta/karpenter/master/tasks/s2i/s2i.yaml -n right-lyrics
kubectl apply -f https://raw.githubusercontent.com/leandroberetta/karpenter/master/tasks/npm/npm.yaml -n right-lyrics
kubectl apply -f https://raw.githubusercontent.com/leandroberetta/karpenter/master/tasks/kubectl/kubectl.yaml -n right-lyrics

kubectl apply -f albums-service/k8s/overlays/dev/albums-pipeline.yaml -n right-lyrics

tkn pipeline start albums-pipeline \
  -s pipeline \
  -w name=source,claimName=source,subPath=albums \
  -p GIT_REPOSITORY=https://github.com/leandroberetta/right-lyrics \
  -p GIT_REVISION=master \
  -n right-lyrics \
  --showlog 

kubectl apply -f hits-service/k8s/overlays/dev/hits-pipeline.yaml -n right-lyrics

tkn pipeline start hits-pipeline \
  -s pipeline \
  -w name=source,claimName=source,subPath=hits \
  -p GIT_REPOSITORY=https://github.com/leandroberetta/right-lyrics \
  -p GIT_REVISION=master \
  -n right-lyrics \
  --showlog 

kubectl apply -f lyrics-service/k8s/overlays/dev/lyrics-pipeline.yaml -n right-lyrics

tkn pipeline start lyrics-pipeline \
  -s pipeline \
  -w name=source,claimName=source,subPath=lyrics \
  -p GIT_REPOSITORY=https://github.com/leandroberetta/right-lyrics \
  -p GIT_REVISION=master \
  -n right-lyrics \
  --showlog 
  
kubectl apply -f lyrics-page/k8s/overlays/dev/page-pipeline.yaml -n right-lyrics

tkn pipeline start page-pipeline \
  -s pipeline \
  -w name=source,claimName=source,subPath=page \
  -p GIT_REPOSITORY=https://github.com/leandroberetta/right-lyrics \
  -p GIT_REVISION=master \
  -n right-lyrics \
  --showlog 
