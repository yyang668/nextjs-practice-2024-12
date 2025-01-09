"use server";
import { getDb } from "@/lib/db";
import {
  AddCommentSchema,
  DeleteCommentSchema,
  UpdateCommentSchema,
  Result,
} from "@/lib/schemas";
import { revalidatePath } from "next/cache";

/**
 * エラーハンドリングを簡素化するための汎用関数
 * @param action 実行する非同期関数
 * @param errorMessage エラー発生時に表示するメッセージ
 * @returns 成功または失敗の結果オブジェクト
 */
async function handleError<T>(
  action: () => Promise<T>,
  errorMessage: string
): Promise<Result> {
  try {
    const data = await action();
    // 成功時も error を明示的に、空で設定
    return { success: true, data, error: "" };
  } catch (error) {
    console.error(errorMessage, error);
    return {
      success: false,
      error: `${errorMessage} しばらくしてから、もう一度お試しください。`,
    };
  }
}

/**
 * アカウント情報を取得するメソッド
 * @returns データベース内のアカウント情報を返します。
 */
export async function getAccounts() {
  return handleError(
    async () => {
      const dbInstance = await getDb();
      return await dbInstance.getAccounts();
    },
    "アカウント情報の取得に失敗しました"
  );
}

/**
 * 患者情報を全て取得するメソッド
 * @returns データベース内の患者情報を返します。
 */
export async function getPatients() {
  return handleError(
    async () => {
      const dbInstance = await getDb();
      return await dbInstance.getPatients();
    },
    "患者情報の取得に失敗しました"
  );
}

/**
 * 指定された患者IDに対応する患者情報を取得するメソッド
 * @param patientId 患者のID
 * @returns 対応する患者の情報
 */
export async function getPatientByPatientId(patientId: string) {
  return handleError(
    async () => {
      const dbInstance = await getDb();
      return await dbInstance.getPatientByPatientId(patientId);
    },
    "指定された患者IDの患者情報の取得に失敗しました"
  );
}

/**
 * 指定された患者のコメント情報を取得するメソッド
 * @param patientId 患者のID
 * @returns その患者のコメント情報
 */
export async function getComments(patientId: string) {
  return handleError(
    async () => {
      const dbInstance = await getDb();
      return await dbInstance.getCommentsByPatientId(patientId);
    },
    "患者のコメント情報の取得に失敗しました"
  );
}

/**
 * コメントを追加するメソッド
 * @param patientId 患者ID
 * @param commentStr コメント内容
 * @param accountId アカウントID
 * @param accountName アカウント名
 * @returns コメント追加操作の結果で、成功可否や関連データ、エラー情報を含みます。
 */
export async function addComment(
  patientId: string,
  commentStr: string,
  accountId: string,
  accountName: string
) {
  const validatedFields = AddCommentSchema.safeParse({
    patientId,
    content: commentStr,
    accountId,
    accountName,
  });
  if (!validatedFields.success) {
    return {
      success: false,
      error: Object.values(validatedFields.error.flatten().fieldErrors).join(
        ", "
      ),
    };
  }

  return handleError(
    async () => {
      const dbInstance = await getDb();
      const comment = await dbInstance.addComment(
        commentStr,
        patientId,
        accountId,
        accountName
      );
      await dbInstance.updatePatient(patientId);
      revalidatePath(`/patient/${patientId}`);
      return comment;
    },
    "コメントの追加に失敗しました"
  );
}

/**
 * コメントを更新するメソッド
 * @param patientId 患者ID
 * @param commentId コメントID
 * @param newContent 新しいコメント内容
 * @returns コメント更新操作の結果で、成功可否や関連データ、エラー情報を含みます。
 */
export async function updateComment(
  patientId: string,
  commentId: string,
  newContent: string
) {
  const validatedFields = UpdateCommentSchema.safeParse({
    patientId,
    id: commentId,
    content: newContent,
  });
  if (!validatedFields.success) {
    return {
      success: false,
      error: Object.values(validatedFields.error.flatten().fieldErrors).join(
        ", "
      ),
    };
  }

  return handleError(
    async () => {
      const dbInstance = await getDb();
      const updatedComment = await dbInstance.updateComment(
        commentId,
        newContent
      );
      await dbInstance.updatePatient(patientId);
      revalidatePath(`/patient/${patientId}`);
      return updatedComment;
    },
    "コメントの更新に失敗しました"
  );
}

/**
 * コメントを削除するメソッド
 * @param pId 患者ID
 * @param commentId コメントID
 * @returns コメント削除操作の結果で、成功可否や関連データ、エラー情報を含みます。
 */
export async function deleteComment(pId: string, commentId: string) {
  const validatedFields = DeleteCommentSchema.safeParse({
    id: commentId,
    patientId: pId,
  });
  if (!validatedFields.success) {
    return {
      success: false,
      error: Object.values(validatedFields.error.flatten().fieldErrors).join(
        ", "
      ),
    };
  }

  const { id, patientId } = validatedFields.data;

  return handleError(
    async () => {
      const dbInstance = await getDb();
      await dbInstance.deleteComment(id);
      await dbInstance.updatePatient(patientId);
      revalidatePath(`/patient/${patientId}`);
    },
    "コメントの削除に失敗しました"
  );
}