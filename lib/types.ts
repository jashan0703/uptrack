export type Role = "root_admin" | "admin" | "employee"

export type AccessLevel = "full" | "manage_team" | "view_only" | "self_only"

export interface User {
  id: string
  username: string
  email: string
  name: string
  role: Role
  accessLevel: AccessLevel
  jobRole: string
  department: string
  dateOfBirth: string
  payScale: string
  bio: string
  profileImage: string
  managerId: string | null
  createdAt: string
  isActive: boolean
}

export type TaskTag = "fix" | "chore" | "implementation" | "review" | "meeting" | "documentation" | "testing" | "deployment"

export interface Task {
  id: string
  title: string
  description: string
  tag: TaskTag
  project: string
  completed: boolean
  timeTaken: number // in hours
  date: string
  userId: string
}

export interface DailyReport {
  id: string
  userId: string
  date: string
  tasks: Task[]
  submittedAt: string
  isEditable: boolean
}

export interface Project {
  id: string
  name: string
  description: string
  status: "active" | "completed" | "on-hold"
  startDate: string
  endDate: string | null
  teamMembers: string[]
}

export interface AIReport {
  id: string
  userId: string
  weekStartDate: string
  weekEndDate: string
  summary: string
  qualityScore: number
  areasOfImprovement: string[]
  strengths: string[]
  recommendations: string[]
  generatedAt: string
}

export interface HeatmapData {
  date: string
  count: number
}

export interface ChartDataPoint {
  label: string
  value: number
  category?: string
}

export interface Notification {
  id: string
  userId: string
  message: string
  type: "info" | "warning" | "success" | "error"
  read: boolean
  createdAt: string
}
