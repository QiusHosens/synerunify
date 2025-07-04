#!/bin/sh
docker save -o service-captcha.tar synerunify/service-captcha
ctr -n k8s.io images import service-captcha.tar
rm service-captcha.tar