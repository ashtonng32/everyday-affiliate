"use client"

import * as React from "react"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import { Input, InputProps } from "./input"
import { cn } from "@/lib/utils"

export interface PasswordInputProps extends Omit<InputProps, 'type'> {
  showPasswordLabel?: string
  hidePasswordLabel?: string
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, showPasswordLabel = "Show password", hidePasswordLabel = "Hide password", ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false)

    return (
      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          className={cn("pr-10", className)}
          ref={ref}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-0 top-0 flex h-full items-center justify-center px-3 text-gray-400 hover:text-gray-600"
          aria-label={showPassword ? hidePasswordLabel : showPasswordLabel}
        >
          {showPassword ? (
            <EyeOffIcon className="h-4 w-4" />
          ) : (
            <EyeIcon className="h-4 w-4" />
          )}
        </button>
      </div>
    )
  }
)
PasswordInput.displayName = "PasswordInput"

export { PasswordInput }
