# Lyrics Service

## Minikube (with pipelines)

### Prerequisites

Follow [this](../documentation/develop/README.md) guide before proceed.

### Deploy

```bash  
kubectl apply -f lyrics-service/k8s/overlays/local/pipeline.yaml -n right-lyrics

tkn pipeline start lyrics-pipeline -s build-bot -w name=source,claimName=lyrics-source -n right-lyrics
```

Wait for the pipeline to complete and then check the service:

```bash 
kubectl proxy &

curl ...
```    

## Local

### MongoDB

```bash
export DB_USERNAME=rl && \
export DB_PASSWORD=rl && \
export DB_NAME=rl && \
export DB_HOST=rl && \
docker run --name mongodb-rl -d\
    -p 27017:27017 \
    -e MONGODB_ADMIN_PASSWORD=${DB_PASSWORD} \
    -e MONGODB_USER=${DB_USERNAME} \
    -e MONGODB_PASSWORD=${DB_PASSWORD} \
    -e MONGODB_DATABASE=${DB_NAME} \
    -v lyrics.json:/tmp/lyrics.json \
    registry.redhat.io/rhscl/mongodb-36-rhel7:latest
```

### Lyrics

```bash
docker exec mongodb-rl mongoimport -c lyrics -d ${DB_NAME} -u ${DB_USERNAME} -p ${DB_PASSWORD}  --file /tmp/lyrics.json --host localhost:27017

npm install
node app.js

curl localhost:8080/api/lyric/5d72534eef68ea00194ac5e8
```

### Cleanup

```bash
docker stop mongodb-rl && docker rm mongodb-rl
```


