#!/bin/sh
# start admin
nginx -c /etc/nginx/nginx.conf
nginx -s reload
# start server
nohup ./system-server > /dev/null 2>&1 &
nohup ./logger-server > /dev/null 2>&1 &
