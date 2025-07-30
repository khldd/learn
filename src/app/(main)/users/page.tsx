"use client"

import type React from "react"
import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { usersApi } from "@/lib/api"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Select } from "@/components/ui/Select"
import { Card, CardContent, CardHeader } from "@/components/ui/Card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"
import { Modal } from "@/components/ui/Modal"
import { formatDate } from "@/lib/utils"
import type { Role } from "@/lib/types"
import { Plus, Search, Trash2, Users } from "lucide-react"

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  createdAt: string
  memberships: Array<{
    id: string
    role: Role
    organization: {
      id: string
      name: string
    }
  }>
}

export default function UsersPage() {
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState("")
  const [page, setPage] = useState(1)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
  })

  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ["users", { page, search, role: roleFilter }],
    queryFn: () => usersApi.getAll({ page, limit: 10, search, role: roleFilter }),
  })

  const createMutation = useMutation({
    mutationFn: usersApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
      setIsCreateModalOpen(false)
      setFormData({ email: "", firstName: "", lastName: "", password: "" })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: usersApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createMutation.mutate(formData)
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      deleteMutation.mutate(id)
    }
  }

  const users = data?.data.data || []
  const totalPages = data?.data.totalPages || 1

  const roleOptions = [
    { value: "", label: "All Roles" },
    { value: "ADMIN", label: "Admin" },
    { value: "INSTRUCTOR", label: "Instructor" },
    { value: "LEARNER", label: "Learner" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Users</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Manage users and their roles across organizations.</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="w-48">
              <Select value={roleFilter} onChange={setRoleFilter} options={roleOptions} />
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
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Roles</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user: User) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                          {user.firstName[0]}
                          {user.lastName[0]}
                        </div>
                        <div>
                          <div className="font-medium">
                            {user.firstName} {user.lastName}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-400">{user.email}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {user.memberships.map((membership) => (
                          <span
                            key={membership.id}
                            className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                          >
                            {membership.role}
                          </span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-400">{formatDate(user.createdAt)}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => setSelectedUser(user)}>
                          <Users className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(user.id)}>
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
              Showing {users.length} of {data?.data.total || 0} users
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

      {/* Create User Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false)
          setFormData({ email: "", firstName: "", lastName: "", password: "" })
        }}
        title="Create User"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium mb-2">
                First Name
              </label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium mb-2">
                Last Name
              </label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsCreateModalOpen(false)
                setFormData({ email: "", firstName: "", lastName: "", password: "" })
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

      {/* User Details Modal */}
      <Modal isOpen={!!selectedUser} onClose={() => setSelectedUser(null)} title="User Memberships" size="lg">
        {selectedUser && (
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary text-primary-foreground flex items-center justify-center text-lg font-medium">
                {selectedUser.firstName[0]}
                {selectedUser.lastName[0]}
              </div>
              <div>
                <h3 className="text-lg font-medium">
                  {selectedUser.firstName} {selectedUser.lastName}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{selectedUser.email}</p>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Organization Memberships</h4>
              <div className="space-y-2">
                {selectedUser.memberships.map((membership) => (
                  <div
                    key={membership.id}
                    className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700"
                  >
                    <div>
                      <div className="font-medium">{membership.organization.name}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Role: {membership.role}</div>
                    </div>
                    <Button variant="outline" size="sm">
                      Edit Role
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
