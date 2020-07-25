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

##### Pull Secret

**Note**: For this step a free Red Hat Developer Subscription is needed.

Some images used are from *registry.redhat.io*, these images require credentials to be pulled, for that reason a secret is needed.

The secret contains a **config.json** file with the token needed to authenticate to the registry.

To generate this file, the recommended approach is to extract that token after login manually to the registry:

```bash
minikube ssh

docker login registry.redhat.io
```

Complete with your username and password from the Red Hat Developer subscription and then get the content of the **config.json** file located in */home/docker/.docker/config.json*. 

Finally, create the file needed by the secret (in the example is called **auth.json**) and create the secret:

```bash
kubectl create secret generic redhat-credentials \
    --from-file=.dockerconfigjson=auth.json \
    --type=kubernetes.io/dockerconfigjson -n right-lyrics

kubectl patch sa default -p '{"imagePullSecrets": [{"name": "redhat-credentials"}]}' -n right-lyrics
```

##### Add an Entry to the /etc/hosts File

The ingress addon is used to provide easy ways to use the application. The only requirement is to add an entry to the */etc/hosts* file mapping a name with the minikube ip.

```bash  
echo "$(minikube ip) right.lyrics" | sudo tee -a /etc/hosts
```
