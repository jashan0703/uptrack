/**
 * Central Appwrite identifiers shared between the browser client, the server
 * client, and the setup/seed scripts. Only NEXT_PUBLIC_* values are safe to
 * read in client components.
 */

export const appwriteEndpoint =
  process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ?? "https://cloud.appwrite.io/v1"

export const appwriteProjectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID ?? ""

export const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID ?? "uptrack"

/** Fixed collection ids (created by scripts/setup-appwrite.mjs). */
export const collections = {
  profiles: "profiles",
  projects: "projects",
  tasks: "tasks",
  dailyReports: "daily_reports",
  aiReports: "ai_reports",
} as const

export type CollectionId = (typeof collections)[keyof typeof collections]
