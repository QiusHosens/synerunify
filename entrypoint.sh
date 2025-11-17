#!/bin/sh
# start admin
nginx -c /etc/nginx/nginx.conf
# start server
#nohup ./system-server > /dev/null 2>&1 &
nohup ./logger-server > /dev/null 2>&1 &
nohup ./file-server > /dev/null 2>&1 &
nohup ./erp-server > /dev/null 2>&1 &
nohup ./mall-server > /dev/null 2>&1 &

nohup ./captcha-service > /dev/null 2>&1 &

./system-server
