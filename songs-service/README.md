# Songs Service

## Minikube (with pipelines)

### Prerequisites

Follow [this](../documentation/develop/README.md) guide before proceed.

### Deploy

```bash  
kubectl apply -f songs-service/k8s/overlays/local/pipeline.yaml -n right-lyrics

tkn pipeline start songs-pipeline -s build-bot -w name=source,claimName=songs-source -n right-lyrics
```

Wait for the pipeline to complete and then check the service:

```bash 
kubectl proxy &

curl ...
```    

## Local

Note: The [Hits service](../hits-service) needs to be running.

### Deploy

#### PostgreSQL

```bash
USER=right-lyrics && \
PASS=right-lyrics && \
DB=right-lyrics && \

docker run --name postgresql-rl  -d \
    -p 5432:5432 \
    -e POSTGRESQL_ADMIN_PASSWORD=${PASS} \
    -e POSTGRESQL_USER=${USER} \
    -e POSTGRESQL_PASSWORD=${PASS} \
    -e POSTGRESQL_DATABASE=${DB} \
    registry.redhat.io/rhscl/postgresql-96-rhel7:latest
```

#### Songs

```bash
mvn clean install 

java -Dspring.profiles.active=dev -jar target/rl-songs-service-1.1.jar

curl localhost:8081/api/song/2
```

#### Cleanup

```bash
docker stop postgresql-rl && docker rm postgresql-rl
```
