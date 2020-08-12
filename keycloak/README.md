# Keycloak

## Local

```bash
docker run -p 8080:8080 \
    -e KEYCLOAK_USER=admin \
    -e KEYCLOAK_PASSWORD=admin \
    -e KEYCLOAK_IMPORT=/tmp/right-lyrics-realm.json
    -v $PWD/right-lyrics-realm.json:/tmp/right-lyrics-realm.json
    quay.io/keycloak/keycloak:11.0.0    
```