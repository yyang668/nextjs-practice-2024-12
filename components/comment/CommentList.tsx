
import React, { useState, useEffect } from 'react';
import { CommentListProps, CommentListPropsSchema } from '@/lib/schemas';
import CommentCard from '@/components/comment/CommentCard';
import { getComments } from '@/app/actions'
import { Comment } from '@/lib/schemas'
export default async function CommentList({
    patientId
}: CommentListProps) {

  const comments: Comment[]  =  await getComments(Number(patientId));

  return (
    <div className="space-y-4">
      {comments? (
        comments.map((comment) => (
          <CommentCard key={comment.id} comment={comment} />
        ))
      ) : (
        <p>...</p>
      )}
    </div>
  );
}
