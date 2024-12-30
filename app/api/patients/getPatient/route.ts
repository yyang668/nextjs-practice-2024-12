import { db } from '@/lib/db';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const patientId = url.searchParams.get('id');
  const patients =  db.getPatientsByPatientId(Number(patientId));
  return new Response(JSON.stringify(patients));
} 
