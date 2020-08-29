# Deploy in Minikube (DEV) with Tekton Pipelines

Right Lyrics can be developed locally on Minikube building and deploying the services (and its related dependencies) using:

* Tekton Pipelines
* Karpenter Tasks
* Kustomize Manifests

A Postman collection is available for testing the services:

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/c9b134cf391caba635d7)

### Prerequisites

* Minikube
* Tekton CLI (tkn)

### Usage

#### Minikube

Start a Minikube instance:

```bash
minikube start --memory=8g --insecure-registry "example.org" --driver=hyperkit --container-runtime=cri-o
```

Notes:

* An internal registry (example.org) will be used to store the built images
* Hypekit is used for macOS, change to other virtualization driver based on the base OS
* CRI-O will be used as the container technology



Run the [install.sh](install.sh) script.

```bash
sh documentation/pipelines/minikube/install.sh
```

#### Accessing the application outside Minikube

The ingress addon provides an easy way to use the application. 

Add an entry to the */etc/hosts* file to map a host name with the minikube ip.

```bash  
echo "$(minikube ip) right.lyrics" | sudo tee -a /etc/hosts
```