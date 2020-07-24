# Right Lyrics

A very simple microservice architecture to be deployed in OpenShift.

## Overview

![preview](./documentation/images/preview.png)

## Topology

![topology](./documentation/images/topology.png)

## Usage

* [Build and deploy in a development environment on Minikube with Tekton Pipelines](./documentation/minikube/dev/README.md)
* [Build and deploy in a CI environment on OpenShift with OpenShift Pipelines](./documentation/openshift/int/README.md)
* [Deploy in production on OpenShift using a Kubernetes Operator](./documentation/openshift/prod/README.md)

## Components

* **Lyrics UI** (React.js + NGINX)
* **Lyrics Admin UI** (React.js + NGINX)
* **Lyrics Service** (Node.js + MongoDB)
* **Songs Service** (Spring Boot + PostgreSQL)
* **Hits Service** (Python + Redis)
* **Albums Service** (Quarkus + MySQL)
* **Importer Service** (Quarkus)
* **Operator** (Operator Framework using Ansible)