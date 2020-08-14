# Right Lyrics

A very simple microservice architecture to be deployed in OpenShift.

## Usage

To deploy the application an operator needs to be installed following [this instructions](./documentation/operators/README.md).

With the operator running, create the following resource:

```yaml
apiVersion: veicot.io/v1
kind: RightLyrics
metadata:
  name: right-lyrics
```

The application will be available and ready to use at:

```bash
echo "http://$(oc get route lyrics-ui -o jsonpath='{.spec.host}') -n right-lyrics"
```

## Overview

![overview](./documentation/images/overview.png)

## Topology

![topology](./documentation/images/topology.png)

## Components

* **Lyrics UI** (React.js + NGINX)
* **Lyrics Service** (Node.js + MongoDB)
* **Songs Service** (Spring Boot + PostgreSQL)
* **Hits Service** (Python + Redis)
* **Albums Service** (Quarkus + MariaDB)
* **Import Service** (Quarkus)

## Bonus

* [Build and deploy in Minikube with Tekton Pipelines](./documentation/pipelines/minikube/README.md)
* [Build and deploy in OpenShift with OpenShift Pipelines](./documentation/pipelines/openshift/README.md)




