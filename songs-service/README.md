# Songs Service

## Prepare Local Enviroment

Note: The [Hits service](../hits-service) needs to be running.

### Create PostgreSQL

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

### Test

```bash
mvn clean install 

java -Dspring.profiles.active=dev -jar target/rl-songs-service-1.1.jar

curl localhost:8081/api/song/2
```

#### Cleanup

```bash
docker stop postgresql-rl && docker rm postgresql-rl
```
