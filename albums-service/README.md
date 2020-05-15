# Albums Service

## Test in Local Environment

    docker run --name rl-albums-mysql \
        -e MYSQL_ROOT_PASSWORD=right-lyrics \
        -e MYSQL_USER=right-lyrics \
        -e MYSQL_PASSWORD=right-lyrics \
        -e MYSQL_DATABASE=right-lyrics \
        -p 3306:3306 -d mysql:latest
        
    export QUARKUS_DATASOURCE_JDBC_URL=jdbc:mysql://localhost:3306/right-lyrics
    export QUARKUS_DATASOURCE_USERNAME=right-lyrics
    export QUARKUS_DATASOURCE_PASSWORD=right-lyrics
    
    ./mvnw compile quarkus:dev    

## Deploy in OpenShift

    oc new-app --template=mysql-persistent -n right-lyrics \
        -p DATABASE_SERVICE_NAME=rl-albums-mysql \
        -p MYSQL_USER=right-lyrics \
        -p MYSQL_PASSWORD=right-lyrics \ 
        -p MYSQL_ROOT_PASSWORD=right-lyrics \
        -p MYSQL_DATABASE=right-lyrics \
    
    oc new-app quay.io/quarkus/ubi-quarkus-native-s2i:19.3.1-java11~https://github.com/leandroberetta/right-lyrics.git \ 
        --context-dir=albums-service \
        --name=quarkus-quickstart-native \
        -e QUARKUS_DATASOURCE_JDBC_URL=jdbc:mysql://rl-albums-mysql:3306/right-lyrics
        -e QUARKUS_DATASOURCE_USERNAME=right-lyrics
        -e QUARKUS_DATASOURCE_PASSWORD=right-lyrics
        -n right-lyrics       