"use client"

import { useState } from "react"
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
import { Loader2 } from "lucide-react"

interface Customer {
  _id: string
  username: string
  email: string
}

interface RejectionDialogProps {
  customer: Customer | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onReject: (customerId: string) => Promise<void>
}

export function RejectionDialog({ customer, open, onOpenChange, onReject }: RejectionDialogProps) {
  const [loading, setLoading] = useState(false)

  const handleReject = async () => {
    if (!customer) return

    try {
      setLoading(true)
      await onReject(customer._id)
      onOpenChange(false)
    } catch (err) {
      console.error("Failed to reject customer:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Reject Customer</AlertDialogTitle>
          <AlertDialogDescription>
            `Are you sure you want to reject customer ${customer?.username} This 
            customer will be removed from the system.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleReject}
            disabled={loading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Reject Customer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
