"use client"

import { Bell, User } from "lucide-react"
import { LocalStorage } from "@/lib/storage"
import { useEffect, useState } from "react"
import Image from "next/image"

export function Header() {
  const [user, setUser] = useState({ name: "Ryan", role: "Admin" })
  const [alertCount, setAlertCount] = useState(0)

  useEffect(() => {
    const currentUser = LocalStorage.getCurrentUser()
    setUser(currentUser)

    const alerts = LocalStorage.getAlerts()
    setAlertCount(alerts.filter((a) => !a.dismissed).length)
  }, [])

  return (
    <header className="h-16 bg-blue-600 border-b border-blue-700 flex items-center justify-between px-4 md:px-6 fixed top-0 left-20 right-0 z-50">
      <div className="flex items-center gap-3">
        <Image
          src="/images/sscpl-logo.png"
          alt="Singapore Shipping Corporation Limited"
          width={200}
          height={60}
          className="h-10 w-auto"
        />
        <div className="hidden md:flex flex-col justify-center">
          <div className="text-white font-semibold text-base leading-tight">
            Singapore Shipping
          </div>
          <div className="text-white font-semibold text-base leading-tight">
            Corporation Limited
          </div>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative p-2 text-white hover:bg-white/10 rounded-lg transition-colors">
          <Bell className="w-5 h-5" />
          {alertCount > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />}
        </button>

        {/* User */}
        <div className="flex items-center gap-3 pl-4 border-l border-white/20">
          <div className="text-right">
            <div className="text-sm font-medium text-white">{user.name}</div>
            <div className="text-xs text-white/80">{user.role}</div>
          </div>
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>
    </header>
  )
}
