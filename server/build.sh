#!/bin/sh

docker build -t synerunify/service-system -f Dockerfile.service-system .
docker build -t synerunify/service-logger -f Dockerfile.service-logger .
docker build -t synerunify/service-file -f Dockerfile.service-file .
docker build -t synerunify/service-erp -f Dockerfile.service-erp .
docker build -t synerunify/service-mall -f Dockerfile.service-mall .