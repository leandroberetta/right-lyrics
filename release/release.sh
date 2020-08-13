#!/user/bin/env bash

kubectl apply -f release-pipeline.yaml -n right-lyrics

tkn pipeline start release-pipeline \
  -s pipeline \
  -w name=source,claimName=source,subPath=albums \
  -p GIT_REPOSITORY=https://github.com/leandroberetta/right-lyrics \
  -p GIT_REVISION=master \
  -p CONTEXT_PATH=albums-service \
  -p IMAGE=quay.io/right-lyrics/albums-service:1.0 \
  -p BASE_IMAGE=registry.access.redhat.com/ubi8/openjdk-11:latest \
  -p BASE_IMAGE_S2I_SCRIPTS=/usr/local/s2i \
  -n right-lyrics

tkn pipeline start release-pipeline \
  -s pipeline \
  -w name=source,claimName=source,subPath=hits \
  -p GIT_REPOSITORY=https://github.com/leandroberetta/right-lyrics \
  -p GIT_REVISION=master \
  -p CONTEXT_PATH=hits-service \
  -p IMAGE=quay.io/right-lyrics/hits-service:1.1 \
  -p BASE_IMAGE=registry.access.redhat.com/rhscl/python-36-rhel7 \
  -p BASE_IMAGE_S2I_SCRIPTS=/usr/libexec/s2i \
  -n right-lyrics

tkn pipeline start release-pipeline \
  -s pipeline \
  -w name=source,claimName=source,subPath=import \
  -p GIT_REPOSITORY=https://github.com/leandroberetta/right-lyrics \
  -p GIT_REVISION=master \
  -p CONTEXT_PATH=import-service \
  -p IMAGE=quay.io/right-lyrics/import-service:1.0 \
  -p BASE_IMAGE=registry.access.redhat.com/ubi8/openjdk-11:latest \
  -p BASE_IMAGE_S2I_SCRIPTS=/usr/local/s2i \
  -n right-lyrics

tkn pipeline start release-pipeline \
  -s pipeline \
  -w name=source,claimName=source,subPath=lyrics \
  -p GIT_REPOSITORY=https://github.com/leandroberetta/right-lyrics \
  -p GIT_REVISION=master \
  -p CONTEXT_PATH=lyrics-service \
  -p IMAGE=quay.io/right-lyrics/lyrics-service:1.1 \
  -p BASE_IMAGE=registry.access.redhat.com/rhscl/nodejs-10-rhel7 \
  -p BASE_IMAGE_S2I_SCRIPTS=/usr/libexec/s2i \
  -n right-lyrics

tkn pipeline start release-ui-pipeline \
  -s pipeline \
  -w name=source,claimName=source,subPath=ui \
  -p GIT_REPOSITORY=https://github.com/leandroberetta/right-lyrics \
  -p GIT_REVISION=keycloak \
  -p CONTEXT_PATH=lyrics-ui \
  -p IMAGE=quay.io/right-lyrics/lyrics-ui:1.2 \
  -p BASE_IMAGE=registry.access.redhat.com/rhscl/nginx-114-rhel7 \
  -p BASE_IMAGE_S2I_SCRIPTS=/usr/libexec/s2i \
  -n right-lyrics

tkn pipeline start release-pipeline \
  -s pipeline \
  -w name=source,claimName=source,subPath=songs \
  -p GIT_REPOSITORY=https://github.com/leandroberetta/right-lyrics \
  -p GIT_REVISION=master \
  -p CONTEXT_PATH=songs-service \
  -p IMAGE=quay.io/right-lyrics/songs-service:1.2 \
  -p BASE_IMAGE=registry.access.redhat.com/redhat-openjdk-18/openjdk18-openshift \
  -p BASE_IMAGE_S2I_SCRIPTS=/usr/local/s2i \
  -n right-lyrics