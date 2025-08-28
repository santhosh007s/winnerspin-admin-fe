"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CustomerTable } from "@/components/customer-table"
import { ApprovalDialog } from "@/components/approval-dialog"
import { RejectionDialog } from "@/components/rejection-dialog"
import { customerAPI } from "@/lib/api"
import { Clock, CheckCircle, XCircle } from "lucide-react"

interface Customer {
  _id: string
  username: string
  email: string
  cardNo?: string
  status: "pending" | "approved" | "rejected"
  promoterId?: string
  promoterName?: string
  seasonId?: string
  seasonName?: string
  createdAt: string
}

export default function RequestsPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [approvalCustomer, setApprovalCustomer] = useState<Customer | null>(null)
  const [rejectionCustomer, setRejectionCustomer] = useState<Customer | null>(null)

  useEffect(() => {
    fetchNewCustomers()
  }, [])

  const fetchNewCustomers = async () => {
    try {
      setLoading(true)
      const response = await customerAPI.getNew()
      setCustomers(response.customers || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch new customers")
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (customerId: string, promoterId: string, seasonId: string) => {
    try {
      await customerAPI.approve({ customerId, promoterId, seasonId })
      // Remove from pending list
      setCustomers((prev) => prev.filter((c) => c._id !== customerId))
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Failed to approve customer")
    }
  }

  const handleReject = async (customerId: string) => {
    try {
      await customerAPI.reject(customerId)
      // Remove from pending list
      setCustomers((prev) => prev.filter((c) => c._id !== customerId))
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Failed to reject customer")
    }
  }

  const stats = {
    pending: customers.length,
    processed: 0, // This would come from a different endpoint in a real app
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Customer Requests</h1>
        <p className="text-muted-foreground">Review and approve pending customer applications</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">0</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected Today</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">0</div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Requests */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Customer Requests</CardTitle>
          <CardDescription>
            {customers.length === 0
              ? "No pending requests at the moment"
              : "Review and approve customer applications below"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {customers.length === 0 && !loading ? (
            <div className="text-center py-12">
              <CheckCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">All caught up!</h3>
              <p className="text-muted-foreground">No pending customer requests to review.</p>
            </div>
          ) : (
            <CustomerTable
              customers={customers}
              loading={loading}
              onApprove={setApprovalCustomer}
              onReject={setRejectionCustomer}
            />
          )}
        </CardContent>
      </Card>

      {/* Approval Dialog */}
      <ApprovalDialog
        customer={approvalCustomer}
        open={!!approvalCustomer}
        onOpenChange={(open) => !open && setApprovalCustomer(null)}
        onApprove={handleApprove}
      />

      {/* Rejection Dialog */}
      <RejectionDialog
        customer={rejectionCustomer}
        open={!!rejectionCustomer}
        onOpenChange={(open) => !open && setRejectionCustomer(null)}
        onReject={handleReject}
      />

      {error && <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-lg">{error}</div>}
    </div>
  )
}
