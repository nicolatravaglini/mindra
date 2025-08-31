#!/bin/bash
cd /home/nicola/Documents/code/mindra
pm2 start server.js --name mindra --env VITE_MINDRA_API="http://mindra.ddns.net"
