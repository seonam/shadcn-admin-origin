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
import { useGetMetric, PodInfo, InstantVector } from "../hooks/use-metrics";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

// Helper to format bytes into MB
const formatBytes = (bytes: string) => {
  const mb = parseFloat(bytes) / 1024 / 1024;
  return `${mb.toFixed(2)} MB`;
};

function parsePodInfoVector(vector?: InstantVector): PodInfo[] {
  if (!vector) return [];
  try {
    return vector.data.result.map(item => ({
      podName: item.metric.podName,
      created: parseFloat(item.metric.created),
      restarts: parseInt(item.metric.restarts, 10),
      cpuUsage: item.metric.cpuUsage,
      memoryUsage: item.metric.memoryUsage,
    }));
  } catch (error) {
    console.error("Error parsing pod info vector:", error);
    return [];
  }
}

export function PodInfoTable() {
  const { data: podInfoVector, isLoading } = useGetMetric(1, 'pod_info');

  const podData = React.useMemo(() => parsePodInfoVector(podInfoVector), [podInfoVector]);

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
              <TableHead className="text-right">CPU Usage</TableHead>
              <TableHead className="text-right">Memory Usage</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell colSpan={5}>
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
                  <TableCell className="text-right">{parseFloat(pod.cpuUsage).toFixed(2)} cores</TableCell>
                  <TableCell className="text-right">{formatBytes(pod.memoryUsage)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
