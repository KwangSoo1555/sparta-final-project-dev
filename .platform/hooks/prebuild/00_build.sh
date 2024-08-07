#!/bin/bash

# Navigate to the app staging directory
cd /var/app/current

# npm 의존성 설치 및 프로젝트 빌드
npm install
npm run build

# AWS CLI 설치
if ! command -v aws &> /dev/null; then
    yum update
    yum install -y awscli
fi
