# Albums Service

For testing the services the following Postman library can be used:

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/c9b134cf391caba635d7)

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

## Deploy in OpenShift (Quarkus Native)

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

## Deploy in Minikube (Quarkus on JVM) using Tekton Pipelines

    minikube start

    helm install rl-albums-mysql stable/mysql --set slave.replicas=0 -n right-lyrics

    kubectl apply --filename https://storage.googleapis.com/tekton-releases/pipeline/latest/release.yaml

    kubectl apply -f https://raw.githubusercontent.com/tektoncd/catalog/v1beta1/buildah/buildah.yaml -n right-lyrics
    kubectl apply -f https://raw.githubusercontent.com/tektoncd/catalog/v1beta1/git/git-clone.yaml -n right-lyrics
    kubectl apply -f https://raw.githubusercontent.com/tektoncd/catalog/v1beta1/maven/maven.yaml -n right-lyrics

    kubectl apply -f pipeline.yaml -n right-lyrics