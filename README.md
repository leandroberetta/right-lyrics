# Right Lyrics

TBD

## Components

* Lyrics Page
* Lyrics Service
* Songs Service

## Deploy on OpenShift

    oc new-app --template postgresql-ephemeral -p POSTGRESQL_DATABASE=rl-postgres -p POSTGRESQL_VERSION=10 -p POSTGRESQL_USER=right-lyrics -p POSTGRESQL_PASSWORD=right-lyrics -p DATABASE_SERVICE_NAME=rl-postgresql -n right-lyrics

    oc new-app --template mongodb-ephemeral -p MONGODB_DATABASE=rl-mongodb -p MONGODB_VERSION=3.6 -p MONGODB_USER=right-lyrics -p MONGODB_PASSWORD=right-lyrics -p DATABASE_SERVICE_NAME=rl-mongodb -n right-lyrics

    oc new-app -i nodejs:8 --code=https://github.com/leandroberetta/right-lyrics.git -e DB_USERNAME=right-lyrics -e DB_PASSWORD=right-lyrics -e DB_NAME=rl-mongodb -e DB_HOST=rl-mongodb --context-dir=lyrics-service --name=rl-lyrics-service -n right-lyrics

    oc new-app -i redhat-openjdk18-openshift:1.5 --code=https://github.com/leandroberetta/right-lyrics.git -e SPRING_DATASOURCE_URL=jdbc:postgresql://rl-postgres:5432/rl-postgres -e SPRING_DATASOURCE_USERNAME=right-lyrics -e SPRING_DATASOURCE_PASSWORD=rl-mongodb --context-dir=songs-service --name=rl-songs-service -n right-lyrics

    oc new-build https://github.com/leandroberetta/right-lyrics.git --context-dir=lyrics-page --strategy=docker --name lyrics-page-builder -n right-lyrics

    oc new-build -i nginx:1.12 --binary --name=rl-lyrics-page -n right-lyrics
    oc start-build rl-lyrics-page --from-dir=./lyrics-page/build/ -n right-lyrics
    oc new-app rl-lyric-page:latest -n right-lyrics
