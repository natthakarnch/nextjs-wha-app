export type AdminStats = {
  todaySales: number;
  todayOrders: number;
  pendingOrders: number;
  totalProducts: number;
  totalUsers: number;
};

export type RevenuePoint = {
  date: string;
  revenue: number;
  orders: number;
};

export type AdminOrderItem = {
  id: string;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: string;
};

export type DashboardPeriod = '7d' | '30d' | '90d';
