"use client"

import React from "react"

// Shared labeled-input field used across auth forms. Encapsulates the
// label + icon + input + recurring Tailwind classes so each field collapses
// to a single <Field /> call. It is a controlled input, so pass value/onChange.
const AuthField = ({
  id,
  name,
  type = "text",
  label,
  icon,
  value,
  onChange,
  placeholder,
  autoComplete,
  required = false,
  variant = "card", // "card" uses bg-surface-card (login/forgot/reset), "surface" uses bg-surface (signup)
  labelExtra, // optional element rendered to the right of the label (e.g. a link)
  children, // optional extra content rendered under the input (e.g. password strength)
}) => {
  const inputBg = variant === "surface" ? "bg-surface" : "bg-surface-card"

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label
          htmlFor={id}
          className="block text-sm font-semibold tracking-wide text-on-surface"
        >
          {label}
        </label>
        {labelExtra}
      </div>
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-outline">
            {icon}
          </div>
        )}
        <input
          id={id}
          name={name}
          type={type}
          required={required}
          autoComplete={autoComplete}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`block w-full ${
            icon ? "pl-11" : "pl-4"
          } pr-4 py-2 border border-outline-variant rounded-lg ${inputBg} text-on-surface text-base input-glow transition-all duration-200 outline-none`}
        />
      </div>
      {children}
    </div>
  )
}

export default AuthField
