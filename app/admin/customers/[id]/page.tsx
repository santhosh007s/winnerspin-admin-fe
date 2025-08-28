"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { customerAPI } from "@/lib/api"
import { ArrowLeft, Mail, CreditCard, User, Calendar } from "lucide-react"

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
  approvedAt?: string
}

export default function CustomerDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (params.id) {
      fetchCustomer(params.id as string)
    }
  }, [params.id])

  const fetchCustomer = async (id: string) => {
    try {
      setLoading(true)
      const response = await customerAPI.getById(id)
      setCustomer(response.customer)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch customer")
    } finally {
      setLoading(false)
    }
  }

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

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted animate-pulse rounded w-1/3" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="h-64 bg-muted animate-pulse rounded" />
          </div>
          <div className="h-64 bg-muted animate-pulse rounded" />
        </div>
      </div>
    )
  }

  if (error || !customer) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div className="text-center py-12">
          <p className="text-muted-foreground">{error || "Customer not found"}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{customer.username}</h1>
            <p className="text-muted-foreground">Customer Details</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
              <CardDescription>Basic details and contact information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{customer.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Card Number</p>
                      <p className="font-medium">{customer.cardNo || "Not provided"}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge variant="secondary" className={getStatusColor(customer.status)}>
                      {customer.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Registration Date</p>
                      <p className="font-medium">{new Date(customer.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              {customer.status === "approved" && (
                <>
                  <Separator />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center gap-3">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Assigned Promoter</p>
                        <p className="font-medium">{customer.promoterName || "Not assigned"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Season</p>
                        <p className="font-medium">{customer.seasonName || "Not assigned"}</p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Stats & Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Current Status</span>
                <Badge variant="secondary" className={getStatusColor(customer.status)}>
                  {customer.status}
                </Badge>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Registration Date</span>
                <span className="font-medium text-sm">{new Date(customer.createdAt).toLocaleDateString()}</span>
              </div>
              {customer.approvedAt && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Approved Date</span>
                  <span className="font-medium text-sm">{new Date(customer.approvedAt).toLocaleDateString()}</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Mail className="mr-2 h-4 w-4" />
                Send Email
              </Button>
              {customer.status === "approved" && (
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <User className="mr-2 h-4 w-4" />
                  View Promoter
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
