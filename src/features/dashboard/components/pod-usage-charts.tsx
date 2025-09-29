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
import { useGetMetricByRange, RangeVector } from "../hooks/use-metrics";
import { Skeleton } from "@/components/ui/skeleton";

// --- DATA TRANSFORMATION ---
const transformUsageVectorForChart = (vector?: RangeVector) => {
  if (!vector?.data.result) return [];
  
  const timestamps = new Set<number>();
  vector.data.result.forEach(series => {
    series.values.forEach(([ts]) => timestamps.add(ts));
  });

  const sortedTimestamps = Array.from(timestamps).sort();

  const podNames = vector.data.result.map(s => s.metric.pod);
  const podConfigs = podNames.reduce((acc, podName, index) => {
    acc[podName] = { label: podName, color: `var(--chart-${index + 1})` };
    return acc;
  }, {} as Record<string, { label: string; color: string }>);

  const chartData = sortedTimestamps.map(ts => {
    const dataPoint: any = { date: ts * 1000 };
    vector.data.result.forEach(series => {
      const valueEntry = series.values.find(([timestamp]) => timestamp === ts);
      dataPoint[series.metric.pod] = valueEntry ? parseFloat(valueEntry[1]) : null;
    });
    return dataPoint;
  });

  return { chartData, podConfigs };
};

// --- Reusable Area Chart Component ---
const UsageAreaChart = ({ data, podConfigs }: { data: any[], podConfigs: any }) => (
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
          stackId="a"
        />
      ))}
      <ChartLegend content={<ChartLegendContent />} />
    </AreaChart>
  </ChartContainer>
);

// --- Main Export Component ---
export function PodUsageCharts() {
  const [timeRange, setTimeRange] = React.useState("15m");

  const { data: cpuVector, isLoading: isCpuLoading } = useGetMetricByRange(1, 'pod_cpu_usage_range', timeRange);
  const { data: memoryVector, isLoading: isMemoryLoading } = useGetMetricByRange(1, 'pod_memory_usage_range', timeRange);

  const { chartData: cpuChartData, podConfigs: cpuPodConfigs } = React.useMemo(() => transformUsageVectorForChart(cpuVector), [cpuVector]);
  const { chartData: memoryChartData, podConfigs: memoryPodConfigs } = React.useMemo(() => transformUsageVectorForChart(memoryVector), [memoryVector]);

  const isLoading = isCpuLoading || isMemoryLoading;

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
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[250px]">
            <Skeleton className="w-full h-full" />
            <Skeleton className="w-full h-full" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-4">
            <div>
                <div className="text-center text-sm text-muted-foreground mb-2">CPU Usage (cores)</div>
                <UsageAreaChart data={cpuChartData} podConfigs={cpuPodConfigs} />
            </div>
            <div>
                <div className="text-center text-sm text-muted-foreground mb-2">Memory Usage (MB)</div>
                <UsageAreaChart data={memoryChartData} podConfigs={memoryPodConfigs} />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
