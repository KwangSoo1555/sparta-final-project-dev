#!/bin/bash

# artillery 폴더 경로
ARTILLERY_DIR="./artillery"

# Artillery 실행 옵션
RECORD_OPTION="--record"
KEY_OPTION="--key a9_VClUCUe8fLdFCs1t3E9wagm73hoS4aGi"

# 모든 YAML 파일 실행
for file in "$ARTILLERY_DIR"/*.yaml
do
  echo "Running test: $file"
  artillery run "$file" $RECORD_OPTION $KEY_OPTION
done

# ./run-all-artillery-tests.sh 실행 명령어 