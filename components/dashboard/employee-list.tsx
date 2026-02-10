"use client"

import { useState } from "react"
import Image from "next/image"
import { Search, UserX, Eye } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { removeUser } from "@/store/slices/users-slice"
import type { User } from "@/lib/types"
import { toast } from "sonner"

interface EmployeeListProps {
  canRemove?: boolean
  onViewProfile?: (user: User) => void
  filterByManager?: string
}

export function EmployeeList({ canRemove = false, onViewProfile, filterByManager }: EmployeeListProps) {
  const dispatch = useAppDispatch()
  const { users } = useAppSelector((state) => state.users)
  const [search, setSearch] = useState("")

  const filteredUsers = users.filter((u) => {
    if (!u.isActive) return false
    if (filterByManager && u.managerId !== filterByManager) return false
    if (search) {
      const q = search.toLowerCase()
      return (
        u.name.toLowerCase().includes(q) ||
        u.jobRole.toLowerCase().includes(q) ||
        u.department.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q)
      )
    }
    return true
  })

  const roleLabels: Record<string, string> = {
    root_admin: "Root Admin",
    admin: "Admin",
    employee: "Employee",
  }

  const handleRemove = (user: User) => {
    dispatch(removeUser(user.id))
    toast.success(`${user.name} has been removed from the organization`)
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-base font-semibold text-card-foreground">
          <span>Employee Directory</span>
          <Badge variant="secondary">{filteredUsers.length} members</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search employees..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <ScrollArea className="h-[400px]">
          <div className="flex flex-col gap-2 pr-4">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between rounded-lg border border-border p-3 transition-colors hover:bg-muted/30"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 overflow-hidden rounded-full border border-border">
                    <Image
                      src={user.profileImage || "/placeholder-user.jpg"}
                      alt={user.name}
                      width={40}
                      height={40}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-card-foreground">{user.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {user.jobRole} - {user.department}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {roleLabels[user.role]}
                  </Badge>

                  {onViewProfile && (
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onViewProfile(user)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  )}

                  {canRemove && user.role !== "root_admin" && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                          <UserX className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-card text-card-foreground">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remove {user.name}?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will deactivate the employee account. This action can be reversed by an administrator.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-destructive text-destructive-foreground"
                            onClick={() => handleRemove(user)}
                          >
                            Remove
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              </div>
            ))}

            {filteredUsers.length === 0 && (
              <div className="py-8 text-center text-sm text-muted-foreground">
                No employees found matching your search.
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
