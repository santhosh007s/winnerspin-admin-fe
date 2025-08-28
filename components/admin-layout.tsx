"use client"

import type React from "react"

import { AdminSidebar } from "./admin-sidebar"
import { AuthGuard } from "@/components/auth-guard"

interface AdminLayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <AdminSidebar />
        <div className="lg:pl-64">
          <main className="p-4 lg:p-8">{children}</main>
        </div>
      </div>
    </AuthGuard>
  )
}
