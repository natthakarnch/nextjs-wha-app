import { NextResponse } from 'next/server';
import { AdminService } from '@/services/admin-service';

export async function GET() {
  try {
    const stats = await AdminService.getDashboardStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error('[ADMIN_STATS_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
