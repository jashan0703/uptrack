import "server-only"

import { createAdminClient, createSessionClient } from "./server"
import { databaseId, collections } from "./config"

export const accessRank: Record<string, number> = {
  self_only: 0,
  view_only: 1,
  manage_team: 2,
  full: 3,
}

export class HttpError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

export interface CallerContext {
  callerId: string
  role: string
  accessLevel: string
}

/**
 * Verify the request's JWT, load the caller's profile with the admin client,
 * and ensure they are an admin with team-management rights. Returns the caller
 * context plus an admin client for the privileged work. Throws HttpError otherwise.
 */
export async function requireTeamManager(request: Request): Promise<{
  caller: CallerContext
  admin: ReturnType<typeof createAdminClient>
}> {
  const header = request.headers.get("authorization") ?? ""
  const jwt = header.startsWith("Bearer ") ? header.slice(7).trim() : ""
  if (!jwt) throw new HttpError(401, "Missing authentication token")

  let callerId: string
  try {
    const { account } = createSessionClient(jwt)
    const me = await account.get()
    callerId = me.$id
  } catch {
    throw new HttpError(401, "Invalid or expired session")
  }

  const admin = createAdminClient()
  let profile
  try {
    profile = await admin.databases.getDocument(
      databaseId,
      collections.profiles,
      callerId,
    )
  } catch {
    throw new HttpError(403, "No profile found for caller")
  }

  const role = profile.role as string
  const accessLevel = profile.accessLevel as string
  const isAdmin = role === "admin" || role === "root_admin"
  const canManage = accessRank[accessLevel] >= accessRank.manage_team
  if (!isAdmin || !canManage) {
    throw new HttpError(403, "Insufficient permissions")
  }

  return { caller: { callerId, role, accessLevel }, admin }
}

/**
 * Verify the request's JWT and return the caller's id plus an admin client.
 * Does NOT require any role — used for self-service actions (profile bootstrap).
 */
export async function requireCaller(request: Request): Promise<{
  callerId: string
  admin: ReturnType<typeof createAdminClient>
}> {
  const header = request.headers.get("authorization") ?? ""
  const jwt = header.startsWith("Bearer ") ? header.slice(7).trim() : ""
  if (!jwt) throw new HttpError(401, "Missing authentication token")

  try {
    const { account } = createSessionClient(jwt)
    const me = await account.get()
    return { callerId: me.$id, admin: createAdminClient() }
  } catch {
    throw new HttpError(401, "Invalid or expired session")
  }
}

export function jsonError(err: unknown) {
  if (err instanceof HttpError) {
    return Response.json({ error: err.message }, { status: err.status })
  }
  console.error("Unexpected API error:", err)
  return Response.json({ error: "Internal server error" }, { status: 500 })
}
