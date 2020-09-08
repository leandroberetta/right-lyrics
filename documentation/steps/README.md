# Deploy in OpenShift step by step

Create a project for Right Lyrics:

```bash
oc new-project right-lyrics
```

## Components

### Hits Service

#### Hits Redis

```bash
oc new-app --template=redis-ephemeral \
    --name hits-redis \
    -p DATABASE_SERVICE_NAME=hits-redis \
    -p REDIS_PASSWORD=right-lyrics \
    -n right-lyrics

oc label dc hits-redis app.openshift.io/runtime=redis -n right-lyrics
```

#### Hits Service

```bash
oc new-app python:3.6~https://github.com/leandroberetta/right-lyrics \
    --name hits-service \
    --context-dir hits-service \
    -n right-lyrics

oc patch dc/hits-service -p  '{"spec": {"template": {"spec": {"containers": [{"name": "hits-service","env": [{"name": "DB_HOST","value": "hits-redis"},{"name": "DB_PASSWORD","valueFrom": {"secretKeyRef": {"key": "database-password","name": "hits-redis"}}}]}]}}}}' -n right-lyrics

oc expose svc hits-service -n right-lyrics

oc label dc hits-service app.openshift.io/runtime=python -n right-lyrics
oc annotate dc hits-service app.openshift.io/connects-to=hits-redis -n right-lyrics
```

### Songs Service

#### Songs PostgreSQL

```bash
oc new-app --template postgresql-ephemeral \
    --name songs-postgresql \
    -p DATABASE_SERVICE_NAME=songs-postgresql \
    -p POSTGRESQL_USER=right-lyrics \
    -p POSTGRESQL_PASSWORD=right-lyrics \
    -p POSTGRESQL_DATABASE=right-lyrics \
    -n right-lyrics

oc label dc songs-postgresql app.openshift.io/runtime=postgresql -n right-lyrics
```

#### Songs Service

```bash
oc new-app redhat-openjdk18-openshift:1.7~https://github.com/leandroberetta/right-lyrics \
    --name songs-service \
    --context-dir songs-service \
    -e HITS_SERVICE_URL=http://hits-service:8080 \
    -n right-lyrics

oc patch dc/songs-service -p '{"spec": {"template": {"spec": {"containers": [{"name": "songs-service","env": [{"name": "SPRING_DATASOURCE_URL","value": "jdbc:postgresql://songs-postgresql:5432/right-lyrics"},{"name": "SPRING_DATASOURCE_PASSWORD","valueFrom": {"secretKeyRef": {"key": "database-password","name": "songs-postgresql"}}},{"name": "SPRING_DATASOURCE_USERNAME","valueFrom": {"secretKeyRef": {"key": "database-user","name": "songs-postgresql"}}}]}]}}}}' -n right-lyrics

oc expose svc songs-service -n right-lyrics

SONGS_SERVICE_ROUTE="http://$(oc get route songs-service -o jsonpath='{.spec.host}' -n right-lyrics)"

oc label dc songs-service app.openshift.io/runtime=spring -n right-lyrics
oc annotate dc songs-service app.openshift.io/connects-to=songs-postgresql,hits-service -n right-lyrics
```

### Lyrics Page

```bash
oc new-app nodejs:10~https://github.com/leandroberetta/right-lyrics \
    --name lyrics-page \
    --context-dir lyrics-page \
    -e NPM_RUN=serve \
    -n right-lyrics

oc expose svc lyrics-page -n right-lyrics 

LYRICS_PAGE_ROUTE="$(oc get route lyrics-page -o jsonpath='{.spec.host}' -n right-lyrics)"

echo "apiVersion: v1
kind: ConfigMap
metadata:
  name: lyrics-page
data:
  config.js: |
    window.SONGS_SERVICE = \"$SONGS_SERVICE_ROUTE/api/songs/\";" | oc apply -f - -n right-lyrics

oc set volume dc/lyrics-page --add -t configmap --configmap-name=lyrics-page --mount-path=/opt/app-root/src/build/config.js --sub-path=config.js --name=lyrics-page -n right-lyrics

oc label dc lyrics-page app.openshift.io/runtime=nodejs -n right-lyrics
oc annotate dc lyrics-page app.openshift.io/connects-to=songs-service,lyrics-service,albums-service -n right-lyrics
```

### Data Import

```bash
curl -H "Content-Type: application/json" -d '{"name": "Californication","artist": "Red Hot Chili Peppers"}' $SONGS_SERVICE_ROUTE/api/songs
curl -H "Content-Type: application/json" -d '{"name": "Even Flow","artist": "Pearl Jam"}' $SONGS_SERVICE_ROUTE/api/songs
curl -H "Content-Type: application/json" -d '{"name": "Everlong","artist": "Foo Fighters"}' $SONGS_SERVICE_ROUTE/api/songs
```