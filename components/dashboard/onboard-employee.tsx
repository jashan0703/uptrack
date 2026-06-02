"use client"

import React from "react"

import { useState } from "react"
import { UserPlus, Mail } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useAppDispatch } from "@/store/hooks"
import { onboardUser } from "@/store/slices/users-slice"
import type { Role, AccessLevel } from "@/lib/types"
import { toast } from "sonner"

interface OnboardEmployeeProps {
  maxRole?: Role
  maxAccessLevel?: AccessLevel
}

export function OnboardEmployee({ maxRole = "employee", maxAccessLevel = "self_only" }: OnboardEmployeeProps) {
  const dispatch = useAppDispatch()
  const [submitting, setSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    jobRole: "",
    department: "",
    dateOfBirth: "",
    payScale: "",
    bio: "",
    role: "employee" as "admin" | "employee",
    accessLevel: "self_only" as AccessLevel,
  })

  const roleOptions = () => {
    if (maxRole === "admin") return [{ value: "admin", label: "Admin" }, { value: "employee", label: "Employee" }]
    return [{ value: "employee", label: "Employee" }]
  }

  const accessOptions = () => {
    const levels: Array<{ value: AccessLevel; label: string }> = [
      { value: "self_only", label: "Self Only" },
    ]
    if (maxAccessLevel === "view_only" || maxAccessLevel === "manage_team" || maxAccessLevel === "full") {
      levels.push({ value: "view_only", label: "View Only" })
    }
    if (maxAccessLevel === "manage_team" || maxAccessLevel === "full") {
      levels.push({ value: "manage_team", label: "Manage Team" })
    }
    return levels
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.username || !formData.email || !formData.password) {
      toast.error("Please fill in all required fields")
      return
    }
    if (formData.password.length < 8) {
      toast.error("Initial password must be at least 8 characters")
      return
    }

    setSubmitting(true)
    try {
      await dispatch(onboardUser(formData)).unwrap()
      toast.success(`${formData.name} has been onboarded successfully`)
      setFormData({
        name: "",
        username: "",
        email: "",
        password: "",
        jobRole: "",
        department: "",
        dateOfBirth: "",
        payScale: "",
        bio: "",
        role: "employee",
        accessLevel: "self_only",
      })
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to onboard employee")
    } finally {
      setSubmitting(false)
    }
  }

  const handleSendInvite = () => {
    if (!formData.email) {
      toast.error("Please enter an email address first")
      return
    }
    toast.success(`Invitation email sent to ${formData.email}`)
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-semibold text-card-foreground">
          <UserPlus className="h-4 w-4" />
          Onboard New Employee
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm">Full Name *</Label>
              <Input
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm">Username *</Label>
              <Input
                placeholder="john.d"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm">Email *</Label>
              <Input
                type="email"
                placeholder="john@workpulse.dev"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm">Initial Password *</Label>
              <Input
                type="text"
                placeholder="Set initial password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm">Job Role</Label>
              <Input
                placeholder="Frontend Developer"
                value={formData.jobRole}
                onChange={(e) => setFormData({ ...formData, jobRole: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm">Department</Label>
              <Select value={formData.department} onValueChange={(v) => setFormData({ ...formData, department: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Engineering">Engineering</SelectItem>
                  <SelectItem value="Design">Design</SelectItem>
                  <SelectItem value="Human Resources">Human Resources</SelectItem>
                  <SelectItem value="Product">Product</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Sales">Sales</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm">Date of Birth</Label>
              <Input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm">Pay Scale</Label>
              <Select value={formData.payScale} onValueChange={(v) => setFormData({ ...formData, payScale: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select pay scale" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Executive Band">Executive Band</SelectItem>
                  <SelectItem value="Band A">Band A</SelectItem>
                  <SelectItem value="Band B">Band B</SelectItem>
                  <SelectItem value="Band C">Band C</SelectItem>
                  <SelectItem value="Band D">Band D</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm">Role</Label>
              <Select value={formData.role} onValueChange={(v) => setFormData({ ...formData, role: v as "admin" | "employee" })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {roleOptions().map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm">Access Level</Label>
              <Select value={formData.accessLevel} onValueChange={(v) => setFormData({ ...formData, accessLevel: v as AccessLevel })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {accessOptions().map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm">Bio</Label>
            <Textarea
              placeholder="Brief description of the employee..."
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              rows={3}
            />
          </div>

          <div className="flex items-center gap-3">
            <Button type="submit" disabled={submitting} className="bg-primary text-primary-foreground hover:bg-primary/90">
              <UserPlus className="mr-1 h-4 w-4" />
              {submitting ? "Onboarding..." : "Onboard Employee"}
            </Button>
            <Button type="button" variant="outline" onClick={handleSendInvite}>
              <Mail className="mr-1 h-4 w-4" />
              Send Invite Email
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
