#!/bin/bash
export PORT=3333
cd /var/app/current
npm run eb:prod

# 배포 전 테스트 실행 명령어
# chmod +x .platform/hooks/prebuild/01_start_app.sh