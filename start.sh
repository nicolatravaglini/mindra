#!/bin/bash
cd /home/nicola/Documents/code/mindra
npm run build
pm2 start server.js --name mindra
