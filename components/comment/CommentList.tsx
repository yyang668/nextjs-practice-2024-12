'use client';

import React, { useState, useEffect } from 'react';
import { CommentListProps, CommentListPropsSchema } from '@/lib/schemas';
import CommentCard from '@/components/comment/CommentCard';

export default function CommentList({
  comments,
  isEditingFlag,
  isProcessing,
  refreshComments,
  deleteComment,
  editComment,
}: CommentListProps) {

  return (
    <div className="space-y-4">
      {comments? (
        comments.map((comment) => (
          <CommentCard
          key={comment.id}
          comment={comment}
          isEditingFlag={isEditingFlag}
          isProcessing={isProcessing}
          refreshComments={refreshComments}
          deleteComment={deleteComment}
          editComment={editComment}
        />
        ))
      ) : (
        <p>...</p>
      )}
    </div>
  );
}
