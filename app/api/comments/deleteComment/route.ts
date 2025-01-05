import { db } from "@/lib/db";

export async function POST(request: Request) {
  const { id, patientId } = await request.json();

  await db.deleteComment(id);
  await db.updatePatient(patientId);
  return new Response(JSON.stringify({ success: true }));
}
