# Right Lyrics - Hits Service

### Local enviroment


#### Create Redis
```bash
PASSWORD=pass && \
docker run -d --name redis-rl \
-e REDIS_PASSWORD=${PASSWORD} \
-p 6379:6379 -d \
registry.redhat.io/rhel8/redis-5:latest
```

#### Test

```bash
pip3 install -r requirements.txt
python app.py
curl localhost:8080/api/popularity/2
```

#### Clean all

```bash
docker stop redis-rl && docker rm redis-rl
```
