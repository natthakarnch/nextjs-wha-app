'use client';

import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { 
  KpiCard, 
  PeriodSelector, 
  RecentOrdersTable, 
} from '@/components/admin';
import { 
  AdminStats, 
  RevenuePoint, 
  AdminOrderItem, 
  DashboardPeriod 
} from '@/types/admin';

const RevenueChartDynamic = dynamic(() => import('@/components/admin/revenue-chart').then(mod => mod.RevenueChart), { 
  ssr: false 
});

export default function DashboardClient() {
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);

  const [revenue, setRevenue] = useState<RevenuePoint[]>([]);
  const [revenueLoading, setRevenueLoading] = useState(true);
  const [revenueError, setRevenueError] = useState<string | null>(null);

  const [period, setPeriod] = useState<DashboardPeriod>('30d');
  
  const [orders, setOrders] = useState<AdminOrderItem[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setStatsError(null);
      const res = await fetch('/api/admin/stats');
      if (!res.ok) throw new Error('Failed to fetch statistics');
      const data = await res.json();
      setStats(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setStatsError(errorMessage);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  const fetchOrders = useCallback(async () => {
    try {
      setOrdersError(null);
      const res = await fetch('/api/admin/orders?limit=5');
      if (!res.ok) throw new Error('Failed to fetch recent orders');
      const data = await res.json();
      setOrders(data.orders);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setOrdersError(errorMessage);
    } finally {
      setOrdersLoading(false);
    }
  }, []);

  const fetchRevenue = useCallback(async () => {
    try {
      setRevenueError(null);
      setRevenueLoading(true);
      const res = await fetch(`/api/admin/revenue?period=${period}`);
      if (!res.ok) throw new Error('Failed to fetch revenue data');
      const data = await res.json();
      setRevenue(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setRevenueError(errorMessage);
    } finally {
      setRevenueLoading(false);
    }
  }, [period]);

  useEffect(() => {
    async function initDashboard() {
      setIsCheckingAuth(false);
      await Promise.all([fetchStats(), fetchOrders(), fetchRevenue()]);
      
      const interval = setInterval(() => {
        fetchStats();
        fetchOrders();
      }, 30000);

      return () => clearInterval(interval);
    }
    initDashboard();
  }, [fetchStats, fetchOrders, fetchRevenue]);

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(value);

  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <PeriodSelector period={period} onPeriodChange={setPeriod} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsError ? (
          <div className="col-span-full p-4 bg-destructive/10 text-destructive rounded-md flex justify-between items-center">
            <p className="text-sm">{statsError}</p>
            <button onClick={fetchStats} className="text-sm font-medium underline">ลองใหม่อีกครั้ง</button>
          </div>
        ) : (
          <>
            <KpiCard 
              title="รายได้วันนี้" 
              value={stats ? formatCurrency(stats.todaySales) : '฿0'} 
              description="ยอดขายรวมของวันนี้" 
              isLoading={statsLoading} 
            />
            <KpiCard 
              title="คำสั่งซื้อวันนี้" 
              value={stats?.todayOrders ?? 0} 
              description="จำนวนคำสั่งซื้อวันนี้" 
              isLoading={statsLoading} 
            />
            <KpiCard 
              title="รอดำเนินการ" 
              value={stats?.pendingOrders ?? 0} 
              description="คำสั่งซื้อที่ยังไม่จัดการ" 
              isLoading={statsLoading} 
            />
            <KpiCard 
              title="ลูกค้าทั้งหมด" 
              value={stats?.totalUsers ?? 0} 
              description="จำนวนสมาชิกทั้งหมด" 
              isLoading={statsLoading} 
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <RevenueChartDynamic 
            data={revenue} 
            isLoading={revenueLoading} 
            error={revenueError} 
            onRetry={fetchRevenue} 
          />
        </div>
        <div className="space-y-4">
          <RecentOrdersTable 
            orders={orders} 
            isLoading={ordersLoading} 
            error={ordersError} 
            onRetry={fetchOrders} 
          />
        </div>
      </div>
    </div>
  );
}
