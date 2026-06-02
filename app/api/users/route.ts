import { ID, Permission, Role } from "node-appwrite"
import { z } from "zod"
import { databaseId, collections } from "@/lib/appwrite/config"
import {
  requireTeamManager,
  accessRank,
  HttpError,
  jsonError,
} from "@/lib/appwrite/server-auth"

const onboardSchema = z.object({
  name: z.string().trim().min(1).max(255),
  username: z.string().trim().min(1).max(255),
  email: z.string().trim().email().max(320),
  password: z.string().min(8).max(256),
  jobRole: z.string().max(255).optional().default(""),
  department: z.string().max(128).optional().default(""),
  dateOfBirth: z.string().max(32).optional().default(""),
  payScale: z.string().max(64).optional().default(""),
  bio: z.string().max(2000).optional().default(""),
  role: z.enum(["admin", "employee"]),
  accessLevel: z.enum(["self_only", "view_only", "manage_team", "full"]),
})

export async function POST(request: Request) {
  try {
    const { caller, admin } = await requireTeamManager(request)

    const body = await request.json()
    const parsed = onboardSchema.safeParse(body)
    if (!parsed.success) {
      throw new HttpError(400, "Invalid request payload")
    }
    const data = parsed.data

    // Authorization: cannot grant a role/access level above the caller's own,
    // and a non-root admin may not mint other admins above their tier.
    if (accessRank[data.accessLevel] > accessRank[caller.accessLevel]) {
      throw new HttpError(403, "Cannot grant access level above your own")
    }
    if (data.role === "admin" && caller.role !== "root_admin" && caller.role !== "admin") {
      throw new HttpError(403, "Not allowed to create admins")
    }

    const newId = ID.unique()
    await admin.users.create(newId, data.email, undefined, data.password, data.name)

    const profilePerms = [
      Permission.read(Role.users()),
      Permission.update(Role.user(newId)),
      Permission.delete(Role.user(newId)),
    ]

    const doc = await admin.databases.createDocument(
      databaseId,
      collections.profiles,
      newId,
      {
        username: data.username,
        email: data.email,
        name: data.name,
        role: data.role,
        accessLevel: data.accessLevel,
        jobRole: data.jobRole,
        department: data.department,
        dateOfBirth: data.dateOfBirth,
        payScale: data.payScale,
        bio: data.bio,
        profileImage: "",
        managerId: caller.callerId,
        createdAt: new Date().toISOString().split("T")[0],
        isActive: true,
      },
      profilePerms,
    )

    const user = {
      id: doc.$id,
      username: doc.username,
      email: doc.email,
      name: doc.name,
      role: doc.role,
      accessLevel: doc.accessLevel,
      jobRole: doc.jobRole,
      department: doc.department,
      dateOfBirth: doc.dateOfBirth,
      payScale: doc.payScale,
      bio: doc.bio,
      profileImage: doc.profileImage,
      managerId: doc.managerId,
      createdAt: doc.createdAt,
      isActive: doc.isActive,
    }

    return Response.json({ user }, { status: 201 })
  } catch (err) {
    return jsonError(err)
  }
}
