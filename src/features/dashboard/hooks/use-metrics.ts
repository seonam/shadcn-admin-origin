import * as React from "react";

// --- Data Types --- //

export interface InstantVector {
  projectId: number;
  data: {
    resultType: "vector";
    result: {
      metric: Record<string, string>;
      value: [number, string];
    }[];
  };
}

export interface RangeVector {
  projectId: number;
  data: {
    resultType: "matrix";
    result: {
      metric: Record<string, string>;
      values: [number, string][];
    }[];
  };
}

export interface PodInfo {
  podName: string;
  created: number;
  restarts: number;
  cpuUsage: string;
  memoryUsage: string;
}

export type DonutChartData = {
  name: string;
  value: number;
  fill: string;
};

// --- Mock Data Generation --- //
const generateTimeSeriesData = (pods: string[], timeMinutes: number, unit: 'cores' | 'MB') => {
  const now = Date.now();
  const result: { metric: { pod: string }; values: [number, string][] }[] = [];
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
    result.push({ metric: { pod }, values });
  }
  return { projectId: 1, data: { resultType: "matrix", result } };
};

const POD_NAMES = [
  "frontend-api-6b7b8c9c-x4v2f",
  "worker-jobs-7a8c9d0e-q5r6t",
  "database-connector-f9g0h1i2-z3y4x",
];

// --- Mock Data Store --- //

const MOCK_DATA_STORE: Record<string, any> = {
  pod_status: {
    projectId: 1,
    data: {
      resultType: "vector",
      result: [
        { metric: { phase: "Running" }, value: [Date.now(), "125"] },
        { metric: { phase: "Succeeded" }, value: [Date.now(), "45"] },
        { metric: { phase: "Pending" }, value: [Date.now(), "12"] },
        { metric: { phase: "Failed" }, value: [Date.now(), "8"] },
      ],
    },
  },
  pod_info: {
    projectId: 1,
    data: {
      resultType: "vector",
      result: [
        { metric: { podName: "frontend-api-6b7b8c9c-x4v2f", created: (new Date().getTime() / 1000 - 60 * 60 * 24 * 3).toString(), restarts: "0", cpuUsage: "0.15", memoryUsage: "256000000" }, value: [Date.now(), "1"] },
        { metric: { podName: "frontend-api-6b7b8c9c-a8b3d", created: (new Date().getTime() / 1000 - 60 * 60 * 12).toString(), restarts: "2", cpuUsage: "0.25", memoryUsage: "288000000" }, value: [Date.now(), "1"] },
        { metric: { podName: "worker-jobs-7a8c9d0e-q5r6t", created: (new Date().getTime() / 1000 - 60 * 5).toString(), restarts: "0", cpuUsage: "1.10", memoryUsage: "512000000" }, value: [Date.now(), "1"] },
        { metric: { podName: "database-connector-f9g0h1i2-z3y4x", created: (new Date().getTime() / 1000 - 60 * 60 * 24 * 10).toString(), restarts: "12", cpuUsage: "0.05", memoryUsage: "128000000" }, value: [Date.now(), "1"] },
      ],
    },
  },
  cpu_limit: { projectId: 1, data: { resultType: "vector", result: [{ metric: {}, value: [1716966982.249, "8"] }] } },
  cpu_usage: { projectId: 1, data: { resultType: "matrix", result: [{ metric: {}, values: [[1716966480, "1.2"], [1716966540, "1.5"], [1716966600, "5.8"]] }] } },
  memory_limit: { projectId: 1, data: { resultType: "vector", result: [{ metric: {}, value: [1716966982.249, "64"] }] } },
  memory_usage: { projectId: 1, data: { resultType: "matrix", result: [{ metric: {}, values: [[1716966480, "28.1"], [1716966540, "30.5"], [1716966600, "35.4"]] }] } },
  // Static data for range queries are now generated dynamically in the hook
};

// --- API Hooks --- //

function useGetMetricQuery<T>(projectId: number, query: string, timeRange?: string) {
  const [data, setData] = React.useState<T | undefined>(undefined);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    const fetchData = () => {
      setIsLoading(true);
      setTimeout(() => {
        try {
          let result = MOCK_DATA_STORE[query];
          // Handle dynamic generation for time-series data
          if (query === 'pod_cpu_usage_range' || query === 'pod_memory_usage_range') {
            let timeMinutes = 60;
            if (timeRange) {
              if (timeRange.includes('h')) {
                timeMinutes = parseInt(timeRange.replace('h', '')) * 60;
              } else if (timeRange.includes('m')) {
                timeMinutes = parseInt(timeRange.replace('m', ''));
              }
            }
            const unit = query === 'pod_cpu_usage_range' ? 'cores' : 'MB';
            result = generateTimeSeriesData(POD_NAMES, timeMinutes, unit);
          }

          if (result) {
            setData(result as T);
          } else {
            throw new Error(`No data found for query: ${query}`);
          }
        } catch (e: any) {
          setError(e);
        }
        setIsLoading(false);
      }, 500); // Simulate network delay
    };

    if (projectId) {
        fetchData();
    }
  }, [projectId, query, timeRange]);

  return { data, isLoading, error };
}

export function useGetMetric(projectId: number, query: string): { data: InstantVector | undefined; isLoading: boolean; error: Error | null } {
    return useGetMetricQuery<InstantVector>(projectId, query);
}

export function useGetMetricByRange(projectId: number, query: string, timeRange?: string): { data: RangeVector | undefined; isLoading: boolean; error: Error | null } {
    return useGetMetricQuery<RangeVector>(projectId, query, timeRange);
}
