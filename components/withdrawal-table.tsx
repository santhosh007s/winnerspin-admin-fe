"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import { MoreHorizontal, Eye, Check, X, Search } from "lucide-react"

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

interface WithdrawalTableProps {
  withdrawals: Withdrawal[]
  loading?: boolean
  onApprove: (withdrawalId: string) => void
  onReject: (withdrawalId: string) => void
}

export function WithdrawalTable({ withdrawals, loading, onApprove, onReject }: WithdrawalTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [actionWithdrawal, setActionWithdrawal] = useState<{
    withdrawal: Withdrawal
    action: "approve" | "reject"
  } | null>(null)

  const filteredWithdrawals = withdrawals.filter((withdrawal) => {
    const matchesSearch =
      withdrawal.promoterUsername?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      withdrawal.promoterName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      withdrawal.amount.toString().includes(searchTerm)

    const matchesStatus = statusFilter === "all" || withdrawal.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleAction = () => {
    if (!actionWithdrawal) return

    if (actionWithdrawal.action === "approve") {
      onApprove(actionWithdrawal.withdrawal._id)
    } else {
      onReject(actionWithdrawal.withdrawal._id)
    }
    setActionWithdrawal(null)
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex gap-4">
          <div className="h-10 bg-muted animate-pulse rounded flex-1" />
          <div className="h-10 bg-muted animate-pulse rounded w-32" />
        </div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-muted animate-pulse rounded" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by promoter name or amount..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Promoter</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Request Date</TableHead>
              <TableHead>Processed Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredWithdrawals.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No withdrawals found
                </TableCell>
              </TableRow>
            ) : (
              filteredWithdrawals.map((withdrawal) => (
                <TableRow key={withdrawal._id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{withdrawal.promoterUsername || "Unknown"}</p>
                      <p className="text-sm text-muted-foreground">
                        {withdrawal.promoterName || withdrawal.promoterId}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">${withdrawal.amount.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={getStatusColor(withdrawal.status)}>
                      {withdrawal.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(withdrawal.requestDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {withdrawal.processedDate ? new Date(withdrawal.processedDate).toLocaleDateString() : "N/A"}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        {withdrawal.status === "pending" && (
                          <>
                            <DropdownMenuItem
                              className="text-green-600"
                              onClick={() => setActionWithdrawal({ withdrawal, action: "approve" })}
                            >
                              <Check className="mr-2 h-4 w-4" />
                              Approve
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => setActionWithdrawal({ withdrawal, action: "reject" })}
                            >
                              <X className="mr-2 h-4 w-4" />
                              Reject
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination placeholder */}
      {filteredWithdrawals.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Showing {filteredWithdrawals.length} withdrawals</p>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled>
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Action Confirmation Dialog */}
      <AlertDialog open={!!actionWithdrawal} onOpenChange={() => setActionWithdrawal(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionWithdrawal?.action === "approve" ? "Approve Withdrawal" : "Reject Withdrawal"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to {actionWithdrawal?.action} the withdrawal request of $
              {actionWithdrawal?.withdrawal.amount.toLocaleString()} from{" "}
              {actionWithdrawal?.withdrawal.promoterUsername}?
              {actionWithdrawal?.action === "approve" && " This will process the payment to the promoter."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleAction}
              className={
                actionWithdrawal?.action === "approve"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-destructive text-destructive-foreground hover:bg-destructive/90"
              }
            >
              {actionWithdrawal?.action === "approve" ? "Approve" : "Reject"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
