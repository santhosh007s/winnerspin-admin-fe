"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TransactionTable } from "@/components/transaction-table"
import { TransactionStats } from "@/components/transaction-stats"
import { EarningsSummary } from "@/components/earnings-summary"
import { RecentTransactions } from "@/components/recent-transactions"
import { transactionAPI, seasonAPI, promoterAPI } from "@/lib/api"

interface Transaction {
  id: string
  type: "credit" | "debit"
  amount: number
  from: string
  to: string
  seasonId: string
  seasonName?: string
  promoterId?: string
  promoterName?: string
  customerId?: string
  customerName?: string
  date: string
  description?: string
  status: "completed" | "pending" | "failed"
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [seasons, setSeasons] = useState<any[]>([])
  const [promoters, setPromoters] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [transactionsRes, seasonsRes, promotersRes] = await Promise.all([
        transactionAPI.getAll(),
        seasonAPI.getAll(),
        promoterAPI.getAll(),
      ])

      // Mock transaction data based on the sample response format
      const mockTransactions: Transaction[] = [
        {
          id: "t001",
          type: "credit",
          amount: 1000,
          from: "customer1",
          to: "system",
          seasonId: "S2025",
          seasonName: "Winter 2025",
          promoterId: "p001",
          promoterName: "promoter1",
          date: "2025-08-20",
          status: "completed",
        },
        {
          id: "t002",
          type: "debit",
          amount: 500,
          from: "system",
          to: "promoter1",
          seasonId: "S2025",
          seasonName: "Winter 2025",
          promoterId: "p001",
          promoterName: "promoter1",
          date: "2025-08-22",
          status: "completed",
        },
        {
          id: "t003",
          type: "credit",
          amount: 1500,
          from: "customer2",
          to: "system",
          seasonId: "S2024",
          seasonName: "Fall 2024",
          promoterId: "p002",
          promoterName: "promoter2",
          date: "2025-08-18",
          status: "completed",
        },
        {
          id: "t004",
          type: "debit",
          amount: 750,
          from: "system",
          to: "promoter2",
          seasonId: "S2024",
          seasonName: "Fall 2024",
          promoterId: "p002",
          promoterName: "promoter2",
          date: "2025-08-19",
          status: "pending",
        },
      ]

      setTransactions(mockTransactions)
      setSeasons(seasonsRes.seasons || [])
      setPromoters(promotersRes.allPromoters || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch transaction data")
    } finally {
      setLoading(false)
    }
  }

  // Calculate earnings summaries
  const seasonEarnings = seasons.map((season) => {
    const seasonTransactions = transactions.filter((t) => t.seasonId === season._id)
    const credits = seasonTransactions.filter((t) => t.type === "credit").reduce((sum, t) => sum + t.amount, 0)
    const debits = seasonTransactions.filter((t) => t.type === "debit").reduce((sum, t) => sum + t.amount, 0)
    return {
      seasonName: season.Season,
      totalEarnings: credits - debits,
      credits,
      debits,
    }
  })

  const promoterEarnings = promoters.map((promoter) => {
    const promoterTransactions = transactions.filter((t) => t.promoterId === promoter._id)
    const earnings = promoterTransactions.reduce((sum, t) => sum + (t.type === "credit" ? t.amount : -t.amount), 0)
    return {
      promoterName: promoter.username,
      earnings: Math.abs(earnings),
      transactions: promoterTransactions.length,
    }
  })

  const creditTransactions = transactions.filter((t) => t.type === "credit")
  const debitTransactions = transactions.filter((t) => t.type === "debit")

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Transactions</h1>
        <p className="text-muted-foreground">Track all financial transactions and earnings across the system</p>
      </div>

      {/* Stats */}
      <TransactionStats transactions={transactions} loading={loading} />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Transactions Table */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList>
              <TabsTrigger value="all">All Transactions ({transactions.length})</TabsTrigger>
              <TabsTrigger value="credits">Credits ({creditTransactions.length})</TabsTrigger>
              <TabsTrigger value="debits">Debits ({debitTransactions.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <Card>
                <CardHeader>
                  <CardTitle>All Transactions</CardTitle>
                  <CardDescription>Complete transaction history with filtering options</CardDescription>
                </CardHeader>
                <CardContent>
                  <TransactionTable
                    transactions={transactions}
                    loading={loading}
                    seasons={seasons}
                    promoters={promoters}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="credits">
              <Card>
                <CardHeader>
                  <CardTitle>Credit Transactions</CardTitle>
                  <CardDescription>Money received from customers</CardDescription>
                </CardHeader>
                <CardContent>
                  <TransactionTable
                    transactions={creditTransactions}
                    loading={loading}
                    seasons={seasons}
                    promoters={promoters}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="debits">
              <Card>
                <CardHeader>
                  <CardTitle>Debit Transactions</CardTitle>
                  <CardDescription>Payments made to promoters</CardDescription>
                </CardHeader>
                <CardContent>
                  <TransactionTable
                    transactions={debitTransactions}
                    loading={loading}
                    seasons={seasons}
                    promoters={promoters}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Recent Transactions Sidebar */}
        <div>
          <RecentTransactions transactions={transactions} loading={loading} />
        </div>
      </div>

      {/* Earnings Summary */}
      <EarningsSummary seasonEarnings={seasonEarnings} promoterEarnings={promoterEarnings} loading={loading} />

      {error && <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-lg">{error}</div>}
    </div>
  )
}
