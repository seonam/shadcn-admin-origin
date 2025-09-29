import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/layout/header";
import { Main } from "@/components/layout/main";
import { TopNav } from "@/components/layout/top-nav";
import { ProfileDropdown } from "@/components/profile-dropdown";
import { Search } from "@/components/search";
import { ThemeSwitch } from "@/components/theme-switch";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import * as React from "react";
import { Label, Pie, PieChart, RadialBar, RadialBarChart, PolarRadiusAxis } from "recharts";
import { PodInfoTable } from "./components/pod-info-table";
import { PodUsageCharts } from "./components/pod-usage-charts";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetMetric,
  useGetMetricByRange,
  InstantVector,
  RangeVector,
  DonutChartData,
} from "./hooks/use-metrics";

// --- Data Types and Parsers --- //

type ChartDisplayConfig = Record<string, { label: string; color: string }>;

function parseInstantVectorToSingleValue(vector?: InstantVector): number {
  try {
    const value = vector?.data.result?.[0]?.value?.[1];
    return value ? parseFloat(value) : 0;
  } catch (error) {
    console.error("Error parsing instant vector:", error);
    return 0;
  }
}

function parseRangeVectorToSingleValue(matrix?: RangeVector): number {
  try {
    const values = matrix?.data.result?.[0]?.values;
    if (Array.isArray(values) && values.length > 0) {
      const latestValue = values[values.length - 1]?.[1];
      return latestValue ? parseFloat(latestValue) : 0;
    }
    return 0;
  } catch (error) {
    console.error("Error parsing range vector:", error);
    return 0;
  }
}

function parsePodStatusVector(vector?: InstantVector): DonutChartData[] {
  if (!vector) return [];
  const colorMap: Record<string, string> = {
    Running: "var(--chart-2)",
    Succeeded: "var(--chart-1)",
    Pending: "var(--chart-3)",
    Failed: "var(--chart-5)",
  };
  try {
    return vector.data.result.map(item => {
      const phase = item.metric.phase;
      return {
        name: phase,
        value: parseFloat(item.value[1]),
        fill: colorMap[phase] || "var(--chart-4)",
      };
    });
  } catch (error) {
    console.error("Error parsing pod status vector:", error);
    return [];
  }
}

// --- Main Dashboard Component --- //

export default function Dashboard() {
  return (
    <>
      <Header>
        <TopNav links={topNav} />
        <div className="ml-auto flex items-center space-x-4">
          <Search />
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className="space-y-4">
          <KubernetesClusterOverview />
          <PodUsageCharts />
          <PodInfoTable />
        </div>
      </Main>
    </>
  );
}

function KubernetesClusterOverview() {
  const { data: podStatusVector, isLoading: podStatusLoading } = useGetMetric(1, "pod_status");
  const { data: cpuLimitData, isLoading: cpuLimitLoading } = useGetMetric(1, "cpu_limit");
  const { data: cpuUsageData, isLoading: cpuUsageLoading } = useGetMetricByRange(1, "cpu_usage");
  const { data: memoryLimitData, isLoading: memoryLimitLoading } = useGetMetric(1, "memory_limit");
  const { data: memoryUsageData, isLoading: memoryUsageLoading } = useGetMetricByRange(1, "memory_usage");

  const isLoading = podStatusLoading || cpuLimitLoading || cpuUsageLoading || memoryLimitLoading || memoryUsageLoading;

  const podStatusData = React.useMemo(() => parsePodStatusVector(podStatusVector), [podStatusVector]);
  const cpuLimit = parseInstantVectorToSingleValue(cpuLimitData);
  const cpuUsage = parseRangeVectorToSingleValue(cpuUsageData);
  const memoryLimit = parseInstantVectorToSingleValue(memoryLimitData);
  const memoryUsage = parseRangeVectorToSingleValue(memoryUsageData);

  const cpuData = [{ name: "CPU", used: cpuUsage, limit: cpuLimit }];
  const memoryData = [{ name: "Memory", used: memoryUsage, limit: memoryLimit }];

  const resourceDisplayConfig: ChartDisplayConfig = {
    memory: { label: "Memory", color: "var(--chart-1)" },
    cpu: { label: "CPU", color: "var(--chart-2)" },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Kubernetes Cluster Overview</CardTitle>
        <CardDescription>An overview of pod statuses and resource usage.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 items-start gap-8 h-60">
            <Skeleton className="w-full h-full" />
            <Skeleton className="w-full h-full" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg: grid-cols-2 items-start gap-8">
            <div className="flex flex-col items-center w-full">
              <h3 className="text-lg font-semibold mb-4">Pod Status</h3>
              <DonutChart data={podStatusData} dataKey="value" nameKey="name" />
            </div>
            <div className="flex flex-col items-center w-full">
              <h3 className="text-lg font-semibold mb-4">Resource Usage</h3>
              <div className="w-full flex justify-around items-start gap-x-4 pt-6">
                <div className="flex-1 max-w-[250px]">
                  <ChartRadial
                    metricKey="memory"
                    data={memoryData}
                    config={resourceDisplayConfig}
                    title="Memory"
                    unit="Gi"
                    dataKey="used"
                    limitKey="limit"
                  />
                </div>
                <div className="flex-1 max-w-[250px]">
                  <ChartRadial
                    metricKey="cpu"
                    data={cpuData}
                    config={resourceDisplayConfig}
                    title="CPU"
                    unit="Cores"
                    dataKey="used"
                    limitKey="limit"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

const topNav = [
  { title: "Overview", href: "dashboard/overview", isActive: true, disabled: false },
  { title: "Customers", href: "dashboard/customers", isActive: false, disabled: true },
  { title: "Products", href: "dashboard/products", isActive: false, disabled: true },
  { title: "Settings", href: "dashboard/settings", isActive: false, disabled: true },
];

// --- Chart Components --- //

interface ChartRadialProps {
  metricKey: string;
  data: Record<string, any>[];
  config: ChartDisplayConfig;
  title: string;
  unit?: string;
  dataKey: string;
  limitKey: string;
}

function ChartRadial({
  metricKey,
  data,
  config,
  title,
  unit = "",
  dataKey,
  limitKey,
}: ChartRadialProps) {
  const metricConfig = config[metricKey];
  if (!metricConfig) {
    console.warn(`No chartConfig found for metric "${metricKey}"`);
    return null;
  }

  const processed = data.map((d) => ({
    ...d,
    remaining: d[limitKey] - d[dataKey],
  }));

  const used = processed[0]?.[dataKey] ?? 0;
  const limit = processed[0]?.[limitKey] ?? 0;
  const percentage = limit > 0 ? (used / limit) * 100 : 0;

  return (
    <div className="flex flex-col items-center w-full">
      {/* Title */}
      <div className="text-base font-semibold">{title}</div>
      <div className="text-base">{used.toFixed(1)} / {limit.toFixed(1)} {unit}</div>

      <ChartContainer
        config={{ [metricKey]: metricConfig }}
        className="relative aspect-square w-full max-w-[220px]"
      >
        <RadialBarChart data={processed} startAngle={180} endAngle={0} innerRadius={80} outerRadius={130}>
          <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />

          <defs>
            <linearGradient id={`${metricKey}UsedGradient`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={metricConfig.color} stopOpacity={0.3} />
              <stop offset="100%" stopColor={metricConfig.color} stopOpacity={1} />
            </linearGradient>
            <linearGradient id={`${metricKey}RemGradient`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={metricConfig.color} stopOpacity={0.1} />
              <stop offset="100%" stopColor={metricConfig.color} stopOpacity={0.1} />
            </linearGradient>
          </defs>

          <RadialBar dataKey={dataKey} cornerRadius={5} fill={`url(#${metricKey}UsedGradient)`} stackId="a" />
          <RadialBar dataKey="remaining" cornerRadius={5} fill={`url(#${metricKey}RemGradient)`} stackId="a" />

          <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
            <Label
              content={({ viewBox }) => {
                if (!viewBox || typeof viewBox.cx !== "number" || typeof viewBox.cy !== "number") return null;
                return (
                  <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                    <tspan x={viewBox.cx} y={viewBox.cy - 10} className="fill-foreground text-xl font-bold">
                      {percentage.toFixed(1)}%
                    </tspan>
                  </text>
                );
              }}
            />
          </PolarRadiusAxis>
        </RadialBarChart>
      </ChartContainer>
    </div>
  );
}

function DonutChart({ data, dataKey, nameKey }: { data: Record<string, any>[]; dataKey: string; nameKey: string }) {
  const chartData = React.useMemo(() => {
    return data.map((item, index) => ({
      ...item,
      fill: item.fill || `var(--chart-${index + 1})`,
    }));
  }, [data]);

  const chartConfig: ChartDisplayConfig = React.useMemo(() => {
    const config: ChartDisplayConfig = { [dataKey]: { label: dataKey, color: "hsl(var(--foreground))" } };
    chartData.forEach((item) => {
      config[item[nameKey]] = { label: item[nameKey], color: item.fill };
    });
    return config;
  }, [chartData, dataKey, nameKey]);

  const totalValue = React.useMemo(
    () => chartData.reduce((acc, curr) => acc + curr[dataKey], 0),
    [chartData, dataKey]
  );

  return (
    <div className="flex w-full items-center gap-6">
      <div className="flex-1 max-w-[200px]">
        <ChartContainer config={chartConfig} className="w-full h-[200px]">
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie data={chartData} dataKey={dataKey} nameKey={nameKey} innerRadius={50} strokeWidth={5}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                        <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-2xl font-bold">
                          {totalValue.toLocaleString()}
                        </tspan>
                        <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 20} className="fill-muted-foreground text-sm">
                          Pods
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </div>
      <div className="flex flex-col justify-center gap-2 text-sm">
        {chartData.map((item) => (
          <div key={item[nameKey]} className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.fill }} />
            <span className="font-medium capitalize text-muted-foreground w-20">
              {item[nameKey]}
            </span>
            <span className="font-bold ml-auto">
              {item[dataKey]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

