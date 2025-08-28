"use client"

import { useState } from "react"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { MoreHorizontal, Eye, Edit, Trash2, Search } from "lucide-react"
import { format } from "date-fns"

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

interface SeasonTableProps {
  seasons: Season[]
  loading?: boolean
  onDelete: (seasonId: string) => void
}

export function SeasonTable({ seasons, loading, onDelete }: SeasonTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [deleteSeason, setDeleteSeason] = useState<Season | null>(null)

  const filteredSeasons = seasons.filter((season) => season.Season.toLowerCase().includes(searchTerm.toLowerCase()))

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "upcoming":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
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

  const handleDelete = () => {
    if (deleteSeason) {
      onDelete(deleteSeason._id)
      setDeleteSeason(null)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-10 bg-muted animate-pulse rounded" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-muted animate-pulse rounded" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search seasons..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Season Name</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Promoters</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSeasons.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No seasons found
                </TableCell>
              </TableRow>
            ) : (
              filteredSeasons.map((season) => {
                const status = getSeasonStatus(season.startDate, season.endDate)
                return (
                  <TableRow key={season._id}>
                    <TableCell className="font-medium">{season.Season}</TableCell>
                    <TableCell>{format(new Date(season.startDate), "MMM dd, yyyy")}</TableCell>
                    <TableCell>{format(new Date(season.endDate), "MMM dd, yyyy")}</TableCell>
                    <TableCell>${season.amount.toLocaleString()}</TableCell>
                    <TableCell>{season.approvedPromoters.length}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={getStatusColor(status)}>
                        {status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/seasons/${season._id}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/seasons/${season._id}/edit`}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={() => setDeleteSeason(season)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteSeason} onOpenChange={() => setDeleteSeason(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Season</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete season "{deleteSeason?.Season}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
