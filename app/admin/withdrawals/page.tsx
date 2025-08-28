"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WithdrawalTable } from "@/components/withdrawal-table"
import { WithdrawalStats } from "@/components/withdrawal-stats"
import { RecentWithdrawals } from "@/components/recent-withdrawals"
import { withdrawalAPI, promoterAPI } from "@/lib/api"

interface Withdrawal {
  _id: string
  promoterId: string
  promoterName?: string
  promoterUsername?: string
  amount: number
  status: "pending" | "approved" | "rejected"
  requestDate: string
  processedDate?: string
  notes?: string
}

export default function WithdrawalsPage() {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchWithdrawals()
  }, [])

  const fetchWithdrawals = async () => {
    try {
      setLoading(true)
      const [withdrawalsRes, promotersRes] = await Promise.all([withdrawalAPI.getAll(), promoterAPI.getAll()])

      // Enrich withdrawals with promoter information
      const enrichedWithdrawals = (withdrawalsRes.withdraw || []).map((withdrawal: any) => {
        const promoter = promotersRes.allPromoters?.find((p: any) => p._id === withdrawal.promoterId)
        return {
          ...withdrawal,
          promoterName: promoter?.username || "Unknown",
          promoterUsername: promoter?.username || "Unknown",
          requestDate: withdrawal.createdAt || new Date().toISOString(),
        }
      })

      setWithdrawals(enrichedWithdrawals)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch withdrawals")
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (withdrawalId: string) => {
    try {
      await withdrawalAPI.update(withdrawalId, "approved")
      setWithdrawals((prev) =>
        prev.map((w) =>
          w._id === withdrawalId ? { ...w, status: "approved" as const, processedDate: new Date().toISOString() } : w,
        ),
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to approve withdrawal")
    }
  }

  const handleReject = async (withdrawalId: string) => {
    try {
      await withdrawalAPI.update(withdrawalId, "rejected")
      setWithdrawals((prev) =>
        prev.map((w) =>
          w._id === withdrawalId ? { ...w, status: "rejected" as const, processedDate: new Date().toISOString() } : w,
        ),
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reject withdrawal")
    }
  }

  const pendingWithdrawals = withdrawals.filter((w) => w.status === "pending")
  const processedWithdrawals = withdrawals.filter((w) => w.status !== "pending")

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Withdrawals</h1>
        <p className="text-muted-foreground">Manage promoter withdrawal requests and payment processing</p>
      </div>

      {/* Stats */}
      <WithdrawalStats withdrawals={withdrawals} loading={loading} />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Withdrawals Table */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="pending" className="space-y-4">
            <TabsList>
              <TabsTrigger value="pending">Pending ({pendingWithdrawals.length})</TabsTrigger>
              <TabsTrigger value="all">All Withdrawals ({withdrawals.length})</TabsTrigger>
              <TabsTrigger value="processed">Processed ({processedWithdrawals.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="pending">
              <Card>
                <CardHeader>
                  <CardTitle>Pending Withdrawals</CardTitle>
                  <CardDescription>Withdrawal requests awaiting approval</CardDescription>
                </CardHeader>
                <CardContent>
                  <WithdrawalTable
                    withdrawals={pendingWithdrawals}
                    loading={loading}
                    onApprove={handleApprove}
                    onReject={handleReject}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="all">
              <Card>
                <CardHeader>
                  <CardTitle>All Withdrawals</CardTitle>
                  <CardDescription>Complete withdrawal history</CardDescription>
                </CardHeader>
                <CardContent>
                  <WithdrawalTable
                    withdrawals={withdrawals}
                    loading={loading}
                    onApprove={handleApprove}
                    onReject={handleReject}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="processed">
              <Card>
                <CardHeader>
                  <CardTitle>Processed Withdrawals</CardTitle>
                  <CardDescription>Approved and rejected withdrawal requests</CardDescription>
                </CardHeader>
                <CardContent>
                  <WithdrawalTable
                    withdrawals={processedWithdrawals}
                    loading={loading}
                    onApprove={handleApprove}
                    onReject={handleReject}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Recent Withdrawals Sidebar */}
        <div>
          <RecentWithdrawals
            withdrawals={pendingWithdrawals}
            loading={loading}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        </div>
      </div>

      {error && <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-lg">{error}</div>}
    </div>
  )
}
