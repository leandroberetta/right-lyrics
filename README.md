# Right Lyrics

A very simple microservice architecture to be deployed in OpenShift with Ansible Operators.

![preview](./preview.png)

## Components

* Lyrics Page (React.js)
* Lyrics Service (Node.js + MongoDB)
* Songs Service (Spring Boot + PostgreSQL)

## Deploy in OpenShift

Create the Right Lyrics project:

    oc new-project right-lyrics

Create the CRD that will be watched by the Operator:

    oc create -f ./operator/deploy/crds/veicot_v1_rightlyrics_crd.yaml

Deploy the Operator:

    oc create -f ./operator/deploy/service_account.yaml
    oc create -f ./operator/deploy/role.yaml
    oc create -f ./operator/deploy/role_binding.yaml
    oc create -f ./operator/deploy/operator.yaml

Deploy a CR representing the application:
    
    echo "apiVersion: veicot.io/v1
    kind: RightLyrics
    metadata:
      name: my-rightlyrics
    spec:
      routesBaseDomain: apps-crc.testing
      lyricsPageReplicas: 1
      lyricsServiceReplicas: 1
      songsServiceReplicas: 1" | oc create -f -

Finally the Operator watches this CR an creates the application.