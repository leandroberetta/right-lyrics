#!/usr/bin/env bash

# create the CRD
oc create -f ./operator/deploy/crds/veicot_v1_rightlyrics_crd.yaml

# create a project to deploy the application
oc new-project right-lyrics

# create the RBAC required by the operator
oc create -f ./operator/deploy/service_account.yaml -n right-lyrics
oc create -f ./operator/deploy/role.yaml -n right-lyrics
oc create -f ./operator/deploy/role_binding.yaml -n right-lyrics
oc create -f ./operator/deploy/operator.yaml -n right-lyrics

# finally creates the application creating a CR
oc create -f ./operator/deploy/crds/veicot_v1_rightlyrics_cr.yaml -n right-lyrics
