import { db } from '@/lib/db'

export async function POST(request: Request) {
  const jsonData = await request.json();
  const { id, name, patientId, content } = jsonData;
  const comment = db.addComment(content,patientId,id,name)
  return new Response(JSON.stringify(comment));
}
