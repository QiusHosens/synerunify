#!/bin/bash
# start http server
#nohup /app/venv/bin/python src/http_server.py > /app/log.txt 2>&1 &
nohup /app/venv/bin/python app/main.py > /app/log.txt 2>&1 &
# start grpc server
/app/venv/bin/python src/grpc_server.py > /app/log.txt