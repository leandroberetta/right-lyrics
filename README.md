# Right Lyrics

A very simple microservice architecture to be deployed in OpenShift with Ansible Operators.

![preview](./openshift/img/preview.png)

## Components

* Lyrics Page (React.js)
* Lyrics Service (Node.js + MongoDB)
* Songs Service (Spring Boot + PostgreSQL)

## Deploy in OpenShift with an Ansible Operator

    oc new-project right-lyrics

    oc create -f ./openshift/operator/deploy/crds/veicot_v1_rightlyrics_crd.yaml
    oc create -f ./openshift/operator/deploy/service_account.yaml
    oc create -f ./openshift/operator/deploy/role.yaml
    oc create -f ./openshift/operator/deploy/role_binding.yaml
    oc create -f ./openshift/operator/deploy/operator.yaml
    
    echo "apiVersion: veicot.io/v1
    kind: RightLyrics
    metadata:
      name: my-rightlyrics
    spec:
      routeSubdomain: apps-crc.testing
      lyricsServiceReplicas: 1
      songsServiceReplicas: 1" | oc create -f -