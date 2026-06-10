import { NextResponse } from 'next/server';
import { AdminService } from '@/services/admin-service';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const period = (searchParams.get('period') as '7d' | '30d' | '90d') || '30d';
    
    const data = await AdminService.getRevenueData(period);
    return NextResponse.json(data);
  } catch (error) {
    console.error('[ADMIN_REVENUE_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
