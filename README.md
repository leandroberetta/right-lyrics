# Right Lyrics

A very simple microservice architecture to be deployed in OpenShift.

## Overview

![preview](./documentation/images/preview.png)

## Documentation

* [Deploy in Minikube with Tekton Pipelines](./documentation/minikube/pipelines.md)
* [Deploy in OpenShift with OpenShift Pipelines](./documentation/openshift/pipelines.md)
* [Deploy in OpenShift with a Kubernetes Operator](./documentation/openshift/operator.md)

## Components

* **Lyrics Page** (React.js + NGINX)
* **Lyrics Service** (Node.js + MongoDB)
* **Songs Service** (Spring Boot + PostgreSQL)
* **Hits Service** (Python + Redis)
* **Albums Service** (Quarkus + MySQL)
* **Operator** (Operator Framework using Ansible)
* **Importer** (Quarkus)
* **Admin Page** (React.js + NGINX)