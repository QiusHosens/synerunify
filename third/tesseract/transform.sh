#!/bin/sh
docker save -o tesseract.tar synerunify/tesseract
ctr -n k8s.io images import tesseract.tar
rm tesseract.tar