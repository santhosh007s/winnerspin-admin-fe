"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SeasonTable } from "@/components/season-table"
import { seasonAPI } from "@/lib/api"
import { Plus, Calendar, Play, Clock, CheckCircle } from "lucide-react"

interface Season {
  _id: string
  Season: string
  startDate: string
  endDate: string
  amount: number
  approvedPromoters: string[]
  status: "active" | "upcoming" | "completed"
  createdAt: string
}

export default function SeasonsPage() {
  const [seasons, setSeasons] = useState<Season[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchSeasons()
  }, [])

  const fetchSeasons = async () => {
    try {
      setLoading(true)
      const response = await seasonAPI.getAll()
      setSeasons(response.seasons || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch seasons")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (seasonId: string) => {
    try {
      await seasonAPI.delete(seasonId)
      setSeasons((prev) => prev.filter((s) => s._id !== seasonId))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete season")
    }
  }

  const getSeasonStatus = (startDate: string, endDate: string) => {
    const now = new Date()
    const start = new Date(startDate)
    const end = new Date(endDate)

    if (now < start) return "upcoming"
    if (now > end) return "completed"
    return "active"
  }

  const stats = {
    total: seasons.length,
    active: seasons.filter((s) => getSeasonStatus(s.startDate, s.endDate) === "active").length,
    upcoming: seasons.filter((s) => getSeasonStatus(s.startDate, s.endDate) === "upcoming").length,
    completed: seasons.filter((s) => getSeasonStatus(s.startDate, s.endDate) === "completed").length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Seasons</h1>
          <p className="text-muted-foreground">Manage promotional seasons and promoter assignments</p>
        </div>
        <Button asChild>
          <Link href="/admin/seasons/create">
            <Plus className="mr-2 h-4 w-4" />
            Create Season
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Seasons</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <Play className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.upcoming}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{stats.completed}</div>
          </CardContent>
        </Card>
      </div>

      {/* Seasons Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Seasons</CardTitle>
          <CardDescription>View and manage all promotional seasons</CardDescription>
        </CardHeader>
        <CardContent>
          <SeasonTable seasons={seasons} loading={loading} onDelete={handleDelete} />
        </CardContent>
      </Card>

      {error && <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-lg">{error}</div>}
    </div>
  )
}
