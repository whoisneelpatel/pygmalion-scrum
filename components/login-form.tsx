"use client"

import * as React from "react"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import { cn } from "@/lib/utils"
import { IconBrandGithub, IconBrandGoogle } from "@tabler/icons-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { authenticate } from "@/lib/auth"
import { useFormState, useFormStatus } from "react-dom"

// Server Action
async function loginAction(prevState: any, formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  const result = await authenticate({ email, password })

  if (result.error) {
    console.log("Login error:", result.error)
    return { error: result.error }
  }

  return { success: true }
}

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button
      className="w-full bg-black text-white rounded-md h-10 font-medium mt-4 hover:bg-gray-900 transition-colors disabled:opacity-50"
      type="submit"
      disabled={pending}
    >
      {pending ? "Signing in..." : "Sign in →"}
    </button>
  )
}

export function LoginForm() {
  const router = useRouter()
  const [state, formAction] = useFormState(loginAction, null)

  // Handle successful login
  React.useEffect(() => {
    if (state?.success) {
      router.push("/dashboard")
    }
  }, [state?.success, router])

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-2xl p-8 shadow-xl">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Welcome to Pygmalion Wealth</h2>
        <p className="text-gray-600 mb-6">Sign in to access your account</p>

        <form action={formAction} className="space-y-4">
          <LabelInputContainer>
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" name="email" placeholder="name@example.com" type="email" required />
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" placeholder="••••••••" type="password" required />
          </LabelInputContainer>

          {state?.error && <div className="text-sm text-red-500 dark:text-red-400">{state.error}</div>}

          <SubmitButton />

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">or continue with</span>
            </div>
          </div>


          <p className="text-center text-sm text-gray-600 mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-black hover:underline">
              Sign up
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

