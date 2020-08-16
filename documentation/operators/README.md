# Deploy Right Lyrics Operator

Create the CustomResourceDefinition (this step requires cluster admin privileges):

```bash
oc apply -f https://raw.githubusercontent.com/leandroberetta/right-lyrics/master/operator/deploy/crds/veicot.io_rightlyrics_crd.yaml
```

Create a namespace:

```bash
oc create namespace right-lyrics
```

Deploy the operator:

```bash
oc apply -f https://raw.githubusercontent.com/leandroberetta/right-lyrics/master/operator/deploy/service_account.yaml -n right-lyrics
oc apply -f https://raw.githubusercontent.com/leandroberetta/right-lyrics/master/operator/deploy/role.yaml -n right-lyrics
oc apply -f https://raw.githubusercontent.com/leandroberetta/right-lyrics/master/operator/deploy/role_binding.yaml -n right-lyrics
oc apply -f https://raw.githubusercontent.com/leandroberetta/right-lyrics/master/operator/deploy/operator.yaml -n right-lyrics
```