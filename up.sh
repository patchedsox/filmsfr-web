#!/usr/bin/env bash
yarn &&
node_modules/.bin/ng build --prod --aot &&
docker build -t filmsfr-web . && docker run -d -p 8080:80 filmsfr-web
