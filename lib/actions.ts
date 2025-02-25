"use server"

import { supabase } from "./supabase"
import { z } from "zod"
import bcrypt from "bcryptjs"

const clientSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  stage_id: z.string().min(1, "Stage is required"),
  is_active: z.boolean(),
  start_date: z.string().min(1, "Start date is required"),
})

export async function createClient(formData: FormData) {
  try {
    // Validate the input
    const validatedFields = clientSchema.parse({
      name: formData.get("name"),
      email: formData.get("email"),
      stage_id: formData.get("stage_id"),
      is_active: formData.get("is_active") === "true",
      start_date: formData.get("start_date"),
    })

    // Insert the new client
    const { data, error } = await supabase
      .from("clients")
      .insert([
        {
          name: validatedFields.name,
          email: validatedFields.email,
          stage_id: Number.parseInt(validatedFields.stage_id),
          is_active: validatedFields.is_active,
          start_date: validatedFields.start_date,
        },
      ])
      .select()

    if (error) {
      console.error("Error creating client:", error)
      return { error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error in createClient:", error)
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message }
    }
    return { error: "Failed to create client" }
  }
}

export async function getClients() {
  const { data, error } = await supabase.from("clients").select("*")

  if (error) {
    console.error("Error fetching clients:", error)
    return []
  }

  return data
}

export async function getStages() {
  const { data, error } = await supabase.from("stages_table").select("id, name, order_number").order("order_number")

  if (error) {
    console.error("Error fetching stages:", error)
    return []
  }

  return data
}

const signUpSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export async function signUp(data: any) {
  try {
    const validatedFields = signUpSchema.parse(data)

    const hashedPassword = await bcrypt.hash(validatedFields.password, 10)

    const { data: insertData, error: insertError } = await supabase
      .from("pygmalion_users")
      .insert([
        {
          email: validatedFields.email.toLowerCase().trim(),
          password_hash: hashedPassword,
          first_name: validatedFields.firstName,
          last_name: validatedFields.lastName,
        },
      ])
      .select()

    if (insertError) {
      console.error("Error creating user:", insertError)
      return { error: "Failed to create user" }
    }

    return { success: true, data: insertData }
  } catch (error) {
    console.error("Error in signUp:", error)
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message }
    }
    return { error: "Failed to create user" }
  }
}

