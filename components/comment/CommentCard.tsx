"use client";

import { useEffect, useState } from "react";
import { useAccount } from "@/app/_context/AccountContext";
import { CommentCardProps } from "@/lib/schemas";
import { deleteComment, updateComment } from "@/app/actions";
import { PersonIcon, TrashIcon } from "@radix-ui/react-icons";

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
              {/* <TrashIcon className="size-4 align-text-bottom m-1" /> */}
              <svg
                width="12px"
                height="12px"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                fill="#ffffff"
                stroke="#ffffff"
                className="align-text-bottom m-1"
              >
                <path
                  d="M308.224 168.813714v-33.938285c0-56.32 45.641143-101.888 101.888-101.888h203.776c56.32 0 101.888 45.641143 101.888 101.888v33.938285h237.714286a33.938286 33.938286 0 0 1 0 67.949715H70.509714a33.938286 33.938286 0 0 1 0-67.949715h237.714286z m67.949714 0h271.652572v-33.938285a33.938286 33.938286 0 0 0-33.938286-33.938286H410.112a33.938286 33.938286 0 0 0-33.938286 33.938286v33.938285z m407.186286 710.582857V304.786286a34.084571 34.084571 0 1 1 68.242286 0v605.915428a73.142857 73.142857 0 0 1-73.142857 73.142857H245.540571a73.142857 73.142857 0 0 1-73.142857-73.142857V304.64a33.938286 33.938286 0 0 1 67.949715 0v574.756571a36.571429 36.571429 0 0 0 36.571428 36.571429h469.869714a36.571429 36.571429 0 0 0 36.571429-36.571429zM376.173714 338.651429c18.724571 0 33.938286 15.213714 33.938286 33.938285v407.478857a33.938286 33.938286 0 0 1-67.876571 0V372.589714c0-18.724571 15.140571-33.938286 33.938285-33.938285zM512 338.651429c18.724571 0 33.938286 15.213714 33.938286 33.938285v407.478857a33.938286 33.938286 0 0 1-67.876572 0V372.589714c0-18.724571 15.213714-33.938286 33.938286-33.938285z m135.826286 0c18.797714 0 33.938286 15.213714 33.938285 33.938285v407.478857a33.938286 33.938286 0 0 1-67.876571 0V372.589714c0-18.724571 15.213714-33.938286 33.938286-33.938285z"
                  fill="#ffffff"
                />
              </svg>
              削除
            </>
          </button>
        </div>
      )}
    </div>
  );
}
