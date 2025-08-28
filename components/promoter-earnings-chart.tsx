"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface PromoterEarningsChartProps {
  data: Array<{
    promoter: string
    earnings: number
    customers: number
  }>
  loading?: boolean
}

export function PromoterEarningsChart({ data, loading }: PromoterEarningsChartProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top Promoters by Earnings</CardTitle>
          <CardDescription>Promoter performance this season</CardDescription>
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
        <CardTitle>Top Promoters by Earnings</CardTitle>
        <CardDescription>Promoter performance this season</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="promoter" />
            <YAxis />
            <Tooltip
              formatter={(value, name) => [
                name === "earnings" ? `$${value}` : value,
                name === "earnings" ? "Earnings" : "Customers",
              ]}
            />
            <Bar dataKey="earnings" fill="hsl(var(--primary))" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
