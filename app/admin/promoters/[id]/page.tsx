"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { promoterAPI } from "@/lib/api"
import { ArrowLeft, Edit, Mail, Phone, DollarSign, Users } from "lucide-react"

interface Promoter {
  _id: string
  userid: string
  username: string
  email: string
  mobNo: string
  status: "approved" | "pending" | "rejected"
  balance: number
  customers: any[]
  createdAt?: string
  updatedAt?: string
}

export default function PromoterDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [promoter, setPromoter] = useState<Promoter | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (params.id) {
      fetchPromoter(params.id as string)
    }
  }, [params.id])

  const fetchPromoter = async (id: string) => {
    try {
      setLoading(true)
      const response = await promoterAPI.getById(id)
      setPromoter(response.promoter)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch promoter")
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

  if (error || !promoter) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div className="text-center py-12">
          <p className="text-muted-foreground">{error || "Promoter not found"}</p>
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
            <h1 className="text-3xl font-bold text-foreground">{promoter.username}</h1>
            <p className="text-muted-foreground">Promoter ID: {promoter.userid}</p>
          </div>
        </div>
        <Button asChild>
          <Link href={`/admin/promoters/${promoter._id}/edit`}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Promoter
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Promoter Information</CardTitle>
              <CardDescription>Basic details and contact information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{promoter.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Mobile Number</p>
                      <p className="font-medium">{promoter.mobNo}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge variant="secondary" className={getStatusColor(promoter.status)}>
                      {promoter.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Current Balance</p>
                      <p className="font-medium text-lg">${promoter.balance.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Total Customers</span>
                </div>
                <span className="font-bold text-lg">{promoter.customers.length}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Account Balance</span>
                <span className="font-medium">${promoter.balance.toLocaleString()}</span>
              </div>
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
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <DollarSign className="mr-2 h-4 w-4" />
                Adjust Balance
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Users className="mr-2 h-4 w-4" />
                View Customers
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
