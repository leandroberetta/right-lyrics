# Build and deploy in OpenShift (PROD) with OpenShift Pipelines

Right Lyrics can be deployed in OpenShift using:

* OpenShift Pipelines
* Karpenter Tasks
* Kustomize Manifests

### Prerequisites

* OpenShift 4.2 or higher
* OpenShift Pipelines (installed by the operator)
* Tekton CLI (tkn)

### Usage

Every step needed is in the [install.sh](install.sh) script.

```bash
sh install.sh
```

#### Setting the backends URIS in Lyrics UI

```bash
echo "http://$(oc get route lyrics-service -o jsonpath='{.spec.host}' -n right-lyrics)"
echo "http://$(oc get route songs-service -o jsonpath='{.spec.host}' -n right-lyrics)"
echo "http://$(oc get route albums-service -o jsonpath='{.spec.host}' -n right-lyrics)"
echo "http://$(oc get route keycloak -o jsonpath='{.spec.host}' -n right-lyrics)"
````

#### Setting the redirect URI in Keycloak

The redirect URI needs to be set accordingly with the Lyrics UI host (it will vary between clusters unless a custom domain is set).

The correct value can be obtained with the oc command as follows:

```bash
echo "http://$(oc get route lyrics-ui -o jsonpath='{.spec.host}' -n right-lyrics)"
```

Modify the Keycloak's realm which is stored in a ConfigMap called **right-lyrics-realm**:

```json
"redirectUris": [
    "http://right.lyrics/*",
    "http://localhost:3000/*",
    "http://ADD_EXTRA_REDIRECT_URI_HERE/*"
],
```

Keycloak needs to be restarted to load the new URI:

```bash
oc scale deployment/keycloak --replicas=0 -n right-lyrics
oc scale deployment/keycloak --replicas=1 -n right-lyrics
```

### Import data

When all the services are in Running state, execute the following command to import some songs:

```bash
oc apply -f import-service/k8s/base/import-configmap.yaml -n right-lyrics
oc apply -f import-service/k8s/base/import-job.yaml -n right-lyrics
```

