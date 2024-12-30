import  { db } from  '@/lib/db'; // データベース接続モジュール

export async function GET() {
  const accounts = db.getAccounts();
  return new Response(JSON.stringify(accounts));
}
