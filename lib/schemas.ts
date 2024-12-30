import { z } from 'zod';
// アカウントのスキーマ
export const AccountSchema = z.object({
  id: z.number(),
  name: z.string(),
});

// AccountContextのスキーマ
export const AccountContextTypeSchema = z.object({
  selectedAccount: AccountSchema.nullable(),
  setSelectedAccount: z.function().args(AccountSchema.nullable()).returns(z.promise(z.void())),
});

// 患者データのスキーマ
export const PatientSchema = z.object({
  id: z.number(),
  name: z.string()
});

// コメントデータのスキーマ
export const CommentSchema = z.object({
  id: z.number(),
  content: z.string(),

  patientId: z.number(),
  // patientname: z.string(),

  accountId: z.number(),
  accountName: z.string(),

  createdAt:z.string(),
  updatedAt: z.string(),
});

// 新規コメント用スキーマ
export const NewCommentSchema = z.object({
  content: z.string().min(1, "コメントは必須です"),
  patientId: z.number(),
});

// AccountSelectorPropsデータのスキーマ
export const AccountSelectorPropsSchema = z.object({
  accounts: z.array(AccountSchema),
  currentAccount: AccountSchema.nullable(),
  onChange:z.function().args(AccountSchema).returns(z.promise(z.void())),
});

// フッターPropsデータのスキーマ
export const PatientDetailsPropsSchema = z.object({
  patientId: z.string(),
});

// コメントPropsデータのスキーマ
export const CommentCardPropsSchema = z.object({
  comment: CommentSchema,
  isEditingFlag: z.boolean(),
  isProcessing: z.boolean(),
  refreshComments: z.function().returns(z.promise(z.void())),
  deleteComment: z.function().args(z.number()).returns(z.promise(z.void())),
  editComment: z.function().args(z.number(), z.string()).returns(z.promise(z.void())),
});

// 患者詳細Propsデータのスキーマ
export const CommentListPropsSchema = z.object({
  comments: z.array(CommentSchema).nullable(),
  isEditingFlag: z.boolean(),
  isProcessing: z.boolean(),
  refreshComments: z.function().returns(z.promise(z.void())),
  deleteComment: z.function().args(z.number()).returns(z.promise(z.void())),
  editComment: z.function().args(z.number(), z.string()).returns(z.promise(z.void())),
});

// フッターPropsデータのスキーマ
export const FooterPropsSchema = z.object({
  patientId: z.string(),
  refreshComments: z.function().returns(z.promise(z.void())),
});

// 患者データのスキーマ
export const CommentsSchema = z.array(CommentSchema);

// handleEdit のスキーマ
export const EditCommentSchema = z.object({
  id: z.number(),
  content: z.string(),
});

// handleDelete のスキーマ
export const DeleteCommentSchema = z.object({
  id: z.number(),
});


// DB 全体のスキーマ
export const DbSchema = z.object({
  accounts: z.array(AccountSchema),
  patients: z.array(PatientSchema),
  comments: z.array(CommentSchema),
  maxCommentId:z.number() ,
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



 