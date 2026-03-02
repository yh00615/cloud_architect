#!/usr/bin/env node

/**
 * DOWNLOAD Alert를 labEnvironments.ts와 동기화하는 스크립트
 *
 * 실행 방법:
 *   npx ts-node scripts/sync-download-alerts.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { labEnvironments, LabFile } from '../src/data/labEnvironments';

const CONTENT_DIR = path.join(__dirname, '../public/content');

/**
 * usedInTask 필드를 기반으로 "관련 태스크" 섹션 생성
 * 각 파일이 어디에 어떻게 사용되는지 설명
 */
function generateRelatedTasks(files: LabFile[]): string {
  const taskMap = new Map<string, LabFile[]>();

  // usedInTask별로 파일 그룹화
  files.forEach((file) => {
    if (file.usedInTask) {
      if (!taskMap.has(file.usedInTask)) {
        taskMap.set(file.usedInTask, []);
      }
      taskMap.get(file.usedInTask)!.push(file);
    }
  });

  if (taskMap.size === 0) {
    return '';
  }

  let result = '>\n> **관련 태스크:**\n>\n';

  // 태스크별로 상세 설명 생성
  Array.from(taskMap.entries()).forEach(([task, taskFiles]) => {
    // 파일이 1개인 경우: 간단하게 파일명만
    if (taskFiles.length === 1) {
      result += `> - **${task}**: \`${taskFiles[0].name}\`\n`;
    } else {
      // 파일이 여러 개인 경우: 파일명 나열
      const fileNames = taskFiles.map((f) => `\`${f.name}\``).join(', ');
      result += `> - **${task}**: ${fileNames}\n`;
    }
  });

  return result;
}

/**
 * 특정 차시의 DOWNLOAD Alert 동기화
 */
function syncDownloadAlert(week: number, session: number): boolean {
  const env = labEnvironments.find(
    (e) => e.week === week && e.session === session,
  );

  if (!env || !env.zipFileName || env.files.length === 0) {
    console.log(`⏭️  Week ${week}-${session}: 파일 없음, 건너뜀`);
    return false;
  }

  const weekDir = `week${week}`;
  const contentPath = path.join(CONTENT_DIR, weekDir);

  if (!fs.existsSync(contentPath)) {
    console.log(`⚠️  Week ${week}-${session}: 디렉토리 없음 (${contentPath})`);
    return false;
  }

  const files = fs.readdirSync(contentPath);
  const mdFile = files.find(
    (f) => f.startsWith(`${week}-${session}-`) && f.endsWith('.md'),
  );

  if (!mdFile) {
    console.log(`⚠️  Week ${week}-${session}: 마크다운 파일 없음`);
    return false;
  }

  const filePath = path.join(contentPath, mdFile);
  let content = fs.readFileSync(filePath, 'utf-8');

  // DOWNLOAD Alert 찾기 (더 정확한 정규식)
  const downloadRegex = /> \[!DOWNLOAD\]\n([\s\S]*?)(?=\n\n(?:[^>]|$))/;
  const match = content.match(downloadRegex);

  if (!match) {
    console.log(`⚠️  Week ${week}-${session}: DOWNLOAD Alert 없음`);
    return false;
  }

  // 새로운 DOWNLOAD Alert 생성
  const zipPath = `/files/${weekDir}/${env.zipFileName}`;
  let newAlert = `> [!DOWNLOAD]\n> [${env.zipFileName}](${zipPath})\n>\n`;

  // 파일 목록 (description 포함)
  env.files.forEach((file) => {
    newAlert += `> - \`${file.name}\` - ${file.description}\n`;
  });

  // 관련 태스크 섹션 생성
  const relatedTasks = generateRelatedTasks(env.files);
  newAlert += relatedTasks;

  // 기존 Alert 교체
  content = content.replace(downloadRegex, newAlert.trimEnd());

  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`✅ Week ${week}-${session}: 업데이트 완료 (${mdFile})`);
  return true;
}

// 메인 실행
console.log('🔄 DOWNLOAD Alert 동기화 시작...\n');
console.log('📁 대상 디렉토리:', CONTENT_DIR);
console.log('');

let successCount = 0;
let skipCount = 0;
let errorCount = 0;

labEnvironments.forEach((env) => {
  if (env.hasPrerequisites && env.zipFileName) {
    try {
      const result = syncDownloadAlert(env.week, env.session);
      if (result) {
        successCount++;
      } else {
        skipCount++;
      }
    } catch (error) {
      console.error(`❌ Week ${env.week}-${env.session}: 오류 발생`, error);
      errorCount++;
    }
  }
});

console.log('');
console.log('✨ 동기화 완료!');
console.log(`   성공: ${successCount}개`);
console.log(`   건너뜀: ${skipCount}개`);
console.log(`   오류: ${errorCount}개`);
