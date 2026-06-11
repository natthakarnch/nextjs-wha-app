import { NextResponse } from 'next/server';
import { AdminService } from '@/services/admin-service';
import { connection } from 'next/server';

export async function GET(request: Request) {
  await connection();
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '5', 10);
    
    const data = await AdminService.getRecentOrders(limit);
    return NextResponse.json(data);
  } catch (error) {
    console.error('[ADMIN_ORDERS_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
