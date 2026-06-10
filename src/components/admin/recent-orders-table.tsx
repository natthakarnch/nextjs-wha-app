'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { AdminOrderItem } from '@/types/admin';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

type RecentOrdersTableProps = {
  orders: AdminOrderItem[];
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
};

const statusMap: Record<AdminOrderItem['status'], { label: string; color: string }> = {
  pending: { label: 'รอดำเนินการ', color: 'bg-yellow-100 text-yellow-800' },
  completed: { label: 'สำเร็จ', color: 'bg-green-100 text-green-800' },
  cancelled: { label: 'ยกเลิก', color: 'bg-red-100 text-red-800' },
};

export function RecentOrdersTable({ orders, isLoading, error, onRetry }: RecentOrdersTableProps) {
  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-sm text-destructive mb-4">{error}</p>
          <button 
            onClick={onRetry}
            className="text-sm font-medium text-primary hover:underline"
          >
            ลองใหม่อีกครั้ง
          </button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>รายการสั่งซื้อล่าสุด</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ลูกค้า</TableHead>
              <TableHead>ยอดรวม</TableHead>
              <TableHead>สถานะ</TableHead>
              <TableHead>วันที่</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={4}><Skeleton className="h-6 w-full" /></TableCell>
                </TableRow>
              ))
            ) : orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center">ไม่พบข้อมูล</TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.customerName}</TableCell>
                  <TableCell>
                    {new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(order.totalAmount)}
                  </TableCell>
                  <TableCell>
                    <Badge className={statusMap[order.status].color}>
                      {statusMap[order.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(order.createdAt).toLocaleDateString('th-TH')}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
