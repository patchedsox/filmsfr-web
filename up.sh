#!/usr/bin/env bash
yarn &&
docker build -t filmsfr-web . && docker run -d -p 8080:80 filmsfr-web
