import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import {
  AreaChart,
  Area,
  XAxis,
  CartesianGrid,
} from 'recharts'
import * as React from "react"

// --- MOCK DATA GENERATION (Simulating Prometheus API) ---
const POD_NAMES = [
  "frontend-api-6b7b8c9c-x4v2f",
  "worker-jobs-7a8c9d0e-q5r6t",
  "database-connector-f9g0h1i2-z3y4x",
];
const COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)"];

const generateMockData = (pods: string[], timeMinutes: number, unit: 'cores' | 'MB') => {
  const now = Date.now();
  const data: any[] = [];
  for (const pod of pods) {
    const values: [number, string][] = [];
    for (let i = timeMinutes; i >= 0; i--) {
      const timestamp = Math.floor((now - i * 60 * 1000) / 1000);
      let value;
      if (unit === 'cores') {
        value = (Math.random() * (pod.includes('api') ? 0.5 : 1.5)).toFixed(2);
      } else { // MB
        value = (Math.random() * (pod.includes('api') ? 300 : 800)).toFixed(0);
      }
      values.push([timestamp, value]);
    }
    data.push({ metric: { pod }, values });
  }
  return data;
};

// --- DATA TRANSFORMATION ---
const transformDataForChart = (prometheusResult: any[]) => {
  if (!prometheusResult || prometheusResult.length === 0) return [];
  const timestamps = new Set<number>();
  prometheusResult.forEach(series => {
    series.values.forEach(([ts]: [number, string]) => timestamps.add(ts));
  });

  const sortedTimestamps = Array.from(timestamps).sort();

  return sortedTimestamps.map(ts => {
    const dataPoint: any = { date: ts * 1000 }; // Use 'date' for XAxis
    prometheusResult.forEach(series => {
      const valueEntry = series.values.find(([timestamp]: [number, string]) => timestamp === ts);
      dataPoint[series.metric.pod] = valueEntry ? parseFloat(valueEntry[1]) : null;
    });
    return dataPoint;
  });
};

// --- Reusable Area Chart Component ---
const UsageAreaChart = ({ data, unit, podConfigs }: { data: any[], unit: string, podConfigs: any }) => (
  <ChartContainer config={podConfigs} className="aspect-auto h-[250px] w-full">
    <AreaChart data={data}>
      <defs>
        {Object.keys(podConfigs).filter(k => k !== 'time').map(podName => (
          <linearGradient key={podName} id={`fill-${podName}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={podConfigs[podName].color} stopOpacity={0.8} />
            <stop offset="95%" stopColor={podConfigs[podName].color} stopOpacity={0.1} />
          </linearGradient>
        ))}
      </defs>
      <CartesianGrid vertical={false} />
      <XAxis
        dataKey="date"
        tickLine={false}
        axisLine={false}
        tickMargin={8}
        minTickGap={32}
        tickFormatter={(value) => new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      />
      <ChartTooltip
        cursor={false}
        content={<ChartTooltipContent indicator="dot" labelFormatter={(value) => new Date(value).toLocaleString()} />}
      />
      {Object.keys(podConfigs).filter(k => k !== 'time').map(podName => (
        <Area
          key={podName}
          dataKey={podName}
          type="natural"
          fill={`url(#fill-${podName})`}
          stroke={podConfigs[podName].color}
        />
      ))}
      <ChartLegend content={<ChartLegendContent />} />
    </AreaChart>
  </ChartContainer>
);

// --- Main Export Component ---
export function PodUsageCharts() {
  const [timeRange, setTimeRange] = React.useState("15m");

  const timeMinutes = parseInt(timeRange.replace('m', ''));

  const mockCpuData = generateMockData(POD_NAMES, timeMinutes, 'cores');
  const mockMemoryData = generateMockData(POD_NAMES, timeMinutes, 'MB');

  const transformedCpuData = transformDataForChart(mockCpuData);
  const transformedMemoryData = transformDataForChart(mockMemoryData);

  const podChartConfig = POD_NAMES.reduce((acc, podName, index) => {
    acc[podName] = { label: podName, color: COLORS[index % COLORS.length] };
    return acc;
  }, {} as any);

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Per-Pod Resource Usage</CardTitle>
          <CardDescription>CPU and Memory usage for individual pods.</CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[160px] rounded-lg sm:ml-auto" aria-label="Select time range">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="60m" className="rounded-lg">Last 60 minutes</SelectItem>
            <SelectItem value="30m" className="rounded-lg">Last 30 minutes</SelectItem>
            <SelectItem value="15m" className="rounded-lg">Last 15 minutes</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-4">
            <div>
                <div className="text-center text-sm text-muted-foreground mb-2">CPU Usage (cores)</div>
                <UsageAreaChart data={transformedCpuData} unit="c" podConfigs={podChartConfig} />
            </div>
            <div>
                <div className="text-center text-sm text-muted-foreground mb-2">Memory Usage (MB)</div>
                <UsageAreaChart data={transformedMemoryData} unit="MB" podConfigs={podChartConfig} />
            </div>
        </div>
      </CardContent>
    </Card>
  )
}