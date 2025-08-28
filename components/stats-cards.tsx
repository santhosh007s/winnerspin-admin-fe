"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UserCheck, Clock, CreditCard } from "lucide-react"

interface StatsCardsProps {
  stats: {
    totalPromoters: number
    totalCustomers: number
    pendingApprovals: number
    pendingWithdrawals: number
  }
  loading?: boolean
}

export function StatsCards({ stats, loading }: StatsCardsProps) {
  const cards = [
    {
      title: "Total Promoters",
      value: stats.totalPromoters,
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Total Customers",
      value: stats.totalCustomers,
      icon: UserCheck,
      color: "text-green-600",
    },
    {
      title: "Pending Approvals",
      value: stats.pendingApprovals,
      icon: Clock,
      color: "text-orange-600",
    },
    {
      title: "Pending Withdrawals",
      value: stats.pendingWithdrawals,
      icon: CreditCard,
      color: "text-purple-600",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
            <card.icon className={`h-4 w-4 ${card.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? <div className="h-8 w-16 bg-muted animate-pulse rounded" /> : card.value.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
