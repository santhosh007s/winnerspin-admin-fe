"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PromoterTable } from "@/components/promoter-table"
import { promoterAPI } from "@/lib/api"
import { Plus, Users, UserCheck, UserX } from "lucide-react"

interface Promoter {
  _id: string
  userid: string
  username: string
  email: string
  mobNo: string
  status: "approved" | "pending" | "rejected"
  balance: number
  customers: any[]
}

export default function PromotersPage() {
  const [promoters, setPromoters] = useState<Promoter[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPromoters()
  }, [])

  const fetchPromoters = async () => {
    try {
      setLoading(true)
      const response = await promoterAPI.getAll()
      setPromoters(response.allPromoters || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch promoters")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (promoterId: string) => {
    try {
      await promoterAPI.delete(promoterId)
      setPromoters((prev) => prev.filter((p) => p._id !== promoterId))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete promoter")
    }
  }

  const handleStatusChange = async (promoterId: string, status: string) => {
    try {
      await promoterAPI.update(promoterId, { status })
      setPromoters((prev) => prev.map((p) => (p._id === promoterId ? { ...p, status: status as any } : p)))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update promoter status")
    }
  }

  const stats = {
    total: promoters.length,
    approved: promoters.filter((p) => p.status === "approved").length,
    pending: promoters.filter((p) => p.status === "pending").length,
    rejected: promoters.filter((p) => p.status === "rejected").length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Promoters</h1>
          <p className="text-muted-foreground">Manage your promoter network</p>
        </div>
        <Button asChild>
          <Link href="/admin/promoters/create">
            <Plus className="mr-2 h-4 w-4" />
            Create Promoter
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Promoters</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <UserCheck className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <UserX className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
          </CardContent>
        </Card>
      </div>

      {/* Promoters Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Promoters</CardTitle>
          <CardDescription>View and manage all promoters in your system</CardDescription>
        </CardHeader>
        <CardContent>
          <PromoterTable
            promoters={promoters}
            loading={loading}
            onDelete={handleDelete}
            onStatusChange={handleStatusChange}
          />
        </CardContent>
      </Card>

      {error && <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-lg">{error}</div>}
    </div>
  )
}
