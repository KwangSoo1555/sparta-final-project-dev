# Base image
FROM node:alpine

# RUN:  지정한 명령어 실행
# mkdir -p /var/app : 컨테이너 내부에 경로 생성
# -p : 부모 디렉토리가 없으면 경고 없이 경로를 생성한다.
# 즉, /var/app 이라는 경로를 생성 시 /var 가 없으면 경고 없이 생성해준다.
RUN mkdir -p /var/app 

# app directory 생성
WORKDIR /var/app

# package.json 과 package-lock.json 파일을 복사
COPY package*.json ./

# 환경 변수 주입 후 npm 모듈 설치 (buildkit 엔진으로 .env 파일을 주입)
RUN --mount=type=secret,id=env,target=/var/app/.env \source /var/app/.env && npm install

# COPY source(카피할 파일 경로 -) dest(카피할 파일을 넣을 경로 = WORKDIR)
# . : 호스트의 현재 디렉토리, . : 컨테이너 내부의 작업 디렉토리
# 즉, 현재 디렉토리에 있는 모든 파일을 컨테이너 내부의 /var/app 으로 복사
COPY . .

# 환경 변수 주입 후 빌드 (buildkit 엔진으로 .env 파일을 주입)
RUN --mount=type=secret,id=env,target=/var/app/.env \source /var/app/.env && npm run build

# 키네시스 에이전트 주입
# RUN apt-get update && apt-get install -y gnupg


# 포트 개방
EXPOSE 3333

# node 는 Node 환경에서 파일을 실행 시 사용되는 키워드이다.
# dist/main.js 는 node 키워드로 실행하고자 하는 파일의 경로이다.
# 즉, 도커 컨테이너가 실행될 때 dist/mian.js 를 같이 실행(node) 한다.
CMD [ "node", "dist/src/main.js" ]