"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/store/store"
import { loadFromStorage } from "@/store/authSlice"

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const dispatch = useDispatch()
  const router = useRouter()
  const { isAuthenticated, token } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    dispatch(loadFromStorage())
  }, [dispatch])

  useEffect(() => {
    if (!isAuthenticated && !token) {
      router.push("/login")
    }
  }, [isAuthenticated, token, router])

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return <>{children}</>
}
