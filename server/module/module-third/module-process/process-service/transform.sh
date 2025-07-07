#!/bin/sh
docker save -o service-process.tar synerunify/service-process
ctr -n k8s.io images import service-process.tar
rm service-process.tar