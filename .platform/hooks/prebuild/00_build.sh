#!/bin/bash

# Navigate to the app staging directory
cd /var/app/current

# npm 의존성 설치 및 프로젝트 빌드
npm install
npm run build

# 로그 파일 설정
LOG_FILE="/var/log/prebuild.log"

# AWS CLI 설치
if ! command -v aws &> /dev/null; then
    yum update
    yum install -y awscli
fi

# 로그 파일에 기록echo "AWS CLI version:" >> $LOG_FILE
aws --version >> $LOG_FILE

# Elastic IP 정보
EIP_ALLOCATION_ID="eipalloc-0257480a97665b382"
REGION="ap-northeast-2"

# 인스턴스 ID 가져오기
INSTANCE_ID=$(curl http://169.254.169.254/latest/meta-data/instance-id)
echo "Instance ID: $INSTANCE_ID" >> $LOG_FILE

# Elastic IP 연결
ASSOCIATE_OUTPUT=$(aws ec2 associate-address --instance-id $INSTANCE_ID --allocation-id $EIP_ALLOCATION_ID --region $REGION 2>&1)
echo "Associate Output: $ASSOCIATE_OUTPUT" >> $LOG_FILE
