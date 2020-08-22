# Deploy Right Lyrics Operator

Right Lyrics can be deployed with an operator.

First, create the CustomResourceDefinition (this step requires cluster admin privileges):

```bash
oc apply -f https://raw.githubusercontent.com/leandroberetta/right-lyrics/master/operator/deploy/crds/veicot.io_rightlyrics_crd.yaml
```

The operator will watch a single namespace, then create the namespace for Right Lyrics:

```bash
oc create namespace right-lyrics
```

Finally, deploy the operator in the Right Lyrics namespace:

```bash
oc apply -f https://raw.githubusercontent.com/leandroberetta/right-lyrics/master/operator/deploy/service_account.yaml -n right-lyrics
oc apply -f https://raw.githubusercontent.com/leandroberetta/right-lyrics/master/operator/deploy/role.yaml -n right-lyrics
oc apply -f https://raw.githubusercontent.com/leandroberetta/right-lyrics/master/operator/deploy/role_binding.yaml -n right-lyrics
oc apply -f https://raw.githubusercontent.com/leandroberetta/right-lyrics/master/operator/deploy/operator.yaml -n right-lyrics
```

To deploy an instance of Right Lyrics, a custom resource needs to be created in the same namespace where the operator is running:

```bash
oc apply -f https://raw.githubusercontent.com/leandroberetta/right-lyrics/master/operator/deploy/crds/veicot.io_v1_rightlyrics_cr.yaml -n right-lyrics
```

After a few minutes, the application will be available and ready to use in the following link:

```bash
echo "http://$(oc get route lyrics-ui -o jsonpath='{.spec.host}' -n right-lyrics)"
```