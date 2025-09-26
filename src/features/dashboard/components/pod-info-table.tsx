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

// This mock data simulates the result of joining multiple Prometheus queries.
// For example, joining results from:
// - kube_pod_created
// - kube_pod_container_status_restarts_total
// - sum(rate(container_cpu_usage_seconds_total[5m])) by (pod)
// - container_memory_working_set_bytes
const mockPodData = [
  {
    podName: "frontend-api-6b7b8c9c-x4v2f",
    created: new Date().getTime() / 1000 - 60 * 60 * 24 * 3, // 3 days ago
    restarts: 0,
    cpuUsage: "0.15", // value is a string, like in Prometheus results
    memoryUsage: "256000000", // in bytes
  },
  {
    podName: "frontend-api-6b7b8c9c-a8b3d",
    created: new Date().getTime() / 1000 - 60 * 60 * 12, // 12 hours ago
    restarts: 2,
    cpuUsage: "0.25",
    memoryUsage: "288000000",
  },
  {
    podName: "worker-jobs-7a8c9d0e-q5r6t",
    created: new Date().getTime() / 1000 - 60 * 5, // 5 minutes ago
    restarts: 0,
    cpuUsage: "1.10",
    memoryUsage: "512000000",
  },
  {
    podName: "database-connector-f9g0h1i2-z3y4x",
    created: new Date().getTime() / 1000 - 60 * 60 * 24 * 10, // 10 days ago
    restarts: 12,
    cpuUsage: "0.05",
    memoryUsage: "128000000",
  },
];

// Helper to format bytes into MB
const formatBytes = (bytes: string) => {
  const mb = parseFloat(bytes) / 1024 / 1024;
  return `${mb.toFixed(2)} MB`;
};

export function PodInfoTable() {
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
            {mockPodData.map((pod) => (
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
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
