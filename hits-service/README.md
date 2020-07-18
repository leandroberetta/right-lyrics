# Hits Service

## Local

```bash
export PASSWORD=right-lyrics && \
docker run -d --name hits-redis \
    -e REDIS_PASSWORD=${PASSWORD} \
    -p 6379:6379 -d \
    registry.redhat.io/rhel8/redis-5:latest

pip3 install -r requirements.txt

python app.py
```