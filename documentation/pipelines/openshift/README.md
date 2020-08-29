# Deploy in OpenShift (PROD) with OpenShift Pipelines

Right Lyrics can be deployed in OpenShift using:

* OpenShift Pipelines
* Karpenter Tasks
* Kustomize Manifests

### Prerequisites

* OpenShift (4.2 or higher)
* OpenShift Pipelines
* Tekton CLI (tkn)

### Usage

#### Right Lyrics

Create the project to deploy the services:

```bash
oc create namespace right-lyrics
```

Create extra resources for the pipelines:

```bash
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
```

##### Keycloak

Keycloak is used to provide authentication and authorization.

```bash
oc apply -k ./keycloak/k8s/overlays/prod -n right-lyrics

oc expose svc keycloak -n right-lyrics
```

##### Karpenter

The pipelines use Karpenter tasks for the clone, build and deploy tasks.

```bash
oc apply -f https://raw.githubusercontent.com/leandroberetta/karpenter/master/tasks/git/git.yaml -n right-lyrics
oc apply -f https://raw.githubusercontent.com/leandroberetta/karpenter/master/tasks/s2i/s2i.yaml -n right-lyrics
oc apply -f https://raw.githubusercontent.com/leandroberetta/karpenter/master/tasks/oc/oc.yaml -n right-lyrics
```

##### Pipelines

Create the pipelines:

```bash
oc apply -f pipelines -n right-lyrics
```

Start Albums pipeline:

```bash
tkn pipeline start albums-pipeline \
  -w name=source,claimName=source,subPath=albums \
  -p GIT_REPOSITORY=https://github.com/leandroberetta/right-lyrics \
  -p GIT_REVISION=master \
  -p IMAGE=image-registry.openshift-image-registry.svc.cluster.local:5000/right-lyrics/albums-service:1.0 \
  -p OVERLAY=prod \
  --showlog \
  -n right-lyrics
```

Start Hits pipeline:

```bash
tkn pipeline start hits-pipeline \
  -w name=source,claimName=source,subPath=hits \
  -p GIT_REPOSITORY=https://github.com/leandroberetta/right-lyrics \
  -p GIT_REVISION=master \
  -p IMAGE=image-registry.openshift-image-registry.svc.cluster.local:5000/right-lyrics/hits-service:1.1 \
  -p OVERLAY=prod \
  --showlog \
  -n right-lyrics
```

Start Lyrics pipeline:

```bash
tkn pipeline start lyrics-pipeline \
  -w name=source,claimName=source,subPath=lyrics \
  -p GIT_REPOSITORY=https://github.com/leandroberetta/right-lyrics \
  -p GIT_REVISION=master \
  -p IMAGE=image-registry.openshift-image-registry.svc.cluster.local:5000/right-lyrics/lyrics-service:1.1 \
  -p OVERLAY=prod \
  --showlog \
  -n right-lyrics
```

Start Songs pipeline:

```bash
tkn pipeline start songs-pipeline \
  -w name=source,claimName=source,subPath=songs \
  -p GIT_REPOSITORY=https://github.com/leandroberetta/right-lyrics \
  -p GIT_REVISION=master \
  -p IMAGE=image-registry.openshift-image-registry.svc.cluster.local:5000/right-lyrics/songs-service:1.3 \
  -p OVERLAY=prod \
  --showlog \
  -n right-lyrics
```

Start Import pipeline:

```bash
tkn pipeline start import-pipeline \
  -w name=source,claimName=source,subPath=import \
  -p GIT_REPOSITORY=https://github.com/leandroberetta/right-lyrics \
  -p GIT_REVISION=master \
  -p IMAGE=image-registry.openshift-image-registry.svc.cluster.local:5000/right-lyrics/import-service:1.1 \
  -p OVERLAY=prod \
  --showlog \
  -n right-lyrics
```

Start Page pipeline:

```bash
tkn pipeline start page-pipeline \
  -w name=source,claimName=source,subPath=page \
  -p GIT_REPOSITORY=https://github.com/leandroberetta/right-lyrics \
  -p GIT_REVISION=master \
  -p IMAGE=image-registry.openshift-image-registry.svc.cluster.local:5000/right-lyrics/lyrics-page:1.3 \
  -p OVERLAY=prod \
  --showlog \
  -n right-lyrics
```

After all the services are up and running, import some data:

```bash
oc apply -f import-service/k8s/base/import-configmap.yaml -n right-lyrics
oc apply -f import-service/k8s/base/import-job.yaml -n right-lyrics
```

##### Routes

Expose the services to reach them outside the cluster:

```bash
oc expose svc albums-service -n right-lyrics
oc expose svc hits-service -n right-lyrics
oc expose svc lyrics-service -n right-lyrics
oc expose svc songs-service -n right-lyrics
oc expose svc import-service -n right-lyrics
oc expose svc lyrics-page -n right-lyrics
```

##### Configuration

Set the redirect URI in Keycloak:

```bash
LYRICS_PAGE_ROUTE=$(oc get route lyrics-page -o jsonpath='{.spec.host}' -n right-lyrics)

oc get cm right-lyrics-realm -o yaml -n right-lyrics > right-lyrics-realm.yaml

sed "s/right\.lyrics/$LYRICS_PAGE_ROUTE/g" right-lyrics-realm.yaml > right-lyrics-realm-replaced.yaml

oc apply -f right-lyrics-realm-replaced.yaml -n right-lyrics

rm right-lyrics-realm.yaml right-lyrics-realm-replaced.yaml

oc patch deployment/keycloak --patch "{\"spec\":{\"template\":{\"metadata\":{\"annotations\":{\"last-restart\":\"`date +'%s'`\"}}}}}" -n right-lyrics
```

Configure the backend services in Lyrics Page:

```bash
ALBUMS_SERVICE_ROUTE=$(oc get route albums-service -o jsonpath='{.spec.host}' -n right-lyrics)
LYRICS_SERVICE_ROUTE=$(oc get route lyrics-service -o jsonpath='{.spec.host}' -n right-lyrics)
SONGS_SERVICE_ROUTE=$(oc get route songs-service -o jsonpath='{.spec.host}' -n right-lyrics)
KEYCLOAK_ROUTE=$(oc get route keycloak -o jsonpath='{.spec.host}' -n right-lyrics)

oc get cm lyrics-page -o yaml -n right-lyrics > lyrics-page.yaml 

sed -e "s/right\.lyrics\/api\/songs/$SONGS_SERVICE_ROUTE\/api\/songs/" \
  -e "s/right\.lyrics\/api\/lyrics/$LYRICS_SERVICE_ROUTE\/api\/lyrics/" \
  -e "s/right\.lyrics\/api\/albums/$ALBUMS_SERVICE_ROUTE\/api\/albums/" \
  -e "s/right\.lyrics\/auth/$KEYCLOAK_ROUTE\/auth/" \
  lyrics-page.yaml > lyrics-page-replaced.yaml

oc apply -f lyrics-page-replaced.yaml -n right-lyrics

rm lyrics-page.yaml lyrics-page-replaced.yaml

oc patch deployment/lyrics-page --patch "{\"spec\":{\"template\":{\"metadata\":{\"annotations\":{\"last-restart\":\"`date +'%s'`\"}}}}}" -n right-lyrics
```

Finally, the application will be available at:

```bash
echo "http://$(oc get route lyrics-page -o jsonpath='{.spec.host}' -n right-lyrics)"
```
