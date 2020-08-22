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

oc apply -k ./keycloak/k8s/overlays/prod -n right-lyrics

oc expose svc keycloak -n right-lyrics

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
  --showlog \
  -n right-lyrics

tkn pipeline start hits-pipeline \
  -w name=source,claimName=source,subPath=hits \
  -p GIT_REPOSITORY=https://github.com/leandroberetta/right-lyrics \
  -p GIT_REVISION=master \
  -p IMAGE=image-registry.openshift-image-registry.svc.cluster.local:5000/right-lyrics/hits-service:latest \
  -p OVERLAY=prod \
  --showlog \
  -n right-lyrics

tkn pipeline start lyrics-pipeline \
  -w name=source,claimName=source,subPath=lyrics \
  -p GIT_REPOSITORY=https://github.com/leandroberetta/right-lyrics \
  -p GIT_REVISION=master \
  -p IMAGE=image-registry.openshift-image-registry.svc.cluster.local:5000/right-lyrics/lyrics-service:latest \
  -p OVERLAY=prod \
  --showlog \
  -n right-lyrics

tkn pipeline start songs-pipeline \
  -w name=source,claimName=source,subPath=songs \
  -p GIT_REPOSITORY=https://github.com/leandroberetta/right-lyrics \
  -p GIT_REVISION=master \
  -p IMAGE=image-registry.openshift-image-registry.svc.cluster.local:5000/right-lyrics/songs-service:latest \
  -p OVERLAY=prod \
  --showlog \
  -n right-lyrics

tkn pipeline start import-pipeline \
  -w name=source,claimName=source,subPath=import \
  -p GIT_REPOSITORY=https://github.com/leandroberetta/right-lyrics \
  -p GIT_REVISION=master \
  -p IMAGE=image-registry.openshift-image-registry.svc.cluster.local:5000/right-lyrics/import-service:latest \
  -p OVERLAY=prod \
  --showlog \
  -n right-lyrics

tkn pipeline start ui-pipeline \
  -w name=source,claimName=source,subPath=ui \
  -p GIT_REPOSITORY=https://github.com/leandroberetta/right-lyrics \
  -p GIT_REVISION=master \
  -p IMAGE=image-registry.openshift-image-registry.svc.cluster.local:5000/right-lyrics/lyrics-ui:latest \
  -p OVERLAY=prod \
  --showlog \
  -n right-lyrics

#
# Routes
#

oc expose svc albums-service -n right-lyrics
oc expose svc hits-service -n right-lyrics
oc expose svc lyrics-service -n right-lyrics
oc expose svc songs-service -n right-lyrics
oc expose svc import-service -n right-lyrics
oc expose svc lyrics-ui -n right-lyrics

echo "http://$(oc get route albums-service -o jsonpath='{.spec.host}' -n right-lyrics)"
echo "http://$(oc get route hits-service -o jsonpath='{.spec.host}' -n right-lyrics)"
echo "http://$(oc get route lyrics-service -o jsonpath='{.spec.host}' -n right-lyrics)"
echo "http://$(oc get route songs-service -o jsonpath='{.spec.host}' -n right-lyrics)"
echo "http://$(oc get route import-service -o jsonpath='{.spec.host}' -n right-lyrics)"
echo "http://$(oc get route lyrics-ui -o jsonpath='{.spec.host}' -n right-lyrics)"
echo "http://$(oc get route keycloak -o jsonpath='{.spec.host}' -n right-lyrics)"

#
# Redirect URI in Keycloak
#

LYRICS_UI_ROUTE=$(oc get route lyrics-ui -o jsonpath='{.spec.host}' -n right-lyrics)

echo $LYRICS_UI_ROUTE

oc get cm right-lyrics-realm -o yaml -n right-lyrics > right-lyrics-realm.yaml 

sed "s/right.lyrics/$LYRICS_UI_ROUTE/g" right-lyrics-realm.yaml > right-lyrics-realm-replaced.yaml

oc apply -f right-lyrics-realm-replaced.yaml -n right-lyrics

rm right-lyrics-realm.yaml right-lyrics-realm-replaced.yaml

oc patch deployment/keycloak --patch "{\"spec\":{\"template\":{\"metadata\":{\"annotations\":{\"last-restart\":\"`date +'%s'`\"}}}}}" -n right-lyrics

#
# Backends configuration in Lyrics UI
#

ALBUMS_SERVICE_ROUTE=$(oc get route albums-service -o jsonpath='{.spec.host}' -n right-lyrics)
LYRICS_SERVICE_ROUTE=$(oc get route lyrics-service -o jsonpath='{.spec.host}' -n right-lyrics)
SONGS_SERVICE_ROUTE=$(oc get route songs-service -o jsonpath='{.spec.host}' -n right-lyrics)
KEYCLOAK_ROUTE=$(oc get route keycloak -o jsonpath='{.spec.host}' -n right-lyrics)

echo $ALBUMS_SERVICE_ROUTE
echo $LYRICS_SERVICE_ROUTE
echo $SONGS_SERVICE_ROUTE
echo $KEYCLOAK_ROUTE

oc get cm lyrics-ui -o yaml -n right-lyrics > lyrics-ui.yaml 

sed -e "s/right.lyrics\/api\/songs/$SONGS_SERVICE_ROUTE\/api\/songs/" \
  -e "s/right.lyrics\/api\/lyrics/$LYRICS_SERVICE_ROUTE\/api\/lyrics/" \
  -e "s/right.lyrics\/api\/albums/$ALBUMS_SERVICE_ROUTE\/api\/albums/" \
  -e "s/right.lyrics\/auth/$KEYCLOAK_ROUTE\/auth/" \
  lyrics-ui.yaml > lyrics-ui-replaced.yaml

oc apply -f lyrics-ui-replaced.yaml -n right-lyrics

rm lyrics-ui.yaml lyrics-ui-replaced.yaml

oc patch deployment/lyrics-ui --patch "{\"spec\":{\"template\":{\"metadata\":{\"annotations\":{\"last-restart\":\"`date +'%s'`\"}}}}}" -n right-lyrics

#
# Data import
#

oc apply -f import-service/k8s/base/import-configmap.yaml -n right-lyrics
oc apply -f import-service/k8s/base/import-job.yaml -n right-lyrics