#!/bin/bash
cd /home/nicola/Documents/code/mindra
NOW=$(date +"%Y-%m-%d %H:%M:%S")

git fetch origin main

LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse origin/main)

if [ "$LOCAL" != "$REMOTE" ]; then
    echo "[$NOW] Changes found, deploying..." >> restart.log
    ./restart.sh >> restart.log 2>&1
else
    echo "[$NOW] No changes" >> restart.log
fi

tail -n 1000 restart.log | sponge restart.log
