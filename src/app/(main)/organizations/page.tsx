"use client"

import type React from "react"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { organizationsApi } from "@/lib/api"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent, CardHeader } from "@/components/ui/Card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"
import { Modal } from "@/components/ui/Modal"
import { formatDate } from "@/lib/utils"
import { Plus, Search, Edit, Trash2 } from "lucide-react"

interface Organization {
  id: string
  name: string
  description: string
  createdAt: string
  updatedAt: string
}

export default function OrganizationsPage() {
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingOrg, setEditingOrg] = useState<Organization | null>(null)
  const [formData, setFormData] = useState({ name: "", description: "" })

  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ["organizations", { page, search }],
    queryFn: () => organizationsApi.getAll({ page, limit: 10, search }),
  })

  const createMutation = useMutation({
    mutationFn: organizationsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] })
      setIsCreateModalOpen(false)
      setFormData({ name: "", description: "" })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => organizationsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] })
      setEditingOrg(null)
      setFormData({ name: "", description: "" })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: organizationsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] })
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingOrg) {
      updateMutation.mutate({ id: editingOrg.id, data: formData })
    } else {
      createMutation.mutate(formData)
    }
  }

  const handleEdit = (org: Organization) => {
    setEditingOrg(org)
    setFormData({ name: org.name, description: org.description })
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this organization?")) {
      deleteMutation.mutate(id)
    }
  }

  const organizations = data?.data.data || []
  const totalPages = data?.data.totalPages || 1

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Organizations</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Manage your organizations and their settings.</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Organization
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search organizations..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
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
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {organizations.map((org: Organization) => (
                  <TableRow key={org.id}>
                    <TableCell className="font-medium">{org.name}</TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-400">
                      {org.description || "No description"}
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-400">{formatDate(org.createdAt)}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(org)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(org.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Showing {organizations.length} of {data?.data.total || 0} organizations
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

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isCreateModalOpen || !!editingOrg}
        onClose={() => {
          setIsCreateModalOpen(false)
          setEditingOrg(null)
          setFormData({ name: "", description: "" })
        }}
        title={editingOrg ? "Edit Organization" : "Create Organization"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Name
            </label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-2">
              Description
            </label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsCreateModalOpen(false)
                setEditingOrg(null)
                setFormData({ name: "", description: "" })
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
              {editingOrg ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
