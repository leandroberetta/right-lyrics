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

#
# Keycloak
#

oc apply -k ./keycloak/k8s/base -n right-lyrics

#
# Karpenter
#

oc apply -f https://raw.githubusercontent.com/leandroberetta/karpenter/master/tasks/git/git.yaml -n right-lyrics
oc apply -f https://raw.githubusercontent.com/leandroberetta/karpenter/master/tasks/s2i/s2i.yaml -n right-lyrics
oc apply -f https://raw.githubusercontent.com/leandroberetta/karpenter/master/tasks/kubectl/kubectl.yaml -n right-lyrics

#
# Pipelines (PROD) 
#

oc apply -f albums-service/k8s/base/albums-pipeline.yaml -n right-lyrics
oc apply -f hits-service/k8s/base/hits-pipeline.yaml -n right-lyrics
oc apply -f lyrics-service/k8s/base/lyrics-pipeline.yaml -n right-lyrics
oc apply -f songs-service/k8s/base/songs-pipeline.yaml -n right-lyrics
oc apply -f import-service/k8s/base/import-pipeline.yaml -n right-lyrics
oc apply -f lyrics-ui/k8s/base/ui-pipeline.yaml -n right-lyrics

tkn pipeline start albums-pipeline \
  -w name=source,claimName=source,subPath=albums \
  -p GIT_REPOSITORY=https://github.com/leandroberetta/right-lyrics \
  -p GIT_REVISION=master \
  -p IMAGE=image-registry.openshift-image-registry.svc.cluster.local:5000/right-lyrics/albums-service:latest \
  -p OVERLAY=prod \
  -n right-lyrics

tkn pipeline start hits-pipeline \
  -w name=source,claimName=source,subPath=hits \
  -p GIT_REPOSITORY=https://github.com/leandroberetta/right-lyrics \
  -p GIT_REVISION=master \
  -p IMAGE=image-registry.openshift-image-registry.svc.cluster.local:5000/right-lyrics/hits-service:latest \
  -p OVERLAY=prod \
  -n right-lyrics

tkn pipeline start lyrics-pipeline \
  -w name=source,claimName=source,subPath=lyrics \
  -p GIT_REPOSITORY=https://github.com/leandroberetta/right-lyrics \
  -p GIT_REVISION=master \
  -p IMAGE=image-registry.openshift-image-registry.svc.cluster.local:5000/right-lyrics/lyrics-service:latest \
  -p OVERLAY=prod \
  -n right-lyrics

tkn pipeline start songs-pipeline \
  -w name=source,claimName=source,subPath=songs \
  -p GIT_REPOSITORY=https://github.com/leandroberetta/right-lyrics \
  -p GIT_REVISION=master \
  -p IMAGE=image-registry.openshift-image-registry.svc.cluster.local:5000/right-lyrics/songs-service:latest \
  -p OVERLAY=prod \
  -n right-lyrics

tkn pipeline start import-pipeline \
  -w name=source,claimName=source,subPath=import \
  -p GIT_REPOSITORY=https://github.com/leandroberetta/right-lyrics \
  -p GIT_REVISION=master \
  -p IMAGE=image-registry.openshift-image-registry.svc.cluster.local:5000/right-lyrics/import-service:latest \
  -p OVERLAY=prod \
  -n right-lyrics

tkn pipeline start ui-pipeline \
  -w name=source,claimName=source,subPath=ui \
  -p GIT_REPOSITORY=https://github.com/leandroberetta/right-lyrics \
  -p GIT_REVISION=master \
  -p IMAGE=image-registry.openshift-image-registry.svc.cluster.local:5000/right-lyrics/lyrics-ui:latest \
  -p OVERLAY=prod \
  -n right-lyrics

#
# Routes
#

oc expose svc lyrics-ui -n right-lyrics
oc expose svc lyrics-service -n right-lyrics
oc expose svc albums-service -n right-lyrics
oc expose svc songs-service -n right-lyrics
oc expose svc keycloak -n right-lyrics

echo "http://$(oc get route lyrics-ui -o jsonpath='{.spec.host}' -n right-lyrics)"
echo "http://$(oc get route lyrics-service -o jsonpath='{.spec.host}' -n right-lyrics)"
echo "http://$(oc get route songs-service -o jsonpath='{.spec.host}' -n right-lyrics)"
echo "http://$(oc get route albums-service -o jsonpath='{.spec.host}' -n right-lyrics)"
echo "http://$(oc get route keycloak -o jsonpath='{.spec.host}' -n right-lyrics)"