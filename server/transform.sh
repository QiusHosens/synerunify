#!/bin/sh
docker save -o system-server.tar synerunify/system-server
ctr -n k8s.io images import system-server.tar
rm system-server.tar

docker save -o logger-server.tar synerunify/logger-server
ctr -n k8s.io images import logger-server.tar
rm logger-server.tar