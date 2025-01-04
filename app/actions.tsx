'use server';
import  { getDb } from  '@/lib/db'; 
import { revalidatePath } from 'next/cache';


export async function getAccounts()  {
    const dbInstance = await getDb();

  const accounts =  dbInstance.getAccounts();
  return accounts;
}

export async function getPatients() {
  const dbInstance = await getDb();

  const patients = await  dbInstance.getPatients();
  return patients;
} 

export async function getPatientByPatientId(patientId: number) {
  const dbInstance = await getDb();

  const patients = await  dbInstance.getPatientByPatientId(patientId);
  return patients;
} 

export async function addComment(patientId: number, commentStr: string, accountId: number,accountName: string ) {
  const dbInstance = await getDb();
  const comment = dbInstance.addComment(commentStr,patientId,accountId,accountName);

  dbInstance.updatePatient(patientId);
  revalidatePath(`/patient/${patientId}`);
  return  comment;
}


export async function getComments(patientId:number) {
  const dbInstance = await getDb();
  const comments =dbInstance.getCommentsByPatientId(patientId);
  return comments;
}


export async function updateComment (patientId:number,commentId: number, newContent: string) {
  const dbInstance = await getDb();
  const updatedComment = dbInstance.updateComment(commentId,newContent);

  dbInstance.updatePatient(patientId);
  revalidatePath(`/patient/${patientId}`);
  return updatedComment;
}

export async function deleteComment (patientId:number,commentId: number ) {
  const dbInstance = await getDb();
  await dbInstance.deleteComment(commentId);

  dbInstance.updatePatient(patientId);
  revalidatePath(`/patient/${patientId}`);
  return ;
}
