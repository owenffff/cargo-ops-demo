"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Ship, FileText, Settings, LogOut, Mail } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Emails", href: "/emails", icon: Mail },
  { name: "Shipments", href: "/shipments", icon: Ship },
  { name: "Documents", href: "/documents", icon: FileText },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex flex-col w-20 bg-white border-r border-gray-200 h-screen fixed left-0 top-0">
      {/* Logo */}
      <div className="flex items-center justify-center h-16 border-b border-gray-200">
        <Image src="/images/sscpl-logo.png" alt="SSCPL" width={48} height={48} className="w-12 h-12 object-contain" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col items-center gap-2 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-16 h-16 rounded-lg transition-colors",
                isActive ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
              )}
              title={item.name}
            >
              <item.icon className="w-6 h-6" />
              <span className="text-xs mt-1">{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* Bottom actions */}
      <div className="flex flex-col items-center gap-2 py-4 border-t border-gray-200">
        <Link
          href="/settings"
          className={cn(
            "flex items-center justify-center w-12 h-12 rounded-lg transition-colors",
            pathname === "/settings"
              ? "bg-blue-50 text-blue-600"
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
          )}
          title="Settings"
        >
          <Settings className="w-6 h-6" />
        </Link>
        <button
          className="flex items-center justify-center w-12 h-12 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
          title="Logout"
        >
          <LogOut className="w-6 h-6" />
        </button>
      </div>
    </div>
  )
}
