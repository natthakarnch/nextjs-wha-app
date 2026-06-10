import prisma from '@/lib/prisma';
import { AdminStats, RevenuePoint, AdminOrderItem } from '@/types/admin';

export class AdminService {
  static async getDashboardStats(): Promise<AdminStats> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const stats = await prisma.orders.aggregate({
      _sum: { total_amount: true },
      _count: { id: true },
      where: {
        date: {
          gte: today,
        },
      },
    });

    const totalProducts = await prisma.products.count();
    const totalUsers = await prisma.user.count();
    const pendingOrders = await prisma.orders.count({
      where: {
        status: 'processing',
      },
    });

    return {
      todaySales: Number(stats._sum.total_amount || 0),
      todayOrders: stats._count.id || 0,
      pendingOrders: pendingOrders,
      totalProducts: totalProducts,
      totalUsers: totalUsers,
    };
  }

  static async getRevenueData(period: '7d' | '30d' | '90d'): Promise<RevenuePoint[]> {
    const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const orders = await prisma.orders.findMany({
      where: {
        date: {
          gte: startDate,
        },
      },
      select: {
        date: true,
        total_amount: true,
      },
      orderBy: {
        date: 'asc',
      },
    });

    const revenueMap: Record<string, { revenue: number; orders: number }> = {};

    orders.forEach((order) => {
      if (!order.date) return;
      const dateStr = order.date.toLocaleDateString('en-GB', { 
        day: '2-digit', 
        month: '2-digit' 
      });
      
      if (!revenueMap[dateStr]) {
        revenueMap[dateStr] = { revenue: 0, orders: 0 };
      }
      revenueMap[dateStr].revenue += Number(order.total_amount || 0);
      revenueMap[dateStr].orders += 1;
    });

    return Object.entries(revenueMap).map(([date, data]) => ({
      date,
      ...data,
    }));
  }

  static async getRecentOrders(limit: number = 5): Promise<{ orders: AdminOrderItem[]; total: number }> {
    const ordersData = await prisma.orders.findMany({
      take: limit,
      orderBy: {
        date: 'desc',
      },
      include: {
        customers: true,
      },
    });

    const total = await prisma.orders.count();

    const orders: AdminOrderItem[] = ordersData.map((order) => ({
      id: order.id.toString(),
      customerName: order.customers?.name || 'Unknown',
      customerEmail: 'N/A', // Database doesn't have email in customers table
      totalAmount: Number(order.total_amount || 0),
      status: order.status === 'processing' ? 'pending' : 
              order.status === 'delivered' ? 'completed' : 'cancelled',
      createdAt: order.date ? order.date.toISOString() : new Date().toISOString(),
    }));

    return { orders, total };
  }
}
