# Deploy a Canary version with Service Mesh

Canary deployments can be managed with OpenShift Service Mesh (Istio).

### Overview

The new version of Songs adds a YouTube preview to be shown in the Lyrics Page.

So as a result of doing a Canary deployment, sometimes the YouTube preview will appear and sometimes it won't.

This situation can be observed in Kiali too:

![canary](../images/canary.png)

### Prerequisites

* OpenShift (4.2 or higher)
* OpenShift Service Mesh

### Usage

#### Service Mesh

Install Service Mesh with the official documentation in [this](https://docs.openshift.com/container-platform/4.5/service_mesh/service_mesh_install/installing-ossm.html) link.

Then create a control plane in the *right-lyrics-istio* project using the operator:

```bash
oc new-project right-lyrics-istio

echo 'apiVersion: maistra.io/v1
kind: ServiceMeshControlPlane
metadata:
  name: basic-install
  namespace: right-lyrics-istio
spec:
  version: v1.1
  istio:
    gateways:
      istio-egressgateway:
        autoscaleEnabled: false
      istio-ingressgateway:
        autoscaleEnabled: false
        ior_enabled: false
    mixer:
      policy:
        autoscaleEnabled: false
      telemetry:
        autoscaleEnabled: false
    pilot:
      autoscaleEnabled: false
      traceSampling: 100
    kiali:
      enabled: true
    grafana:
      enabled: true
    tracing:
      enabled: true
      jaeger:
        template: all-in-one' | oc apply -f - -n right-lyrics-istio
```

Finally, add the *right-lyrics* project to the member roll as follows:

```bash
echo "apiVersion: maistra.io/v1
kind: ServiceMeshMemberRoll
metadata:
  name: default
spec:
  members:
    - right-lyrics" | oc apply -f -n right-lyrics-istio
```

#### Right Lyrics (with Songs v1)

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
  name: right-lyrics
spec:
  selector:
    istio: ingressgateway
  servers:
  - port:
      number: 80
      name: http
      protocol: HTTP
    hosts:
    - \"*\"" | oc apply -f - -n right-lyrics
```

##### Virtual Services

```bash
echo "apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: lyrics-page
spec:
  hosts:
  - $LYRICS_PAGE_ROUTE
  gateways:
  - right-lyrics
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
  - $ALBUMS_SERVICE_ROUTE
  gateways:
  - right-lyrics
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
  - $LYRICS_SERVICE_ROUTE
  gateways:
  - right-lyrics
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
  - $SONGS_SERVICE_ROUTE
  gateways:
  - right-lyrics
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
  - $KEYCLOAK_ROUTE
  gateways:
  - right-lyrics
  http:
  - route:
    - destination:
        host: keycloak" | oc apply -f - -n right-lyrics 

echo "apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: hits-service
spec:
  hosts:
  - hits-service
  http:
  - route:
    - destination:
        host: hits-service" | oc apply -f - -n right-lyrics 
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

#### Right Lyrics (with Songs v2)

```bash
echo "apiVersion: apps/v1
kind: Deployment
metadata:
  annotations:
    app.openshift.io/connects-to: songs-postgresql,hits-service
  labels:
    app: songs-service
    version: v2
    app.openshift.io/runtime: spring
    app.kubernetes.io/part-of: right-lyrics
  name: songs-service-v2
spec:
  replicas: 1
  selector:
    matchLabels:
      app: songs-service
      version: v2
  strategy:
    type: RollingUpdate
  template:
    metadata:
      annotations:
        sidecar.istio.io/inject: \"true\"
        prometheus.io/scrape: \"true\"
        prometheus.io/path: /actuator/prometheus
        prometheus.io/port: \"8080\"
        prometheus.io/scheme: http
      labels:
        app: songs-service
        version: v2
    spec:
      containers:
        - image: quay.io/right-lyrics/songs-service:2.0
          env:
            - name: SPRING_DATASOURCE_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: songs-postgresql
                  key: password
            - name: SPRING_DATASOURCE_USERNAME
              valueFrom:
                secretKeyRef:
                  name: songs-postgresql
                  key: user
            - name: SPRING_DATASOURCE_URL
              value: jdbc:postgresql://songs-postgresql:5432/right-lyrics
            - name: HITS_SERVICE_URL
              value: http://hits-service:8080
          imagePullPolicy: Always
          name: songs-service
          ports:
            - containerPort: 8080" | oc apply -f - -n right-lyrics
```

##### Canary

```bash

echo "apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: songs-service
spec:
  hosts:
  - $SONGS_SERVICE_ROUTE
  gateways:
  - right-lyrics
  http:
  - route:
    - destination:
        host: songs-service
        subset: v1
      weight: 50
    - destination:
        host: songs-service
        subset: v2
      weight: 50" | oc apply -f - -n right-lyrics

echo "apiVersion: networking.istio.io/v1alpha3
kind: DestinationRule
metadata:
  name: songs-service
spec:
  host: songs-service
  subsets:
  - name: v1
    labels:
      version: v1
  - name: v2
    labels:
      version: v2"  | oc apply -f - -n right-lyrics      
````

Update the songs with the YouTube links:

```bash
oc rsh -n right-lyrics deployment/songs-service-v2 curl -X POST http://localhost:8080/api/songs/youtube/1/YlUKcNNmywk
oc rsh -n right-lyrics deployment/songs-service-v2 curl -X POST http://localhost:8080/api/songs/youtube/2/CxKWTzr-k6s
oc rsh -n right-lyrics deployment/songs-service-v2 curl -X POST http://localhost:8080/api/songs/youtube/3/eBG7P-K-r1Y
```

Test again the application, 50% of the time there will be a YouTube preview in the Lyrics Page.




