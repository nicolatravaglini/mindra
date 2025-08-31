#!/bin/bash
cd /home/nicola/Documents/code/mindra
NOW=$(date +"%Y-%m-%d %H:%M:%S")

git fetch origin main

LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse origin/main)

if [ "$LOCAL" != "$REMOTE" ]; then
    echo "[$NOW] Changes found, deploying..." >> restart.log
    ./restart.sh
else
    echo "[$NOW] No changes" >> restart.log
fi

tail -n 60 restart.log | sponge restart.log
