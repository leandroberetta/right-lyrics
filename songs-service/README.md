# Songs Service

## Local

Note: The [Hits service](../hits-service) needs to be running.

```bash
export USER=right-lyrics && \
export PASS=right-lyrics && \
export DB=right-lyrics && \

docker run --name songs-postgresql -d \
    -p 5432:5432 \
    -e POSTGRESQL_ADMIN_PASSWORD=${PASS} \
    -e POSTGRESQL_USER=${USER} \
    -e POSTGRESQL_PASSWORD=${PASS} \
    -e POSTGRESQL_DATABASE=${DB} \
    registry.access.redhat.com/rhscl/postgresql-96-rhel7

export HITS_SERVICE_URL=right.lyrics

mvn spring-boot:run
```