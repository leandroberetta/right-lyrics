# Deploy a Canary version with Service Mesh

Canary deployments can be managed with OpenShift Service Mesh (Istio).

### Overview

The new version of Songs adds a YouTube preview to show in the Lyrics Page.

So as a result of doing a Canary deployment, sometimes the YouTube preview will appear and sometimes it won't.

This situation can be observed in Kiali too:

![canary](../images/canary.png)

### Prerequisites

* OpenShift (4.2 or higher)
* OpenShift Pipelines
* OpenShift Service Mesh
* Tekton CLI (tkn)

### Usage

#### Service Mesh

Create a control plane in the *right-lyrics-istio* project using the operator.

Then add the *right-lyrics* project to the member roll as follows:

```bash
echo "apiVersion: maistra.io/v1
kind: ServiceMeshMemberRoll
metadata:
  name: default
spec:
  members:
    - right-lyrics" | oc apply -f -n right-lyrics-istio
```

#### Right Lyrics (with Songs 1.2)

Create the project to deploy the services:

```bash
oc create namespace right-lyrics
```

Deploy the application from a template:

```bash
export WILDCARD_DOMAIN=<YOUR_WILDCARD_DOMAIN>

oc process -f documentation/istio/right-lyrics.yaml -p NAMESPACE=right-lyrics -p WILDCARD_DOMAIN=$WILDCARD_DOMAIN | oc apply -f - -n right-lyrics
```

##### Routes

Create routes for the services using the ingress gateway as an entry point into the mesh:

```bash
oc expose svc istio-ingressgateway --name lyrics-page --port 8080 -n right-lyrics-istio --dry-run -o yaml | oc apply -f - -n right-lyrics-istio
oc expose svc istio-ingressgateway --name songs-service --port 8080 -n right-lyrics-istio --dry-run -o yaml | oc apply -f - -n right-lyrics-istio
oc expose svc istio-ingressgateway --name lyrics-service --port 8080 -n right-lyrics-istio --dry-run -o yaml | oc apply -f - -n right-lyrics-istio
oc expose svc istio-ingressgateway --name albums-service --port 8080 -n right-lyrics-istio --dry-run -o yaml | oc apply -f - -n right-lyrics-istio
oc expose svc istio-ingressgateway --name keycloak --port 8080 -n right-lyrics-istio --dry-run -o yaml | oc apply -f - -n right-lyrics-istio

LYRICS_PAGE_ROUTE=$(oc get route lyrics-page -o jsonpath='{.spec.host}' -n right-lyrics-istio)
SONGS_SERVICE_ROUTE=$(oc get route songs-service -o jsonpath='{.spec.host}' -n right-lyrics-istio)
LYRICS_SERVICE_ROUTE=$(oc get route lyrics-service -o jsonpath='{.spec.host}' -n right-lyrics-istio)
ALBUMS_SERVICE_ROUTE=$(oc get route albums-service -o jsonpath='{.spec.host}' -n right-lyrics-istio)
KEYCLOAK_ROUTE=$(oc get route keycloak -o jsonpath='{.spec.host}' -n right-lyrics-istio)
```

##### Gateways

```bash
echo "apiVersion: networking.istio.io/v1alpha3
kind: Gateway
metadata:
  name: lyrics-page-gateway
spec:
  selector:
    istio: ingressgateway
  servers:
  - port:
      number: 80
      name: http
      protocol: HTTP
    hosts:
    - $LYRICS_PAGE_ROUTE" | oc apply -f - -n right-lyrics

echo "apiVersion: networking.istio.io/v1alpha3
kind: Gateway
metadata:
  name: songs-service-gateway
spec:
  selector:
    istio: ingressgateway
  servers:
  - port:
      number: 80
      name: http
      protocol: HTTP
    hosts:
    - $SONGS_SERVICE_ROUTE" | oc apply -f - -n right-lyrics

echo "apiVersion: networking.istio.io/v1alpha3
kind: Gateway
metadata:
  name: lyrics-service-gateway
spec:
  selector:
    istio: ingressgateway
  servers:
  - port:
      number: 80
      name: http
      protocol: HTTP
    hosts:
    - $LYRICS_SERVICE_ROUTE" | oc apply -f - -n right-lyrics

echo "apiVersion: networking.istio.io/v1alpha3
kind: Gateway
metadata:
  name: albums-service-gateway
spec:
  selector:
    istio: ingressgateway
  servers:
  - port:
      number: 80
      name: http
      protocol: HTTP
    hosts:
    - $ALBUMS_SERVICE_ROUTE" | oc apply -f - -n right-lyrics

echo "apiVersion: networking.istio.io/v1alpha3
kind: Gateway
metadata:
  name: keycloak-gateway
spec:
  selector:
    istio: ingressgateway
  servers:
  - port:
      number: 80
      name: http
      protocol: HTTP
    hosts:
    - $KEYCLOAK_ROUTE" | oc apply -f - -n right-lyrics
```

##### Virtual Services

```bash
echo "apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: lyrics-page
spec:
  hosts:
  - \"*\"
  gateways:
  - lyrics-page-gateway
  http:
  - route:
    - destination:
        host: lyrics-page" | oc apply -f - -n right-lyrics

echo "apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: albums-service
spec:
  hosts:
  - \"*\"
  gateways:
  - albums-service-gateway
  http:
  - route:
    - destination:
        host: albums-service" | oc apply -f - -n right-lyrics

echo "apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: lyrics-service
spec:
  hosts:
  - \"*\"
  gateways:
  - lyrics-service-gateway
  http:
  - route:
    - destination:
        host: lyrics-service" | oc apply -f - -n right-lyrics

echo "apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: songs-service
spec:
  hosts:
  - \"*\"
  gateways:
  - songs-service-gateway
  http:
  - route:
    - destination:
        host: songs-service" | oc apply -f - -n right-lyrics

echo "apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: keycloak
spec:
  hosts:
  - \"*\"
  gateways:
  - keycloak-gateway
  http:
  - route:
    - destination:
        host: keycloak" | oc apply -f - -n right-lyrics   
```

##### Configuration

Set the redirect URI in Keycloak:

```bash
oc get cm right-lyrics-realm -o yaml -n right-lyrics > right-lyrics-realm.yaml

sed "s/lyrics-page-right-lyrics/lyrics-page-right-lyrics-istio/g" right-lyrics-realm.yaml > right-lyrics-realm-replaced.yaml

oc apply -f right-lyrics-realm-replaced.yaml -n right-lyrics

rm right-lyrics-realm.yaml right-lyrics-realm-replaced.yaml

oc patch deployment/keycloak --patch "{\"spec\":{\"template\":{\"metadata\":{\"annotations\":{\"last-restart\":\"`date +'%s'`\"}}}}}" -n right-lyrics
```

Configure the backend services in Lyrics Page:

```bash
oc get cm lyrics-page -o yaml -n right-lyrics > lyrics-page.yaml 

sed -e "s/songs-service-right-lyrics/songs-service-right-lyrics-istio/g" \
  -e "s/lyrics-service-right-lyrics/lyrics-service-right-lyrics-istio/g" \
  -e "s/albums-service-right-lyrics/albums-service-right-lyrics-istio/g" \
  -e "s/keycloak-right-lyrics/keycloak-right-lyrics-istio/g" \
  lyrics-page.yaml > lyrics-page-replaced.yaml

oc apply -f lyrics-page-replaced.yaml -n right-lyrics

rm lyrics-page.yaml lyrics-page-replaced.yaml

oc patch deployment/lyrics-page --patch "{\"spec\":{\"template\":{\"metadata\":{\"annotations\":{\"last-restart\":\"`date +'%s'`\"}}}}}" -n right-lyrics
```

The application will be available at:

```bash
echo "http://$(oc get route lyrics-page -o jsonpath='{.spec.host}' -n right-lyrics-istio)"
```

#### Right Lyrics (with Songs 1.3)

##### Karpenter

The pipelines use Karpenter tasks for the clone, build and deploy tasks.

```bash
oc apply -f https://raw.githubusercontent.com/leandroberetta/karpenter/master/tasks/git/git.yaml -n right-lyrics
oc apply -f https://raw.githubusercontent.com/leandroberetta/karpenter/master/tasks/s2i/s2i.yaml -n right-lyrics
oc apply -f https://raw.githubusercontent.com/leandroberetta/karpenter/master/tasks/kubectl/kubectl.yaml -n right-lyrics
```

##### Pipelines

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

Create Songs pipeline:

```bash
oc apply -f pipelines/songs-pipeline.yaml -n right-lyrics
```

Start Songs pipeline to deploy the new version (1.3):

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

##### Canary

```bash

echo "apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: songs-service
spec:
  hosts:
  - \"*\"
  gateways:
  - songs-service-gateway
  http:
  - route:
    - destination:
        host: songs-service
        subset: 1-2
      weight: 50
    - destination:
        host: songs-service
        subset: 1-3
      weight: 50" | oc apply -f - -n right-lyrics

echo "apiVersion: networking.istio.io/v1alpha3
kind: DestinationRule
metadata:
  name: songs-service
spec:
  host: songs-service
  subsets:
  - name: 1-2
    labels:
      version: \"1.2\"
  - name: 1-3
    labels:
      version: \"1.3\""  | oc apply -f - -n right-lyrics      

oc rsh -n right-lyrics deployment/songs-service-v-1-3 curl -X POST http://localhost:8080/api/songs/youtube/1/YlUKcNNmywk
oc rsh -n right-lyrics deployment/songs-service-v-1-3 curl -X POST http://localhost:8080/api/songs/youtube/2/CxKWTzr-k6s
oc rsh -n right-lyrics deployment/songs-service-v-1-3 curl -X POST http://localhost:8080/api/songs/youtube/3/eBG7P-K-r1Y
```

Test again the application, 50% of the time there will be a YouTube preview in the Lyrics Page.




