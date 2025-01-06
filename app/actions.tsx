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
 * アカウント情報を取得するメソッド
 * @returns データベース内のアカウント情報を返します。
 */
export async function getAccounts() {
  let result: Result = { success: false, error: "" };
  try {
    const dbInstance = await getDb();
    const accounts = dbInstance.getAccounts();

    result.success = true;
    result.data = await accounts;
    return result;
  } catch (getAccountsError) {
    console.error("アカウント情報の取得に失敗しました:", getAccountsError);
    result.error =
      "アカウント情報の取得に失敗しました。しばらくしてからもう一度お試しください。";
    return result;
  }
}

/**
 * 患者情報を全て取得するメソッド
 * @returns データベース内の患者情報を返します。
 */
export async function getPatients() {
  let result: Result = { success: false, error: "" };
  try {
    const dbInstance = await getDb();
    const patients = await dbInstance.getPatients();
    result.success = true;
    result.data = await patients;
    return result;
  } catch (getPatientsError) {
    console.error("患者情報の取得に失敗しました:", getPatientsError);
    result.error =
      "患者情報の取得に失敗しました。しばらくしてからもう一度お試しください。";
    return result;
  }
}

/**
 * 指定された患者IDに対応する患者情報を取得するメソッド
 * @param patientId 患者のID
 * @returns 対応する患者の情報を返します。
 */
export async function getPatientByPatientId(patientId: string) {
  let result: Result = { success: false, error: "" };
  try {
    const dbInstance = await getDb();
    const patients = await dbInstance.getPatientByPatientId(patientId);
    result.success = true;
    result.data = await patients;
    return result;
  } catch (getPatientError) {
    console.error(
      "指定された患者IDの患者情報の取得に失敗しました:",
      getPatientError
    );
    result.error =
      "指定された患者IDの患者情報の取得に失敗しました。しばらくしてからもう一度お試しください。";
    return result;
  }
}

/**
 * 指定された患者のコメント情報を取得するメソッド
 * @param patientId 患者のID
 * @returns その患者のコメント情報を返します。
 */
export async function getComments(patientId: string) {
  let result: Result = { success: false, error: "", data: [] as Comment[] };
  try {
    const dbInstance = await getDb();
    const comments = dbInstance.getCommentsByPatientId(patientId);
    result.success = true;
    result.data = await comments;
    return result;
  } catch (getCommentsError) {
    console.error("患者のコメント情報の取得に失敗しました:", getCommentsError);
    result.error =
      "患者のコメント情報の取得に失敗しました。しばらくしてからもう一度お試しください。";
    return result;
  }
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
  let result: Result = { success: false, error: "" };
  const validatedFields = AddCommentSchema.safeParse({
    patientId,
    content: commentStr,
    accountId,
    accountName,
  });
  if (!validatedFields.success) {
    result.error = Object.values(
      validatedFields.error.flatten().fieldErrors
    ).join(", ");
    return result;
  }
  try {
    const dbInstance = await getDb();
    const comment = dbInstance.addComment(
      commentStr,
      patientId,
      accountId,
      accountName
    );
    try {
      dbInstance.updatePatient(patientId);
    } catch (updatePatientError) {
      console.error("患者情報の更新に失敗しました:", updatePatientError);
      result.error =
        "患者情報の更新に失敗しました。しばらくしてからもう一度お試しください。";
      return result;
    }
    try {
      revalidatePath(`/patient/${patientId}`);
    } catch (revalidatePathError) {
      console.error("パスの再検証に失敗しました:", revalidatePathError);
      result.error =
        "パスの再検証に失敗しました。手動でページを更新して最新のデータを表示してください。";
      return result;
    }
    result.success = true;
    result.data = comment;
    return result;
  } catch (addCommentError) {
    console.error("コメントの追加に失敗しました:", addCommentError);
    result.error =
      "コメントの追加に失敗しました。しばらくしてからもう一度お試しください。";
    return result;
  }
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
  let result: Result = { success: false, error: "" };
  const validatedFields = UpdateCommentSchema.safeParse({
    patientId,
    id: commentId,
    content: newContent,
  });
  if (!validatedFields.success) {
    result.error = Object.values(
      validatedFields.error.flatten().fieldErrors
    ).join(", ");
    return result;
  }
  try {
    const dbInstance = await getDb();
    const updatedComment = dbInstance.updateComment(commentId, newContent);
    try {
      dbInstance.updatePatient(patientId);
    } catch (updatePatientError) {
      console.error("患者情報の更新に失敗しました:", updatePatientError);
      result.error =
        "患者情報の更新に失敗しました。しばらくしてからもう一度お試しください。";
      return result;
    }
    try {
      revalidatePath(`/patient/${patientId}`);
    } catch (revalidatePathError) {
      console.error("パスの再検証に失敗しました:", revalidatePathError);
      result.error =
        "パスの再検証に失敗しました。手動でページを更新して最新のデータを表示してください。";
      return result;
    }
    result.success = true;
    result.data = updatedComment;
    return result;
  } catch (updateCommentError) {
    console.error("コメントの更新に失敗しました:", updateCommentError);
    result.error =
      "コメントの更新に失敗しました。しばらくしてからもう一度お試しください。";
    return result;
  }
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
  let result = { success: false, error: "" };
  if (!validatedFields.success) {
    result.error = Object.values(
      validatedFields.error.flatten().fieldErrors
    ).join(", ");
    return result;
  }
  const { id, patientId } = validatedFields.data;
  try {
    const dbInstance = await getDb();
    await dbInstance.deleteComment(id);
    try {
      dbInstance.updatePatient(patientId);
    } catch (updatePatientError) {
      console.error("患者情報の更新に失敗しました:", updatePatientError);
      result.error =
        "患者情報の更新に失敗しました。しばらくしてからもう一度お試しください。";
      return result;
    }
    try {
      revalidatePath(`/patient/${patientId}`);
    } catch (revalidatePathError) {
      console.error("パスの再検証に失敗しました:", revalidatePathError);
      result.error =
        "パスの再検証に失敗しました。手動でページを更新して最新のデータを表示してください。";
      return result;
    }
    result.success = true;
    return result;
  } catch (deleteCommentError) {
    console.error("コメントの削除に失敗しました:", deleteCommentError);
    result.error =
      "コメントの削除に失敗しました。しばらくしてからもう一度お試しください。";
    return result;
  }
}
