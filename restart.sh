#!/bin/bash
source "$NVM_DIR/nvm.sh"

cd /home/nicola/Documents/code/mindra
git pull
npm i
npm run build
pm2 restart mindra
