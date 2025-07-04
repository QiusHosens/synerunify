#!/bin/sh
docker save -o service-system.tar synerunify/service-system
ctr -n k8s.io images import service-system.tar
rm service-system.tar

docker save -o service-logger.tar synerunify/service-logger
ctr -n k8s.io images import service-logger.tar
rm service-logger.tar

docker save -o service-file.tar synerunify/service-file
ctr -n k8s.io images import service-file.tar
rm service-file.tar

docker save -o service-erp.tar synerunify/service-erp
ctr -n k8s.io images import service-erp.tar
rm service-erp.tar