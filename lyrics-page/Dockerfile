FROM registry.redhat.io/rhoar-nodejs/nodejs-10

COPY . .

RUN npm install && \
    npm run-script build
