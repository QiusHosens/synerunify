#!/bin/sh
docker save -o synerunify.tar synerunify/synerunify
ctr -n k8s.io images import synerunify.tar
rm synerunify.tar