"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface EarningsChartProps {
  data: Array<{
    season: string
    earnings: number
    month: string
  }>
  loading?: boolean
}

export function EarningsChart({ data, loading }: EarningsChartProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Season Earnings Trend</CardTitle>
          <CardDescription>Monthly earnings across seasons</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full bg-muted animate-pulse rounded" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Season Earnings Trend</CardTitle>
        <CardDescription>Monthly earnings across seasons</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => [`$${value}`, "Earnings"]} labelFormatter={(label) => `Month: ${label}`} />
            <Line
              type="monotone"
              dataKey="earnings"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{ fill: "hsl(var(--primary))" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
