/**
 * Seeds demo data into Appwrite: auth users + profiles, projects, generated
 * tasks/daily reports, and weekly AI reports.
 *
 * Run AFTER scripts/setup-appwrite.mjs:  npm run appwrite:seed
 *
 * Idempotent per-user: if an auth account already exists we skip regenerating
 * that user's tasks to avoid duplicates. All demo accounts share the password
 * from SEED_DEFAULT_PASSWORD; they log in with their email.
 */
import { config } from "dotenv"
import { Client, Users, Databases, Permission, Role, ID } from "node-appwrite"

config({ path: ".env.local" })

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID
const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "uptrack"
const apiKey = process.env.APPWRITE_API_KEY
const password = process.env.SEED_DEFAULT_PASSWORD || "ChangeMe123!"
const SEED_START = process.env.SEED_START || "2025-12-01"
const TODAY = "2026-02-10"

if (!endpoint || !projectId || !apiKey) {
  console.error("Missing Appwrite config in .env.local")
  process.exit(1)
}

const client = new Client().setEndpoint(endpoint).setProject(projectId).setKey(apiKey)
const users = new Users(client)
const db = new Databases(client)

const profilePerms = (id) => [
  Permission.read(Role.users()),
  Permission.update(Role.user(id)),
  Permission.delete(Role.user(id)),
]
const ownerPerms = (id) => [
  Permission.read(Role.users()),
  Permission.update(Role.user(id)),
  Permission.delete(Role.user(id)),
]

const ignore409 = async (fn) => {
  try {
    return await fn()
  } catch (err) {
    if (err?.code === 409) return null
    throw err
  }
}

async function runBatched(items, size, fn) {
  for (let i = 0; i < items.length; i += size) {
    await Promise.all(items.slice(i, i + size).map(fn))
  }
}

// ---------------------------------------------------------------------------
// Seed data
// ---------------------------------------------------------------------------

const seedUsers = [
  { id: "u1", username: "admin", email: "ceo@workpulse.dev", name: "Arjun Mehta", role: "root_admin", accessLevel: "full", jobRole: "Chief Executive Officer", department: "Executive", dateOfBirth: "1980-05-15", payScale: "Executive Band", bio: "Founder and CEO of WorkPulse.", managerId: null, createdAt: "2023-01-01" },
  { id: "u2", username: "priya.s", email: "priya@workpulse.dev", name: "Priya Sharma", role: "admin", accessLevel: "manage_team", jobRole: "Principal Engineer", department: "Engineering", dateOfBirth: "1988-09-22", payScale: "Band A", bio: "Principal Engineer leading the platform team.", managerId: "u1", createdAt: "2023-02-15" },
  { id: "u3", username: "rahul.k", email: "rahul@workpulse.dev", name: "Rahul Kumar", role: "admin", accessLevel: "manage_team", jobRole: "Engineering Manager", department: "Engineering", dateOfBirth: "1990-03-10", payScale: "Band A", bio: "Engineering Manager overseeing frontend and mobile teams.", managerId: "u1", createdAt: "2023-03-01" },
  { id: "u4", username: "sneha.p", email: "sneha@workpulse.dev", name: "Sneha Patel", role: "admin", accessLevel: "view_only", jobRole: "HR Lead", department: "Human Resources", dateOfBirth: "1992-07-18", payScale: "Band B", bio: "HR Lead responsible for talent acquisition.", managerId: "u1", createdAt: "2023-03-15" },
  { id: "u5", username: "vikram.j", email: "vikram@workpulse.dev", name: "Vikram Joshi", role: "employee", accessLevel: "self_only", jobRole: "Senior Frontend Developer", department: "Engineering", dateOfBirth: "1995-11-25", payScale: "Band C", bio: "Senior Frontend Developer specializing in React and Next.js.", managerId: "u3", createdAt: "2023-04-01" },
  { id: "u6", username: "ananya.r", email: "ananya@workpulse.dev", name: "Ananya Rao", role: "employee", accessLevel: "self_only", jobRole: "Backend Developer", department: "Engineering", dateOfBirth: "1996-02-14", payScale: "Band C", bio: "Backend Developer working on microservices.", managerId: "u2", createdAt: "2023-04-15" },
  { id: "u7", username: "karthik.m", email: "karthik@workpulse.dev", name: "Karthik Menon", role: "employee", accessLevel: "self_only", jobRole: "DevOps Engineer", department: "Engineering", dateOfBirth: "1993-08-30", payScale: "Band C", bio: "DevOps Engineer managing CI/CD pipelines.", managerId: "u2", createdAt: "2023-05-01" },
  { id: "u8", username: "deepa.n", email: "deepa@workpulse.dev", name: "Deepa Nair", role: "employee", accessLevel: "self_only", jobRole: "QA Engineer", department: "Engineering", dateOfBirth: "1997-04-05", payScale: "Band D", bio: "QA Engineer focused on automation testing.", managerId: "u3", createdAt: "2023-06-01" },
  { id: "u9", username: "amit.s", email: "amit@workpulse.dev", name: "Amit Singh", role: "employee", accessLevel: "self_only", jobRole: "Full Stack Developer", department: "Engineering", dateOfBirth: "1994-12-20", payScale: "Band C", bio: "Full Stack Developer with React and Node.js expertise.", managerId: "u3", createdAt: "2023-06-15" },
  { id: "u10", username: "meera.g", email: "meera@workpulse.dev", name: "Meera Gupta", role: "employee", accessLevel: "self_only", jobRole: "UI/UX Designer", department: "Design", dateOfBirth: "1996-06-10", payScale: "Band C", bio: "UI/UX Designer creating intuitive interfaces.", managerId: "u3", createdAt: "2023-07-01" },
]

const seedProjects = [
  { id: "p1", name: "WorkPulse Dashboard", description: "Internal employee productivity dashboard.", status: "active", startDate: "2024-01-15", endDate: null, teamMembers: ["u2", "u5", "u6", "u9", "u10"] },
  { id: "p2", name: "API Gateway", description: "Centralized API gateway with rate limiting and auth.", status: "active", startDate: "2024-03-01", endDate: null, teamMembers: ["u2", "u6", "u7"] },
  { id: "p3", name: "Mobile App v2", description: "Redesign of the customer-facing mobile application.", status: "active", startDate: "2024-06-01", endDate: null, teamMembers: ["u3", "u5", "u8", "u10"] },
  { id: "p4", name: "CI/CD Pipeline Upgrade", description: "Migrating CI/CD from Jenkins to GitHub Actions.", status: "completed", startDate: "2024-02-01", endDate: "2024-08-30", teamMembers: ["u7", "u9"] },
  { id: "p5", name: "Data Analytics Platform", description: "Internal analytics platform for business intelligence.", status: "on-hold", startDate: "2024-09-01", endDate: null, teamMembers: ["u6", "u9"] },
]

const seedAIReports = [
  { userId: "u5", weekStartDate: "2026-02-03", weekEndDate: "2026-02-07", summary: "Vikram demonstrated consistent productivity this week, completing 14 tasks across the WorkPulse Dashboard and Mobile App v2 projects with high-quality frontend work.", qualityScore: 87, areasOfImprovement: ["Could improve code documentation", "Consider adding more edge case tests", "Review performance optimization techniques"], strengths: ["Strong component architecture", "Consistent daily output", "Good collaboration in code reviews"], recommendations: ["Explore advanced React patterns", "Take on more cross-team initiatives", "Mentor junior developers"], generatedAt: "2026-02-08T09:00:00Z" },
  { userId: "u6", weekStartDate: "2026-02-03", weekEndDate: "2026-02-07", summary: "Ananya had a productive week focused on the API Gateway project, implementing rate limiting middleware and contributing to the Data Analytics Platform.", qualityScore: 91, areasOfImprovement: ["Improve API response time", "Add more error handling", "Write migration scripts"], strengths: ["Excellent system design skills", "Thorough testing approach", "Strong database optimization"], recommendations: ["Lead the microservices discussion", "Publish a tech blog on rate limiting", "Explore event-driven architecture"], generatedAt: "2026-02-08T09:00:00Z" },
  { userId: "u7", weekStartDate: "2026-02-03", weekEndDate: "2026-02-07", summary: "Karthik focused on infrastructure improvements, completing the CI/CD pipeline optimization and reducing deployment times by 40%.", qualityScore: 93, areasOfImprovement: ["Document infrastructure runbooks", "Set up better monitoring alerts", "Create disaster recovery procedures"], strengths: ["Deep infrastructure expertise", "Measurable performance improvements", "Strong automation skills"], recommendations: ["Implement IaC best practices", "Set up cost optimization dashboards", "Lead a DevOps workshop"], generatedAt: "2026-02-08T09:00:00Z" },
  { userId: "u2", weekStartDate: "2026-02-03", weekEndDate: "2026-02-07", summary: "Priya balanced leadership and hands-on development, reviewing critical PRs and guiding architecture decisions for the API Gateway.", qualityScore: 95, areasOfImprovement: ["Delegate more implementation tasks", "Schedule dedicated focus time", "Document architectural decisions"], strengths: ["Exceptional technical leadership", "High-quality code reviews", "Strong mentoring"], recommendations: ["Formalize the ADR process", "Lead cross-functional initiatives", "Build a technical skills matrix"], generatedAt: "2026-02-08T09:00:00Z" },
]

const tags = ["fix", "chore", "implementation", "review", "meeting", "documentation", "testing", "deployment"]
const projectIds = ["p1", "p2", "p3", "p4", "p5"]
const taskTitles = {
  fix: ["Fixed login redirect bug", "Resolved memory leak in worker", "Patched CORS issue", "Fixed pagination offset"],
  chore: ["Updated dependencies", "Cleaned up unused imports", "Refactored utility functions", "Updated environment configs"],
  implementation: ["Built user profile page", "Implemented search filters", "Added export to CSV feature", "Created notification system"],
  review: ["Reviewed PR #234", "Code review for auth module", "Reviewed database schema changes", "Peer review of API design"],
  meeting: ["Sprint planning meeting", "Architecture review session", "Team standup", "One-on-one with manager"],
  documentation: ["Wrote API documentation", "Updated onboarding guide", "Created architecture diagrams", "Documented deployment process"],
  testing: ["Wrote unit tests for auth", "Integration test for payments", "E2E test for onboarding flow", "Load testing API endpoints"],
  deployment: ["Deployed v2.3 to staging", "Production release v2.4", "Rolled back hotfix", "Deployed infrastructure changes"],
}
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]

/** Generate { tasksByDate } for a user between SEED_START and TODAY (weekdays). */
function generateTasksForUser(userId) {
  const tasksByDate = {}
  const current = new Date(SEED_START)
  const end = new Date(TODAY)
  while (current <= end) {
    const day = current.getDay()
    if (day !== 0 && day !== 6) {
      const dateStr = current.toISOString().split("T")[0]
      const numTasks = Math.floor(Math.random() * 4) + 1
      const dayTasks = []
      for (let i = 0; i < numTasks; i++) {
        const tag = pick(tags)
        dayTasks.push({
          userId,
          title: pick(taskTitles[tag]),
          description: "",
          tag,
          project: pick(projectIds),
          completed: Math.random() > 0.1,
          timeTaken: Math.round((Math.random() * 4 + 0.5) * 10) / 10,
          date: dateStr,
        })
      }
      tasksByDate[dateStr] = dayTasks
    }
    current.setDate(current.getDate() + 1)
  }
  return tasksByDate
}

// ---------------------------------------------------------------------------
// Seeding
// ---------------------------------------------------------------------------

async function main() {
  console.log(`Seeding into "${databaseId}" (tasks ${SEED_START} -> ${TODAY})`)

  // Projects
  console.log("Projects...")
  await runBatched(seedProjects, 5, (p) =>
    ignore409(() =>
      db.createDocument(databaseId, "projects", p.id, {
        name: p.name,
        description: p.description,
        status: p.status,
        startDate: p.startDate,
        endDate: p.endDate,
        teamMembers: p.teamMembers,
      }),
    ),
  )

  // Users + profiles, then tasks + daily reports for newly created users
  for (const u of seedUsers) {
    const created = await ignore409(() =>
      users.create(u.id, u.email, undefined, password, u.name),
    )
    await ignore409(() =>
      db.createDocument(
        databaseId,
        "profiles",
        u.id,
        {
          username: u.username,
          email: u.email,
          name: u.name,
          role: u.role,
          accessLevel: u.accessLevel,
          jobRole: u.jobRole,
          department: u.department,
          dateOfBirth: u.dateOfBirth,
          payScale: u.payScale,
          bio: u.bio,
          profileImage: "",
          managerId: u.managerId,
          createdAt: u.createdAt,
          isActive: true,
        },
        profilePerms(u.id),
      ),
    )

    if (created === null) {
      console.log(`  = ${u.username} (exists, skipping task generation)`)
      continue
    }

    if (u.role === "root_admin") {
      console.log(`  + ${u.username}`)
      continue
    }

    const tasksByDate = generateTasksForUser(u.id)
    const dates = Object.keys(tasksByDate)
    const flatTasks = dates.flatMap((d) => tasksByDate[d])

    await runBatched(flatTasks, 25, (t) =>
      db.createDocument(databaseId, "tasks", ID.unique(), t, ownerPerms(u.id)),
    )
    await runBatched(dates, 25, (d) =>
      db.createDocument(
        databaseId,
        "daily_reports",
        `${u.id}-${d}`,
        { userId: u.id, date: d, submittedAt: `${d}T17:00:00Z`, isEditable: d === TODAY },
        ownerPerms(u.id),
      ),
    )
    console.log(`  + ${u.username} (${flatTasks.length} tasks, ${dates.length} reports)`)
  }

  // AI reports
  console.log("AI reports...")
  await runBatched(seedAIReports, 4, (r) =>
    ignore409(() =>
      db.createDocument(databaseId, "ai_reports", ID.unique(), r),
    ),
  )

  console.log(`\nSeeding complete. Demo accounts log in with their email + "${password}".`)
  console.log("e.g.  ceo@workpulse.dev / vikram@workpulse.dev")
}

main().catch((err) => {
  console.error("\nSeeding failed:", err?.message || err)
  process.exit(1)
})
