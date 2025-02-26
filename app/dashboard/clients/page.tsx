"use client"

import { getClients } from "@/lib/actions"
import { Table, TableHead, TableHeaderCell, TableBody, TableRow, TableCell, Badge, Card } from "@tremor/react"
import { IconPlus } from "@tabler/icons-react"
import Link from "next/link"
import { useEffect, useState } from "react"

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

interface Client {
  id: string
  name: string
  email: string
  stage_id: number
  is_active: boolean
  start_date: string
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])

  useEffect(() => {
    fetchClients()
  }, [])

  async function fetchClients() {
    const data = await getClients()
    setClients(data)
  }

  return (
    <main className="flex-1 p-8">
      <div className="flex flex-col gap-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-900">Clients</h1>
            <p className="text-zinc-500 mt-1">Manage your client onboarding process</p>
          </div>
          <Link href="/dashboard/clients/add">
            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-blue-500 text-white hover:bg-blue-600 h-10 px-4 py-2">
              <IconPlus className="h-5 w-5 mr-2" />
              Add Client
            </button>
          </Link>
        </div>

        <Card>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell>Name</TableHeaderCell>
                <TableHeaderCell>Email</TableHeaderCell>
                <TableHeaderCell>Stage</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Start Date</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {clients.map((client) => {
                const stageName = STAGE_MAPPING[client.stage_id as keyof typeof STAGE_MAPPING]
                const stageColor = STAGE_COLORS[stageName as keyof typeof STAGE_COLORS]

                return (
                  <TableRow key={client.id} className="hover:bg-gray-50">
                    <TableCell>
                      <Link href={`/dashboard/clients/${client.id}`} className="text-blue-600 hover:underline">
                        {client.name}
                      </Link>
                    </TableCell>
                    <TableCell>{client.email}</TableCell>
                    <TableCell>
                      <Badge color={stageColor}>{stageName}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge color={client.is_active ? "emerald" : "gray"}>
                        {client.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(client.start_date).toLocaleDateString()}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </Card>
      </div>
    </main>
  )
}

