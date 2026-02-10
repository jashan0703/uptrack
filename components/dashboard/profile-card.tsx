"use client"

import React from "react"

import { useState } from "react"
import Image from "next/image"
import { Camera, Briefcase, Calendar, DollarSign } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useAppDispatch } from "@/store/hooks"
import { updateProfile } from "@/store/slices/auth-slice"
import type { User } from "@/lib/types"
import { toast } from "sonner"

interface ProfileCardProps {
  user: User
}

export function ProfileCard({ user }: ProfileCardProps) {
  const [imageModalOpen, setImageModalOpen] = useState(false)
  const dispatch = useAppDispatch()

  const handleImageUpload = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const file = formData.get("image") as File
    if (file && file.size > 0) {
      const url = URL.createObjectURL(file)
      dispatch(updateProfile({ profileImage: url }))
      toast.success("Profile image updated")
    }
    setImageModalOpen(false)
  }

  const roleLabels: Record<string, string> = {
    root_admin: "Root Admin",
    admin: "Admin",
    employee: "Employee",
  }

  const roleColors: Record<string, string> = {
    root_admin: "bg-primary/10 text-primary",
    admin: "bg-success/10 text-success",
    employee: "bg-chart-2/10 text-chart-2",
  }

  return (
    <Card className="border-border bg-card">
      <CardContent className="p-6">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
          {/* Profile Image */}
          <div className="relative">
            <div className="h-24 w-24 overflow-hidden rounded-full border-2 border-border">
              <Image
                src={user.profileImage || "/placeholder-user.jpg"}
                alt={user.name}
                width={96}
                height={96}
                className="h-full w-full object-cover"
              />
            </div>
            <Dialog open={imageModalOpen} onOpenChange={setImageModalOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full border-border bg-card"
                >
                  <Camera className="h-3.5 w-3.5" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[360px] bg-card text-card-foreground">
                <DialogHeader>
                  <DialogTitle>Update Profile Photo</DialogTitle>
                  <DialogDescription className="text-sm text-muted-foreground">
                    Upload a new image to update your profile photo.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleImageUpload} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="image">Choose an image</Label>
                    <Input id="image" name="image" type="file" accept="image/*" />
                  </div>
                  <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
                    Upload
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Profile Info */}
          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-col items-center gap-2 sm:flex-row">
              <h2 className="text-xl font-bold text-card-foreground">{user.name}</h2>
              <Badge variant="secondary" className={roleColors[user.role]}>
                {roleLabels[user.role]}
              </Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{user.bio}</p>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Briefcase className="h-4 w-4" />
                <span>{user.jobRole}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>DOB: {user.dateOfBirth}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <DollarSign className="h-4 w-4" />
                <span>{user.payScale}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="font-medium text-card-foreground">{user.department}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
