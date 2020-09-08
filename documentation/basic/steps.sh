#
# Right Lyrics
#
# A simple microservice architecture to deploy in OpenShift
#  
#
# https://github.com/leandroberetta/right-lyrics
#

oc new-project right-lyrics

#
# Hits Service
#

# Redis

oc new-app --template=redis-ephemeral \
    --name hits-redis \
    -p DATABASE_SERVICE_NAME=hits-redis \
    -p REDIS_PASSWORD=right-lyrics \
    -n right-lyrics

oc label dc hits-redis app.openshift.io/runtime=redis -n right-lyrics

# Hits Service

oc new-app python:3.6~https://github.com/leandroberetta/right-lyrics \
    --name hits-service \
    --context-dir hits-service \
    -n right-lyrics

oc patch dc/hits-service -p  '{"spec": {"template": {"spec": {"containers": [{"name": "hits-service","env": [{"name": "DB_HOST","value": "hits-redis"},{"name": "DB_PASSWORD","valueFrom": {"secretKeyRef": {"key": "database-password","name": "hits-redis"}}}]}]}}}}' -n right-lyrics

oc expose svc hits-service -n right-lyrics

oc label dc hits-service app.openshift.io/runtime=python -n right-lyrics
oc annotate dc hits-service app.openshift.io/connects-to=hits-redis -n right-lyrics

#
# Songs Service
#

# PostgreSQL

oc new-app --template postgresql-ephemeral \
    --name songs-postgresql \
    -p DATABASE_SERVICE_NAME=songs-postgresql \
    -p POSTGRESQL_USER=right-lyrics \
    -p POSTGRESQL_PASSWORD=right-lyrics \
    -p POSTGRESQL_DATABASE=right-lyrics \
    -n right-lyrics

oc label dc songs-postgresql app.openshift.io/runtime=postgresql -n right-lyrics

# Songs Service

oc new-app redhat-openjdk18-openshift:1.7~https://github.com/leandroberetta/right-lyrics \
    --name songs-service \
    --context-dir songs-service \
    -e HITS_SERVICE_URL=http://hits-service:8080 \
    -n right-lyrics

oc patch dc/songs-service -p '{"spec": {"template": {"spec": {"containers": [{"name": "songs-service","env": [{"name": "SPRING_DATASOURCE_URL","value": "jdbc:postgresql://songs-postgresql:5432/right-lyrics"},{"name": "SPRING_DATASOURCE_PASSWORD","valueFrom": {"secretKeyRef": {"key": "database-password","name": "songs-postgresql"}}},{"name": "SPRING_DATASOURCE_USERNAME","valueFrom": {"secretKeyRef": {"key": "database-user","name": "songs-postgresql"}}}]}]}}}}' -n right-lyrics

oc expose svc songs-service -n right-lyrics

SONGS_SERVICE_ROUTE="http://$(oc get route songs-service -o jsonpath='{.spec.host}' -n right-lyrics)"

oc label dc songs-service app.openshift.io/runtime=spring -n right-lyrics
oc annotate dc songs-service app.openshift.io/connects-to=songs-postgresql,hits-service -n right-lyrics

#
# Lyrics Page
#

oc new-app nodejs:10~https://github.com/leandroberetta/right-lyrics \
    --name lyrics-page \
    --context-dir lyrics-page \
    -e NPM_RUN=serve \
    -n right-lyrics

oc expose svc lyrics-page -n right-lyrics 

LYRICS_PAGE_ROUTE="$(oc get route lyrics-page -o jsonpath='{.spec.host}' -n right-lyrics)"

echo "apiVersion: v1
kind: ConfigMap
metadata:
  name: lyrics-page
data:
  config.js: |
    window.SONGS_SERVICE = \"$SONGS_SERVICE_ROUTE/api/songs/\";" | oc apply -f - -n right-lyrics

oc set volume dc/lyrics-page --add -t configmap --configmap-name=lyrics-page --mount-path=/opt/app-root/src/build/config.js --sub-path=config.js --name=lyrics-page -n right-lyrics

oc label dc lyrics-page app.openshift.io/runtime=nodejs -n right-lyrics
oc annotate dc lyrics-page app.openshift.io/connects-to=songs-service,lyrics-service,albums-service -n right-lyrics

#curl -H "Content-Type: application/json" -d '{"name": "Californication","artist": "Red Hot Chili Peppers"}' $SONGS_SERVICE_ROUTE/api/songs
#curl -H "Content-Type: application/json" -d '{"name": "Even Flow","artist": "Pearl Jam"}' $SONGS_SERVICE_ROUTE/api/songs
#curl -H "Content-Type: application/json" -d '{"name": "Everlong","artist": "Foo Fighters"}' $SONGS_SERVICE_ROUTE/api/songs

#
# Keycloak
#

oc apply -k ./keycloak/k8s/base -n right-lyrics

oc expose svc keycloak -n right-lyrics

KEYCLOAK_ROUTE="http://$(oc get route keycloak -o jsonpath='{.spec.host}' -n right-lyrics)"

oc get cm right-lyrics-realm -o yaml -n right-lyrics > right-lyrics-realm.yaml

sed "s/right\.lyrics/$LYRICS_PAGE_ROUTE/g" right-lyrics-realm.yaml > right-lyrics-realm-replaced.yaml

oc apply -f right-lyrics-realm-replaced.yaml -n right-lyrics

rm right-lyrics-realm.yaml right-lyrics-realm-replaced.yaml

oc patch deployment/keycloak --patch "{\"spec\":{\"template\":{\"metadata\":{\"annotations\":{\"last-restart\":\"`date +'%s'`\"}}}}}" -n right-lyrics

echo "apiVersion: v1
kind: ConfigMap
metadata:
  name: lyrics-page
data:
  config.js: |
    window.SONGS_SERVICE = \"$SONGS_SERVICE_ROUTE/api/songs/\";
    window.KEYCLOAK_SERVICE = \"$KEYCLOAK_ROUTE/auth/\";
    window.KEYCLOAK_REALM = \"right-lyrics\";
    window.KEYCLOAK_CLIENT_ID = \"lyrics-page\";" | oc apply -f - -n right-lyrics

oc patch dc/lyrics-page --patch "{\"spec\":{\"template\":{\"metadata\":{\"annotations\":{\"last-restart\":\"`date +'%s'`\"}}}}}" -n right-lyrics

#
# Lyrics Service
#

# MongoDB

oc new-app --template=mongodb-ephemeral \
    --name lyrics-mongodb \
    -p DATABASE_SERVICE_NAME=lyrics-mongodb \
    -p MONGODB_USER=right-lyrics \
    -p MONGODB_PASSWORD=right-lyrics \
    -p MONGODB_DATABASE=right-lyrics \
    -n right-lyrics

oc label dc lyrics-mongodb app.openshift.io/runtime=mongodb -n right-lyrics

# Lyrics Service

oc new-app nodejs:10~https://github.com/leandroberetta/right-lyrics \
    --name lyrics-service \
    --context-dir lyrics-service \
    -n right-lyrics

oc patch dc/lyrics-service -p '{"spec": {"template": {"spec": {"containers": [{"name": "lyrics-service","env": [{"name": "DB_HOST","value": "lyrics-mongodb"},{"name": "DB_NAME","valueFrom": {"secretKeyRef": {"key": "database-name","name": "lyrics-mongodb"}}},{"name": "DB_USERNAME","valueFrom": {"secretKeyRef": {"key": "database-user","name": "lyrics-mongodb"}}}, {"name": "DB_PASSWORD","valueFrom": {"secretKeyRef": {"key": "database-password","name": "lyrics-mongodb"}}}]}]}}}}' -n right-lyrics

oc expose svc lyrics-service -n right-lyrics

LYRICS_SERVICE_ROUTE="http://$(oc get route lyrics-service -o jsonpath='{.spec.host}' -n right-lyrics)"

oc label dc lyrics-service app.openshift.io/runtime=nodejs -n right-lyrics
oc annotate dc lyrics-service app.openshift.io/connects-to=lyrics-mongodb -n right-lyrics

#
# Albums Service
#

# MariaDB

oc new-app --template=mariadb-ephemeral \
    --name albums-mariadb \
    -p DATABASE_SERVICE_NAME=albums-mariadb \
    -p MYSQL_USER=rl \
    -p MYSQL_PASSWORD=rl \
    -p MYSQL_DATABASE=rl \
    -n right-lyrics

# Albums Service

oc new-app openjdk-11-rhel8:1.1~https://github.com/leandroberetta/right-lyrics \
    --name albums-service \
    --context-dir albums-service \
    -n right-lyrics

oc patch dc/albums-service -p '{"spec": {"template": {"spec": {"containers": [{"name": "albums-service","env": [{"name": "QUARKUS_DATASOURCE_JDBC_URL","value": "jdbc:mysql://albums-mariadb:3306/rl"},{"name": "QUARKUS_DATASOURCE_PASSWORD","valueFrom": {"secretKeyRef": {"key": "database-password","name": "albums-mariadb"}}},{"name": "QUARKUS_DATASOURCE_USERNAME","valueFrom": {"secretKeyRef": {"key": "database-user","name": "albums-mariadb"}}}]}]}}}}' -n right-lyrics

oc expose svc albums-service -n right-lyrics

ALBUMS_SERVICE_ROUTE="http://$(oc get route albums-service -o jsonpath='{.spec.host}' -n right-lyrics)"

oc label dc albums-service app.openshift.io/runtime=quarkus -n right-lyrics
oc annotate dc albums-service app.openshift.io/connects-to=albums-mariadb -n right-lyrics

echo "apiVersion: v1
kind: ConfigMap
metadata:
  name: lyrics-page
data:
  config.js: |
    window.SONGS_SERVICE = \"$SONGS_SERVICE_ROUTE/api/songs/\";
    window.LYRICS_SERVICE = \"$LYRICS_SERVICE_ROUTE/api/lyrics/\";
    window.ALBUMS_SERVICE = \"$ALBUMS_SERVICE_ROUTE/api/albums/\";
    window.KEYCLOAK_SERVICE = \"$KEYCLOAK_ROUTE/auth/\";
    window.KEYCLOAK_REALM = \"right-lyrics\";
    window.KEYCLOAK_CLIENT_ID = \"lyrics-page\";" | oc apply -f - -n right-lyrics

oc patch dc/lyrics-page --patch "{\"spec\":{\"template\":{\"metadata\":{\"annotations\":{\"last-restart\":\"`date +'%s'`\"}}}}}" -n right-lyrics

oc label dc --all app.kubernetes.io/part-of=right-lyrics -n right-lyrics

#
# Import Service
#

oc new-app openjdk-11-rhel8:1.1~https://github.com/leandroberetta/right-lyrics \
    --name import-service \
    --context-dir import-service \
    -n right-lyrics

oc set env dc/import-service ALBUMS_SERVICE_BASE_URL=http://albums-service:8080 -n right-lyrics
oc set env dc/import-service LYRICS_SERVICE_BASE_URL=http://lyrics-service:8080 -n right-lyrics
oc set env dc/import-service SONGS_SERVICE_BASE_URL=http://songs-service:8080 -n right-lyrics

echo "apiVersion: v1
kind: ConfigMap
metadata:
  name: right-lyrics-data
data:
  data.yaml: |   
    - title: Californication
      artist: Red Hot Chili Peppers
      coverUrl: https://upload.wikimedia.org/wikipedia/en/d/df/RedHotChiliPeppersCalifornication.jpg
      year: 1999
      songs:
        - name: Californication
          lyrics: |-
            Psychic spies from China try to steal your mind's elation  
            And little girls from Sweden dream of silver screen quotation  
            And if you want these kind of dreams it's Californication  

            It's the edge of the world and all of Western civilization  
            The sun may rise in the East at least it's settled in a final location  
            It's understood that Hollywood sells Californication  

            Pay your surgeon very well to break the spell of aging  
            Celebrity skin, is this your chin, or is that war you're waging?  
            First born unicorn  
            Hardcore soft porn  

            Dream of Californication  
            Dream of Californication  
            Dream of Californication  
            Dream of Californication  

            Marry me, girl, be my fairy to the world, be my very own constellation  
            A teenage bride with a baby inside getting high on information  
            And buy me a star on the boulevard, it's Californication  

            Space may be the final frontier but it's made in a Hollywood basement  
            And Cobain can you hear the spheres singing songs off Station To Station?  
            And Alderaan's not far away, it's Californication  

            Born and raised by those who praise control of population  
            Well, everybody's been there and I don't mean on vacation  
            First born unicorn  
            Hardcore soft porn  

            Dream of Californication  
            Dream of Californication  
            Dream of Californication  
            Dream of Californication  

            Destruction leads to a very rough road but it also breeds creation  
            And earthquakes are to a girl's guitar, they're just another good vibration  
            And tidal waves couldn't save the world from Californication  

            Pay your surgeon very well to break the spell of aging  
            Sicker than the rest, there is no test, but this is what you're craving?  
            First born unicorn  
            Hardcore soft porn  

            Dream of Californication  
            Dream of Californication  
            Dream of Californication  
            Dream of Californication  
    - title: Ten
      artist: Pearl Jam
      coverUrl: https://upload.wikimedia.org/wikipedia/en/2/2d/PearlJam-Ten2.jpg
      year: 1991
      songs:
        - name: Even Flow
          lyrics: |-
            Freezin' rests his head on a pillow made of concrete again ooh yeah  
            Oh feelin' maybe he'll see a little betters any days ooh yeah  
            Oh hand out faces that he sees come again ain't that familiar  
            Oh dark grin he can't help when he's happy he looks insane  

            Even flow  
            Thoughts arrive like butterflies  
            Oh he don't know, so he chases them away  
            Someday yet he'll begin his life again  
            Life again, life again  

            Kneelin' looking through the paper though he doesn't know to read, ooh yeah  
            Oh, prayin', now to something that has never showed him anything  
            Oh, feelin', understands the weather or that winters on its way  
            Oh, ceilings, few and far between all the legal halls of shame, yeah  

            Even flow  
            Thoughts arrive like butterflies  
            Oh, he don't know, so he chases them away  

            Someday yet he'll begin his life again  
            Oh whispering hands, gently lead him away  
            Him away, him away  
            Yeah  
            Woo  
            Oh yeah yeah fuck it up  

            Even flow  
            Thoughts arrive like butterflies  
            Oh, he don't know, so he chases them away  

            Someday yet he'll begin his life again  
            Oh whispering hands, gently lead him away  
            Him away, him away  
            Yeah!  
            Woo  
            Uh huh yeah  
            Yeah yeah mommy, mommy  
    - title: The Colour And The Shape
      artist: Foo Fighters
      coverUrl: https://upload.wikimedia.org/wikipedia/en/0/0d/FooFighters-TheColourAndTheShape.jpg
      year: 1997
      songs:
        - name: Everlong
          lyrics: |-
            Hello  
            I've waited here for you  
            Everlong  

            Tonight I throw myself in two  
            Out of the red  
            Out of her head she sang  

            Come down and waste away with me  
            Down with me  
            Slow, how you wanted it to be  
            I'm over my head  
            Out of her head she sang  

            And I wonder  
            When I sing along with you  
            If everything could ever feel this real forever  
            If anything could ever be this good again  
            The only thing I'll ever ask of you  
            You've got to promise not to stop when I say when  
            She sang  

            Breathe out  
            So I can breathe you in  
            Hold you in  
            And now  
            I know you've always been  
            Out of your head  
            Out of my head I sang  

            And I wonder  
            When I sing along with you  
            If everything could ever feel this real forever  
            If anything could ever be this good again  
            The only thing I'll ever ask of you  
            You've got to promise not to stop when I say when  
            She sang  

            And I wonder  
            If everything could ever feel this real forever  
            If anything could ever be this good again  
            The only thing I'll ever ask of you  
            You've got to promise not to stop when I say when"| oc apply -f - -n right-lyrics

echo "apiVersion: batch/v1
kind: Job
metadata:
  name: import-data
spec:
  template:
    spec:
      volumes:
        - configMap:
            name: right-lyrics-data
          name: right-lyrics-data
      containers:
        - name: import
          image: registry.access.redhat.com/ubi8
          command: [/bin/sh]
          args: [-c, sleep 180; curl -v -F uploadedFile=@/tmp/data.yaml http://import-service:8080/api/import/upload]
          volumeMounts:
            - mountPath: /tmp/data.yaml
              name: right-lyrics-data
              subPath: data.yaml
      restartPolicy: Never" | oc apply -f - -n right-lyrics