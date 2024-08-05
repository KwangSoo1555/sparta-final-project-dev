#!/bin/bash

# Navigate to the app staging directory
cd /var/app/staging

# npm 의존성 설치
npm install

# 프로젝트 빌드
npm run build

# Elastic IP 연결
# Variables
EIP_ALLOCATION_ID="eipalloc-0257480a97665b382"  # Elastic IP allocation ID
REGION="ap-northeast-2"  # 리전

# AWS CLI 설치
if ! command -v aws &> /dev/null; then
    apt-get update
    apt-get install -y awscli
fi

# 인스턴스 ID 가져오기 (이 주소는 EC2 인스턴스의 메타데이터를 가져오는 표준 URL로, 인스턴스 내에서 사용될 때 인스턴스 ID를 반환한다.)
INSTANCE_ID=$(curl http://169.254.169.254/latest/meta-data/instance-id)

# Elastic IP 연결
aws ec2 associate-address --instance-id $INSTANCE_ID --allocation-id $EIP_ALLOCATION_ID --region $REGION