#!/user/bin/env bash

#
# Right Lyrics
#

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

#
# Karpenter
#

oc apply -f https://raw.githubusercontent.com/leandroberetta/karpenter/master/tasks/git/git.yaml -n right-lyrics
oc apply -f https://raw.githubusercontent.com/leandroberetta/karpenter/master/tasks/s2i/s2i.yaml -n right-lyrics
oc apply -f https://raw.githubusercontent.com/leandroberetta/karpenter/master/tasks/npm/npm.yaml -n right-lyrics
oc apply -f https://raw.githubusercontent.com/leandroberetta/karpenter/master/tasks/kubectl/kubectl.yaml -n right-lyrics

#
# Pipelines (TEST) 
#

oc apply -f albums-service/k8s/overlays/test/albums-pipeline.yaml -n right-lyrics
oc apply -f hits-service/k8s/overlays/test/hits-pipeline.yaml -n right-lyrics
oc apply -f lyrics-service/k8s/overlays/test/lyrics-pipeline.yaml -n right-lyrics
oc apply -f songs-service/k8s/overlays/test/songs-pipeline.yaml -n right-lyrics
oc apply -f import-service/k8s/overlays/test/import-pipeline.yaml -n right-lyrics
oc apply -f lyrics-ui/k8s/overlays/test/ui-pipeline.yaml -n right-lyrics

tkn pipeline start albums-pipeline \
  -s pipeline \
  -w name=source,claimName=source,subPath=albums \
  -p GIT_REPOSITORY=https://github.com/leandroberetta/right-lyrics \
  -p GIT_REVISION=master \
  -n right-lyrics

tkn pipeline start hits-pipeline \
  -s pipeline \
  -w name=source,claimName=source,subPath=hits \
  -p GIT_REPOSITORY=https://github.com/leandroberetta/right-lyrics \
  -p GIT_REVISION=master \
  -n right-lyrics

tkn pipeline start lyrics-pipeline \
  -s pipeline \
  -w name=source,claimName=source,subPath=lyrics \
  -p GIT_REPOSITORY=https://github.com/leandroberetta/right-lyrics \
  -p GIT_REVISION=master \
  -n right-lyrics

tkn pipeline start songs-pipeline \
  -s pipeline \
  -w name=source,claimName=source,subPath=songs \
  -p GIT_REPOSITORY=https://github.com/leandroberetta/right-lyrics \
  -p GIT_REVISION=master \
  -n right-lyrics

tkn pipeline start import-pipeline \
  -s pipeline \
  -w name=source,claimName=source,subPath=import \
  -p GIT_REPOSITORY=https://github.com/leandroberetta/right-lyrics \
  -p GIT_REVISION=master \
  -n right-lyrics

tkn pipeline start ui-pipeline \
  -s pipeline \
  -w name=source,claimName=source,subPath=ui \
  -p GIT_REPOSITORY=https://github.com/leandroberetta/right-lyrics \
  -p GIT_REVISION=master \
  -n right-lyrics