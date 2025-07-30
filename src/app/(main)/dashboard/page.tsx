"use client"

import { useQuery } from "@tanstack/react-query"
import { dashboardApi } from "@/lib/api"
import { MetricTile } from "@/components/ui/MetricTile"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"
import { formatDate } from "@/lib/utils"
import { Users, BookOpen, GraduationCap, TrendingUp } from "lucide-react"

export default function DashboardPage() {
  const { data: metrics, isLoading: metricsLoading } = useQuery({
    queryKey: ["dashboard-metrics"],
    queryFn: () => dashboardApi.getMetrics(),
  })

  const { data: recentProgress, isLoading: progressLoading } = useQuery({
    queryKey: ["dashboard-recent-progress"],
    queryFn: () => dashboardApi.getRecentProgress(10),
  })

  if (metricsLoading || progressLoading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-card loading-shimmer" />
          ))}
        </div>
        <div className="h-96 bg-card loading-shimmer" />
      </div>
    )
  }

  const metricsData = metrics?.data.data
  const progressData = recentProgress?.data.data || []

  return (
    <div className="space-y-8">
      <div className="fade-in">
        <h1 className="text-3xl font-bold connected-accent">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Welcome back! Here's what's happening with your learning platform.
        </p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="stagger-fade">
          <MetricTile
            title="Total Users"
            value={metricsData?.totalUsers || 0}
            change={12}
            data={[65, 59, 80, 81, 56, 55, 40]}
            icon={<Users className="h-4 w-4" />}
          />
        </div>
        <div className="stagger-fade">
          <MetricTile
            title="Total Courses"
            value={metricsData?.totalCourses || 0}
            change={8}
            data={[28, 48, 40, 19, 86, 27, 90]}
            icon={<BookOpen className="h-4 w-4" />}
          />
        </div>
        <div className="stagger-fade">
          <MetricTile
            title="Active Enrollments"
            value={metricsData?.totalEnrollments || 0}
            change={-2}
            data={[45, 52, 38, 24, 33, 26, 21]}
            icon={<GraduationCap className="h-4 w-4" />}
          />
        </div>
        <div className="stagger-fade">
          <MetricTile
            title="Completion Rate"
            value={`${metricsData?.completionRate || 0}%`}
            change={5}
            data={[35, 41, 62, 42, 13, 18, 29]}
            icon={<TrendingUp className="h-4 w-4" />}
          />
        </div>
      </div>

      {/* Recent Progress */}
      <Card className="fade-in">
        <CardHeader>
          <CardTitle className="connected-accent">Recent Video Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Video</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Last Watched</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {progressData.map((progress: any, index: number) => (
                <TableRow key={progress.id} className="stagger-fade hover-lift">
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {progress.user.firstName} {progress.user.lastName}
                      </div>
                      <div className="text-sm text-gray-500">{progress.user.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>{progress.video.course.title}</TableCell>
                  <TableCell>{progress.video.title}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 dark:bg-gray-700 h-2 relative overflow-hidden">
                        <div
                          className="bg-primary h-2 data-flow transition-all duration-1000 ease-out"
                          style={{ width: `${progress.watchedPercent}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">{progress.watchedPercent}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-400">
                    {formatDate(progress.lastWatchedAt)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
