/**
 * Provisions the Appwrite database schema for UpTrack.
 *
 * Idempotent: re-running skips anything that already exists (409 conflicts are
 * swallowed). Run with:  npm run appwrite:setup
 */
import { config } from "dotenv"
import { Client, Databases, Permission, Role, DatabasesIndexType } from "node-appwrite"

config({ path: ".env.local" })

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID
const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "uptrack"
const apiKey = process.env.APPWRITE_API_KEY

if (!endpoint || !projectId || !apiKey) {
  console.error(
    "Missing config. Ensure NEXT_PUBLIC_APPWRITE_ENDPOINT, NEXT_PUBLIC_APPWRITE_PROJECT_ID and APPWRITE_API_KEY are set in .env.local",
  )
  process.exit(1)
}

const client = new Client().setEndpoint(endpoint).setProject(projectId).setKey(apiKey)
const db = new Databases(client)

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

/** Run an Appwrite call, ignoring "already exists" (409) errors. */
async function idempotent(label, fn) {
  try {
    await fn()
    console.log(`  + ${label}`)
  } catch (err) {
    if (err?.code === 409) {
      console.log(`  = ${label} (exists)`)
    } else {
      throw err
    }
  }
}

async function ensureCollection(id, name, permissions, documentSecurity) {
  await idempotent(`collection ${id}`, () =>
    db.createCollection(databaseId, id, name, permissions, documentSecurity),
  )
}

/** Poll until every attribute on a collection is processed and available. */
async function waitForAttributes(collectionId) {
  for (let attempt = 0; attempt < 30; attempt++) {
    const res = await db.listAttributes(databaseId, collectionId)
    const pending = res.attributes.filter((a) => a.status !== "available")
    if (pending.length === 0) return
    await sleep(1000)
  }
  console.warn(`  ! attributes for ${collectionId} still processing; continuing`)
}

async function main() {
  console.log(`Setting up database "${databaseId}" on ${endpoint}`)

  await idempotent(`database ${databaseId}`, () =>
    db.create(databaseId, "UpTrack"),
  )

  const readAll = [Permission.read(Role.users())]
  const userWritable = [
    Permission.read(Role.users()),
    Permission.create(Role.users()),
    Permission.update(Role.users()),
    Permission.delete(Role.users()),
  ]
  const userCreatable = [Permission.read(Role.users()), Permission.create(Role.users())]

  // ---- profiles ----
  await ensureCollection("profiles", "Profiles", readAll, true)
  const s = (key, size, req, def, arr) =>
    idempotent(`profiles.${key}`, () =>
      db.createStringAttribute(databaseId, "profiles", key, size, req, def, arr),
    )
  await s("username", 255, true)
  await s("email", 320, true)
  await s("name", 255, true)
  await s("role", 32, true)
  await s("accessLevel", 32, true)
  await s("jobRole", 255, false)
  await s("department", 128, false)
  await s("dateOfBirth", 32, false)
  await s("payScale", 64, false)
  await s("bio", 2000, false)
  await s("profileImage", 1024, false)
  await s("managerId", 64, false)
  await s("createdAt", 64, false)
  await idempotent("profiles.isActive", () =>
    db.createBooleanAttribute(databaseId, "profiles", "isActive", false, true),
  )
  await waitForAttributes("profiles")
  await idempotent("profiles.idx_username", () =>
    db.createIndex(databaseId, "profiles", "idx_username", DatabasesIndexType.Key, ["username"]),
  )
  await idempotent("profiles.idx_managerId", () =>
    db.createIndex(databaseId, "profiles", "idx_managerId", DatabasesIndexType.Key, ["managerId"]),
  )

  // ---- projects ----
  await ensureCollection("projects", "Projects", userWritable, false)
  const ps = (key, size, req, def, arr) =>
    idempotent(`projects.${key}`, () =>
      db.createStringAttribute(databaseId, "projects", key, size, req, def, arr),
    )
  await ps("name", 255, true)
  await ps("description", 2000, false)
  await ps("status", 32, true)
  await ps("startDate", 32, false)
  await ps("endDate", 32, false)
  await ps("teamMembers", 64, false, undefined, true)

  // ---- tasks ----
  await ensureCollection("tasks", "Tasks", userCreatable, true)
  const ts = (key, size, req, def, arr) =>
    idempotent(`tasks.${key}`, () =>
      db.createStringAttribute(databaseId, "tasks", key, size, req, def, arr),
    )
  await ts("userId", 64, true)
  await ts("title", 500, true)
  await ts("description", 2000, false)
  await ts("tag", 32, true)
  await ts("project", 64, false)
  await idempotent("tasks.completed", () =>
    db.createBooleanAttribute(databaseId, "tasks", "completed", false, false),
  )
  await idempotent("tasks.timeTaken", () =>
    db.createFloatAttribute(databaseId, "tasks", "timeTaken", false, 0, 1000, 0),
  )
  await ts("date", 32, true)
  await waitForAttributes("tasks")
  await idempotent("tasks.idx_userId", () =>
    db.createIndex(databaseId, "tasks", "idx_userId", DatabasesIndexType.Key, ["userId"]),
  )
  await idempotent("tasks.idx_userId_date", () =>
    db.createIndex(databaseId, "tasks", "idx_userId_date", DatabasesIndexType.Key, ["userId", "date"]),
  )

  // ---- daily_reports ----
  await ensureCollection("daily_reports", "Daily Reports", userCreatable, true)
  await idempotent("daily_reports.userId", () =>
    db.createStringAttribute(databaseId, "daily_reports", "userId", 64, true),
  )
  await idempotent("daily_reports.date", () =>
    db.createStringAttribute(databaseId, "daily_reports", "date", 32, true),
  )
  await idempotent("daily_reports.submittedAt", () =>
    db.createStringAttribute(databaseId, "daily_reports", "submittedAt", 64, false),
  )
  await idempotent("daily_reports.isEditable", () =>
    db.createBooleanAttribute(databaseId, "daily_reports", "isEditable", false, true),
  )
  await waitForAttributes("daily_reports")
  await idempotent("daily_reports.idx_userId", () =>
    db.createIndex(databaseId, "daily_reports", "idx_userId", DatabasesIndexType.Key, ["userId"]),
  )

  // ---- ai_reports ----
  await ensureCollection("ai_reports", "AI Reports", readAll, false)
  const as = (key, size, req, def, arr) =>
    idempotent(`ai_reports.${key}`, () =>
      db.createStringAttribute(databaseId, "ai_reports", key, size, req, def, arr),
    )
  await as("userId", 64, true)
  await as("weekStartDate", 32, false)
  await as("weekEndDate", 32, false)
  await as("summary", 5000, false)
  await idempotent("ai_reports.qualityScore", () =>
    db.createIntegerAttribute(databaseId, "ai_reports", "qualityScore", false, 0, 100, 0),
  )
  await as("areasOfImprovement", 1000, false, undefined, true)
  await as("strengths", 1000, false, undefined, true)
  await as("recommendations", 1000, false, undefined, true)
  await as("generatedAt", 64, false)
  await waitForAttributes("ai_reports")
  await idempotent("ai_reports.idx_userId", () =>
    db.createIndex(databaseId, "ai_reports", "idx_userId", DatabasesIndexType.Key, ["userId"]),
  )

  console.log("\nSchema setup complete.")
}

main().catch((err) => {
  console.error("\nSetup failed:", err?.message || err)
  process.exit(1)
})
