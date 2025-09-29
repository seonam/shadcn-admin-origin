import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from 'date-fns';
import {
  useGetCreated,
  useGetRestartsTotal,
  useGetMemoryUsed,
  useGetMemoryLimit,
  PodInfo,
  InstantVector
} from "../hooks/use-metrics";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

// Helper to format bytes into MB
const formatBytes = (bytes: string) => {
  if (!bytes) return "0.00 MB";
  const mb = parseFloat(bytes) / 1024 / 1024;
  return `${mb.toFixed(2)} MB`;
};

const joinPodInfo = (
  createdData?: InstantVector,
  restartsData?: InstantVector,
  memoryUsedData?: InstantVector,
  memoryLimitData?: InstantVector
): PodInfo[] => {
  if (!createdData || !restartsData || !memoryUsedData || !memoryLimitData) {
    return [];
  }

  const restartsMap = new Map(restartsData.data.result.map(item => [item.metric.pod, item.value[1]]));
  const memoryUsedMap = new Map(memoryUsedData.data.result.map(item => [item.metric.pod, item.value[1]]));
  const memoryLimitMap = new Map(memoryLimitData.data.result.map(item => [item.metric.pod, item.value[1]]));

  return createdData.data.result.map(item => {
    const podName = item.metric.pod;
    return {
      podName,
      created: parseFloat(item.value[1]),
      restarts: parseInt(restartsMap.get(podName) || '0', 10),
      // cpuUsage is missing from the new hooks, so it's removed for now.
      cpuUsage: "N/A", 
      memoryUsage: memoryUsedMap.get(podName) || '0',
      memoryLimit: memoryLimitMap.get(podName) || '0',
    };
  });
};

export function PodInfoTable() {
  const { data: createdData, isLoading: isLoadingCreated } = useGetCreated(1);
  const { data: restartsData, isLoading: isLoadingRestarts } = useGetRestartsTotal(1);
  const { data: memoryUsedData, isLoading: isLoadingMemoryUsed } = useGetMemoryUsed(1);
  const { data: memoryLimitData, isLoading: isLoadingMemoryLimit } = useGetMemoryLimit(1);

  const isLoading = isLoadingCreated || isLoadingRestarts || isLoadingMemoryUsed || isLoadingMemoryLimit;

  const podData = React.useMemo(() => 
    joinPodInfo(createdData, restartsData, memoryUsedData, memoryLimitData), 
    [createdData, restartsData, memoryUsedData, memoryLimitData]
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pod Status Details</CardTitle>
        <CardDescription>
          Detailed information for individual pods running in the cluster.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pod Name</TableHead>
              <TableHead>Last Deployed</TableHead>
              <TableHead className="text-center">Restarts</TableHead>
              <TableHead className="text-right">Memory Usage</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell colSpan={4}>
                    <Skeleton className="h-8 w-full" />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              podData.map((pod) => (
                <TableRow key={pod.podName}>
                  <TableCell className="font-medium">{pod.podName}</TableCell>
                  <TableCell>{formatDistanceToNow(new Date(pod.created * 1000), { addSuffix: true })}</TableCell>
                  <TableCell className="text-center">
                    {pod.restarts > 0 ? (
                      <Badge variant="destructive">{pod.restarts}</Badge>
                    ) : (
                      <Badge variant="secondary">{pod.restarts}</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">{`${formatBytes(pod.memoryUsage)} / ${formatBytes(pod.memoryLimit)}`}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
