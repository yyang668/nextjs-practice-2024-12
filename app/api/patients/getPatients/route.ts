import { db } from '@/lib/db';

export async function GET() {
  const patients =  db.getPatients();
  return new Response(JSON.stringify(patients));
} 
