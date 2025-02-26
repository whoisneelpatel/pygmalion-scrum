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

export async function getClientById(id: string) {
  const { data: client, error: clientError } = await supabase.from("clients").select("*").eq("id", id).single()

  if (clientError) {
    console.error("Error fetching client:", clientError)
    return null
  }

  // Fetch checklist items with their completion status for this client
  const { data: checklistItems, error: checklistError } = await supabase
    .from("checklist_items")
    .select(`
      id,
      title,
      stage,
      order_number,
      client_checklist!left (
        completed,
        completed_at
      )
    `)
    .order("stage")
    .order("order_number")

  if (checklistError) {
    console.error("Error fetching checklist:", checklistError)
    return null
  }

  return {
    client,
    checklist: checklistItems.map((item) => ({
      ...item,
      completed: item.client_checklist?.[0]?.completed || false,
      completed_at: item.client_checklist?.[0]?.completed_at || null,
    })),
  }
}

export async function toggleChecklistItem(clientId: number, itemId: number, completed: boolean) {
  const { data, error } = await supabase
    .from("client_checklist")
    .upsert(
      {
        client_id: clientId,
        checklist_item_id: itemId,
        completed,
        completed_at: completed ? new Date().toISOString() : null,
      },
      {
        onConflict: "client_id,checklist_item_id",
      },
    )
    .select()

  if (error) {
    console.error("Error updating checklist item:", error)
    return { error: error.message }
  }

  return { success: true, data }
}

export async function getClientTasks(clientId: string) {
  const { data, error } = await supabase.from("tasks").select("*").eq("client_id", clientId).order("stage_id")

  if (error) {
    console.error("Error fetching tasks:", error)
    return []
  }

  return data
}

export async function updateTaskStatus(taskId: string, completed: boolean) {
  const { data, error } = await supabase.from("tasks").update({ completed }).eq("id", taskId).select()

  if (error) {
    console.error("Error updating task:", error)
    return { error: error.message }
  }

  return { success: true, data }
}

export async function updateClientStage(clientId: string, newStageId: number) {
  const { data, error } = await supabase.from("clients").update({ stage_id: newStageId }).eq("id", clientId).select()

  if (error) {
    console.error("Error updating client stage:", error)
    return { error: error.message }
  }

  return { success: true, data }
}

export async function checkStageCompletion(clientId: string, stageId: number) {
  // Get all tasks for the client in the current stage
  const { data: tasks, error } = await supabase
    .from("tasks")
    .select("completed")
    .eq("client_id", clientId)
    .eq("stage_id", stageId)

  if (error) {
    console.error("Error checking stage completion:", error)
    return false
  }

  // Check if all tasks are completed
  return tasks.every((task) => task.completed)
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

