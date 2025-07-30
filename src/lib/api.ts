// Mock API responses for demo purposes
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Mock data
const mockMetrics = {
  totalUsers: 1247,
  totalCourses: 89,
  totalEnrollments: 3456,
  completionRate: 78,
}

const mockRecentProgress = [
  {
    id: "1",
    user: { firstName: "Alice", lastName: "Johnson", email: "alice@example.com" },
    video: {
      title: "Introduction to React",
      course: { title: "React Fundamentals" },
    },
    watchedPercent: 85,
    lastWatchedAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    user: { firstName: "Bob", lastName: "Smith", email: "bob@example.com" },
    video: {
      title: "State Management",
      course: { title: "Advanced React" },
    },
    watchedPercent: 92,
    lastWatchedAt: "2024-01-15T09:15:00Z",
  },
  {
    id: "3",
    user: { firstName: "Carol", lastName: "Davis", email: "carol@example.com" },
    video: {
      title: "API Integration",
      course: { title: "Full Stack Development" },
    },
    watchedPercent: 67,
    lastWatchedAt: "2024-01-15T08:45:00Z",
  },
]

const mockOrganizations = [
  {
    id: "1",
    name: "Tech Corp",
    description: "Leading technology company",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    name: "EduTech Solutions",
    description: "Educational technology provider",
    createdAt: "2024-01-02T00:00:00Z",
    updatedAt: "2024-01-02T00:00:00Z",
  },
]

const mockUsers = [
  {
    id: "1",
    email: "alice.johnson@example.com",
    firstName: "Alice",
    lastName: "Johnson",
    createdAt: "2024-01-01T00:00:00Z",
    memberships: [
      {
        id: "1",
        role: "ADMIN",
        organization: { id: "1", name: "Tech Corp" },
      },
    ],
  },
  {
    id: "2",
    email: "bob.smith@example.com",
    firstName: "Bob",
    lastName: "Smith",
    createdAt: "2024-01-02T00:00:00Z",
    memberships: [
      {
        id: "2",
        role: "INSTRUCTOR",
        organization: { id: "1", name: "Tech Corp" },
      },
    ],
  },
  {
    id: "3",
    email: "carol.davis@example.com",
    firstName: "Carol",
    lastName: "Davis",
    createdAt: "2024-01-03T00:00:00Z",
    memberships: [
      {
        id: "3",
        role: "LEARNER",
        organization: { id: "2", name: "EduTech Solutions" },
      },
    ],
  },
]

const mockCourses = [
  {
    id: "1",
    title: "React Fundamentals",
    description: "Learn the basics of React development",
    instructor: { firstName: "Bob", lastName: "Smith" },
    organization: { name: "Tech Corp" },
    videos: [{ id: "1" }, { id: "2" }],
    enrollments: [{ id: "1" }, { id: "2" }, { id: "3" }],
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    title: "Advanced React",
    description: "Master advanced React concepts and patterns",
    instructor: { firstName: "Alice", lastName: "Johnson" },
    organization: { name: "Tech Corp" },
    videos: [{ id: "3" }, { id: "4" }, { id: "5" }],
    enrollments: [{ id: "4" }, { id: "5" }],
    createdAt: "2024-01-02T00:00:00Z",
  },
]

const mockEnrollments = [
  {
    id: "1",
    status: "ACTIVE",
    enrolledAt: "2024-01-10T00:00:00Z",
    user: { firstName: "Alice", lastName: "Johnson", email: "alice@example.com" },
    course: {
      title: "React Fundamentals",
      instructor: { firstName: "Bob", lastName: "Smith" },
    },
  },
  {
    id: "2",
    status: "COMPLETED",
    enrolledAt: "2024-01-05T00:00:00Z",
    completedAt: "2024-01-14T00:00:00Z",
    user: { firstName: "Bob", lastName: "Smith", email: "bob@example.com" },
    course: {
      title: "Advanced React",
      instructor: { firstName: "Alice", lastName: "Johnson" },
    },
  },
]

// Dashboard API
export const dashboardApi = {
  getMetrics: async () => {
    await delay(500)
    return {
      data: {
        success: true,
        data: mockMetrics,
      },
    }
  },

  getRecentProgress: async (limit?: number) => {
    await delay(300)
    return {
      data: {
        success: true,
        data: mockRecentProgress.slice(0, limit || 10),
      },
    }
  },
}

// Organizations API
export const organizationsApi = {
  getAll: async (params?: { page?: number; limit?: number; search?: string }) => {
    await delay(400)
    return {
      data: {
        data: mockOrganizations,
        total: mockOrganizations.length,
        page: params?.page || 1,
        limit: params?.limit || 10,
        totalPages: 1,
      },
    }
  },

  create: async (data: any) => {
    await delay(600)
    const newOrg = {
      id: Date.now().toString(),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    mockOrganizations.push(newOrg)
    return { data: { success: true, data: newOrg } }
  },

  update: async (id: string, data: any) => {
    await delay(500)
    const index = mockOrganizations.findIndex((org) => org.id === id)
    if (index !== -1) {
      mockOrganizations[index] = { ...mockOrganizations[index], ...data, updatedAt: new Date().toISOString() }
    }
    return { data: { success: true, data: mockOrganizations[index] } }
  },

  delete: async (id: string) => {
    await delay(400)
    const index = mockOrganizations.findIndex((org) => org.id === id)
    if (index !== -1) {
      mockOrganizations.splice(index, 1)
    }
    return { data: { success: true } }
  },
}

// Users API
export const usersApi = {
  getAll: async (params?: { page?: number; limit?: number; search?: string; role?: string }) => {
    await delay(400)
    let filteredUsers = [...mockUsers]

    if (params?.search) {
      const search = params.search.toLowerCase()
      filteredUsers = filteredUsers.filter(
        (user) =>
          user.firstName.toLowerCase().includes(search) ||
          user.lastName.toLowerCase().includes(search) ||
          user.email.toLowerCase().includes(search),
      )
    }

    if (params?.role) {
      filteredUsers = filteredUsers.filter((user) =>
        user.memberships.some((membership) => membership.role === params.role),
      )
    }

    return {
      data: {
        data: filteredUsers,
        total: filteredUsers.length,
        page: params?.page || 1,
        limit: params?.limit || 10,
        totalPages: Math.ceil(filteredUsers.length / (params?.limit || 10)),
      },
    }
  },

  create: async (data: any) => {
    await delay(600)
    const newUser = {
      id: Date.now().toString(),
      ...data,
      createdAt: new Date().toISOString(),
      memberships: [],
    }
    mockUsers.push(newUser)
    return { data: { success: true, data: newUser } }
  },

  delete: async (id: string) => {
    await delay(400)
    const index = mockUsers.findIndex((user) => user.id === id)
    if (index !== -1) {
      mockUsers.splice(index, 1)
    }
    return { data: { success: true } }
  },
}

// Courses API
export const coursesApi = {
  getAll: async (params?: { page?: number; limit?: number; search?: string }) => {
    await delay(400)
    let filteredCourses = [...mockCourses]

    if (params?.search) {
      const search = params.search.toLowerCase()
      filteredCourses = filteredCourses.filter(
        (course) => course.title.toLowerCase().includes(search) || course.description.toLowerCase().includes(search),
      )
    }

    return {
      data: {
        data: filteredCourses,
        total: filteredCourses.length,
        page: params?.page || 1,
        limit: params?.limit || 12,
        totalPages: Math.ceil(filteredCourses.length / (params?.limit || 12)),
      },
    }
  },

  create: async (data: any) => {
    await delay(600)
    const newCourse = {
      id: Date.now().toString(),
      ...data,
      videos: [],
      enrollments: [],
      createdAt: new Date().toISOString(),
    }
    mockCourses.push(newCourse)
    return { data: { success: true, data: newCourse } }
  },

  delete: async (id: string) => {
    await delay(400)
    const index = mockCourses.findIndex((course) => course.id === id)
    if (index !== -1) {
      mockCourses.splice(index, 1)
    }
    return { data: { success: true } }
  },
}

// Enrollments API
export const enrollmentsApi = {
  getAll: async (params?: { page?: number; limit?: number; search?: string; status?: string }) => {
    await delay(400)
    let filteredEnrollments = [...mockEnrollments]

    if (params?.search) {
      const search = params.search.toLowerCase()
      filteredEnrollments = filteredEnrollments.filter(
        (enrollment) =>
          enrollment.user.firstName.toLowerCase().includes(search) ||
          enrollment.user.lastName.toLowerCase().includes(search) ||
          enrollment.course.title.toLowerCase().includes(search),
      )
    }

    if (params?.status) {
      filteredEnrollments = filteredEnrollments.filter((enrollment) => enrollment.status === params.status)
    }

    return {
      data: {
        data: filteredEnrollments,
        total: filteredEnrollments.length,
        page: params?.page || 1,
        limit: params?.limit || 10,
        totalPages: Math.ceil(filteredEnrollments.length / (params?.limit || 10)),
      },
    }
  },

  getById: async (id: string) => {
    await delay(300)
    const enrollment = mockEnrollments.find((e) => e.id === id)
    return { data: { success: true, data: enrollment } }
  },
}

// Progress API
export const progressApi = {
  getByEnrollment: async (enrollmentId: string) => {
    await delay(400)
    // Mock progress data for the enrollment
    const mockProgress = [
      {
        id: "1",
        watchedPercent: 100,
        lastWatchedAt: "2024-01-14T10:30:00Z",
        video: { id: "1", title: "Introduction to Components", duration: 1200, order: 1 },
      },
      {
        id: "2",
        watchedPercent: 75,
        lastWatchedAt: "2024-01-14T11:15:00Z",
        video: { id: "2", title: "Props and State", duration: 1800, order: 2 },
      },
      {
        id: "3",
        watchedPercent: 30,
        lastWatchedAt: "2024-01-14T12:00:00Z",
        video: { id: "3", title: "Event Handling", duration: 1500, order: 3 },
      },
    ]
    return { data: { success: true, data: mockProgress } }
  },
}
