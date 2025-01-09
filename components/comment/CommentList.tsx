import React, { useState, useEffect } from "react";
import { CommentListProps, CommentListPropsSchema } from "@/lib/schemas";
import CommentCard from "@/components/comment/CommentCard";
import { getComments } from "@/app/actions";
import { Comment } from "@/lib/schemas";
export default async function CommentList({ patientId }: CommentListProps) {
  const result = await getComments(patientId);
  // 備忘：サーバコンポーネントのため、useState　は利用できない
  // const [currentEditingId, setCurrentEditingId] = useState<string | null>(null);

  if (!result.success) {
    return <p>{result.error}</p>;
  }
  const comments: Comment[] = result.data;

  return (
    <div className="space-y-4">
      {comments ? (
        comments.map((comment) => (
          <CommentCard key={comment.id} comment={comment} />
        ))
      ) : (
        <p>...</p>
      )}
    </div>
  );
}
