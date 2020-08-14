# Right Lyrics

A very simple microservice architecture to deploy in OpenShift.

## Usage

The application is deployed by an operator, follow [this instructions](./documentation/operators/README.md) to install it.

With the operator running, create the following resource (in the same namespace where the operator is running):

```yaml
apiVersion: veicot.io/v1
kind: RightLyrics
metadata:
  name: right-lyrics
```

The application will be available and ready to use at:

```bash
echo "http://$(oc get route lyrics-ui -o jsonpath='{.spec.host}' -n right-lyrics)"
```

## Overview

![overview](./documentation/images/overview.png)

## Components

* **Lyrics UI** (React.js + NGINX)
* **Lyrics Service** (Node.js + MongoDB)
* **Songs Service** (Spring Boot + PostgreSQL)
* **Hits Service** (Python + Redis)
* **Albums Service** (Quarkus + MariaDB)
* **Import Service** (Quarkus)
* **Operator** (Ansible)
* **Keycloak**

## Bonuses

* [Build and deploy in Minikube with Tekton Pipelines](./documentation/pipelines/minikube/README.md)
* [Build and deploy in OpenShift with OpenShift Pipelines](./documentation/pipelines/openshift/README.md)




