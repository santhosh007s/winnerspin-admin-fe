"use client"

import { useState, useEffect } from "react"
import { StatsCards } from "@/components/stats-cards"
import { EarningsChart } from "@/components/earnings-chart"
import { PromoterEarningsChart } from "@/components/promoter-earnings-chart"
import { RecentActivity } from "@/components/recent-activity"
import { QuickActions } from "@/components/quick-actions"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data for demonstration
const mockStats = {
  totalPromoters: 45,
  totalCustomers: 1250,
  pendingApprovals: 12,
  pendingWithdrawals: 8,
}

const mockEarningsData = [
  { season: "Summer 2024", earnings: 15000, month: "Jun" },
  { season: "Summer 2024", earnings: 18000, month: "Jul" },
  { season: "Summer 2024", earnings: 22000, month: "Aug" },
  { season: "Fall 2024", earnings: 16000, month: "Sep" },
  { season: "Fall 2024", earnings: 19000, month: "Oct" },
  { season: "Fall 2024", earnings: 25000, month: "Nov" },
]

const mockPromoterData = [
  { promoter: "John D.", earnings: 5200, customers: 15 },
  { promoter: "Sarah M.", earnings: 4800, customers: 12 },
  { promoter: "Mike R.", earnings: 4200, customers: 10 },
  { promoter: "Lisa K.", earnings: 3900, customers: 9 },
  { promoter: "Tom B.", earnings: 3500, customers: 8 },
]

const mockActivities = [
  {
    id: "1",
    type: "customer_approval" as const,
    description: "New customer approval request from promoter John D.",
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    status: "pending" as const,
  },
  {
    id: "2",
    type: "withdrawal_request" as const,
    description: "Withdrawal request of $500 from Sarah M.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    status: "approved" as const,
  },
  {
    id: "3",
    type: "promoter_signup" as const,
    description: "New promoter registration: Alex Johnson",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    status: "approved" as const,
  },
  {
    id: "4",
    type: "season_created" as const,
    description: "Winter 2025 season created with 25 approved promoters",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
]

export default function DashboardPage() {
  const [selectedSeason, setSelectedSeason] = useState("all")
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState(mockStats)
  const [earningsData, setEarningsData] = useState(mockEarningsData)
  const [promoterData, setPromoterData] = useState(mockPromoterData)
  const [activities, setActivities] = useState(mockActivities)

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true)
      try {
        // In a real implementation, these would fetch from actual APIs
        // const [statsRes, earningsRes, promotersRes] = await Promise.all([
        //   dashboardAPI.getStats(),
        //   dashboardAPI.getSeasonEarnings(),
        //   dashboardAPI.getAllPromoters(),
        // ])

        // For now, using mock data with a delay to simulate API calls
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // setStats(statsRes)
        // setEarningsData(earningsRes.data)
        // setPromoterData(promotersRes.topPromoters)
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [selectedSeason])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your MLM system performance</p>
        </div>
        <Select value={selectedSeason} onValueChange={setSelectedSeason}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select season" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Seasons</SelectItem>
            <SelectItem value="winter2025">Winter 2025</SelectItem>
            <SelectItem value="fall2024">Fall 2024</SelectItem>
            <SelectItem value="summer2024">Summer 2024</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Cards */}
      <StatsCards stats={stats} loading={loading} />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EarningsChart data={earningsData} loading={loading} />
        <PromoterEarningsChart data={promoterData} loading={loading} />
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity activities={activities} loading={loading} />
        <QuickActions />
      </div>
    </div>
  )
}
