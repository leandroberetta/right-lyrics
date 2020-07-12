# Hits Service

## Minikube (with pipelines)

### Prerequisites

Follow [this](../documentation/develop/README.md) guide before proceed.

### Deploy

```bash  
kubectl apply -f hits-service/k8s/overlays/local/pipeline.yaml -n right-lyrics

echo "apiVersion: tekton.dev/v1beta1
kind: PipelineRun
metadata:
  name: hits-pipeline-run
spec:
  serviceAccountName: build-bot
  pipelineRef:
    name: hits-pipeline
  workspaces:
  - name: source
    persistentvolumeclaim:
      claimName: hits-source" | kubectl apply -f - -n right-lyrics

kubectl proxy &

curl http://localhost:8001/api/v1/namespaces/right-lyrics/services/http:hits-service:tcp-8080/proxy/api/hits1
curl http://localhost:8001/api/v1/namespaces/right-lyrics/services/http:hits-service:tcp-8080/proxy/api/popularity/1
```    

## Local

### Deploy

#### Redis

```bash
PASSWORD=right-lyrics && \
docker run -d --name hits-redis \
    -e REDIS_PASSWORD=${PASSWORD} \
    -p 6379:6379 -d \
    registry.redhat.io/rhel8/redis-5:latest
```

#### Hits

```bash
pip3 install -r requirements.txt

python app.py

curl localhost:5000/api/hits/1
curl localhost:5000/api/popularity/1
```

#### Cleanup

```bash
docker stop hits-redis && docker rm hits-redis
```
