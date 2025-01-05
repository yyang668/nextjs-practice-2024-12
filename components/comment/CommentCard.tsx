"use client";

import { useEffect, useState } from "react";
import { useAccount } from "@/app/_context/AccountContext";
import { CommentCardProps } from "@/lib/schemas";
import { deleteComment, updateComment } from "@/app/actions";
import { PersonIcon } from "@radix-ui/react-icons";

export default function CommentCard({ comment }: CommentCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(comment.content);
  const { selectedAccount } = useAccount();
  const isOwner = selectedAccount?.id === comment.accountId;

  useEffect(() => {
    if (isEditing) {
      setIsEditing(false);
    }
  }, [selectedAccount]);

  //削除のコールバック
  const handleDelete = async (id: string) => {
    if (window.confirm("本当に削除しますか？")) {
      await deleteComment(comment.patientId, id);
    }
  };

  //編集のコールバック
  const handleEdit = async (id: string, content: string) => {
    //	if(window.confirm('コメントを編集しますか？')){
    // editComment(id, content)
    //}
    await updateComment(comment.patientId, id, content);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 space-y-2">
      <div className="flex items-center space-x-4">
        <div className="bg-gray-300 rounded-lg p-2">
          <PersonIcon className="size-" />
        </div>
        <span className="text-gray-800 font-medium">{comment.accountName}</span>
      </div>
      <div className="text-sm text-gray-500">{comment.updatedAt}</div>

      {isEditing ? (
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="mt-2 p-2 border rounded w-full"
          onBlur={() => {
            handleEdit(comment.id, content);
            setIsEditing(false);
          }}
        />
      ) : (
        <p
          className="text-gray-700"
          onClick={() => setIsEditing(isOwner === true)}
          style={{
            cursor: isOwner ? "pointer" : "default",
          }}
        >
          {comment.content}
        </p>
      )}

      {isOwner && (
        <div className="flex justify-end whitespace-no-wrap">
          <button
            onClick={() => handleDelete(comment.id)}
            className="bg-red-500 text-white px-4 py-1 text-sm rounded-md whitespace-no-wrap flex flex-row  "
          >
            <>
              <PersonIcon className="size-12" />
              削除
            </>
          </button>
        </div>
      )}
    </div>
  );
}
