# Right Lyrics

## Components

* Lyrics Page (React.js)
* Lyrics Service (Node.js)
* Songs Service (SpringBoot)

## Deploy on OpenShift

    oc new-app --name=rl-postgresql -n right-lyrics \
        -l app=rl-lyrics-service \
        --template postgresql-ephemeral \
        -p POSTGRESQL_DATABASE=rl-postgresql\
        -p POSTGRESQL_VERSION=10 \
        -p POSTGRESQL_USER=right-lyrics \
        -p POSTGRESQL_PASSWORD=right-lyrics \
        -p DATABASE_SERVICE_NAME=rl-postgresql 

    oc new-app --name=rl-lyrics-service -n right-lyrics \
        -i nodejs:8 \
        --code=https://github.com/leandroberetta/right-lyrics.git \
        --context-dir=lyrics-service \
        -e DB_USERNAME=right-lyrics \
        -e DB_PASSWORD=right-lyrics \
        -e DB_NAME=rl-mongodb \
        -e DB_HOST=rl-mongodb

    oc expose svc rl-lyrics-service -n right-lyrics

    oc new-app --name=rl-mongodb -n right-lyrics \
        -l app=rl-songs-service \
        --template mongodb-ephemeral \
        -p MONGODB_DATABASE=rl-mongodb \
        -p MONGODB_VERSION=3.6 \
        -p MONGODB_USER=right-lyrics \
        -p MONGODB_PASSWORD=right-lyrics \
        -p DATABASE_SERVICE_NAME=rl-mongodb 

    oc new-app --name=rl-songs-service -n right-lyrics \
        -i redhat-openjdk18-openshift:1.5 \
        --code=https://github.com/leandroberetta/right-lyrics.git \
        --context-dir=songs-service \
        -e SPRING_DATASOURCE_URL=jdbc:postgresql://rl-postgres:5432/rl-postgres \
        -e SPRING_DATASOURCE_USERNAME=right-lyrics \
        -e SPRING_DATASOURCE_PASSWORD=rl-mongodb 

    oc expose svc rl-songs-service -n right-lyrics

    oc new-build --name rl-lyrics-page-builder -n right-lyrics \
        --code=https://github.com/leandroberetta/right-lyrics.git \
        --context-dir=lyrics-page \
        --docker-image=nodejs:10 \
        --strategy=docker 

    oc new-build -i nginx:1.12 --name=rl-lyrics-page -n right-lyrics \
        --source-image=rl-lyrics-page-builder:latest \
        --source-image-path=/opt/app-root/src/build/.:.

    oc new-app rl-lyrics-page:latest --name=rl-lyrics-page -n right-lyrics
    
    oc expose svc rl-lyrics-page -n right-lyrics