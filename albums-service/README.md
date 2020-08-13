# Albums Service

## Local

```bash 
docker run --name rl-albums-mysql \
    -e MYSQL_ROOT_PASSWORD=right-lyrics \
    -e MYSQL_USER=right-lyrics \
    -e MYSQL_PASSWORD=right-lyrics \
    -e MYSQL_DATABASE=right-lyrics \
    -p 3306:3306 -d registry.access.redhat.com/rhscl/mariadb-102-rhel7
    
export QUARKUS_DATASOURCE_JDBC_URL=jdbc:mysql://localhost:3306/right-lyrics
export QUARKUS_DATASOURCE_USERNAME=right-lyrics
export QUARKUS_DATASOURCE_PASSWORD=right-lyrics

./mvnw compile quarkus:dev    
```