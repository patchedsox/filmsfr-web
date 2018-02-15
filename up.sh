#!/usr/bin/env bash
yarn &&
node_modules/.bin/ng build --prod --aot &&
docker build -t filmsfr-web . && docker run -p 8080:8080 filmsfr-web
