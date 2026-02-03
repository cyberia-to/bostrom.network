import { useMemo } from 'react';
import { Area, AreaChart, ResponsiveContainer, YAxis } from 'recharts';

interface PriceHistoryPoint {
  timestamp: number;
  price: number;
}

interface PriceChartProps {
  data: PriceHistoryPoint[] | null;
  isPositive: boolean;
}

export const PriceChart = ({ data, isPositive }: PriceChartProps) => {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];
    return data.map(point => ({
      time: point.timestamp,
      price: point.price,
    }));
  }, [data]);

  if (!data || data.length === 0) {
    return (
      <div className="h-16 w-full flex items-center justify-center">
        <div className="text-muted-foreground text-sm">No chart data</div>
      </div>
    );
  }

  const strokeColor = isPositive ? 'hsl(142, 76%, 36%)' : 'hsl(0, 84%, 60%)';
  const fillColor = isPositive ? 'hsl(142, 76%, 36%)' : 'hsl(0, 84%, 60%)';

  return (
    <div className="h-16 w-full mt-4 relative">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={fillColor} stopOpacity={0.3} />
              <stop offset="100%" stopColor={fillColor} stopOpacity={0} />
            </linearGradient>
          </defs>
          <YAxis domain={['dataMin', 'dataMax']} hide />
          <Area
            type="monotone"
            dataKey="price"
            stroke={strokeColor}
            strokeWidth={2}
            fill="url(#priceGradient)"
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
      <div className="absolute bottom-0 left-0 text-xs text-muted-foreground font-mono">
        7d price chart
      </div>
    </div>
  );
};
