"use client"

import { Brain, TrendingUp, AlertCircle, Lightbulb } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import type { AIReport } from "@/lib/types"

interface AIReviewCardProps {
  report: AIReport | undefined
}

export function AIReviewCard({ report }: AIReviewCardProps) {
  if (!report) {
    return (
      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-semibold text-card-foreground">
            <Brain className="h-4 w-4 text-primary" />
            AI Weekly Review
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No AI review available for this week yet. Reviews are generated weekly.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-base font-semibold text-card-foreground">
          <span className="flex items-center gap-2">
            <Brain className="h-4 w-4 text-primary" />
            AI Weekly Review
          </span>
          <Badge variant="secondary" className="text-xs">
            {report.weekStartDate} - {report.weekEndDate}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        {/* Quality Score */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Quality Score</span>
            <span className="font-semibold text-card-foreground">{report.qualityScore}/100</span>
          </div>
          <Progress value={report.qualityScore} className="h-2" />
        </div>

        {/* Summary */}
        <div>
          <p className="text-sm leading-relaxed text-muted-foreground">{report.summary}</p>
        </div>

        {/* Strengths */}
        <div>
          <h4 className="mb-2 flex items-center gap-1.5 text-sm font-medium text-card-foreground">
            <TrendingUp className="h-3.5 w-3.5 text-success" />
            Strengths
          </h4>
          <ul className="flex flex-col gap-1">
            {report.strengths.map((s) => (
              <li key={s} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-success" />
                {s}
              </li>
            ))}
          </ul>
        </div>

        {/* Areas of Improvement */}
        <div>
          <h4 className="mb-2 flex items-center gap-1.5 text-sm font-medium text-card-foreground">
            <AlertCircle className="h-3.5 w-3.5 text-warning" />
            Areas for Improvement
          </h4>
          <ul className="flex flex-col gap-1">
            {report.areasOfImprovement.map((a) => (
              <li key={a} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-warning" />
                {a}
              </li>
            ))}
          </ul>
        </div>

        {/* Recommendations */}
        <div>
          <h4 className="mb-2 flex items-center gap-1.5 text-sm font-medium text-card-foreground">
            <Lightbulb className="h-3.5 w-3.5 text-primary" />
            Recommendations
          </h4>
          <ul className="flex flex-col gap-1">
            {report.recommendations.map((r) => (
              <li key={r} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                {r}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
