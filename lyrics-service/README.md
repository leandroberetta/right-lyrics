# Lyrics Service

## Prepare Local Enviroment

### Create mongoDB

```bash
USER=rl && \
PASS=rl && \
DB=rl && \
docker run --name mongodb-rl -d\
    -p 27017:27017 \
    -e MONGODB_ADMIN_PASSWORD=${PASS} \
    -e MONGODB_USER=${USER} \
    -e MONGODB_PASSWORD=${PASS} \
    -e MONGODB_DATABASE=${DB} \
    -v $(pwd)/lyrics.json:/tmp/lyrics.json \
    registry.redhat.io/rhscl/mongodb-36-rhel7:latest
```

### Load Lyrics Data

```bash
USER=rl && \
PASS=rl && \
DB=rl && \
docker exec mongodb-rl \
    mongoimport -c lyrics -d ${DB} -u ${USER} -p ${PASS}  --file /tmp/lyrics.json --host localhost:27017
```

### Test

```bash
npm i 
node app.js
curl localhost:8080/api/lyric/5d72534eef68ea00194ac5e8
```

### Cleanup

```bash
docker stop mongodb-rl && docker rm mongodb-rl
```


