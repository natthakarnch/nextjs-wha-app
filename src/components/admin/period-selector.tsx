'use client';

import { Button } from '@/components/ui/button';
import { DashboardPeriod } from '@/types/admin';

type PeriodSelectorProps = {
  period: DashboardPeriod;
  onPeriodChange: (period: DashboardPeriod) => void;
};

export function PeriodSelector({ period, onPeriodChange }: PeriodSelectorProps) {
  const periods: { label: string; value: DashboardPeriod }[] = [
    { label: '7 วัน', value: '7d' },
    { label: '30 วัน', value: '30d' },
    { label: '90 วัน', value: '90d' },
  ];

  return (
    <div className="flex gap-2">
      {periods.map((p) => (
        <Button
          key={p.value}
          variant={period === p.value ? 'default' : 'outline'}
          size="sm"
          onClick={() => onPeriodChange(p.value)}
        >
          {p.label}
        </Button>
      ))}
    </div>
  );
}
