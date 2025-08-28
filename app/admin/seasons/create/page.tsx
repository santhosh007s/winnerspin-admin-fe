"use client"

import { SeasonForm } from "@/components/season-form"
import { seasonAPI } from "@/lib/api"

export default function CreateSeasonPage() {
  const handleSubmit = async (data: any) => {
    await seasonAPI.create(data)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Create Season</h1>
        <p className="text-muted-foreground">Set up a new promotional season with approved promoters</p>
      </div>
      <SeasonForm onSubmit={handleSubmit} />
    </div>
  )
}
