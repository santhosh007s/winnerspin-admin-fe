"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

interface EarningsSummaryProps {
  seasonEarnings: Array<{
    seasonName: string
    totalEarnings: number
    credits: number
    debits: number
  }>
  promoterEarnings: Array<{
    promoterName: string
    earnings: number
    transactions: number
  }>
  loading?: boolean
}

const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))"]

export function EarningsSummary({ seasonEarnings, promoterEarnings, loading }: EarningsSummaryProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Season Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full bg-muted animate-pulse rounded" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Top Promoters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full bg-muted animate-pulse rounded" />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Season Earnings Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Earnings by Season</CardTitle>
          <CardDescription>Revenue breakdown across different seasons</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={seasonEarnings}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="seasonName" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value}`, "Earnings"]} />
              <Bar dataKey="totalEarnings" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Promoters Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Top Promoters by Earnings</CardTitle>
          <CardDescription>Highest earning promoters distribution</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={promoterEarnings.slice(0, 4)}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: $${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="earnings"
              >
                {promoterEarnings.slice(0, 4).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`$${value}`, "Earnings"]} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
