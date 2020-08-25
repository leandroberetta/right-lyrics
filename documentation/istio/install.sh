#!/user/bin/env bash

#
# Routes
#

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

#
# Gateways
#

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

#
# Redirect URI in Keycloak
#

oc get cm right-lyrics-realm -o yaml -n right-lyrics > right-lyrics-realm.yaml

sed "s/right\.lyrics/$LYRICS_PAGE_ROUTE/g" right-lyrics-realm.yaml > right-lyrics-realm-replaced.yaml

oc apply -f right-lyrics-realm-replaced.yaml -n right-lyrics

rm right-lyrics-realm.yaml right-lyrics-realm-replaced.yaml

oc patch deployment/keycloak --patch "{\"spec\":{\"template\":{\"metadata\":{\"annotations\":{\"last-restart\":\"`date +'%s'`\"}}}}}" -n right-lyrics

#
# Backends configuration in Lyrics Page
#

oc get cm lyrics-page -o yaml -n right-lyrics > lyrics-page.yaml 

sed -e "s/right\.lyrics\/api\/songs/$SONGS_SERVICE_ROUTE\/api\/songs/" \
  -e "s/right\.lyrics\/api\/lyrics/$LYRICS_SERVICE_ROUTE\/api\/lyrics/" \
  -e "s/right\.lyrics\/api\/albums/$ALBUMS_SERVICE_ROUTE\/api\/albums/" \
  -e "s/right\.lyrics\/auth/$KEYCLOAK_ROUTE\/auth/" \
  lyrics-page.yaml > lyrics-page-replaced.yaml

oc apply -f lyrics-page-replaced.yaml -n right-lyrics

rm lyrics-page.yaml lyrics-page-replaced.yaml

oc patch deployment/lyrics-page --patch "{\"spec\":{\"template\":{\"metadata\":{\"annotations\":{\"last-restart\":\"`date +'%s'`\"}}}}}" -n right-lyrics

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