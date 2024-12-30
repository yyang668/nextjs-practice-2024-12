import { db } from '@/lib/db'

export async function GET(request: Request) {
  const url = new URL(request.url);
  const patientId = url.searchParams.get('patientId');
  const comments =db.getCommentsByPatientId(Number(patientId));
  return new Response(JSON.stringify(comments));
}
