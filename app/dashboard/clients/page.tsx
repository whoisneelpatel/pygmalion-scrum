"use client"

import type React from "react"

import { useState } from "react"
import {
  Table,
  TableHead,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  Badge,
  Button,
  Card,
  Dialog,
  TextInput,
  Select,
  SelectItem,
  Title,
} from "@tremor/react"
import { IconPlus, IconEdit, IconTrash } from "@tabler/icons-react"

// Sample data - replace with your actual data fetching logic
const clients = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    stage: "Initiation",
    status: "Active",
    assignedTo: "Sarah Johnson",
    startDate: "2024-02-20",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    stage: "Documentation",
    status: "Active",
    assignedTo: "Michael Brown",
    startDate: "2024-02-18",
  },
  // Add more sample clients
]

const stages = ["Initiation", "Documentation", "Account Opening"]

export default function ClientsPage() {
  const [isOpen, setIsOpen] = useState(false)
  const [newClient, setNewClient] = useState({
    name: "",
    email: "",
    stage: "Initiation",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle client creation logic here
    setIsOpen(false)
    setNewClient({ name: "", email: "", stage: "Initiation" })
  }

  return (
    <main className="flex-1 p-8">
      <div className="flex flex-col gap-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-900">Clients</h1>
            <p className="text-zinc-500 mt-1">Manage your client onboarding process</p>
          </div>
          <Button icon={IconPlus} onClick={() => setIsOpen(true)} className="bg-blue-500 hover:bg-blue-600 text-white">
            Add Client
          </Button>
        </div>

        <Card>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell>Name</TableHeaderCell>
                <TableHeaderCell>Email</TableHeaderCell>
                <TableHeaderCell>Stage</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Assigned To</TableHeaderCell>
                <TableHeaderCell>Start Date</TableHeaderCell>
                <TableHeaderCell>Actions</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {clients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell>{client.name}</TableCell>
                  <TableCell>{client.email}</TableCell>
                  <TableCell>
                    <Badge
                      color={
                        client.stage === "Initiation" ? "blue" : client.stage === "Documentation" ? "amber" : "green"
                      }
                    >
                      {client.stage}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge color="emerald">{client.status}</Badge>
                  </TableCell>
                  <TableCell>{client.assignedTo}</TableCell>
                  <TableCell>{new Date(client.startDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button icon={IconEdit} variant="light" color="gray" size="xs" />
                      <Button icon={IconTrash} variant="light" color="red" size="xs" />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
          <div className="p-6">
            <Title className="mb-4">Add New Client</Title>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <TextInput
                  placeholder="Enter client's full name"
                  value={newClient.name}
                  onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <TextInput
                  placeholder="Enter client's email"
                  type="email"
                  value={newClient.email}
                  onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Initial Stage</label>
                <Select value={newClient.stage} onValueChange={(value) => setNewClient({ ...newClient, stage: value })}>
                  {stages.map((stage) => (
                    <SelectItem key={stage} value={stage}>
                      {stage}
                    </SelectItem>
                  ))}
                </Select>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <Button variant="light" color="gray" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white">
                  Add Client
                </Button>
              </div>
            </form>
          </div>
        </Dialog>
      </div>
    </main>
  )
}

