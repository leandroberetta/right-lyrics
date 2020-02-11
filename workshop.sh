######## stage 1: preparacion
oc new-app mongodb-ephemeral -p MONGODB_DATABASE=right-lyrics  -p MONGODB_USER=right-lyrics -p MONGODB_PASSWORD=right-lyrics -p MONGODB_ADMIN_PASSWORD=right-lyrics -p DATABASE_SERVICE_NAME=rl-lyrics-mongodb
oc new-app postgresql-ephemeral -p POSTGRESQL_USER=right-lyrics -p POSTGRESQL_PASSWORD=right-lyrics -p POSTGRESQL_DATABASE=right-lyrics -p DATABASE_SERVICE_NAME=rl-songs-postgresql
oc new-app redis-ephemeral -p DATABASE_SERVICE_NAME=rl-hits-redis -p REDIS_PASSWORD=right-lyrics

######## stage 2: creacion de las imagenes 
oc new-build redhat-openjdk18-openshift:1.5~https://github.com/leandroberetta/right-lyrics.git --context-dir=songs-service --name=rl-songs-service
oc new-build nodejs:10~https://github.com/leandroberetta/right-lyrics.git --context-dir=lyrics-page --name=rl-lyrics-page
oc new-build nodejs:10~https://github.com/leandroberetta/right-lyrics.git --context-dir=lyrics-service --name=rl-lyrics-service
oc new-build python:3.6~https://github.com/leandroberetta/right-lyrics.git --context-dir=hits-service --name=rl-hits-service

######## stage 3: aprovisionamiento de los servicios
oc new-app -i rl-hits-service -e DB_HOST=rl-hits-redis -e DB_PASSWORD=right-lyrics --name=rl-hits-service
oc new-app -i rl-lyrics-service --name=rl-lyrics-service -e DB_HOST=rl-lyrics-mongodb -e DB_NAME=right-lyrics -e DB_PASSWORD=right-lyrics -e DB_USERNAME=right-lyrics
oc new-app -i rl-lyrics-page --name=rl-lyrics-page -e PORT=8080
oc new-app -i rl-songs-service -e SPRING_DATASOURCE_PASSWORD=right-lyrics -e SPRING_DATASOURCE_URL=jdbc:postgresql://rl-songs-postgresql:5432/right-lyrics -e SPRING_DATASOURCE_USERNAME=right-lyrics -e HITS_SERVICE_URL=http://rl-hits-service:8080 --name=rl-songs-service

######## stage 4: exponer servicios
oc expose svc/rl-lyrics-page
oc expose svc/rl-lyrics-service
oc expose svc/rl-songs-service

####### stage 5a: configuracion del webclient con config.js

    window.ENV = {
        "RL_SONGS_SERVICE":"http://rl-songs-service-< meta.namespace>.<routes_base_domain>",
        "RL_LYRICS_SERVICE":"http://rl-lyrics-service-< meta.namespace>.<routes_base_domain>"
    }

######## stage 5b: configmap para configurar el webclient
oc create configmap rl-lyrics-page --from-file=config.js && rm config.js

######## stage 5c: montar configuracion en webclient
oc set volume dc/rl-lyrics-page --add --sub-path=config.js -m /opt/app-root/src/public/ -t configmap --configmap-name=rl-lyrics-page

####### stage 6a: configuracion de mongodb con lyrics.json 

    {"_id":{"$oid":"5d72534eef68ea00194ac5e8"},"name":"Californication","lyric":"Psychic spies from China  \nTry to steal your mind's elation  \nLittle girls from Sweden  \nDream of silver screen quotations  \nAnd if you want these kind of dreams  \nIt's Californication  \n\nIt's the edge of the world  \nAnd all of western civilization  \nThe sun may rise in the East  \nAt least it settles in the final location  \nIt's understood that Hollywood  \nSells Californication  \n\nPay your surgeon very well  \nTo break the spell of aging  \nCelebrity skin is this your chin  \nOr is that war you're waging?  \n\nFirst born unicorn  \nHard core soft porn  \nDream of Californication  \nDream of Californication  \nDream of Californication  \nDream of Californication  \n\nMarry me girl be my fairy to the world  \nBe my very own constellation  \nA teenage bride with a baby inside  \nGetting high on information  \nAnd buy me a star on the boulevard  \nIt'sCalifornication  \n\nSpace may be the final frontier  \nBut it's made in a Hollywood basement  \nCobain can you hear the spheres  \nSinging songs off station to station  \nAnd Alderaan's not far away  \nIt's Californication  \n\nBorn and raised by those who praise  \nControl of population everybody's been there and  \nI don't mean on vacation  \n\nFirst born unicorn  \nHard core soft porn  \nDream of Californication  \nDream of Californication  \nDream of Californication  \nDream of Californication  \n\nDestruction leads to a very rough road  \nBut it also breeds creation  \nAnd earthquakes are to a girl's guitar  \nThey're just another good vibration  \nAnd tidal waves couldn't save the world  \nFrom Californication  \n\nPay your surgeon very well  \nTo break the spell of aging  \nSicker than the rest  \nThere is no test  \nBut this is what you're craving  \n\nFirst born unicorn  \nHard core soft porn  \nDream of Californication  \nDream of Californication  \nDream of Californication  \nDream of Californication  ","__v":0}
    {"_id":{"$oid":"5d725355ef68ea00194ac5e9"},"name":"Even Flow","lyric":"Freezin', rests his head on a pillow made of concrete, again  \nOh, feelin' maybe he'll see a little better, set of days, ooh yeah  \nOh, hand out, faces that he sees time again ain't that familiar, oh yeah  \nOh, dark grin, he can't help, when he's happy looks insane, oh yeah  \n\nEven flow, thoughts arrive like butterflies  \nOh, hedon't know, so he chases them away  \nSomeday yet, he'll begin his life again  \nLife again, life again...  \n\nKneelin', looking through the paper though he doesn't know to read, ooh yeah  \nOh, prayin', now to something that has never showed him anything  \nOh, feelin', understands the weather of the winters on its way  \nOh, ceilings, few and far between all the legal halls of shame, yeah  \n\nEven flow, thoughts arrive like butterflies  \nOh, he don't know, so he chases them away  \nSomeday yet, he'll begin his life again  \n\nWhispering hands, gently lead him away  \nHim away, him away...  \nYeah!  \nWoo...ah yeah...fuck it up...  \n\nEven flow, thoughts arrive likebutterflies  \nOh, he don't know, so he chases them away  \nSomeday yet, he'll begin his life again, yeah  \n\nOh, whispering hands, gently lead him away  \nHim away, him away...  \nYeah!  \nWoo...uh huh...yeah, yeah, mommy, mommy...  ","__v":0}
    {"_id":{"$oid":"5d72535def68ea00194ac5ea"},"name":"Everlong","lyric":"Hello  \nI've waited here for you  \nEverlong  \nTonight  \nI throw myself into  \nAnd out of the red  \nOut of her head she sang  \n\nCome down  \nAnd waste away with me  \nDown with me  \nSlow how  \nYou wanted it to be  \nI'm over my head  \nOut of her head she sang  \n\nAnd I wonder  \nWhen I sing along with you  \nIf everything could ever feel this real forever  \nIf anything could ever be this good again  \nThe only thing I'll ever ask of you  \nYou gotta promisenot to stop when I say when she sang  \n\nBreathe out  \nSo I can breathe you in  \nHold you in  \nAnd now  \nI know you've always been \nOut of your head  \nOut of my head I sang  \n\nAnd I wonder  \nWhen I sing along with you  \nIf everything could ever feel this realforever  \nIf anything could ever be this good again  \nThe only thing I'll ever ask of you  \nYou gotta promise not to stop when I saywhen she sang  \n\nSo, Dad would take the Sundays off.  \nAnd that's the only time he could ever get any rest.  \nAnd so, because we were loud on Sundays, he'd make us hold his construction boots over our head, 'til we'd sleep.  \nAnd they were really heavy boots and I used to say, \"Dad, come on, please.\"  \nAnd like start crying, 'cause they're too heavy.  \n\nAnd I wonder  \nIf everything could ever feel this real forever  \nIf anything could ever be this good again  \nThe only thing I'll ever ask of you  \nYou've got to promise not to stop when I say when  ","__v":0}

######## stage 6b: configmap para configurar el mongodb
oc create cm rl-lyrics-mongodb-import --from-file=./lirycs.json

######## stage 6c: montar configuracion en mongo
oc set volume dc/rl-lyrics-mongodb --add -m /tmp/data -t configmap --configmap-name=rl-lyrics-mongodb-import

######## stage 6d: creacion de un posthook para mongodb 
oc patch dc/rl-lyrics-mongodb -p '{"spec": {"strategy": {"recreateParams": {"post": {"execNewPod": {"command": ["/bin/sh","-i","-c","mongoimport --collection=lyrics --username=right-lyrics --password=right-lyrics\n--db=right-lyrics --file=/tmp/data/lyrics.json --host=rl-lyrics-mongodb:27017"],"containerName": "mongodb","volumes": ["rl-lyrics-mongodb-import"]},"failurePolicy": "Abort"}},"type": "Recreate"}}}'

######## stage 7: pruebas de vida
oc patch dc/rl-lyrics-service -p '{"spec": {"template": {"spec": { "containers": [{"name": "rl-lyrics-service","readinessProbe": {"httpGet": {"path": "/health","port": 8080,"scheme": "HTTP"},"initialDelaySeconds": 60,"timeoutSeconds": 3,"periodSeconds": 10},"livenessProbe": {"httpGet": {"path": "/health","port": 8080,"scheme": "HTTP"},"initialDelaySeconds": 60,"timeoutSeconds": 3,"periodSeconds": 10}}]}}}}'
oc patch dc/rl-hits-service -p '{"spec": {"template": {"spec": { "containers": [{"name": "rl-lyrics-service","readinessProbe": {"httpGet": {"path": "/health","port": 8080,"scheme": "HTTP"},"initialDelaySeconds": 60,"timeoutSeconds": 3,"periodSeconds": 10},"livenessProbe": {"httpGet": {"path": "/health","port": 8080,"scheme": "HTTP"},"initialDelaySeconds": 60,"timeoutSeconds": 3,"periodSeconds": 10}}]}}}}'
oc patch dc/rl-lyrics-page -p '{"spec": {"template": {"spec": { "containers": [{"name": "rl-lyrics-service","readinessProbe": {"httpGet": {"path": "/","port": 8080,"scheme": "HTTP"},"initialDelaySeconds": 60,"timeoutSeconds": 3,"periodSeconds": 10},"livenessProbe": {"httpGet": {"path": "/","port": 8080,"scheme": "HTTP"},"initialDelaySeconds": 60,"timeoutSeconds": 3,"periodSeconds": 10}}]}}}}'
oc patch dc/rl-songs-service -p '{"spec": {"template": {"spec": { "containers": [{"name": "rl-lyrics-service","readinessProbe": {"httpGet": {"path": "/actuator/health","port": 8080,"scheme": "HTTP"},"initialDelaySeconds": 60,"timeoutSeconds": 3,"periodSeconds": 10},"livenessProbe": {"httpGet": {"path": "/actuator/health","port": 8080,"scheme": "HTTP"},"initialDelaySeconds": 60,"timeoutSeconds": 3,"periodSeconds": 10}}]}}}}'


######## stages opcionales
######## stage 8: etiqueto los componentes desplegados 

oc label dc rl-lyrics-mongodb app.kubernetes.io/part-of=right-lyrics
oc label dc rl-songs-postgresql app.kubernetes.io/part-of=right-lyrics
oc label dc rl-hits-redis app.kubernetes.io/part-of=right-lyrics
oc label dc rl-songs-service app.kubernetes.io/part-of=right-lyrics
oc label dc rl-lyrics-page app.kubernetes.io/part-of=right-lyrics
oc label dc rl-lyrics-service app.kubernetes.io/part-of=right-lyrics
oc label dc rl-hits-service app.kubernetes.io/part-of=right-lyrics

####### stage 9: iconos de las aplicaciones 

oc label dc rl-lyrics-mongodb app.openshift.io/runtime=mongodb
oc label dc rl-songs-postgresql app.openshift.io/runtime=postgresql
oc label dc rl-hits-redis app.openshift.io/runtime=redis
oc label dc rl-songs-service app.openshift.io/runtime=java
oc label dc rl-lyrics-page app.openshift.io/runtime=nodejs
oc label dc rl-lyrics-service app.openshift.io/runtime=nodejs
oc label dc rl-hits-service app.openshift.io/runtime=python

####### stage 10: annotations para indicar el vinculo entre los servicios

oc annotate dc rl-songs-service app.openshift.io/connects-to=rl-songs-postgresql,rl-hits-service
oc annotate dc rl-lyrics-page app.openshift.io/connects-to=rl-songs-service,rl-lyrics-service
oc annotate dc rl-lyrics-service app.openshift.io/connects-to=rl-lyrics-mongodb
oc annotate dc rl-hits-service app.openshift.io/connects-to=rl-hits-redis



#### en caso de que falle el posthook de mongodb porque no se puede instanciar el pod 
mongoimport --collection=lyrics --username=right-lyrics --password=right-lyrics --db=right-lyrics --file=/tmp/data/lyrics.json --host=rl-lyrics-mongodb:27017
