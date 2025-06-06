#!/bin/sh
docker save -o captcha-service.tar synerunify/captcha-service
ctr -n k8s.io images import captcha-service.tar
rm captcha-service.tar