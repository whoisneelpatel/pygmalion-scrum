"use client"

import { getClientById, getClientTasks, updateTaskStatus, updateClientStage, checkStageCompletion } from "@/lib/actions"
import { useEffect, useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { Badge } from "@tremor/react"

// Stage ID to name mapping
const STAGE_MAPPING = {
  1: "Initiation",
  2: "Documentation",
  3: "Account Opening",
} as const

// Stage to color mapping
const STAGE_COLORS = {
  Initiation: "blue",
  Documentation: "amber",
  "Account Opening": "green",
} as const

interface Task {
  id: string
  title: string
  completed: boolean
  stage_id: number
}

interface Client {
  id: string
  name: string
  email: string
  stage_id: number
  is_active: boolean
  start_date: string
  tasks?: Task[]
}

export default function ClientDetailsPage({ params }: { params: { id: string } }) {
  const [client, setClient] = useState<Client | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const router = useRouter()

  useEffect(() => {
    fetchClientData()
  }, [])

  async function fetchClientData() {
    const clientData = await getClientById(params.id)
    if (clientData?.client) {
      setClient(clientData.client)
      fetchClientTasks(clientData.client.id)
    }
  }

  async function fetchClientTasks(clientId: string) {
    const tasksData = await getClientTasks(clientId)
    setTasks(tasksData || [])
  }

  async function handleTaskToggle(taskId: string, completed: boolean) {
    if (!client) return

    // Update task status
    await updateTaskStatus(taskId, completed)

    // Update local state immediately
    setTasks((prevTasks) => prevTasks.map((task) => (task.id === taskId ? { ...task, completed } : task)))

    // Check if all tasks in the current stage are completed
    const isStageCompleted = await checkStageCompletion(client.id, client.stage_id)

    if (isStageCompleted && client.stage_id < 3) {
      // Move to next stage
      const nextStageId = client.stage_id + 1
      await updateClientStage(client.id, nextStageId)

      // Update local client state
      setClient((prevClient) => (prevClient ? { ...prevClient, stage_id: nextStageId } : null))
    }
  }

  if (!client) {
    return <div>Loading...</div>
  }

  const stageName = STAGE_MAPPING[client.stage_id as keyof typeof STAGE_MAPPING]
  const stageColor = STAGE_COLORS[stageName as keyof typeof STAGE_COLORS]

  return (
    <main className="flex-1 p-8">
      <div className="max-w-4xl mx-auto">
        <Button variant="outline" size="sm" onClick={() => router.push("/dashboard/clients")} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Clients
        </Button>

        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-900">{client.name}</h1>
            <p className="text-zinc-500 mt-1">{client.email}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge color={stageColor} size="lg">
              {stageName}
            </Badge>
            <Badge color={client.is_active ? "emerald" : "gray"}>{client.is_active ? "Active" : "Inactive"}</Badge>
            <div className="text-sm text-zinc-500 mt-2">Started {new Date(client.start_date).toLocaleDateString()}</div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-zinc-200 p-6">
          <div className="space-y-8">
            {Object.entries(STAGE_MAPPING).map(([stageId, stageName]) => {
              const stageIdNum = Number.parseInt(stageId)
              const stageTasks = tasks.filter((task) => task.stage_id === stageIdNum)
              const isCurrentStage = client.stage_id === stageIdNum
              const isPreviousStage = client.stage_id > stageIdNum
              const completedTasks = stageTasks.filter((task) => task.completed).length
              const progress = stageTasks.length > 0 ? Math.round((completedTasks / stageTasks.length) * 100) : 0

              return (
                <div
                  key={stageId}
                  className={`rounded-lg p-6 ${
                    isCurrentStage
                      ? "bg-blue-50 border border-blue-100"
                      : isPreviousStage
                        ? "bg-gray-50 border border-gray-100"
                        : "bg-white border border-zinc-100"
                  }`}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium text-lg">{stageName}</h3>
                    <span className="text-sm text-zinc-500">
                      {completedTasks} of {stageTasks.length} tasks completed ({progress}%)
                    </span>
                  </div>

                  <div className="space-y-3">
                    {stageTasks.map((task) => (
                      <div key={task.id} className="flex items-start gap-3">
                        <Checkbox
                          id={task.id}
                          checked={task.completed}
                          onCheckedChange={(checked) => handleTaskToggle(task.id, checked as boolean)}
                          className="mt-1"
                        />
                        <label
                          htmlFor={task.id}
                          className={`text-sm flex-1 ${
                            task.completed ? "line-through text-zinc-400" : "text-zinc-900"
                          }`}
                        >
                          {task.title}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </main>
  )
}

