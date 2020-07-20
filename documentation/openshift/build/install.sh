#!/user/bin/env bash

# INT

oc create namespace right-lyrics

echo "apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: source
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 1Gi" | oc apply -f - -n right-lyrics

oc create secret generic redhat-credentials \
    --from-file=.dockerconfigjson=$HOME/dev/auth.json \
    --type=kubernetes.io/dockerconfigjson -n right-lyrics

oc secret link default redhat-credentials --for=pull -n right-lyrics

oc apply -f https://raw.githubusercontent.com/leandroberetta/karpenter/master/tasks/git/git.yaml -n right-lyrics
oc apply -f https://raw.githubusercontent.com/leandroberetta/karpenter/master/tasks/s2i/s2i.yaml -n right-lyrics
oc apply -f https://raw.githubusercontent.com/leandroberetta/karpenter/master/tasks/npm/npm.yaml -n right-lyrics
oc apply -f https://raw.githubusercontent.com/leandroberetta/karpenter/master/tasks/kubectl/kubectl.yaml -n right-lyrics

oc apply -f albums-service/k8s/pipeline.yaml -n right-lyrics

tkn pipeline start albums-pipeline -n right-lyrics \
  -w name=source,claimName=source,subPath=albums \
  -p GIT_REPOSITORY=https://github.com/leandroberetta/right-lyrics \
  -p GIT_REVISION=master \
  -p OVERLAY=int \
  -p IMAGE=image-registry.openshift-image-registry.svc:5000/right-lyrics/albums-service:latest
