"use client"

import { useState } from "react"
import { ArrowRight, BarChart3, Brain, Shield, Activity, Users, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"
import { LoginModal } from "@/components/login-modal"
import { WorkPulseLogo } from "@/components/workpulse-logo"
import { Reveal } from "@/components/reveal"

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
        {/* Animated ambient glows */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.10),transparent_60%)]" />
        <div className="pointer-events-none absolute -top-24 left-1/4 h-72 w-72 rounded-full bg-primary/20 blur-3xl animate-pulse-glow" />
        <div className="pointer-events-none absolute top-10 right-1/4 h-72 w-72 rounded-full bg-chart-4/20 blur-3xl animate-pulse-glow [animation-delay:2s]" />

        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center rounded-full border border-border bg-card/80 px-4 py-1.5 text-sm text-muted-foreground backdrop-blur animate-fade-up transition-colors hover:border-primary/40 hover:text-foreground">
              <Zap className="mr-2 h-3.5 w-3.5 text-primary" />
              Enterprise Productivity Platform
            </div>
            <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl animate-fade-up [animation-delay:100ms]">
              Understand Your Team{"'"}s{" "}
              <span className="text-gradient">Productivity</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground sm:text-xl animate-fade-up [animation-delay:200ms]">
              WorkPulse helps management gain actionable insights into employee performance through AI-powered analytics, contribution heatmaps, and intelligent reporting.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4 animate-fade-up [animation-delay:300ms]">
              <Button
                size="lg"
                className="group bg-primary text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-300 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0"
                onClick={() => setLoginOpen(true)}
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/50"
                onClick={() => {
                  document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })
                }}
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="border-t border-border bg-card/50">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <Reveal className="mx-auto max-w-2xl text-center">
            <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Everything you need to measure productivity
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              A comprehensive suite of tools designed for modern engineering teams.
            </p>
          </Reveal>

          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <Reveal key={feature.title} delay={i * 90}>
                <Card className="group relative h-full overflow-hidden border-border bg-card transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10">
                  {/* sheen sweep on hover */}
                  <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-primary/5 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                  <CardContent className="relative p-6">
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground">
                      <feature.icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-semibold text-card-foreground">{feature.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </Reveal>
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
            ].map((stat, i) => (
              <Reveal
                key={stat.label}
                delay={i * 100}
                className="group cursor-default rounded-xl px-4 py-6 text-center transition-colors hover:bg-accent/40"
              >
                <p className="text-3xl font-bold text-foreground transition-colors duration-300 group-hover:text-primary sm:text-4xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <WorkPulseLogo
              className="h-6 w-6"
              showWordmark
              wordmarkClassName="text-sm font-medium"
            />
            <p className="text-sm text-muted-foreground">
              2026 WorkPulse. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      <LoginModal open={loginOpen} onOpenChange={setLoginOpen} />
    </div>
  )
}
