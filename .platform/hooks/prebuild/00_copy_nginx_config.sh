#!/bin/bash
cp .platform/nginx/conf.d/nginx_config.conf /etc/nginx/conf.d/
chmod +x .platform/hooks/prebuild/00_copy_nginx_config.sh