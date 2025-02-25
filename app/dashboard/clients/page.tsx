"use client"

import { getClients } from "@/lib/actions"
import { Table, TableHead, TableHeaderCell, TableBody, TableRow, TableCell, Badge, Button, Card } from "@tremor/react"
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
  id: number
  name: string
  email: string
  stage_id: number
  is_active: boolean
  start_date: string
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])

  useEffect(() => {
    async function fetchClients() {
      const data = await getClients()
      setClients(data)
    }
    fetchClients()
  }, [])

  return (
    <main className="flex-1 p-8">
      <div className="flex flex-col gap-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-900">Clients</h1>
            <p className="text-zinc-500 mt-1">Manage your client onboarding process</p>
          </div>
          <Link href="/dashboard/clients/add">
            <Button className="bg-blue-500 hover:bg-blue-600 text-white">
              <IconPlus className="h-5 w-5" />
              Add Client
            </Button>
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
                  <TableRow key={client.id}>
                    <TableCell>{client.name}</TableCell>
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

