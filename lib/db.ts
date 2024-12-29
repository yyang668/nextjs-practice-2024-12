import fs from 'fs';
import path from 'path';
import { formatDate } from '@/lib/utils'

// JSON ファイルパス
const mockDbPath = path.resolve(process.cwd(), 'db', 'db.json');

// データ（仮DB）
let dbData: { accounts: any[]; patients: any[]; comments: any[] } = {
  accounts: [],
  patients: [],
  comments: [],
};

// ロードモックデータ
function loadMockData() {
  try {
    const data = fs.readFileSync(mockDbPath, 'utf-8');
    dbData = JSON.parse(data);
  } catch (error) {
    console.error('Failed to load mock data:', error);
  }
}

//APP起動時にモックデータをロードする
loadMockData();

// モックDBの操作
export const db = {
  // アカウントを取得する
  getAccounts: () => dbData.accounts,

  // 患者リストを取得する
  getPatients: () => dbData.patients,

  // 患者を取得する
  getPatientsByPatientId: (patientId: number) => {
    const commentIndex = dbData.patients.filter((patient) => patient.id === patientId);
    return commentIndex;
  },

  // 患者のコメントを取得する
  getCommentsByPatientId: (patientId: number) =>
    dbData.comments.filter((comment) => comment.patientId === patientId),

  // 患者にコメントを追加する
  addComment: (content: string, patientId: number, accountId: number,accountName: string) => {
    const newComment = {
      id: dbData.comments.length + 1,
      content,
      patientId,
      accountId,
      accountName,
      createdAt: formatDate(new Date()),
      updatedAt: formatDate(new Date()),
    };
    dbData.comments.push(newComment);

    // JSON に保存
    fs.writeFileSync(mockDbPath, JSON.stringify(dbData, null, 2));
    return newComment;
  },

  // コメントを更新する
  updateComment: (commentId: number, newContent: string) => {
    const commentIndex = dbData.comments.findIndex((comment) => comment.id === commentId);
    if (commentIndex === -1) {
      throw new Error(`Comment with ID ${commentId} not found.`);
    }

    // コメントと時間を更新する
    dbData.comments[commentIndex].content = newContent;
    dbData.comments[commentIndex].updatedAt = formatDate(new Date());

    // JSON に保存
    fs.writeFileSync(mockDbPath, JSON.stringify(dbData, null, 2));
    return dbData.comments[commentIndex];
  },
  // コメントを削除する
  deleteComment: (commentId: number) => {
    const commentIndex = dbData.comments.findIndex((comment) => comment.id === commentId);
    if (commentIndex === -1) {
      throw new Error(`Comment with ID ${commentId} not found.`);
    }

    // コメントを削除する
    const deletedComment = dbData.comments.splice(commentIndex, 1)[0];

    // JSON に保存
    fs.writeFileSync(mockDbPath, JSON.stringify(dbData, null, 2));
    return deletedComment;
  },
};
