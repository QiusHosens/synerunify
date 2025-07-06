#!/bin/sh
docker save -o fileview.tar synerunify/fileview
ctr -n k8s.io images import fileview.tar
rm fileview.tar