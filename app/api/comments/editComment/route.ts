import { db } from '@/lib/db'

export async function POST(request: Request) {
  const { id, content } = await request.json();
  const updatedComment = db.updateComment(id,content);
  return new Response(JSON.stringify(updatedComment));
}
