"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { SeasonForm } from "@/components/season-form"
import { seasonAPI } from "@/lib/api"

export default function EditSeasonPage() {
  const params = useParams()
  const [season, setSeason] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetchSeason(params.id as string)
    }
  }, [params.id])

  const fetchSeason = async (id: string) => {
    try {
      const response = await seasonAPI.getById(id)
      setSeason(response)
    } catch (err) {
      console.error("Failed to fetch season:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (data: any) => {
    await seasonAPI.update(params.id as string, data)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted animate-pulse rounded w-1/3" />
        <div className="h-96 bg-muted animate-pulse rounded" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Edit Season</h1>
        <p className="text-muted-foreground">Update season information and promoter assignments</p>
      </div>
      <SeasonForm initialData={season} onSubmit={handleSubmit} isEditing />
    </div>
  )
}
