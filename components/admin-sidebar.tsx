"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import {
  LayoutDashboard,
  Users,
  Calendar,
  UserCheck,
  CreditCard,
  ArrowUpDown,
  BarChart3,
  LogOut,
  Menu,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { logout } from "@/store/authSlice"
import type { RootState } from "@/store/store"

const navigation = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Promoters", href: "/admin/promoters", icon: Users },
  { name: "Seasons", href: "/admin/seasons", icon: Calendar },
  { name: "Customers", href: "/admin/customers", icon: UserCheck },
  { name: "Requests", href: "/admin/requests", icon: UserCheck },
  { name: "Withdrawals", href: "/admin/withdrawals", icon: CreditCard },
  { name: "Transactions", href: "/admin/transactions", icon: ArrowUpDown },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const dispatch = useDispatch()
  const { username } = useSelector((state: RootState) => state.auth)
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => {
    dispatch(logout())
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">Admin Panel</h2>
        <p className="text-sm text-muted-foreground">Welcome, {username}</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent",
              )}
              onClick={() => setMobileOpen(false)}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:bg-card lg:border-r lg:border-border">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden fixed top-4 left-4 z-50">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  )
}
