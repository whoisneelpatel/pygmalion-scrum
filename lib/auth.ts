import { z } from "zod"
import { supabase } from "./supabase"
import bcrypt from "bcryptjs"

// Schema for login validation
export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export type LoginFormInput = z.infer<typeof loginSchema>

export async function authenticate(credentials: LoginFormInput) {
  try {
    // Validate the input
    loginSchema.parse(credentials)

    try {
      // Query the pygmalion_users table
      const { data, error: queryError } = await supabase
        .from("pygmalion_users")
        .select("id, email, password_hash, first_name, last_name")
        .eq("email", credentials.email.toLowerCase().trim())

      if (queryError) {
        console.error("Database Query Error:", queryError)
        throw new Error(queryError.message)
      }

      if (!data || data.length === 0) {
        console.log("No user found with this email")
        return { error: "Invalid email or password" }
      }

      const user = data[0]

      // Use bcrypt to compare the passwords
      const passwordMatches = await bcrypt.compare(credentials.password, user.password_hash)

      if (!passwordMatches) {
        console.log("Password mismatch")
        return { error: "Invalid email or password" }
      }

      // Create a session token
      const token = Buffer.from(
        JSON.stringify({
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
        }),
      ).toString("base64")

      // Set cookie using client-side JavaScript
      document.cookie = `auth-token=${token}; path=/; max-age=${24 * 60 * 60}; SameSite=Lax`

      console.log("Login successful")
      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
        },
      }
    } catch (dbError) {
      console.error("Database Error:", dbError)
      throw new Error("Database operation failed")
    }
  } catch (error) {
    console.error("Authentication Error:", error)
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message }
    }
    return { error: "An unexpected error occurred" }
  }
}

export function getCurrentUser() {
  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("auth-token="))
    ?.split("=")[1]

  if (!token) {
    return null
  }

  try {
    const userData = JSON.parse(Buffer.from(token, "base64").toString())

    // Check if token is expired
    if (userData.exp < Date.now()) {
      // Clear the expired cookie
      document.cookie = "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
      return null
    }

    return userData
  } catch (error) {
    console.error("Error parsing auth token:", error)
    return null
  }
}

export function signOut() {
  document.cookie = "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
}

