"use client"

import React from "react"
import { Check } from "lucide-react"

// Live password-strength meter shown under a new-password field.
export default function PasswordStrength({ password }) {
  const checks = [
    { label: "8+ characters", ok: password.length >= 8 },
    { label: "Uppercase", ok: /[A-Z]/.test(password) },
    { label: "Lowercase", ok: /[a-z]/.test(password) },
    { label: "Number", ok: /\d/.test(password) },
  ]

  const passed = checks.filter((c) => c.ok).length
  const strength = passed === 0 ? 0 : Math.round((passed / checks.length) * 100)
  const barColor =
    strength === 0
      ? "bg-outline-variant"
      : strength <= 50
        ? "bg-red-500"
        : strength <= 75
          ? "bg-amber-500"
          : "bg-green-500"

  return (
    <div className="mt-2 space-y-2">
      <div className="h-1.5 w-full rounded-full bg-outline-variant/40 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${barColor}`}
          style={{ width: `${strength}%` }}
        />
      </div>
      <ul className="grid grid-cols-2 gap-x-4 gap-y-1">
        {checks.map((check) => (
          <li
            key={check.label}
            className={`flex items-center gap-1.5 text-xs transition-colors ${
              check.ok ? "text-green-600" : "text-outline"
            }`}
          >
            {check.ok ? (
              <Check className="w-3.5 h-3.5" />
            ) : (
              <span className="w-3.5 h-3.5 inline-block" />
            )}
            {check.label}
          </li>
        ))}
      </ul>
    </div>
  )
}
