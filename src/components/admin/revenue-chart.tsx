'use client';

import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend 
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RevenuePoint } from '@/types/admin';
import { Skeleton } from '@/components/ui/skeleton';

type RevenueChartProps = {
  data: RevenuePoint[];
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
};

export function RevenueChart({ data, isLoading, error, onRetry }: RevenueChartProps) {
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
    <Card className="col-span-full lg:col-span-2">
      <CardHeader>
        <CardTitle>รายได้และคำสั่งซื้อ</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          {isLoading ? (
            <Skeleton className="h-full w-full" />
          ) : data.length === 0 ? (
            <div className="h-full w-full flex items-center justify-center text-muted-foreground">
              ไม่มีข้อมูลสำหรับช่วงเวลานี้
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }} 
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 12 }} 
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `฿${value.toLocaleString()}`}
                />
                <Tooltip 
                  formatter={(value: unknown) => typeof value === 'number' ? [`${value.toLocaleString()} บาท`, 'รายได้'] : [String(value), 'รายได้']}
                  labelStyle={{ color: 'rgb(var(--foreground))' }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#2563eb" 
                  strokeWidth={2} 
                  dot={false}
                  name="รายได้"
                />
                <Line 
                  type="monotone" 
                  dataKey="orders" 
                  stroke="#10b981" 
                  strokeWidth={2} 
                  dot={false}
                  name="คำสั่งซื้อ"
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
