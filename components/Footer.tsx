'use client';

import { useState } from 'react';
import { useAccount } from '@/app/_context/AccountContext';
import { FooterProps } from '@/lib/schemas';

export default function Footer({ patientId , refreshComments}: FooterProps) {
  const { selectedAccount } = useAccount();
  const [newComment, setNewComment] = useState('');

  const handleSubmit = async () => {
    if (!newComment.trim()) {
      alert('コメントを入力してください。');
      return;
    }

    try {
        try {
          await fetch('/api/comments/addComment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content : newComment , patientId: Number(patientId), ...selectedAccount}),
          });

          refreshComments();
        } catch (error) {
          console.error('Failed to add comment:', error);
        }
      setNewComment(''); //入力欄をクリアする
    } catch (error) {
      console.error('Failed to submit comment:', error);
    }
  };

  return (
    <footer className="fixed bottom-0 left-0 w-full mr-0 pr-0 bg-gray-100 border-t p-4">
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="新しいコメントを入力"
          className="flex-1 border rounded px-2 py-1 focus:outline-none focus:ring focus:border-blue-300 mr-0"
        />
        <button
          onClick={handleSubmit}
          className="border-2 text-white px-4 py-1 rounded-md"
        >
         <svg width="32px" height="32px" viewBox="0 0 24.00 24.00" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#000000" strokeWidth="0.00024000000000000003">
            <path fillRule ="evenodd" clipRule="evenodd" d="M3.3938 2.20468C3.70395 1.96828 4.12324 1.93374 4.4679 2.1162L21.4679 11.1162C21.7953 11.2895 22 11.6296 22 12C22 12.3704 21.7953 12.7105 21.4679 12.8838L4.4679 21.8838C4.12324 22.0662 3.70395 22.0317 3.3938 21.7953C3.08365 21.5589 2.93922 21.1637 3.02382 20.7831L4.97561 12L3.02382 3.21692C2.93922 2.83623 3.08365 2.44109 3.3938 2.20468ZM6.80218 13L5.44596 19.103L16.9739 13H6.80218ZM16.9739 11H6.80218L5.44596 4.89699L16.9739 11Z" fill="#000000"/> 
        </svg>
        </button>
      </div>
    </footer>
  );
}
