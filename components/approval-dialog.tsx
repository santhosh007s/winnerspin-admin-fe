"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { promoterAPI, seasonAPI } from "@/lib/api"
import { Loader2 } from "lucide-react"

interface Customer {
  _id: string
  username: string
  email: string
  cardNo?: string
  status: string
}

interface ApprovalDialogProps {
  customer: Customer | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onApprove: (customerId: string, promoterId: string, seasonId: string) => Promise<void>
}

export function ApprovalDialog({ customer, open, onOpenChange, onApprove }: ApprovalDialogProps) {
  const [promoters, setPromoters] = useState<any[]>([])
  const [seasons, setSeasons] = useState<any[]>([])
  const [selectedPromoter, setSelectedPromoter] = useState("")
  const [selectedSeason, setSelectedSeason] = useState("")
  const [loading, setLoading] = useState(false)
  const [dataLoading, setDataLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      fetchData()
      setSelectedPromoter("")
      setSelectedSeason("")
      setError(null)
    }
  }, [open])

  const fetchData = async () => {
    try {
      setDataLoading(true)
      const [promotersRes, seasonsRes] = await Promise.all([promoterAPI.getAll(), seasonAPI.getAll()])

      // Only show approved promoters
      const approvedPromoters = promotersRes.approvedPromoters || []
      setPromoters(approvedPromoters)
      setSeasons(seasonsRes.seasons || [])
    } catch (err) {
      setError("Failed to load promoters and seasons")
    } finally {
      setDataLoading(false)
    }
  }

  const handleApprove = async () => {
    if (!customer || !selectedPromoter || !selectedSeason) {
      setError("Please select both a promoter and season")
      return
    }

    try {
      setLoading(true)
      setError(null)
      await onApprove(customer._id, selectedPromoter, selectedSeason)
      onOpenChange(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to approve customer")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Approve Customer</DialogTitle>
          <DialogDescription>
            Assign customer "{customer?.username}" to a promoter and season. This will update the promoter's balance.
          </DialogDescription>
        </DialogHeader>

        {dataLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="promoter">Select Promoter</Label>
              <Select value={selectedPromoter} onValueChange={setSelectedPromoter}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a promoter" />
                </SelectTrigger>
                <SelectContent>
                  {promoters.map((promoter) => (
                    <SelectItem key={promoter._id} value={promoter._id}>
                      {promoter.username} ({promoter.userid}) - Balance: ${promoter.balance.toLocaleString()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="season">Select Season</Label>
              <Select value={selectedSeason} onValueChange={setSelectedSeason}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a season" />
                </SelectTrigger>
                <SelectContent>
                  {seasons.map((season) => (
                    <SelectItem key={season._id} value={season._id}>
                      {season.Season} (${season.amount.toLocaleString()})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleApprove} disabled={loading || !selectedPromoter || !selectedSeason}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Approve Customer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
