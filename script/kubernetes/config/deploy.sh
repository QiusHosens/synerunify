#!/bin/bash
kubectl delete -f config.yaml
kubectl apply -f config.yaml
