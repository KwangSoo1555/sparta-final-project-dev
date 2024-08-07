#!/bin/bash
cp .platform/nginx/conf.d/nginx_config.conf /etc/nginx/conf.d/

# 배포 전 테스트 실행 명령어
# chmod +x .platform/hooks/prebuild/00_copy_nginx_config.sh