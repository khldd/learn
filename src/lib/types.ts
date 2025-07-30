export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  avatar?: string
  createdAt: string
  updatedAt: string
}

export interface Organization {
  id: string
  name: string
  description?: string
  createdAt: string
  updatedAt: string
}

export enum Role {
  ADMIN = "ADMIN",
  INSTRUCTOR = "INSTRUCTOR",
  LEARNER = "LEARNER",
}

export interface Membership {
  id: string
  userId: string
  organizationId: string
  role: Role
  user: User
  organization: Organization
  createdAt: string
}

export interface Course {
  id: string
  title: string
  description: string
  thumbnail?: string
  organizationId: string
  instructorId: string
  organization: Organization
  instructor: User
  videos: Video[]
  enrollments: Enrollment[]
  createdAt: string
  updatedAt: string
}

export interface Video {
  id: string
  title: string
  description?: string
  url: string
  duration: number
  order: number
  courseId: string
  course: Course
  createdAt: string
  updatedAt: string
}

export enum EnrollmentStatus {
  ACTIVE = "ACTIVE",
  COMPLETED = "COMPLETED",
  DROPPED = "DROPPED",
}

export interface Enrollment {
  id: string
  userId: string
  courseId: string
  status: EnrollmentStatus
  enrolledAt: string
  completedAt?: string
  user: User
  course: Course
  progress: VideoProgress[]
}

export interface VideoProgress {
  id: string
  userId: string
  videoId: string
  enrollmentId: string
  watchedPercent: number
  lastWatchedAt: string
  user: User
  video: Video
  enrollment: Enrollment
}

export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}
