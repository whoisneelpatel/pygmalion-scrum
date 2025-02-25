"use client"

import { Card, Table, TableHead, TableHeaderCell, TableBody, TableRow, TableCell, Badge, Text } from "@tremor/react"

// Sample data - replace with your actual data fetching logic
const tasks = [
  {
    id: 1,
    title: "Review KYC Documents",
    client: "John Doe",
    priority: "High",
    status: "Pending",
    deadline: "2024-02-28",
  },
  {
    id: 2,
    title: "Schedule Initial Meeting",
    client: "Jane Smith",
    priority: "Medium",
    status: "In Progress",
    deadline: "2024-02-26",
  },
  {
    id: 3,
    title: "Complete Account Setup",
    client: "Robert Johnson",
    priority: "Low",
    status: "Completed",
    deadline: "2024-02-24",
  },
  // Add more sample tasks
]

const priorityColors = {
  High: "rose",
  Medium: "amber",
  Low: "emerald",
} as const

const statusColors = {
  Pending: "gray",
  "In Progress": "blue",
  Completed: "emerald",
} as const

export default function TasksPage() {
  // Replace with actual user data
  const userName = "Sarah"

  return (
    <main className="flex-1 p-8">
      <div className="flex flex-col gap-6 max-w-7xl mx-auto">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">Welcome, {userName}</h1>
          <p className="text-zinc-500 mt-1">Here are your assigned tasks for client onboarding</p>
        </div>

        <Card>
          <div className="mb-4">
            <Text>Your Tasks</Text>
          </div>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell>Task</TableHeaderCell>
                <TableHeaderCell>Client</TableHeaderCell>
                <TableHeaderCell>Priority</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Deadline</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>{task.title}</TableCell>
                  <TableCell>{task.client}</TableCell>
                  <TableCell>
                    <Badge color={priorityColors[task.priority as keyof typeof priorityColors]}>{task.priority}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge color={statusColors[task.status as keyof typeof statusColors]}>{task.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <Text>{new Date(task.deadline).toLocaleDateString()}</Text>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </main>
  )
}

