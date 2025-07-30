"use client"

import { useQuery } from "@tanstack/react-query"
import { progressApi, enrollmentsApi } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { formatDuration } from "@/lib/utils"
import { Play, CheckCircle, Clock } from "lucide-react"

interface VideoProgress {
  id: string
  watchedPercent: number
  lastWatchedAt: string
  video: {
    id: string
    title: string
    duration: number
    order: number
  }
}

export default function ProgressPage({ params }: { params: { id: string } }) {
  const { data: enrollment, isLoading: enrollmentLoading } = useQuery({
    queryKey: ["enrollment", params.id],
    queryFn: () => enrollmentsApi.getById(params.id),
  })

  const { data: progress, isLoading: progressLoading } = useQuery({
    queryKey: ["progress", params.id],
    queryFn: () => progressApi.getByEnrollment(params.id),
  })

  if (enrollmentLoading || progressLoading) {
    return (
      <div className="space-y-6">
        <div className="h-32 bg-gray-100 dark:bg-gray-800 animate-pulse" />
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-100 dark:bg-gray-800 animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  const enrollmentData = enrollment?.data.data
  const progressData = progress?.data.data || []

  const completedVideos = progressData.filter((p: VideoProgress) => p.watchedPercent >= 90).length
  const totalVideos = progressData.length
  const overallProgress = totalVideos > 0 ? (completedVideos / totalVideos) * 100 : 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Learning Progress</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Track video completion and learning progress</p>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Course Progress Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{Math.round(overallProgress)}%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Overall Progress</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{completedVideos}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Videos Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{totalVideos}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Videos</div>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Course Progress</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {completedVideos} of {totalVideos} completed
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 h-3">
              <div className="bg-primary h-3 transition-all duration-300" style={{ width: `${overallProgress}%` }} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Video Progress Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Video Progress Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {progressData
              .sort((a: VideoProgress, b: VideoProgress) => a.video.order - b.video.order)
              .map((videoProgress: VideoProgress) => {
                const isCompleted = videoProgress.watchedPercent >= 90
                const isInProgress = videoProgress.watchedPercent > 0 && videoProgress.watchedPercent < 90

                return (
                  <div
                    key={videoProgress.id}
                    className="flex items-center space-x-4 p-4 border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex-shrink-0">
                      {isCompleted ? (
                        <CheckCircle className="h-6 w-6 text-green-500" />
                      ) : isInProgress ? (
                        <Clock className="h-6 w-6 text-yellow-500" />
                      ) : (
                        <Play className="h-6 w-6 text-gray-400" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium truncate">{videoProgress.video.title}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                          <span>{formatDuration(videoProgress.video.duration)}</span>
                          <span>{videoProgress.watchedPercent}% watched</span>
                        </div>
                      </div>

                      <div className="mt-2">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 h-2">
                          <div
                            className={`h-2 transition-all duration-300 ${
                              isCompleted ? "bg-green-500" : isInProgress ? "bg-yellow-500" : "bg-gray-300"
                            }`}
                            style={{ width: `${videoProgress.watchedPercent}%` }}
                          />
                        </div>
                      </div>

                      {videoProgress.lastWatchedAt && (
                        <div className="mt-1 text-xs text-gray-500">
                          Last watched: {new Date(videoProgress.lastWatchedAt).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
