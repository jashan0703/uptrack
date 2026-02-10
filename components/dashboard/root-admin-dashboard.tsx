"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CompanyOverview } from "@/components/dashboard/company-overview"
import { EmployeeList } from "@/components/dashboard/employee-list"
import { OnboardEmployee } from "@/components/dashboard/onboard-employee"
import { AISummaryPanel } from "@/components/dashboard/ai-summary-panel"
import { EmployeeProfileView } from "@/components/dashboard/employee-profile-view"
import type { User } from "@/lib/types"

export function RootAdminDashboard() {
  const [viewingEmployee, setViewingEmployee] = useState<User | null>(null)

  if (viewingEmployee) {
    return (
      <div className="p-4 sm:p-6">
        <EmployeeProfileView
          employee={viewingEmployee}
          onBack={() => setViewingEmployee(null)}
        />
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6">
      <Tabs defaultValue="overview" className="flex flex-col gap-6">
        <TabsList className="self-start">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="employees">Employees</TabsTrigger>
          <TabsTrigger value="ai-summary">AI Summary</TabsTrigger>
          <TabsTrigger value="onboard">Onboard</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="flex flex-col gap-6">
          <CompanyOverview />
        </TabsContent>

        <TabsContent value="employees" className="flex flex-col gap-6">
          <EmployeeList
            canRemove
            onViewProfile={setViewingEmployee}
          />
        </TabsContent>

        <TabsContent value="ai-summary" className="flex flex-col gap-6">
          <AISummaryPanel />
        </TabsContent>

        <TabsContent value="onboard" className="flex flex-col gap-6">
          <OnboardEmployee maxRole="admin" maxAccessLevel="full" />
        </TabsContent>
      </Tabs>
    </div>
  )
}
