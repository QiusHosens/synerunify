#!/bin/sh

docker build -t synerunify/system-server -f Dockerfile.system-server .
docker build -t synerunify/logger-server -f Dockerfile.logger-server .