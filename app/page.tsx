"use client"

import { useState } from "react"
import { ArrowRight, BarChart3, Brain, Shield, Activity, Users, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"
import { LoginModal } from "@/components/login-modal"

const features = [
  {
    icon: BarChart3,
    title: "Performance Analytics",
    description: "Track employee productivity with detailed heatmaps and performance graphs across daily, weekly, monthly, and yearly views.",
  },
  {
    icon: Brain,
    title: "AI-Powered Insights",
    description: "Get intelligent weekly reports assessing work quality, identifying strengths, and suggesting areas for improvement.",
  },
  {
    icon: Shield,
    title: "Role-Based Access",
    description: "Granular access control with Root Admin, Admin, and Employee roles, each with configurable permission levels.",
  },
  {
    icon: Activity,
    title: "Real-Time Tracking",
    description: "Employees submit daily progress reports with task categorization, project tagging, and completion tracking.",
  },
  {
    icon: Users,
    title: "Team Management",
    description: "Onboard and manage employees, assign roles, set access levels, and monitor team performance from a single dashboard.",
  },
  {
    icon: Zap,
    title: "Instant Overview",
    description: "Get a bird's-eye view of company-wide productivity, project progress, and individual contributions in real time.",
  },
]

export default function HomePage() {
  const [loginOpen, setLoginOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.08),transparent_60%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground">
              <Zap className="mr-2 h-3.5 w-3.5 text-primary" />
              Enterprise Productivity Platform
            </div>
            <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Understand Your Team{"'"}s Productivity
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground sm:text-xl">
              Copan Developers helps management gain actionable insights into employee performance through AI-powered analytics, contribution heatmaps, and intelligent reporting.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => setLoginOpen(true)}
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => {
                document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })
              }}>
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="border-t border-border bg-card/50">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Everything you need to measure productivity
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              A comprehensive suite of tools designed for modern engineering teams.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title} className="border-border bg-card transition-colors hover:bg-accent/50">
                <CardContent className="p-6">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-card-foreground">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {[
              { label: "Active Users", value: "10+" },
              { label: "Projects Tracked", value: "5" },
              { label: "Daily Reports", value: "500+" },
              { label: "AI Insights", value: "Weekly" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold text-foreground sm:text-4xl">{stat.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-primary">
                <span className="text-xs font-bold text-primary-foreground">C</span>
              </div>
              <span className="text-sm font-medium text-foreground">Copan Developers</span>
            </div>
            <p className="text-sm text-muted-foreground">
              2026 Copan Developers. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      <LoginModal open={loginOpen} onOpenChange={setLoginOpen} />
    </div>
  )
}
