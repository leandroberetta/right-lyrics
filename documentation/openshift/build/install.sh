#!/user/bin/env bash

# INT

oc create namespace right-lyrics-int

echo "apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: source
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 1Gi" | oc apply -f - -n right-lyrics-int

oc create secret generic redhat-credentials \
    --from-file=.dockerconfigjson=auth.json \
    --type=kubernetes.io/dockerconfigjson -n right-lyrics-int

oc secret link default redhat-credentials --for=pull -n right-lyrics-int

oc apply -f https://raw.githubusercontent.com/leandroberetta/karpenter/master/tasks/git/git.yaml -n right-lyrics-int
oc apply -f https://raw.githubusercontent.com/leandroberetta/karpenter/master/tasks/s2i/s2i.yaml -n right-lyrics-int
oc apply -f https://raw.githubusercontent.com/leandroberetta/karpenter/master/tasks/npm/npm.yaml -n right-lyrics-int
oc apply -f https://raw.githubusercontent.com/leandroberetta/karpenter/master/tasks/kubectl/kubectl.yaml -n right-lyrics-int

oc apply -f albums-service/k8s/overlays/int/pipeline.yaml -n right-lyrics-int

tkn pipeline start albums-pipeline -w name=source,claimName=source,subPath=albums -n right-lyrics-int
