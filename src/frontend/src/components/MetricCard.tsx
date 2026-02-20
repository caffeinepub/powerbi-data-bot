import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface MetricCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  trend?: string;
  isLoading?: boolean;
}

export default function MetricCard({ title, value, icon: Icon, trend, isLoading }: MetricCardProps) {
  if (isLoading) {
    return (
      <Card className="border-border/40">
        <CardContent className="p-6">
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/40 hover:border-emerald/50 transition-colors">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="h-12 w-12 rounded-lg bg-emerald/10 flex items-center justify-center">
            <Icon className="h-6 w-6 text-emerald" />
          </div>
          {trend && (
            <span className="text-sm font-medium text-emerald">{trend}</span>
          )}
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <p className="text-3xl font-bold">{value.toLocaleString()}</p>
        </div>
      </CardContent>
    </Card>
  );
}
