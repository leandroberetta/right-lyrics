# Lyrics Service

## Local

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

npm install
node app.js
```


