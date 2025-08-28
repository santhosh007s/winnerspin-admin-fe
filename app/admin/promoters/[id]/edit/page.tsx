"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { PromoterForm } from "@/components/promoter-form"
import { promoterAPI } from "@/lib/api"

export default function EditPromoterPage() {
  const params = useParams()
  const [promoter, setPromoter] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetchPromoter(params.id as string)
    }
  }, [params.id])

  const fetchPromoter = async (id: string) => {
    try {
      const response = await promoterAPI.getById(id)
      setPromoter(response)
    } catch (err) {
      console.error("Failed to fetch promoter:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (data: any) => {
    await promoterAPI.update(params.id as string, data)
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
        <h1 className="text-3xl font-bold text-foreground">Edit Promoter</h1>
        <p className="text-muted-foreground">Update promoter information</p>
      </div>
      <PromoterForm initialData={promoter} onSubmit={handleSubmit} isEditing />
    </div>
  )
}
