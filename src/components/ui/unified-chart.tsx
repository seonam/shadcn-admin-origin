"use client"

import * as React from "react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  Label,
  Line,
  LineChart,
  Pie,
  PieChart,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
  PolarAngleAxis,
} from "recharts"

import { cn } from "@/lib/utils"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface SeriesConfig {
  /** The key in the data object for this series' values */
  dataKey: string
  /** The name to show in the tooltip/legend */
  name?: string
  /** A hex color string for the series */
  color?: string
}

interface UnifiedChartProps {
  /** The type of chart to render */
  type: "line" | "area" | "radial" | "donut"
  /** The chart data */
  data: Record<string, any>[]
  /** The key for the category axis (X-axis for line/area, nameKey for donut/radial) */
  category: string
  /** An array of series configurations to plot */
  series: SeriesConfig[]
  /** The main title of the chart */
  title: string
  /** A description for the chart, used for accessibility */
  description?: string
  /** An optional label for the Y-axis */
  yAxisLabel?: string
  /** Optional additional class names */
  className?: string
}

const DONUT_COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--primary) / 0.9)",
  "hsl(var(--primary) / 0.8)",
  "hsl(var(--primary) / 0.7)",
  "hsl(var(--primary) / 0.6)",
]

function UnifiedChart({
  type,
  data,
  category,
  series,
  title,
  description,
  yAxisLabel,
  className,
}: UnifiedChartProps) {
  const id = React.useId()

  const renderChart = () => {
    switch (type) {
      case "line":
      case "area": {
        const ChartComponent = type === "line" ? LineChart : AreaChart
        const SeriesComponent = type === "line" ? Line : Area

        return (
          <ChartComponent data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey={category}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              label={
                yAxisLabel
                  ? {
                      value: yAxisLabel,
                      angle: -90,
                      position: "insideLeft",
                      offset: 12,
                      style: {
                        fontSize: "12px",
                        fill: "hsl(var(--muted-foreground))",
                      },
                    }
                  : undefined
              }
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            {series.map((s) => (
              <SeriesComponent
                key={s.dataKey}
                dataKey={s.dataKey}
                type="natural"
                fill={s.color || "hsl(var(--primary))"}
                stroke={s.color || "hsl(var(--primary))"}
                stackId={type === "area" ? "a" : undefined}
                name={s.name}
              />
            ))}
          </ChartComponent>
        )
      }

      case "donut": {
        const dataKey = series[0]?.dataKey
        if (!dataKey) return null

        return (
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={data}
              dataKey={dataKey}
              nameKey={category}
              innerRadius="60%"
              outerRadius="80%"
              strokeWidth={5}
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={DONUT_COLORS[index % DONUT_COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        )
      }

      case "radial": {
        const dataKey = series[0]?.dataKey
        if (!dataKey) return null
        const firstEntry = data[0]

        return (
          <RadialBarChart
            data={data}
            innerRadius="80%"
            startAngle={-90}
            endAngle={270}
          >
            <PolarAngleAxis
              type="number"
              domain={[0, firstEntry ? firstEntry[dataKey] * 1.5 : 100]}
              dataKey={dataKey}
              angleAxisId={0}
              tick={false}
            />
            <RadialBar
              dataKey={dataKey}
              background
              cornerRadius={10}
              angleAxisId={0}
            >
              <Cell
                key={`cell-0`}
                fill={series[0]?.color || "hsl(var(--primary))"}
              />
            </RadialBar>
            {firstEntry && (
              <Label
                content={() => (
                  <text
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-foreground text-3xl font-bold"
                  >
                    {firstEntry[dataKey].toLocaleString()}
                    <tspan
                      x="50%"
                      dy="1.2em"
                      className="text-muted-foreground text-sm"
                    >
                      {firstEntry[category]}
                    </tspan>
                  </text>
                )}
              />
            )}
          </RadialBarChart>
        )
      }

      default:
        return null
    }
  }

  return (
    <div className={cn("p-4 border rounded-md", className)}>
      <h3 id={`title-${id}`} className="font-semibold">
        {title}
      </h3>
      {description && (
        <p id={`description-${id}`} className="text-sm text-muted-foreground">
          {description}
        </p>
      )}
      <ChartContainer
        config={{}}
        className="h-64 w-full"
        aria-labelledby={`title-${id}`}
        aria-describedby={`description-${id}`}
      >
        <ResponsiveContainer>{renderChart()}</ResponsiveContainer>
      </ChartContainer>
    </div>
  )
}

export { UnifiedChart }
