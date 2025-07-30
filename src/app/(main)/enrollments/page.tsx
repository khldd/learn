"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { enrollmentsApi } from "@/lib/api"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Select } from "@/components/ui/Select"
import { Card, CardContent, CardHeader } from "@/components/ui/Card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"
import { StatusChip } from "@/components/ui/StatusChip"
import { formatDate } from "@/lib/utils"
import { Search, Eye } from "lucide-react"
import Link from "next/link"

interface Enrollment {
  id: string
  status: string
  enrolledAt: string
  completedAt?: string
  user: {
    firstName: string
    lastName: string
    email: string
  }
  course: {
    title: string
    instructor: {
      firstName: string
      lastName: string
    }
  }
}

export default function EnrollmentsPage() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [page, setPage] = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: ["enrollments", { page, search, status: statusFilter }],
    queryFn: () => enrollmentsApi.getAll({ page, limit: 10, search, status: statusFilter }),
  })

  const enrollments = data?.data.data || []
  const totalPages = data?.data.totalPages || 1

  const statusOptions = [
    { value: "", label: "All Status" },
    { value: "ACTIVE", label: "Active" },
    { value: "COMPLETED", label: "Completed" },
    { value: "DROPPED", label: "Dropped" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Enrollments</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Track student enrollments and progress across all courses.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search enrollments..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onChange={setStatusFilter} options={statusOptions} className="w-48" />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-100 dark:bg-gray-800 animate-pulse" />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Instructor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Enrolled</TableHead>
                  <TableHead>Completed</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {enrollments.map((enrollment: Enrollment) => (
                  <TableRow key={enrollment.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {enrollment.user.firstName} {enrollment.user.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{enrollment.user.email}</div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{enrollment.course.title}</TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-400">
                      {enrollment.course.instructor.firstName} {enrollment.course.instructor.lastName}
                    </TableCell>
                    <TableCell>
                      <StatusChip status={enrollment.status} />
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-400">
                      {formatDate(enrollment.enrolledAt)}
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-400">
                      {enrollment.completedAt ? formatDate(enrollment.completedAt) : "-"}
                    </TableCell>
                    <TableCell>
                      <Link href={`/progress/${enrollment.id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Showing {enrollments.length} of {data?.data.total || 0} enrollments
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => setPage(page - 1)} disabled={page === 1}>
                Previous
              </Button>
              <span className="text-sm">
                Page {page} of {totalPages}
              </span>
              <Button variant="outline" size="sm" onClick={() => setPage(page + 1)} disabled={page === totalPages}>
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
