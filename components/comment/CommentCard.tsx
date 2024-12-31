'use client';

import { useState } from 'react';
import { useAccount } from '@/app/_context/AccountContext';
import { CommentCardProps } from '@/lib/schemas'

export default function CommentCard({ comment, isEditingFlag , isProcessing,  refreshComments ,deleteComment, editComment}: CommentCardProps) {
  const [isEditing, setIsEditing] = useState(isEditingFlag);
  const [content, setContent] = useState(comment.content);
  const { selectedAccount } = useAccount();

	//削除のコールバック
	const handleDelete = (id:number)=>{
		if(window.confirm('本当に削除しますか？')){
			deleteComment(id)
		}
	}

  //編集のコールバック
	const handleEdit = (id:number,content:string)=>{
		if(window.confirm('コメントを編集しますか？')){
			editComment(id, content)
		}
	}

  return (
    <div className="bg-white shadow-md rounded-lg p-4 space-y-2"   >
      <div className="flex items-center space-x-4">
        <div className="bg-gray-300 rounded-lg p-2">
            <svg fill="#000000" width="64px" height="64px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M12 2.5a5.5 5.5 0 00-3.096 10.047 9.005 9.005 0 00-5.9 8.18.75.75 0 001.5.045 7.5 7.5 0 0114.993 0 .75.75 0 101.499-.044 9.005 9.005 0 00-5.9-8.181A5.5 5.5 0 0012 2.5zM8 8a4 4 0 118 0 4 4 0 01-8 0z"/>
            </svg>
        </div>
        <span className="text-gray-800 font-medium">{comment.accountName}</span>
      </div>
      <div className="text-sm text-gray-500">{comment.updatedAt}</div>

      {isEditing ? (
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="mt-2 p-2 border rounded w-full"
          onBlur={ ()=> {handleEdit(comment.id,content);setIsEditing(false);}}
        />
      ) : (
        <p className="text-gray-700" onClick={() => setIsEditing(selectedAccount?.id === comment.accountId)}>{comment.content}</p>
      )}
      <div className="flex justify-end whitespace-no-wrap">
        <button
          onClick={()=> handleDelete(comment.id) } 
          className="bg-red-500 text-white px-4 py-1 text-sm rounded-md whitespace-no-wrap flex flex-row  "
        >

        {isProcessing ? '処理中...' : (
          <>
          <svg width="12px" height="12px" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#ffffff" stroke="#ffffff" className="align-text-bottom m-1">
            <path d="M308.224 168.813714v-33.938285c0-56.32 45.641143-101.888 101.888-101.888h203.776c56.32 0 101.888 45.641143 101.888 101.888v33.938285h237.714286a33.938286 33.938286 0 0 1 0 67.949715H70.509714a33.938286 33.938286 0 0 1 0-67.949715h237.714286z m67.949714 0h271.652572v-33.938285a33.938286 33.938286 0 0 0-33.938286-33.938286H410.112a33.938286 33.938286 0 0 0-33.938286 33.938286v33.938285z m407.186286 710.582857V304.786286a34.084571 34.084571 0 1 1 68.242286 0v605.915428a73.142857 73.142857 0 0 1-73.142857 73.142857H245.540571a73.142857 73.142857 0 0 1-73.142857-73.142857V304.64a33.938286 33.938286 0 0 1 67.949715 0v574.756571a36.571429 36.571429 0 0 0 36.571428 36.571429h469.869714a36.571429 36.571429 0 0 0 36.571429-36.571429zM376.173714 338.651429c18.724571 0 33.938286 15.213714 33.938286 33.938285v407.478857a33.938286 33.938286 0 0 1-67.876571 0V372.589714c0-18.724571 15.140571-33.938286 33.938285-33.938285zM512 338.651429c18.724571 0 33.938286 15.213714 33.938286 33.938285v407.478857a33.938286 33.938286 0 0 1-67.876572 0V372.589714c0-18.724571 15.213714-33.938286 33.938286-33.938285z m135.826286 0c18.797714 0 33.938286 15.213714 33.938285 33.938285v407.478857a33.938286 33.938286 0 0 1-67.876571 0V372.589714c0-18.724571 15.213714-33.938286 33.938286-33.938285z" fill="#ffffff"/>
          </svg> 削除
          </>
        )}
        </button>
      </div>
    </div>
  );
}


