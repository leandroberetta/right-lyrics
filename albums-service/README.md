# Albums Service

## Local

```bash 
docker run --name albums-mariadb \
    -e MYSQL_ROOT_PASSWORD=rl \
    -e MYSQL_USER=rl \
    -e MYSQL_PASSWORD=rl \
    -e MYSQL_DATABASE=rl \
    -p 3306:3306 -d registry.access.redhat.com/rhscl/mariadb-102-rhel7
    
export QUARKUS_DATASOURCE_JDBC_URL=jdbc:mysql://localhost:3306/rl
export QUARKUS_DATASOURCE_USERNAME=rl
export QUARKUS_DATASOURCE_PASSWORD=rl

./mvnw compile quarkus:dev    
```