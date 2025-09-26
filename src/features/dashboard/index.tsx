import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,CardFooter
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { TopNav } from '@/components/layout/top-nav'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Overview } from './components/overview'
import { RecentSales } from './components/recent-sales'
import { ChartContainer, ChartTooltipContent, ChartTooltip } from "@/components/ui/chart"


export default function Dashboard() {
  const resources = [
      { name: "Memory", used: 6, limit: 10, color: "var(--chart-1)" },
      { name: "CPU", used: 3, limit: 8, color: "var(--chart-2)" },
    ]

  const metricData = [
    { name: "Memory", used: 6, limit: 10 },
  ]

  const chartConfig = {
    memory: {
      label: "Memory",
      color: "var(--chart-1)",
    },
    cpu: {
      label: "CPU",
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig

  const customData = [
    { browser: "desktop", visitors: 450 },
    { browser: "mobile", visitors: 320 },
    { browser: "tablet", visitors: 180 },
  ]

  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header>
        <TopNav links={topNav} />
        <div className='ml-auto flex items-center space-x-4'>
          <Search />
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      {/* ===== Main ===== */}
      <Main>
        // Memory 차트
        <DonutChart
          data={customData}
          title="Device Usage Statistics"
          description="March - August 2024"
          trendText="Mobile usage increased by 8.3%"
          footerText="Based on web analytics data"
        />
        <ChartRadial
          metricKey="memory"
          data={metricData}
          config={chartConfig}
          title="Memory Usage"
          unit="GB"
          trendingText="Trending up by 5.2% this month"
          trendingIcon={<TrendingUp className="h-4 w-4" />}
        />

        // CPU 차트
        <ChartRadial
          metricKey="cpu"
          data={[{ name: "CPU", used: 45, limit: 100 }]}
          config={chartConfig}
          title="CPU Usage"
          unit="GB"
        />
        {/*<div className='mb-2 flex items-center justify-between space-y-2'>*/}
        {/*  <h1 className='text-2xl font-bold tracking-tight'>Dashboard</h1>*/}
        {/*  <div className='flex items-center space-x-2'>*/}
        {/*    <Button>Download</Button>*/}
        {/*  </div>*/}
        {/*</div>*/}
        {/*<Tabs*/}
        {/*  orientation='vertical'*/}
        {/*  defaultValue='overview'*/}
        {/*  className='space-y-4'*/}
        {/*>*/}
        {/*  <div className='w-full overflow-x-auto pb-2'>*/}
        {/*    <TabsList>*/}
        {/*      <TabsTrigger value='overview'>Overview</TabsTrigger>*/}
        {/*      <TabsTrigger value='analytics' disabled>*/}
        {/*        Analytics*/}
        {/*      </TabsTrigger>*/}
        {/*      <TabsTrigger value='reports' disabled>*/}
        {/*        Reports*/}
        {/*      </TabsTrigger>*/}
        {/*      <TabsTrigger value='notifications' disabled>*/}
        {/*        Notifications*/}
        {/*      </TabsTrigger>*/}
        {/*    </TabsList>*/}
        {/*  </div>*/}
        {/*  <TabsContent value='overview' className='space-y-4'>*/}
        {/*    <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>*/}
        {/*      <Card>*/}
        {/*        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>*/}
        {/*          <CardTitle className='text-sm font-medium'>*/}
        {/*            Total Revenue*/}
        {/*          </CardTitle>*/}
        {/*          <svg*/}
        {/*            xmlns='http://www.w3.org/2000/svg'*/}
        {/*            viewBox='0 0 24 24'*/}
        {/*            fill='none'*/}
        {/*            stroke='currentColor'*/}
        {/*            strokeLinecap='round'*/}
        {/*            strokeLinejoin='round'*/}
        {/*            strokeWidth='2'*/}
        {/*            className='text-muted-foreground h-4 w-4'*/}
        {/*          >*/}
        {/*            <path d='M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' />*/}
        {/*          </svg>*/}
        {/*        </CardHeader>*/}
        {/*        <CardContent>*/}
        {/*          <div className='text-2xl font-bold'>$45,231.89</div>*/}
        {/*          <p className='text-muted-foreground text-xs'>*/}
        {/*            +20.1% from last month*/}
        {/*          </p>*/}
        {/*        </CardContent>*/}
        {/*      </Card>*/}
        {/*      <Card>*/}
        {/*        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>*/}
        {/*          <CardTitle className='text-sm font-medium'>*/}
        {/*            Subscriptions*/}
        {/*          </CardTitle>*/}
        {/*          <svg*/}
        {/*            xmlns='http://www.w3.org/2000/svg'*/}
        {/*            viewBox='0 0 24 24'*/}
        {/*            fill='none'*/}
        {/*            stroke='currentColor'*/}
        {/*            strokeLinecap='round'*/}
        {/*            strokeLinejoin='round'*/}
        {/*            strokeWidth='2'*/}
        {/*            className='text-muted-foreground h-4 w-4'*/}
        {/*          >*/}
        {/*            <path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' />*/}
        {/*            <circle cx='9' cy='7' r='4' />*/}
        {/*            <path d='M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75' />*/}
        {/*          </svg>*/}
        {/*        </CardHeader>*/}
        {/*        <CardContent>*/}
        {/*          <div className='text-2xl font-bold'>+2350</div>*/}
        {/*          <p className='text-muted-foreground text-xs'>*/}
        {/*            +180.1% from last month*/}
        {/*          </p>*/}
        {/*        </CardContent>*/}
        {/*      </Card>*/}
        {/*      <Card>*/}
        {/*        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>*/}
        {/*          <CardTitle className='text-sm font-medium'>Sales</CardTitle>*/}
        {/*          <svg*/}
        {/*            xmlns='http://www.w3.org/2000/svg'*/}
        {/*            viewBox='0 0 24 24'*/}
        {/*            fill='none'*/}
        {/*            stroke='currentColor'*/}
        {/*            strokeLinecap='round'*/}
        {/*            strokeLinejoin='round'*/}
        {/*            strokeWidth='2'*/}
        {/*            className='text-muted-foreground h-4 w-4'*/}
        {/*          >*/}
        {/*            <rect width='20' height='14' x='2' y='5' rx='2' />*/}
        {/*            <path d='M2 10h20' />*/}
        {/*          </svg>*/}
        {/*        </CardHeader>*/}
        {/*        <CardContent>*/}
        {/*          <div className='text-2xl font-bold'>+12,234</div>*/}
        {/*          <p className='text-muted-foreground text-xs'>*/}
        {/*            +19% from last month*/}
        {/*          </p>*/}
        {/*        </CardContent>*/}
        {/*      </Card>*/}
        {/*      <Card>*/}
        {/*        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>*/}
        {/*          <CardTitle className='text-sm font-medium'>*/}
        {/*            Active Now*/}
        {/*          </CardTitle>*/}
        {/*          <svg*/}
        {/*            xmlns='http://www.w3.org/2000/svg'*/}
        {/*            viewBox='0 0 24 24'*/}
        {/*            fill='none'*/}
        {/*            stroke='currentColor'*/}
        {/*            strokeLinecap='round'*/}
        {/*            strokeLinejoin='round'*/}
        {/*            strokeWidth='2'*/}
        {/*            className='text-muted-foreground h-4 w-4'*/}
        {/*          >*/}
        {/*            <path d='M22 12h-4l-3 9L9 3l-3 9H2' />*/}
        {/*          </svg>*/}
        {/*        </CardHeader>*/}
        {/*        <CardContent>*/}
        {/*          <div className='text-2xl font-bold'>+573</div>*/}
        {/*          <p className='text-muted-foreground text-xs'>*/}
        {/*            +201 since last hour*/}
        {/*          </p>*/}
        {/*        </CardContent>*/}
        {/*      </Card>*/}
        {/*    </div>*/}
        {/*    <div className='grid grid-cols-1 gap-4 lg:grid-cols-7'>*/}
        {/*      <Card className='col-span-1 lg:col-span-4'>*/}
        {/*        <CardHeader>*/}
        {/*          <CardTitle>Overview</CardTitle>*/}
        {/*        </CardHeader>*/}
        {/*        <CardContent className='pl-2'>*/}
        {/*          <Overview />*/}
        {/*        </CardContent>*/}
        {/*      </Card>*/}
        {/*      <Card className='col-span-1 lg:col-span-3'>*/}
        {/*        <CardHeader>*/}
        {/*          <CardTitle>Recent Sales</CardTitle>*/}
        {/*          <CardDescription>*/}
        {/*            You made 265 sales this month.*/}
        {/*          </CardDescription>*/}
        {/*        </CardHeader>*/}
        {/*        <CardContent>*/}
        {/*          <RecentSales />*/}
        {/*        </CardContent>*/}
        {/*      </Card>*/}
        {/*    </div>*/}
        {/*  </TabsContent>*/}
        {/*</Tabs>*/}
      </Main>
    </>
  )
}

const topNav = [
  {
    title: 'Overview',
    href: 'dashboard/overview',
    isActive: true,
    disabled: false,
  },
  {
    title: 'Customers',
    href: 'dashboard/customers',
    isActive: false,
    disabled: true,
  },
  {
    title: 'Products',
    href: 'dashboard/products',
    isActive: false,
    disabled: true,
  },
  {
    title: 'Settings',
    href: 'dashboard/settings',
    isActive: false,
    disabled: true,
  },
]


import { RadialBarChart, RadialBar, PolarRadiusAxis, Label } from "recharts"
import { TrendingUp } from 'lucide-react'

interface MetricData {
  name: string
  used: number
  limit: number
}

interface ChartConfig {
  [metricName: string]: {
    label: string
    color: string
  }
}

interface ChartRadialProps {
  metricKey: string
  data: MetricData[]
  config: ChartConfig
  title: string
  unit?: string
}

export function ChartRadial({
                              metricKey,
                              data,
                              config,
                              title,
                              unit = "",
                            }: ChartRadialProps) {
  const metricConfig = config[metricKey]
  if (!metricConfig) {
    console.warn(`No chartConfig found for metric "${metricKey}"`)
    return null
  }

  const processed = data.map(d => ({
    ...d,
    remaining: d.limit - d.used,
  }))

  const used = processed[0]?.used ?? 0
  const limit = processed[0]?.limit ?? 0
  const percentage = limit > 0 ? (used / limit) * 100 : 0

  return (
    <div className="flex flex-col items-center w-full">
      {/* Title */}
      <div className="text-base font-semibold">{title}</div>
      <div className="text-base">{used} / {limit} {unit}</div>

      <ChartContainer
        config={{ [metricKey]: metricConfig }}
        className="relative aspect-square w-full max-w-[220px]"
      >
        <RadialBarChart
          data={processed}
          startAngle={180}
          endAngle={0}
          innerRadius={80}
          outerRadius={130}
        >
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

          <RadialBar
            dataKey="used"
            cornerRadius={5}
            fill={`url(#${metricKey}UsedGradient)`}
            stackId="a"
          />
          <RadialBar
            dataKey="remaining"
            cornerRadius={5}
            fill={`url(#${metricKey}RemGradient)`}
            stackId="a"
          />

          <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
            <Label
              content={({ viewBox }) => {
                if (!viewBox || typeof viewBox.cx !== "number" || typeof viewBox.cy !== "number") return null
                return (
                  <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy - 10}
                      className="fill-foreground text-xl font-bold"
                    >
                      {percentage.toFixed(1)}%
                    </tspan>
                  </text>
                )
              }}
            />
          </PolarRadiusAxis>
        </RadialBarChart>
      </ChartContainer>
    </div>
  )
}

import * as React from "react"
import {  Pie, PieChart } from "recharts"
export const description = "A donut chart with text"

// 데이터 타입 정의
interface ChartDataItem {
  browser: string
  visitors: number
  fill?: string
}

interface ChartConfig {
  [key: string]: {
    label: string
    color?: string
  }
}

interface DonutChartProps {
  data: ChartDataItem[]
  title?: string
  description?: string
  trendText?: string
  footerText?: string
}

export function DonutChart({
                             data,
                             title = "Pie Chart - Donut with Text",
                             description = "January - June 2024",
                             trendText = "Trending up by 5.2% this month",
                             footerText = "Showing total visitors for the last 6 months"
                           }: DonutChartProps) {

  // 차트 데이터 (색상 자동 할당)
  const chartData = React.useMemo(() => {
    return data.map((item, index) => ({
      ...item,
      fill: item.fill || `var(--chart-${index + 1})`
    }))
  }, [data])

  // 차트 설정 자동 생성
  const chartConfig: ChartConfig = React.useMemo(() => {
    const config: ChartConfig = {
      visitors: { label: "Visitors" }
    }

    data.forEach((item, index) => {
      config[item.browser] = {
        label: item.browser,
        color: `var(--chart-${index + 1})`
      }
    })

    return config
  }, [data])

  const totalVisitors = React.useMemo(
    () => chartData.reduce((acc, curr) => acc + curr.visitors, 0),
    [chartData]
  )

  return (
    <div className="flex flex-col">
      {/* 헤더 */}
      <div className="items-center pb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      {/* 차트와 범례 */}
      <div className="flex gap-4 pb-4">
        {/* 차트 영역 */}
        <div className="flex-1 max-w-[250px]">
          <ChartContainer config={chartConfig} className="w-full h-[250px]">
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={chartData}
                dataKey="visitors"
                nameKey="browser"
                innerRadius={60}
                strokeWidth={5}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold"
                          >
                            {totalVisitors.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            Visitors
                          </tspan>
                        </text>
                      )
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        </div>

        {/* 범례 */}
        <div className="flex flex-col justify-center gap-2">
          {chartData.map((item, index) => (
            <div key={item.browser} className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: `var(--chart-${index + 1})` }}
              />
              <span className="font-medium capitalize">{item.browser}</span>
              <span className="text-muted-foreground">
                {item.visitors.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 푸터 */}
      <div className="flex flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          {trendText} <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          {footerText}
        </div>
      </div>
    </div>
  )
}