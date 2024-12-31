'use client';
import React, { useState, useEffect ,useCallback } from 'react';
import Header from '@/components/Header';
import Navbar from '@/components/navbar/Navbar';
import CommentList from '@/components/comment/CommentList'
import PatientDetails from '@/components/patient/PatientDetails';
import Footer from '@/components/Footer';
import { useAccount } from '@/app/_context/AccountContext';
import { CommentsSchema, EditCommentSchema,  Comment } from '@/lib/schemas'

export default  function CommentPage({ params }: { params: { id: string } }) {
  const patientId = params.id;
  const { selectedAccount } = useAccount();
  const [isProcessing, setIsProcessing] = useState(false);
  const [comments, setComments] = useState<Comment[] | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
 
  const refreshComments = useCallback(async () => {
    setIsProcessing(true);
    try {
      const response = await fetch(
        `/api/comments/getComments?patientId=${patientId}`,
        { cache: 'no-store' }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const jsonData: Comment[] = await response.json();

      // Zod バリデーションチェック
      const validatedData = CommentsSchema.parse(jsonData);
      setComments(validatedData);

    } catch (error) {
      console.error('エラー:', error);
    }    finally {
      setIsProcessing(false);
    }
  }, [patientId]);

  useEffect(() => {
    // コンポーネントがマウントされたときの初期取得
    refreshComments(); 
  }, [patientId, refreshComments]);

  const handleEdit = async (commentId:number,content:String) => {
    setIsProcessing(true);
    try {
      EditCommentSchema.parse({ id: commentId, content });
      
      await fetch(`/api/comments/editComment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: commentId, content }),
      });
      setIsEditing(false);

      await refreshComments(); 

    } catch (error) {
      console.error('エラー:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async (commentId:number) => {
    setIsProcessing(true);
    try {
      await fetch(`/api/comments/deleteComment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: commentId }),
      });
      
       await refreshComments(); 
        
    } catch (error) {
      console.error('エラー:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
     <div className="p-4">
      <Header/>
      <div className="p-4 pb-20">
        <Navbar/>
        <PatientDetails patientId={patientId} />
        <CommentList 
          comments={comments} 
          isEditingFlag={isEditing} 
          isProcessing={isProcessing} 
          refreshComments ={refreshComments} 
          deleteComment={handleDelete} 
          editComment={handleEdit}  
        />
      </div>
      <Footer patientId={patientId} refreshComments={refreshComments}/>
    </div>
  );
}
