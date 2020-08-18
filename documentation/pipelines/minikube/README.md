# Build and deploy in Minikube (DEV) with Tekton Pipelines

Right Lyrics can be developed locally on Minikube deploying the services (and its related dependencies) using:

* Tekton Pipelines
* Karpenter Tasks
* Kustomize Manifests

A Postman collection is available for testing the services:

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/c9b134cf391caba635d7)

### Prerequisites

* Minikube
* Tekton CLI (tkn)

### Usage

Every step needed is in the [install.sh](install.sh) script.

```bash
sh install.sh
```

#### Accessing the application outside Minikube

The ingress addon is used to provide an easy way to use the application. 

Add an entry to the */etc/hosts* file to map a name with the minikube ip.

```bash  
echo "$(minikube ip) right.lyrics" | sudo tee -a /etc/hosts
```