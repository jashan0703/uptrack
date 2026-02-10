import type { User, Project, DailyReport, Task, AIReport, HeatmapData } from "@/lib/types"

export const sampleUsers: User[] = [
  {
    id: "u1",
    username: "admin",
    password: "admin123",
    email: "ceo@copan.dev",
    name: "Arjun Mehta",
    role: "root_admin",
    accessLevel: "full",
    jobRole: "Chief Executive Officer",
    department: "Executive",
    dateOfBirth: "1980-05-15",
    payScale: "Executive Band",
    bio: "Founder and CEO of Copan Developers. Over 20 years of experience in software engineering and leadership.",
    profileImage: "/placeholder-user.jpg",
    managerId: null,
    createdAt: "2023-01-01",
    isActive: true,
  },
  {
    id: "u2",
    username: "priya.s",
    password: "priya123",
    email: "priya@copan.dev",
    name: "Priya Sharma",
    role: "admin",
    accessLevel: "manage_team",
    jobRole: "Principal Engineer",
    department: "Engineering",
    dateOfBirth: "1988-09-22",
    payScale: "Band A",
    bio: "Principal Engineer leading the platform team. Expert in distributed systems and cloud architecture.",
    profileImage: "/placeholder-user.jpg",
    managerId: "u1",
    createdAt: "2023-02-15",
    isActive: true,
  },
  {
    id: "u3",
    username: "rahul.k",
    password: "rahul123",
    email: "rahul@copan.dev",
    name: "Rahul Kumar",
    role: "admin",
    accessLevel: "manage_team",
    jobRole: "Engineering Manager",
    department: "Engineering",
    dateOfBirth: "1990-03-10",
    payScale: "Band A",
    bio: "Engineering Manager overseeing the frontend and mobile teams. Passionate about user experience.",
    profileImage: "/placeholder-user.jpg",
    managerId: "u1",
    createdAt: "2023-03-01",
    isActive: true,
  },
  {
    id: "u4",
    username: "sneha.p",
    password: "sneha123",
    email: "sneha@copan.dev",
    name: "Sneha Patel",
    role: "admin",
    accessLevel: "view_only",
    jobRole: "HR Lead",
    department: "Human Resources",
    dateOfBirth: "1992-07-18",
    payScale: "Band B",
    bio: "HR Lead responsible for talent acquisition and employee engagement programs.",
    profileImage: "/placeholder-user.jpg",
    managerId: "u1",
    createdAt: "2023-03-15",
    isActive: true,
  },
  {
    id: "u5",
    username: "vikram.j",
    password: "vikram123",
    email: "vikram@copan.dev",
    name: "Vikram Joshi",
    role: "employee",
    accessLevel: "self_only",
    jobRole: "Senior Frontend Developer",
    department: "Engineering",
    dateOfBirth: "1995-11-25",
    payScale: "Band C",
    bio: "Senior Frontend Developer specializing in React, Next.js and TypeScript. 5 years of experience.",
    profileImage: "/placeholder-user.jpg",
    managerId: "u3",
    createdAt: "2023-04-01",
    isActive: true,
  },
  {
    id: "u6",
    username: "ananya.r",
    password: "ananya123",
    email: "ananya@copan.dev",
    name: "Ananya Rao",
    role: "employee",
    accessLevel: "self_only",
    jobRole: "Backend Developer",
    department: "Engineering",
    dateOfBirth: "1996-02-14",
    payScale: "Band C",
    bio: "Backend Developer working on microservices architecture. Proficient in Node.js and Go.",
    profileImage: "/placeholder-user.jpg",
    managerId: "u2",
    createdAt: "2023-04-15",
    isActive: true,
  },
  {
    id: "u7",
    username: "karthik.m",
    password: "karthik123",
    email: "karthik@copan.dev",
    name: "Karthik Menon",
    role: "employee",
    accessLevel: "self_only",
    jobRole: "DevOps Engineer",
    department: "Engineering",
    dateOfBirth: "1993-08-30",
    payScale: "Band C",
    bio: "DevOps Engineer managing CI/CD pipelines and cloud infrastructure on AWS and GCP.",
    profileImage: "/placeholder-user.jpg",
    managerId: "u2",
    createdAt: "2023-05-01",
    isActive: true,
  },
  {
    id: "u8",
    username: "deepa.n",
    password: "deepa123",
    email: "deepa@copan.dev",
    name: "Deepa Nair",
    role: "employee",
    accessLevel: "self_only",
    jobRole: "QA Engineer",
    department: "Engineering",
    dateOfBirth: "1997-04-05",
    payScale: "Band D",
    bio: "QA Engineer focused on automation testing and quality assurance processes.",
    profileImage: "/placeholder-user.jpg",
    managerId: "u3",
    createdAt: "2023-06-01",
    isActive: true,
  },
  {
    id: "u9",
    username: "amit.s",
    password: "amit123",
    email: "amit@copan.dev",
    name: "Amit Singh",
    role: "employee",
    accessLevel: "self_only",
    jobRole: "Full Stack Developer",
    department: "Engineering",
    dateOfBirth: "1994-12-20",
    payScale: "Band C",
    bio: "Full Stack Developer with expertise in React, Node.js, and PostgreSQL.",
    profileImage: "/placeholder-user.jpg",
    managerId: "u3",
    createdAt: "2023-06-15",
    isActive: true,
  },
  {
    id: "u10",
    username: "meera.g",
    password: "meera123",
    email: "meera@copan.dev",
    name: "Meera Gupta",
    role: "employee",
    accessLevel: "self_only",
    jobRole: "UI/UX Designer",
    department: "Design",
    dateOfBirth: "1996-06-10",
    payScale: "Band C",
    bio: "UI/UX Designer creating intuitive and beautiful user interfaces. Figma and design systems expert.",
    profileImage: "/placeholder-user.jpg",
    managerId: "u3",
    createdAt: "2023-07-01",
    isActive: true,
  },
]

export const sampleProjects: Project[] = [
  {
    id: "p1",
    name: "Copan Dashboard",
    description: "Internal employee productivity dashboard for the organization.",
    status: "active",
    startDate: "2024-01-15",
    endDate: null,
    teamMembers: ["u2", "u5", "u6", "u9", "u10"],
  },
  {
    id: "p2",
    name: "API Gateway",
    description: "Centralized API gateway for all microservices with rate limiting and auth.",
    status: "active",
    startDate: "2024-03-01",
    endDate: null,
    teamMembers: ["u2", "u6", "u7"],
  },
  {
    id: "p3",
    name: "Mobile App v2",
    description: "Complete redesign of the customer-facing mobile application.",
    status: "active",
    startDate: "2024-06-01",
    endDate: null,
    teamMembers: ["u3", "u5", "u8", "u10"],
  },
  {
    id: "p4",
    name: "CI/CD Pipeline Upgrade",
    description: "Migrating CI/CD from Jenkins to GitHub Actions with improved deployment strategies.",
    status: "completed",
    startDate: "2024-02-01",
    endDate: "2024-08-30",
    teamMembers: ["u7", "u9"],
  },
  {
    id: "p5",
    name: "Data Analytics Platform",
    description: "Building an internal analytics platform for business intelligence.",
    status: "on-hold",
    startDate: "2024-09-01",
    endDate: null,
    teamMembers: ["u6", "u9"],
  },
]

function generateTasksForUser(userId: string, startDate: string): Task[] {
  const tasks: Task[] = []
  const tags: Array<"fix" | "chore" | "implementation" | "review" | "meeting" | "documentation" | "testing" | "deployment"> = [
    "fix", "chore", "implementation", "review", "meeting", "documentation", "testing", "deployment",
  ]
  const projectIds = ["p1", "p2", "p3", "p4", "p5"]
  const taskTitles: Record<string, string[]> = {
    fix: ["Fixed login redirect bug", "Resolved memory leak in worker", "Patched CORS issue", "Fixed pagination offset", "Corrected date format in reports"],
    chore: ["Updated dependencies", "Cleaned up unused imports", "Refactored utility functions", "Updated environment configs", "Organized project structure"],
    implementation: ["Built user profile page", "Implemented search filters", "Added export to CSV feature", "Created notification system", "Built real-time chat module"],
    review: ["Reviewed PR #234", "Code review for auth module", "Reviewed database schema changes", "Peer review of API design", "Reviewed frontend test coverage"],
    meeting: ["Sprint planning meeting", "Architecture review session", "Team standup", "One-on-one with manager", "Client demo preparation"],
    documentation: ["Wrote API documentation", "Updated onboarding guide", "Created architecture diagrams", "Documented deployment process", "Updated README files"],
    testing: ["Wrote unit tests for auth", "Integration test for payments", "E2E test for onboarding flow", "Load testing API endpoints", "Regression testing release"],
    deployment: ["Deployed v2.3 to staging", "Production release v2.4", "Rolled back hotfix", "Deployed infrastructure changes", "Released feature flag update"],
  }

  const start = new Date(startDate)
  const today = new Date("2026-02-10")
  let taskId = 1

  const current = new Date(start)
  while (current <= today) {
    if (current.getDay() !== 0 && current.getDay() !== 6) {
      const numTasks = Math.floor(Math.random() * 4) + 1
      for (let i = 0; i < numTasks; i++) {
        const tag = tags[Math.floor(Math.random() * tags.length)]
        const titles = taskTitles[tag]
        const title = titles[Math.floor(Math.random() * titles.length)]
        tasks.push({
          id: `t-${userId}-${taskId}`,
          title,
          description: `${title} - detailed description of the work done.`,
          tag,
          project: projectIds[Math.floor(Math.random() * projectIds.length)],
          completed: Math.random() > 0.1,
          timeTaken: Math.round((Math.random() * 4 + 0.5) * 10) / 10,
          date: current.toISOString().split("T")[0],
          userId,
        })
        taskId++
      }
    }
    current.setDate(current.getDate() + 1)
  }
  return tasks
}

export const sampleTasks: Record<string, Task[]> = {
  u2: generateTasksForUser("u2", "2025-06-01"),
  u3: generateTasksForUser("u3", "2025-06-01"),
  u4: generateTasksForUser("u4", "2025-06-01"),
  u5: generateTasksForUser("u5", "2025-06-01"),
  u6: generateTasksForUser("u6", "2025-06-01"),
  u7: generateTasksForUser("u7", "2025-06-01"),
  u8: generateTasksForUser("u8", "2025-06-01"),
  u9: generateTasksForUser("u9", "2025-06-01"),
  u10: generateTasksForUser("u10", "2025-06-01"),
}

export function generateHeatmapData(userId: string): HeatmapData[] {
  const tasks = sampleTasks[userId] || []
  const countMap: Record<string, number> = {}
  for (const task of tasks) {
    countMap[task.date] = (countMap[task.date] || 0) + 1
  }
  return Object.entries(countMap).map(([date, count]) => ({ date, count }))
}

export function generateDailyReports(userId: string): DailyReport[] {
  const tasks = sampleTasks[userId] || []
  const grouped: Record<string, Task[]> = {}
  for (const task of tasks) {
    if (!grouped[task.date]) grouped[task.date] = []
    grouped[task.date].push(task)
  }
  const today = "2026-02-10"
  return Object.entries(grouped)
    .map(([date, dateTasks]) => ({
      id: `dr-${userId}-${date}`,
      userId,
      date,
      tasks: dateTasks,
      submittedAt: `${date}T17:00:00Z`,
      isEditable: date === today,
    }))
    .sort((a, b) => b.date.localeCompare(a.date))
}

export const sampleAIReports: AIReport[] = [
  {
    id: "ai1",
    userId: "u5",
    weekStartDate: "2026-02-03",
    weekEndDate: "2026-02-07",
    summary: "Vikram demonstrated consistent productivity this week, completing 14 tasks across the Copan Dashboard and Mobile App v2 projects. The work quality was notably high in frontend implementations, with clean component architecture and proper test coverage.",
    qualityScore: 87,
    areasOfImprovement: ["Could improve code documentation", "Consider adding more edge case tests", "Review performance optimization techniques"],
    strengths: ["Strong component architecture", "Consistent daily output", "Good collaboration in code reviews"],
    recommendations: ["Explore advanced React patterns like compound components", "Take on more cross-team initiatives", "Mentor junior developers on frontend best practices"],
    generatedAt: "2026-02-08T09:00:00Z",
  },
  {
    id: "ai2",
    userId: "u6",
    weekStartDate: "2026-02-03",
    weekEndDate: "2026-02-07",
    summary: "Ananya had a productive week focused on the API Gateway project. She successfully implemented rate limiting middleware and contributed to the Data Analytics Platform. Her backend implementations show strong understanding of system design.",
    qualityScore: 91,
    areasOfImprovement: ["Improve API response time for analytics endpoints", "Add more comprehensive error handling", "Write migration scripts for schema changes"],
    strengths: ["Excellent system design skills", "Thorough testing approach", "Strong database optimization"],
    recommendations: ["Lead the microservices architecture discussion", "Consider publishing a tech blog on rate limiting patterns", "Explore event-driven architecture for real-time features"],
    generatedAt: "2026-02-08T09:00:00Z",
  },
  {
    id: "ai3",
    userId: "u7",
    weekStartDate: "2026-02-03",
    weekEndDate: "2026-02-07",
    summary: "Karthik focused on infrastructure improvements this week, successfully completing the CI/CD pipeline optimization. Deployment times were reduced by 40%. He also contributed to the API Gateway project with containerization work.",
    qualityScore: 93,
    areasOfImprovement: ["Document infrastructure runbooks more thoroughly", "Set up better monitoring alerts", "Create disaster recovery procedures"],
    strengths: ["Deep infrastructure expertise", "Measurable performance improvements", "Strong automation skills"],
    recommendations: ["Implement infrastructure as code best practices", "Set up cost optimization dashboards", "Lead a DevOps workshop for the engineering team"],
    generatedAt: "2026-02-08T09:00:00Z",
  },
  {
    id: "ai4",
    userId: "u2",
    weekStartDate: "2026-02-03",
    weekEndDate: "2026-02-07",
    summary: "Priya balanced leadership and hands-on development effectively. She reviewed multiple critical PRs, guided architecture decisions for the API Gateway, and contributed directly to the Copan Dashboard backend integration.",
    qualityScore: 95,
    areasOfImprovement: ["Delegate more implementation tasks to team members", "Schedule dedicated focus time for deep work", "Document architectural decisions more formally"],
    strengths: ["Exceptional technical leadership", "High-quality code reviews", "Strong mentoring capabilities"],
    recommendations: ["Formalize the architecture decision record process", "Consider leading cross-functional initiatives", "Build a technical skills matrix for the team"],
    generatedAt: "2026-02-08T09:00:00Z",
  },
]
