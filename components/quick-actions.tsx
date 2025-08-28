"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, UserPlus, Calendar, CheckCircle } from "lucide-react"

export function QuickActions() {
  const actions = [
    {
      title: "Create Promoter",
      description: "Add a new promoter to the system",
      href: "/admin/promoters?action=create",
      icon: UserPlus,
      color: "bg-blue-500 hover:bg-blue-600",
    },
    {
      title: "Create Season",
      description: "Start a new promotional season",
      href: "/admin/seasons?action=create",
      icon: Calendar,
      color: "bg-green-500 hover:bg-green-600",
    },
    {
      title: "Approve Customers",
      description: "Review pending customer requests",
      href: "/admin/requests",
      icon: CheckCircle,
      color: "bg-orange-500 hover:bg-orange-600",
    },
    {
      title: "Manage Withdrawals",
      description: "Process withdrawal requests",
      href: "/admin/withdrawals",
      icon: Plus,
      color: "bg-purple-500 hover:bg-purple-600",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common administrative tasks</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {actions.map((action) => (
            <Link key={action.title} href={action.href}>
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-start space-y-2 w-full hover:bg-accent bg-transparent"
              >
                <div className="flex items-center space-x-2">
                  <action.icon className="h-4 w-4" />
                  <span className="font-medium">{action.title}</span>
                </div>
                <span className="text-xs text-muted-foreground text-left">{action.description}</span>
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
