"use server";

import fs from "fs";
import path from "path";
import Lock from "async-lock";
import { formatDate } from "@/lib/utils";
import { DbSchema, CommentSchema, DbData, Patient } from "@/lib/schemas";

const lock = new Lock();

// JSON ファイルパス
const mockDbPath = path.resolve(process.cwd(), "db", "db.json");

// データ（仮DB）
let dbData: DbData = {
  accounts: [],
  patients: [],
  comments: [],
  maxCommentId: 0,
};

// ロードモックデータ
async function loadMockData() {
  try {
    const data = fs.readFileSync(mockDbPath, "utf-8");
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
    console.error("Failed to load or validate mock data:", error);
  }
}

// APP起動時にモックデータをロードする
loadMockData();

// ロック関連性
async function withLock<T>(action: () => Promise<T>): Promise<T> {
  return lock.acquire("dbDataLock", async () => {
    return action();
  });
}

// モックDBの操作
const db = {
  // アカウントを取得する
  getAccounts: async () => dbData.accounts,

  // // 患者リストを取得する
  getPatients: async () => {
    if (!dbData.patients || dbData.patients.length === 0) {
      return [];
    }
    const patients = dbData.patients as Patient[];
    return patients.sort((a: Patient, b: Patient) => {
      if (typeof a.updatedAt === "string" && typeof b.updatedAt === "string") {
        return b.updatedAt.localeCompare(a.updatedAt);
      }
      return 0;
    });
  },

  // コメントを更新する
  updatePatient: async (patientId: number) => {
    const patientIndex = dbData.patients.findIndex(
      (patient) => patient.id === patientId
    );
    if (patientIndex === -1) {
      throw new Error(`Comment with ID ${patientId} not found.`);
    }

    //  時間を更新する
    dbData.patients[patientIndex].updatedAt = String(Date.now());

    // JSON に保存
    await withLock(async () =>
      fs.writeFileSync(mockDbPath, JSON.stringify(dbData, null, 2))
    );

    await loadMockData();
    return;
  },

  // 患者を取得する
  getPatientByPatientId: async (patientId: number) => {
    const patients = dbData.patients.filter(
      (patient) => patient.id === patientId
    );
    if (patients.length === 0) {
      throw new Error(`Patient with ID ${patientId} not found.`);
    }
    return patients;
  },

  // 患者のコメントを取得する
  getCommentsByPatientId: async (patientId: number) => {
    return dbData.comments.filter((comment) => comment.patientId === patientId);
  },

  // 患者にコメントを追加する
  addComment: async (
    content: string,
    patientId: number,
    accountId: number,
    accountName: string
  ) => {
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
    await withLock(async () =>
      fs.writeFileSync(mockDbPath, JSON.stringify(dbData, null, 2))
    );

    await loadMockData();
    return newComment;
  },

  // コメントを更新する
  updateComment: async (commentId: number, newContent: string) => {
    const commentIndex = dbData.comments.findIndex(
      (comment) => comment.id === commentId
    );
    if (commentIndex === -1) {
      throw new Error(`Comment with ID ${commentId} not found.`);
    }

    // コメントと時間を更新する
    dbData.comments[commentIndex].content = newContent;
    dbData.comments[commentIndex].updatedAt = formatDate(new Date());

    // JSON に保存
    await withLock(async () =>
      fs.writeFileSync(mockDbPath, JSON.stringify(dbData, null, 2))
    );

    await loadMockData();
    return dbData.comments[commentIndex];
  },

  // コメントを削除する
  deleteComment: async (commentId: number) => {
    const commentIndex = dbData.comments.findIndex(
      (comment) => comment.id === commentId
    );
    if (commentIndex === -1) {
      throw new Error(`Comment with ID ${commentId} not found.`);
    }

    // コメントを削除する
    const deletedComment = dbData.comments.splice(commentIndex, 1)[0];

    // JSON に保存
    await withLock(async () =>
      fs.writeFileSync(mockDbPath, JSON.stringify(dbData, null, 2))
    );

    await loadMockData();
    return deletedComment;
  },
};

export async function getDb() {
  return db;
}
