#!/user/bin/env bash

#
# Minikube
#

minikube start --memory=8g --insecure-registry "example.org" --driver=hyperkit --container-runtime=cri-o

minikube addons enable registry
minikube addons enable registry-aliases
minikube addons enable ingress

#
# Tekton
#

kubectl apply --filename https://storage.googleapis.com/tekton-releases/pipeline/latest/release.notags.yaml

#
# Right Lyrics
#

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

#
# Keycloak
#

kubectl apply -k ./keycloak/k8s/overlays/dev -n right-lyrics

#
# Karpenter
#

kubectl apply -f https://raw.githubusercontent.com/leandroberetta/karpenter/master/tasks/git/git.yaml -n right-lyrics
kubectl apply -f https://raw.githubusercontent.com/leandroberetta/karpenter/master/tasks/s2i/s2i.yaml -n right-lyrics
kubectl apply -f https://raw.githubusercontent.com/leandroberetta/karpenter/master/tasks/npm/npm.yaml -n right-lyrics
kubectl apply -f https://raw.githubusercontent.com/leandroberetta/karpenter/master/tasks/kubectl/kubectl.yaml -n right-lyrics

#
# Pipelines (DEV)
#

kubectl apply -f albums-service/k8s/base/albums-pipeline.yaml -n right-lyrics
kubectl apply -f hits-service/k8s/base/hits-pipeline.yaml -n right-lyrics
kubectl apply -f lyrics-service/k8s/base/lyrics-pipeline.yaml -n right-lyrics
kubectl apply -f songs-service/k8s/base/songs-pipeline.yaml -n right-lyrics
kubectl apply -f import-service/k8s/base/import-pipeline.yaml -n right-lyrics
kubectl apply -f lyrics-ui/k8s/base/ui-pipeline.yaml -n right-lyrics

tkn pipeline start albums-pipeline \
  -s pipeline \
  -w name=source,claimName=source,subPath=albums \
  -p GIT_REPOSITORY=https://github.com/leandroberetta/right-lyrics \
  -p GIT_REVISION=master \
  -p IMAGE=example.org/right-lyrics/albums-service:latest \
  -p OVERLAY=dev \
  -n right-lyrics

tkn pipeline start hits-pipeline \
  -s pipeline \
  -w name=source,claimName=source,subPath=hits \
  -p GIT_REPOSITORY=https://github.com/leandroberetta/right-lyrics \
  -p GIT_REVISION=master \
  -p IMAGE=example.org/right-lyrics/hits-service:latest \
  -p OVERLAY=dev \
  -n right-lyrics

tkn pipeline start lyrics-pipeline \
  -s pipeline \
  -w name=source,claimName=source,subPath=lyrics \
  -p GIT_REPOSITORY=https://github.com/leandroberetta/right-lyrics \
  -p GIT_REVISION=master \
  -p IMAGE=example.org/right-lyrics/lyrics-service:latest \
  -p OVERLAY=dev \
  -n right-lyrics

tkn pipeline start songs-pipeline \
  -s pipeline \
  -w name=source,claimName=source,subPath=songs \
  -p GIT_REPOSITORY=https://github.com/leandroberetta/right-lyrics \
  -p GIT_REVISION=master \
  -p IMAGE=example.org/right-lyrics/songs-service:latest \
  -p OVERLAY=dev \
  -n right-lyrics

tkn pipeline start import-pipeline \
  -s pipeline \
  -w name=source,claimName=source,subPath=import \
  -p GIT_REPOSITORY=https://github.com/leandroberetta/right-lyrics \
  -p GIT_REVISION=master \
  -p IMAGE=example.org/right-lyrics/import-service:latest \
  -p OVERLAY=dev \
  -n right-lyrics

tkn pipeline start ui-pipeline \
  -s pipeline \
  -w name=source,claimName=source,subPath=ui \
  -p GIT_REPOSITORY=https://github.com/leandroberetta/right-lyrics \
  -p GIT_REVISION=master \
  -p IMAGE=example.org/right-lyrics/lyrics-ui:latest \
  -p OVERLAY=dev \
  -n right-lyrics

