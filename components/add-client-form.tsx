"use client"

import type React from "react"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/actions"
import { useRouter } from "next/navigation"

const PREDEFINED_STAGES = ["Initiation", "Documentation", "Account Opening"]

const STAGE_MAPPING = {
  Initiation: 1,
  Documentation: 2,
  "Account Opening": 3,
} as const

export function AddClientForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedStageName, setSelectedStageName] = useState(PREDEFINED_STAGES[0])
  const [isActive, setIsActive] = useState(true)
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      // Get the stage_id based on the selected stage name
      const stageId = STAGE_MAPPING[selectedStageName as keyof typeof STAGE_MAPPING]
      formData.set("stage_id", stageId.toString())
      formData.set("is_active", isActive.toString())
      formData.set("start_date", startDate)

      const result = await createClient(formData)

      if (result.error) {
        setError(result.error)
      } else {
        router.push("/dashboard/clients")
        router.refresh()
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">{error}</div>}

      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input id="name" name="name" placeholder="Enter client's full name" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input id="email" name="email" type="email" placeholder="client@example.com" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="stage">Stage</Label>
        <select
          id="stage"
          name="stage"
          value={selectedStageName}
          onChange={(e) => setSelectedStageName(e.target.value)}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {PREDEFINED_STAGES.map((stageName) => (
            <option key={stageName} value={stageName}>
              {stageName}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="start_date">Start Date</Label>
        <Input
          id="start_date"
          name="start_date"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />
      </div>

      <div className="flex items-center space-x-2">
        <button
          type="button"
          role="switch"
          aria-checked={isActive}
          onClick={() => setIsActive(!isActive)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
            isActive ? "bg-black" : "bg-gray-200"
          }`}
        >
          <span
            className={`${
              isActive ? "translate-x-5" : "translate-x-0"
            } inline-block h-5 w-5 transform rounded-full bg-white transition-transform`}
          />
        </button>
        <Label htmlFor="is_active" className="cursor-pointer" onClick={() => setIsActive(!isActive)}>
          Active Client
        </Label>
      </div>

      <button
        type="submit"
        className="w-full bg-black text-white rounded-lg h-10 font-medium hover:bg-zinc-900 transition-colors disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Creating..." : "Create Client"}
      </button>
    </form>
  )
}

