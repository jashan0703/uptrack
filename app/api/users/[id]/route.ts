import { z } from "zod"
import { databaseId, collections } from "@/lib/appwrite/config"
import {
  requireTeamManager,
  accessRank,
  HttpError,
  jsonError,
} from "@/lib/appwrite/server-auth"

const patchSchema = z.object({
  isActive: z.boolean().optional(),
  role: z.enum(["admin", "employee"]).optional(),
  accessLevel: z.enum(["self_only", "view_only", "manage_team", "full"]).optional(),
})

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const { caller, admin } = await requireTeamManager(request)

    if (id === caller.callerId) {
      throw new HttpError(400, "You cannot modify your own account here")
    }

    const body = await request.json()
    const parsed = patchSchema.safeParse(body)
    if (!parsed.success || Object.keys(parsed.data).length === 0) {
      throw new HttpError(400, "Invalid request payload")
    }

    const target = await admin.databases.getDocument(
      databaseId,
      collections.profiles,
      id,
    )

    // Only a root admin may modify another admin/root_admin account.
    if (
      (target.role === "admin" || target.role === "root_admin") &&
      caller.role !== "root_admin"
    ) {
      throw new HttpError(403, "Only a root admin can modify admin accounts")
    }

    if (
      parsed.data.accessLevel &&
      accessRank[parsed.data.accessLevel] > accessRank[caller.accessLevel]
    ) {
      throw new HttpError(403, "Cannot grant access level above your own")
    }

    const doc = await admin.databases.updateDocument(
      databaseId,
      collections.profiles,
      id,
      parsed.data,
    )

    return Response.json({
      user: {
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
      },
    })
  } catch (err) {
    return jsonError(err)
  }
}
