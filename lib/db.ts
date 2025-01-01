import fs from 'fs';
import path from 'path';
import Lock from 'async-lock';
import { formatDate } from '@/lib/utils';
import { DbSchema, CommentSchema, DbData } from '@/lib/schemas'


const lock = new Lock(); 

// JSON ファイルパス
const mockDbPath = path.resolve(process.cwd(), 'db', 'db.json');

// データ（仮DB）
let dbData: DbData = {
  accounts: [],
  patients: [],
  comments: [],
  maxCommentId : 0,
};

// ロードモックデータ
function loadMockData() {
  try {
    const data = fs.readFileSync(mockDbPath, 'utf-8');
    const parsedData = JSON.parse(data);

    // Zod でデータを検証
    dbData = DbSchema.parse(parsedData);

    if (dbData.comments.length > 0) {
      for (const comment of dbData.comments) {
          if (comment.id > dbData.maxCommentId) {
            dbData.maxCommentId = comment.id;
          }
      }
    }

  } catch (error) {
    console.error('Failed to load or validate mock data:', error);
  }
}

// APP起動時にモックデータをロードする
loadMockData();

// モックDBの操作
export const db = {
  // アカウントを取得する
  getAccounts: () => dbData.accounts,

  // 患者リストを取得する
  getPatients: () => dbData.patients,

  // 患者を取得する
  getPatientsByPatientId: (patientId: number) => {
    const patients = dbData.patients.filter((patient) => patient.id === patientId);
    if (patients.length === 0) {
      throw new Error(`Patient with ID ${patientId} not found.`);
    }
    return patients;
  },

  // 患者のコメントを取得する
  getCommentsByPatientId: (patientId: number) => {
    return dbData.comments.filter((comment) => comment.patientId === patientId);
  },

  // 患者にコメントを追加する
 // 患者にコメントを追加する
addComment: (content: string, patientId: number, accountId: number, accountName: string) => {
  return lock.acquire('dbDataLock', async () => {
    const newComment = CommentSchema.parse({
      id: ++dbData.maxCommentId,
      content,
      patientId,
      accountId,
      accountName,
      createdAt: formatDate(new Date()),
      updatedAt: formatDate(new Date()),
    });
    dbData.comments.push(newComment);

    // JSON に保存
    fs.writeFileSync(mockDbPath, JSON.stringify(dbData, null, 2));

    await loadMockData();
    return newComment;
  });
},

  // コメントを更新する
// コメントを更新する
updateComment: (commentId: number, newContent: string) => {
  return lock.acquire('dbDataLock', async () => {
    const commentIndex = dbData.comments.findIndex((comment) => comment.id === commentId);
    if (commentIndex === -1) {
      throw new Error(`Comment with ID ${commentId} not found.`);
    }

    // コメントと時間を更新する
    dbData.comments[commentIndex].content = newContent;
    dbData.comments[commentIndex].updatedAt = formatDate(new Date());

    // JSON に保存
    fs.writeFileSync(mockDbPath, JSON.stringify(dbData, null, 2));

    await loadMockData();
    return dbData.comments[commentIndex];
  });
},

  // コメントを削除する
// コメントを削除する
deleteComment: (commentId: number) => {
  return lock.acquire('dbDataLock', async () => {
    const commentIndex = dbData.comments.findIndex((comment) => comment.id === commentId);
    if (commentIndex === -1) {
      throw new Error(`Comment with ID ${commentId} not found.`);
    }

    // コメントを削除する
    const deletedComment = dbData.comments.splice(commentIndex, 1)[0];

    // JSON に保存
    fs.writeFileSync(mockDbPath, JSON.stringify(dbData, null, 2));

    await loadMockData();
    return deletedComment;
  });
},
};
