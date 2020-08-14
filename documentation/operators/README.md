# Deploy Right Lyrics Operator

Create the CustomResourceDefinition (this step requires cluster admin privileges):

```bash
oc apply -f ./operator/deploy/crds/veicot.io_rightlyrics_crd.yaml
```

Create a namespace:

```bash
oc new-project right-lyrics
```

Deploy the operator:

```bash
oc apply -f ./operator/deploy/service_account.yaml -n right-lyrics
oc apply -f ./operator/deploy/role.yaml -n right-lyrics
oc apply -f ./operator/deploy/role_binding.yaml -n right-lyrics
oc apply -f ./operator/deploy/operator.yaml -n right-lyrics
```