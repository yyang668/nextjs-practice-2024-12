import { z } from "zod";
// アカウントのスキーマ
export const AccountSchema = z.object({
  id: z.string(),
  name: z.string(),
});

// AccountContextのスキーマ
export const AccountContextTypeSchema = z.object({
  selectedAccount: AccountSchema.nullable(),
  setSelectedAccount: z
    .function()
    .args(AccountSchema.nullable())
    .returns(z.promise(z.void())),
});

// 患者データのスキーマ
export const PatientSchema = z.object({
  id: z.string(),
  name: z.string(),
  updatedAt: z.string(),
});

export const ResultSchema = z.object({
  success: z.boolean(), // 使用正确的函数调用形式定义布尔类型验证规则
  error: z.string(), // 修正为正确的zod语法，定义字符串类型验证规则
  data: z.optional(z.any()), // 更严谨地定义data属性为可选属性，使用z.optional包裹，这里先简单使用z.any()表示可以是任意类型，你可以根据实际需求细化类型
});

// コメントデータのスキーマ
export const CommentSchema = z.object({
  id: z.string().min(1, { message: "コメントIDは必須です。" }),
  content: z
    .string()
    .min(1, { message: "コメントは必須です。" })
    .max(2000, { message: "コメントは2000文字列以内で入力してください。" }),

  patientId: z.string(),
  // patientname: z.string(),

  accountId: z.string(),
  accountName: z.string(),

  createdAt: z.string(),
  updatedAt: z.string(),
});

// 新規コメント用スキーマ
export const NewCommentSchema = z.object({
  content: z.string().min(1, "コメントは必須です"),
  patientId: z.string(),
});

// AccountSelectorPropsデータのスキーマ
export const AccountSelectorPropsSchema = z.object({
  accounts: z.array(AccountSchema),
  currentAccount: AccountSchema.nullable(),
  onChange: z.function().args(AccountSchema).returns(z.promise(z.void())),
});

// フッターPropsデータのスキーマ
export const PatientDetailsPropsSchema = z.object({
  patientId: z.string(),
});

// コメントPropsデータのスキーマ
export const CommentCardPropsSchema = z.object({
  comment: CommentSchema,
});

// 患者詳細Propsデータのスキーマ
export const CommentListPropsSchema = z.object({
  patientId: z.string(),
});

// フッターPropsデータのスキーマ
export const FooterPropsSchema = z.object({
  patientId: z.string(),
});

// 患者データのスキーマ
export const CommentsSchema = z.array(CommentSchema);

// handleEdit のスキーマ
export const EditCommentSchema = z.object({
  id: z.string(),
  content: z.string(),
});

export const AddCommentSchema = CommentSchema.pick({
  patientId: true,
  content: true,
  accountId: true,
  accountName: true,
});

// handleDelete のスキーマ
export const DeleteCommentSchema = CommentSchema.pick({
  id: true,
  patientId: true,
});

export const UpdateCommentSchema = CommentSchema.pick({
  patientId: true,
  id: true,
  content: true,
});

// DB 全体のスキーマ
export const DbSchema = z.object({
  accounts: z.array(AccountSchema),
  patients: z.array(PatientSchema),
  comments: z.array(CommentSchema),
});

// 型の推論（オプション）
export type AccountContextType = z.infer<typeof AccountContextTypeSchema>;
export type AccountSelectorProps = z.infer<typeof AccountSelectorPropsSchema>;
export type PatientDetailsProps = z.infer<typeof PatientDetailsPropsSchema>;

export type CommentCardProps = z.infer<typeof CommentCardPropsSchema>;
export type CommentListProps = z.infer<typeof CommentListPropsSchema>;
export type FooterProps = z.infer<typeof FooterPropsSchema>;

export type Patient = z.infer<typeof PatientSchema>;
export type Comment = z.infer<typeof CommentSchema>;
export type NewComment = z.infer<typeof NewCommentSchema>;
export type Account = z.infer<typeof AccountSchema>;

export type DbData = z.infer<typeof DbSchema>;

export type Result = z.infer<typeof ResultSchema>;
