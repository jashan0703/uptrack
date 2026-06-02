import { Permission, Role } from "node-appwrite"
import { z } from "zod"
import { databaseId, collections } from "@/lib/appwrite/config"
import { requireCaller, jsonError } from "@/lib/appwrite/server-auth"

const bodySchema = z.object({
  name: z.string().trim().max(255).optional(),
  username: z.string().trim().max(255).optional(),
})

function mapUser(doc: Record<string, any>) {
  return {
    id: doc.$id,
    username: doc.username,
    email: doc.email,
    name: doc.name,
    role: doc.role,
    accessLevel: doc.accessLevel,
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

/**
 * Ensure the authenticated caller has a profile document. Existing profiles are
 * returned as-is; missing ones (fresh email signup or first Google OAuth login)
 * get a default employee/self_only profile created with the admin client.
 */
export async function POST(request: Request) {
  try {
    const { callerId, admin } = await requireCaller(request)

    // Already has a profile → return it.
    try {
      const existing = await admin.databases.getDocument(
        databaseId,
        collections.profiles,
        callerId,
      )
      return Response.json({ user: mapUser(existing) })
    } catch {
      /* no profile yet — create one below */
    }

    const body = await request.json().catch(() => ({}))
    const parsed = bodySchema.safeParse(body)
    const extra = parsed.success ? parsed.data : {}

    const authUser = await admin.users.get(callerId)
    const email = authUser.email ?? ""
    const fallbackName = email ? email.split("@")[0] : "New User"
    const username =
      extra.username?.trim() ||
      (email ? email.split("@")[0] : `user_${callerId.slice(0, 6)}`)

    const profilePerms = [
      Permission.read(Role.users()),
      Permission.update(Role.user(callerId)),
      Permission.delete(Role.user(callerId)),
    ]

    const doc = await admin.databases.createDocument(
      databaseId,
      collections.profiles,
      callerId,
      {
        username,
        email,
        name: extra.name?.trim() || authUser.name || fallbackName,
        role: "employee",
        accessLevel: "self_only",
        jobRole: "",
        department: "",
        dateOfBirth: "",
        payScale: "",
        bio: "",
        profileImage: "",
        managerId: null,
        createdAt: new Date().toISOString().split("T")[0],
        isActive: true,
      },
      profilePerms,
    )

    return Response.json({ user: mapUser(doc) }, { status: 201 })
  } catch (err) {
    return jsonError(err)
  }
}
