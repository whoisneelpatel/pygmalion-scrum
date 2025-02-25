"use client"

import type React from "react"

import { useState } from "react"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import { cn } from "@/lib/utils"
import { IconBrandGithub, IconBrandGoogle } from "@tabler/icons-react"
import Link from "next/link"
import { signUp } from "@/lib/actions"
import { useRouter } from "next/navigation"

export function SignupForm() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      firstName: formData.get("firstname") as string,
      lastName: formData.get("lastname") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    }

    try {
      const result = await signUp(data)
      if (result.success) {
        router.push("/") // Redirect to login page
      } else {
        setError(result.error || "Failed to create account")
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-2xl p-8 shadow-xl">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Create an Account</h2>
        <p className="text-gray-600 mb-6">Join Pygmalion Wealth today</p>

        {error && <div className="mb-4 p-4 text-sm text-red-800 bg-red-100 rounded-lg">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <LabelInputContainer>
              <Label htmlFor="firstname">First name</Label>
              <Input id="firstname" name="firstname" placeholder="John" type="text" required />
            </LabelInputContainer>
            <LabelInputContainer>
              <Label htmlFor="lastname">Last name</Label>
              <Input id="lastname" name="lastname" placeholder="Doe" type="text" required />
            </LabelInputContainer>
          </div>

          <LabelInputContainer>
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" name="email" placeholder="name@example.com" type="email" required />
          </LabelInputContainer>

          <LabelInputContainer>
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" placeholder="••••••••" type="password" required />
          </LabelInputContainer>

          <button
            className={cn(
              "w-full bg-black text-white rounded-md h-10 font-medium mt-4 hover:bg-gray-900 transition-colors",
              loading && "opacity-50 cursor-not-allowed",
            )}
            type="submit"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account →"}
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">or continue with</span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button
              className="flex items-center justify-center gap-2 h-10 w-full border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
              type="button"
            >
              <IconBrandGithub className="h-4 w-4" />
              <span className="text-sm font-medium">Continue with GitHub</span>
            </button>
            <button
              className="flex items-center justify-center gap-2 h-10 w-full border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
              type="button"
            >
              <IconBrandGoogle className="h-4 w-4" />
              <span className="text-sm font-medium">Continue with Google</span>
            </button>
          </div>

          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{" "}
            <Link href="/" className="text-black hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return <div className={cn("flex flex-col space-y-2", className)}>{children}</div>
}

