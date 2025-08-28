"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Search, Users, UserCheck } from "lucide-react"

interface Promoter {
  _id: string
  userid: string
  username: string
  email: string
  status: "approved" | "pending" | "rejected"
}

interface PromoterSelectorProps {
  promoters: Promoter[]
  selectedPromoters: string[]
  onSelectionChange: (selected: string[]) => void
  previousSeasonPromoters?: string[]
}

export function PromoterSelector({
  promoters,
  selectedPromoters,
  onSelectionChange,
  previousSeasonPromoters = [],
}: PromoterSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [showOnlyApproved, setShowOnlyApproved] = useState(true)

  // Auto-fill from previous season on component mount
  useEffect(() => {
    if (previousSeasonPromoters.length > 0 && selectedPromoters.length === 0) {
      onSelectionChange(previousSeasonPromoters)
    }
  }, [previousSeasonPromoters, selectedPromoters.length, onSelectionChange])

  const filteredPromoters = promoters.filter((promoter) => {
    const matchesSearch =
      promoter.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      promoter.userid?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      promoter.email?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = showOnlyApproved ? promoter.status === "approved" : true

    return matchesSearch && matchesStatus
  })

  const handlePromoterToggle = (promoterId: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedPromoters, promoterId])
    } else {
      onSelectionChange(selectedPromoters.filter((id) => id !== promoterId))
    }
  }

  const handleSelectAll = () => {
    const allApprovedIds = filteredPromoters.map((p) => p._id)
    onSelectionChange(allApprovedIds)
  }

  const handleClearAll = () => {
    onSelectionChange([])
  }

  const handleAutoFillPrevious = () => {
    onSelectionChange(previousSeasonPromoters)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Select Approved Promoters
            </CardTitle>
            <CardDescription>Choose which promoters can participate in this season</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{selectedPromoters.length} selected</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search promoters..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleSelectAll}>
              Select All
            </Button>
            <Button variant="outline" size="sm" onClick={handleClearAll}>
              Clear All
            </Button>
            {previousSeasonPromoters.length > 0 && (
              <Button variant="outline" size="sm" onClick={handleAutoFillPrevious}>
                Use Previous Season
              </Button>
            )}
          </div>
        </div>

        {/* Filter */}
        <div className="flex items-center space-x-2">
          <Checkbox id="approved-only" checked={showOnlyApproved} onCheckedChange={setShowOnlyApproved} />
          <label htmlFor="approved-only" className="text-sm font-medium">
            Show only approved promoters
          </label>
        </div>

        {/* Promoter List */}
        <div className="border rounded-lg max-h-96 overflow-y-auto">
          {filteredPromoters.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">No promoters found matching your criteria</div>
          ) : (
            <div className="divide-y">
              {filteredPromoters.map((promoter) => (
                <div key={promoter._id} className="flex items-center space-x-3 p-4">
                  <Checkbox
                    id={promoter._id}
                    checked={selectedPromoters.includes(promoter._id)}
                    onCheckedChange={(checked) => handlePromoterToggle(promoter._id, checked as boolean)}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">{promoter.username}</p>
                      <Badge
                        variant="secondary"
                        className={
                          promoter.status === "approved"
                            ? "bg-green-100 text-green-800"
                            : promoter.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }
                      >
                        {promoter.status}
                      </Badge>
                      {previousSeasonPromoters.includes(promoter._id) && (
                        <Badge variant="outline" className="text-xs">
                          Previous Season
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{promoter.email}</p>
                    <p className="text-xs text-muted-foreground">ID: {promoter.userid}</p>
                  </div>
                  <UserCheck className="h-4 w-4 text-muted-foreground" />
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
