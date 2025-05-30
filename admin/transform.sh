#!/bin/sh
docker save -o admin-ui.tar synerunify/admin-ui
ctr -n k8s.io images import admin-ui.tar
rm admin-ui.tar