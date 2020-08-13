# Deploy in OpenShift with Operators

Create the CustomResourceDefinition (this requires cluster admin privileges):

```bash
oc apply -f ./operator/deploy/crds/veicot.io_rightlyrics_crd.yaml
```

Create the Right Lyrics project:

```bash
oc new-project right-lyrics
```

Deploy the Operator:

```bash
oc apply -f ./operator/deploy/service_account.yaml -n right-lyrics
oc apply -f ./operator/deploy/role.yaml -n right-lyrics
oc apply -f ./operator/deploy/role_binding.yaml -n right-lyrics
oc apply -f ./operator/deploy/operator.yaml -n right-lyrics
```

Deploy a CustomResource:

```yaml
apiVersion: veicot.io/v1
kind: RightLyrics
metadata:
  name: my-rightlyrics
spec:
  lyricsPageReplicas: 1
  lyricsServiceReplicas: 1
  songsServiceReplicas: 1
  hitsServiceReplicas: 1
```

The CustomResource can be created as follows:

```bash
oc apply -f ./operator/deploy/crds/veicot.io_v1_rightlyrics_cr.yaml -n right-lyrics
```

Finally, the Operator will create the application based on the CustomResource.