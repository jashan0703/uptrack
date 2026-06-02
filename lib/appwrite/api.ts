"use client"

import { ID, Query, Permission, Role as AwRole, OAuthProvider } from "appwrite"
import { account, databases } from "./client"
import { databaseId, collections } from "./config"
import type {
  User,
  Project,
  Task,
  DailyReport,
  AIReport,
  Role,
  AccessLevel,
  TaskTag,
} from "@/lib/types"

/** Appwrite documents carry $id/$createdAt plus the collection's attributes. */
type Doc = Record<string, any>

const PAGE_LIMIT = 100

/** Fetch every document in a collection, following pagination cursors. */
async function listAll(
  collectionId: string,
  queries: string[] = [],
): Promise<Doc[]> {
  const docs: Doc[] = []
  let cursor: string | undefined
  // Loop until a page returns fewer than PAGE_LIMIT documents.
  for (;;) {
    const pageQueries = [...queries, Query.limit(PAGE_LIMIT)]
    if (cursor) pageQueries.push(Query.cursorAfter(cursor))
    const res = await databases.listDocuments(databaseId, collectionId, pageQueries)
    docs.push(...res.documents)
    if (res.documents.length < PAGE_LIMIT) break
    cursor = res.documents[res.documents.length - 1].$id
  }
  return docs
}

// ---------- mappers ----------

function toUser(doc: Doc): User {
  return {
    id: doc.$id,
    username: doc.username,
    email: doc.email,
    name: doc.name,
    role: doc.role as Role,
    accessLevel: doc.accessLevel as AccessLevel,
    jobRole: doc.jobRole ?? "",
    department: doc.department ?? "",
    dateOfBirth: doc.dateOfBirth ?? "",
    payScale: doc.payScale ?? "",
    bio: doc.bio ?? "",
    profileImage: doc.profileImage ?? "",
    managerId: doc.managerId ?? null,
    createdAt: doc.createdAt ?? doc.$createdAt,
    isActive: doc.isActive ?? true,
  }
}

function toProject(doc: Doc): Project {
  return {
    id: doc.$id,
    name: doc.name,
    description: doc.description ?? "",
    status: doc.status as Project["status"],
    startDate: doc.startDate ?? "",
    endDate: doc.endDate ?? null,
    teamMembers: doc.teamMembers ?? [],
  }
}

function toTask(doc: Doc): Task {
  return {
    id: doc.$id,
    title: doc.title,
    description: doc.description ?? "",
    tag: doc.tag as TaskTag,
    project: doc.project ?? "",
    completed: doc.completed ?? false,
    timeTaken: doc.timeTaken ?? 0,
    date: doc.date,
    userId: doc.userId,
  }
}

function toAIReport(doc: Doc): AIReport {
  return {
    id: doc.$id,
    userId: doc.userId,
    weekStartDate: doc.weekStartDate,
    weekEndDate: doc.weekEndDate,
    summary: doc.summary ?? "",
    qualityScore: doc.qualityScore ?? 0,
    areasOfImprovement: doc.areasOfImprovement ?? [],
    strengths: doc.strengths ?? [],
    recommendations: doc.recommendations ?? [],
    generatedAt: doc.generatedAt ?? doc.$createdAt,
  }
}

// ---------- auth ----------

export async function login(email: string, password: string): Promise<User> {
  // Clear any stale session before establishing a new one.
  try {
    await account.deleteSession("current")
  } catch {
    /* no active session */
  }
  await account.createEmailPasswordSession(email, password)
  return getCurrentProfile()
}

export async function logout(): Promise<void> {
  try {
    await account.deleteSession("current")
  } catch {
    /* already signed out */
  }
}

export interface SignupInput {
  name: string
  username: string
  email: string
  password: string
}

/** Self-service email/password sign-up. Creates the account, a session, and a default profile. */
export async function signup(input: SignupInput): Promise<User> {
  try {
    await account.deleteSession("current")
  } catch {
    /* no active session */
  }
  await account.create(ID.unique(), input.email, input.password, input.name)
  await account.createEmailPasswordSession(input.email, input.password)
  return bootstrapProfile({ name: input.name, username: input.username })
}

/**
 * Redirect the browser into Google's OAuth flow via Appwrite.
 *
 * Uses the token flow (not the session flow) so it works across domains:
 * the app runs on localhost while Appwrite Cloud lives on another domain,
 * so a session cookie would be a third-party cookie that browsers drop.
 * Appwrite redirects back to `successUrl` with `userId` and `secret` query
 * params, which the client exchanges for a session via `completeOAuthLogin`.
 */
export function loginWithGoogle(): void {
  const origin = window.location.origin
  account.createOAuth2Token(
    OAuthProvider.Google,
    `${origin}/dashboard`,
    `${origin}/?authError=google`,
  )
}

/** Exchange an OAuth token (userId + secret) for a session, then load the profile. */
export async function completeOAuthLogin(
  userId: string,
  secret: string,
): Promise<User> {
  try {
    await account.deleteSession("current")
  } catch {
    /* no active session */
  }
  await account.createSession(userId, secret)
  return getCurrentProfile()
}

/** Ensure the signed-in user has a profile, creating a default one if missing. */
async function bootstrapProfile(extra?: {
  name?: string
  username?: string
}): Promise<User> {
  const res = await fetch("/api/auth/bootstrap", {
    method: "POST",
    headers: await authHeaders(),
    body: JSON.stringify(extra ?? {}),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data?.error ?? "Failed to initialize profile")
  return data.user as User
}

export async function getCurrentProfile(): Promise<User> {
  const me = await account.get()
  try {
    const doc = await databases.getDocument(databaseId, collections.profiles, me.$id)
    return toUser(doc)
  } catch {
    // No profile yet (e.g., first Google login) — create a default one.
    return bootstrapProfile()
  }
}

export async function updateMyProfile(
  id: string,
  updates: Partial<User>,
): Promise<User> {
  const { id: _omit, ...rest } = updates
  const doc = await databases.updateDocument(
    databaseId,
    collections.profiles,
    id,
    rest,
  )
  return toUser(doc)
}

// ---------- users ----------

export async function listProfiles(): Promise<User[]> {
  const docs = await listAll(collections.profiles)
  return docs.map(toUser)
}

export interface OnboardInput {
  name: string
  username: string
  email: string
  password: string
  jobRole?: string
  department?: string
  dateOfBirth?: string
  payScale?: string
  bio?: string
  role: "admin" | "employee"
  accessLevel: AccessLevel
}

/** Build headers carrying a short-lived JWT so the server can authorize the caller. */
async function authHeaders(): Promise<Record<string, string>> {
  const { jwt } = await account.createJWT()
  return { "Content-Type": "application/json", Authorization: `Bearer ${jwt}` }
}

/** Onboard a new employee/admin via the privileged server route. */
export async function onboardUser(input: OnboardInput): Promise<User> {
  const res = await fetch("/api/users", {
    method: "POST",
    headers: await authHeaders(),
    body: JSON.stringify(input),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data?.error ?? "Failed to onboard user")
  return data.user as User
}

/** Activate/deactivate a user via the privileged server route. */
export async function setUserActive(id: string, isActive: boolean): Promise<User> {
  const res = await fetch(`/api/users/${id}`, {
    method: "PATCH",
    headers: await authHeaders(),
    body: JSON.stringify({ isActive }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data?.error ?? "Failed to update user")
  return data.user as User
}

// ---------- projects ----------

export async function listProjects(): Promise<Project[]> {
  const docs = await listAll(collections.projects)
  return docs.map(toProject)
}

export async function createProject(
  data: Omit<Project, "id">,
): Promise<Project> {
  const doc = await databases.createDocument(
    databaseId,
    collections.projects,
    ID.unique(),
    data,
  )
  return toProject(doc)
}

export async function updateProjectDoc(
  id: string,
  updates: Partial<Omit<Project, "id">>,
): Promise<Project> {
  const doc = await databases.updateDocument(
    databaseId,
    collections.projects,
    id,
    updates,
  )
  return toProject(doc)
}

// ---------- tasks & reports ----------

export async function listTasksForUser(userId: string): Promise<Task[]> {
  const docs = await listAll(collections.tasks, [Query.equal("userId", userId)])
  return docs.map(toTask)
}

export async function listAllTasks(): Promise<Task[]> {
  const docs = await listAll(collections.tasks)
  return docs.map(toTask)
}

export async function listAIReports(): Promise<AIReport[]> {
  const docs = await listAll(collections.aiReports)
  return docs.map(toAIReport)
}

/** Build a user's daily reports by joining report docs with their tasks. */
export async function listReportsForUser(userId: string): Promise<DailyReport[]> {
  const [reportDocs, tasks] = await Promise.all([
    listAll(collections.dailyReports, [Query.equal("userId", userId)]),
    listTasksForUser(userId),
  ])

  const tasksByDate = new Map<string, Task[]>()
  for (const t of tasks) {
    const bucket = tasksByDate.get(t.date) ?? []
    bucket.push(t)
    tasksByDate.set(t.date, bucket)
  }

  const reports: DailyReport[] = reportDocs.map((doc) => ({
    id: doc.$id,
    userId: doc.userId,
    date: doc.date,
    submittedAt: doc.submittedAt ?? doc.$createdAt,
    isEditable: doc.isEditable ?? false,
    tasks: tasksByDate.get(doc.date) ?? [],
  }))

  return reports.sort((a, b) => b.date.localeCompare(a.date))
}

/**
 * Persist a day's tasks: replace any existing task docs for that date, then
 * upsert a daily_reports document. The report doc id is deterministic so
 * re-submitting the same day overwrites rather than duplicates.
 */
export async function submitDailyReport(
  userId: string,
  date: string,
  tasks: Task[],
): Promise<DailyReport> {
  const existing = await listAll(collections.tasks, [
    Query.equal("userId", userId),
    Query.equal("date", date),
  ])
  await Promise.all(
    existing.map((doc) =>
      databases.deleteDocument(databaseId, collections.tasks, doc.$id),
    ),
  )

  const ownerPerms = [
    Permission.read(AwRole.users()),
    Permission.update(AwRole.user(userId)),
    Permission.delete(AwRole.user(userId)),
  ]

  const created = await Promise.all(
    tasks.map((t) =>
      databases.createDocument(
        databaseId,
        collections.tasks,
        ID.unique(),
        {
          userId,
          title: t.title,
          description: t.description ?? "",
          tag: t.tag,
          project: t.project,
          completed: t.completed,
          timeTaken: t.timeTaken,
          date,
        },
        ownerPerms,
      ),
    ),
  )

  const reportId = `${userId}-${date}`
  const submittedAt = new Date().toISOString()
  const payload = { userId, date, submittedAt, isEditable: true }

  let reportDoc: Doc
  try {
    reportDoc = await databases.updateDocument(
      databaseId,
      collections.dailyReports,
      reportId,
      payload,
    )
  } catch {
    reportDoc = await databases.createDocument(
      databaseId,
      collections.dailyReports,
      reportId,
      payload,
      ownerPerms,
    )
  }

  return {
    id: reportDoc.$id,
    userId,
    date,
    submittedAt,
    isEditable: true,
    tasks: created.map(toTask),
  }
}
