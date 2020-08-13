# Build and deploy in Minikube with Tekton Pipelines

Right Lyrics can be developed locally on Minikube deploying the services (and its related dependencies) using:

* Tekton Pipelines
* Karpenter Tasks
* Kustomize Manifests

A Postman collection is available for testing the services:

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/c9b134cf391caba635d7)

### Prerequisites

* Minikube installed
* Tekton CLI installed
* A free Red Hat Developer subscription

### Usage

Every step needed is in [this](install.sh) script.

```bash
sh install.sh
```

#### Notes

##### Add entries to /etc/hosts File

The ingress addon is used to provide easy ways to use the application. The only requirement is to add an entry to the */etc/hosts* file mapping a name with the minikube ip.

```bash  
echo "$(minikube ip) right.lyrics" | sudo tee -a /etc/hosts
echo "$(minikube ip) keycloak.right.lyrics" | sudo tee -a /etc/hosts
```
