import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 현재 파일의 디렉토리 경로를 얻습니다.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function afterResponse(requestParams, response, context, ee, next) {
  const email = requestParams.json?.email || 'user1@example.com'; // 기본값 설정
  const tokenPath = path.join(__dirname, `${email.replace('@', '_').replace('.', '_')}_token.txt`);

  try {
    if (context.vars.accessToken) {
      fs.writeFileSync(tokenPath, context.vars.accessToken, 'utf8');
      console.log(`Access token saved to ${tokenPath}`);
    }

    // Job ID 저장
    if (context.vars.jobId) {
      const jobIdPath = path.join(__dirname, 'jobId.txt');
      fs.writeFileSync(jobIdPath, context.vars.jobId, 'utf8');
      console.log(`Job ID saved to ${jobIdPath}`);
    }
  } catch (err) {
    console.error('Error writing to file:', err);
  }

  return next();
}

export function beforeRequestWithUser(userFileName) {
  return function (requestParams, context, ee, next) {
    try {
      const tokenPath = path.join(__dirname, `${userFileName}_token.txt`);
      const token = fs.readFileSync(tokenPath, 'utf8');

      if (!requestParams.headers) {
        requestParams.headers = {};
      }

      requestParams.headers['Authorization'] = `Bearer ${token}`;
    } catch (err) {
      console.error('Error reading token file:', err);
    }
    return next();
  };
}

export function loadJobId(requestParams, context, ee, next) {
  try {
    const jobIdPath = path.join(__dirname, 'jobId.txt');
    const jobId = fs.readFileSync(jobIdPath, 'utf8');
    context.vars.jobId = jobId;
  } catch (err) {
    console.error('Error reading jobId file:', err);
  }
  return next();
}
