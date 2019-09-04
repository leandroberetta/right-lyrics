# Right Lyrics

TBD

## Components

* Lyrics Page
* Lyrics Service
* Songs Service

## Deploy on OpenShift

    oc new-app --template postgresql-ephemeral -p POSTGRESQL_DATABASE=rl-postgres -p POSTGRESQL_VERSION=10 -p POSTGRESQL_USER=right-lyrics -p POSTGRESQL_PASSWORD=right-lyrics -p DATABASE_SERVICE_NAME=rl-postgresql -n right-lyrics

TBD