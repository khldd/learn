"use client"

import type React from "react"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { coursesApi } from "@/lib/api"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent, CardHeader } from "@/components/ui/Card"
import { Modal } from "@/components/ui/Modal"
import { Plus, Search, Edit, Trash2, Play } from "lucide-react"
import Link from "next/link"

interface Course {
  id: string
  title: string
  description: string
  thumbnail?: string
  instructor: {
    firstName: string
    lastName: string
  }
  organization: {
    name: string
  }
  videos: any[]
  enrollments: any[]
  createdAt: string
}

export default function CoursesPage() {
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    organizationId: "",
    instructorId: "",
  })

  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ["courses", { page, search }],
    queryFn: () => coursesApi.getAll({ page, limit: 12, search }),
  })

  const createMutation = useMutation({
    mutationFn: coursesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] })
      setIsCreateModalOpen(false)
      setFormData({ title: "", description: "", organizationId: "", instructorId: "" })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: coursesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] })
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createMutation.mutate(formData)
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this course?")) {
      deleteMutation.mutate(id)
    }
  }

  const courses = data?.data.data || []
  const totalPages = data?.data.totalPages || 1

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Courses</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Manage your learning courses and content.</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Course
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search courses..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-100 dark:bg-gray-800 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course: Course) => (
                <Card key={course.id} className="border border-gray-300 dark:border-gray-600">
                  <div className="aspect-video bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    {course.thumbnail ? (
                      <img
                        src={course.thumbnail || "/placeholder.svg"}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Play className="h-12 w-12 text-gray-400" />
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-medium text-lg mb-2">{course.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">{course.description}</p>
                    <div className="text-sm text-gray-500 mb-3">
                      <div>
                        Instructor: {course.instructor.firstName} {course.instructor.lastName}
                      </div>
                      <div>Organization: {course.organization.name}</div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span>{course.videos.length} videos</span>
                      <span>{course.enrollments.length} enrolled</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <Link href={`/courses/${course.id}`}>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </Link>
                      <div className="flex items-center space-x-1">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(course.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Showing {courses.length} of {data?.data.total || 0} courses
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

      {/* Create Course Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false)
          setFormData({ title: "", description: "", organizationId: "", instructorId: "" })
        }}
        title="Create Course"
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-2">
              Title
            </label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              id="description"
              rows={4}
              className="flex w-full border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="organizationId" className="block text-sm font-medium mb-2">
                Organization
              </label>
              <Input
                id="organizationId"
                value={formData.organizationId}
                onChange={(e) => setFormData({ ...formData, organizationId: e.target.value })}
                placeholder="Organization ID"
                required
              />
            </div>
            <div>
              <label htmlFor="instructorId" className="block text-sm font-medium mb-2">
                Instructor
              </label>
              <Input
                id="instructorId"
                value={formData.instructorId}
                onChange={(e) => setFormData({ ...formData, instructorId: e.target.value })}
                placeholder="Instructor ID"
                required
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsCreateModalOpen(false)
                setFormData({ title: "", description: "", organizationId: "", instructorId: "" })
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              Create
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
