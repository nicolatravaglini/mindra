#!/bin/bash
cd /home/nicola/Documents/code/mindra
git pull
npm i
npm run build
pm2 restart mindra
