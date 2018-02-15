#!/usr/bin/env bash
yarn &&
docker build -t filmsfr-web . && docker run -d -p 80:8080 filmsfr-web
