#!/user/bin/env bash

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
    --from-file=.dockerconfigjson=auth.json \
    --type=kubernetes.io/dockerconfigjson -n right-lyrics

oc secret link default redhat-credentials --for=pull -n right-lyrics

oc apply -f https://raw.githubusercontent.com/leandroberetta/karpenter/master/tasks/git/git.yaml -n right-lyrics
oc apply -f https://raw.githubusercontent.com/leandroberetta/karpenter/master/tasks/s2i/s2i.yaml -n right-lyrics
oc apply -f https://raw.githubusercontent.com/leandroberetta/karpenter/master/tasks/npm/npm.yaml -n right-lyrics
oc apply -f https://raw.githubusercontent.com/leandroberetta/karpenter/master/tasks/kubectl/kubectl.yaml -n right-lyrics