"use client"

import { getClients } from "@/lib/actions"
import { IconUsers, IconUserCheck, IconForms, IconFileCheck } from "@tabler/icons-react"
import { LineChart, BarChart } from "@tremor/react"
import { useEffect, useState } from "react"

interface Client {
  id: number
  name: string
  email: string
  stage_id: number
  is_active: boolean
  start_date: string
}

interface Metrics {
  total: number
  initiation: number
  documentation: number
  accountOpening: number
}

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<Metrics>({
    total: 0,
    initiation: 0,
    documentation: 0,
    accountOpening: 0,
  })

  useEffect(() => {
    async function fetchAndCalculateMetrics() {
      const clients = await getClients()

      // Calculate metrics
      const calculatedMetrics = clients.reduce(
        (acc: Metrics, client: Client) => {
          acc.total += 1

          switch (client.stage_id) {
            case 1: // Initiation
              acc.initiation += 1
              break
            case 2: // Documentation
              acc.documentation += 1
              break
            case 3: // Account Opening
              acc.accountOpening += 1
              break
          }

          return acc
        },
        {
          total: 0,
          initiation: 0,
          documentation: 0,
          accountOpening: 0,
        },
      )

      setMetrics(calculatedMetrics)
    }

    fetchAndCalculateMetrics()
  }, [])

  const metricsConfig = [
    {
      title: "Total Onboarding",
      value: metrics.total.toString(),
      icon: IconUsers,
      description: "Total clients in onboarding process",
      color: "blue",
    },
    {
      title: "Initiation Stage",
      value: metrics.initiation.toString(),
      icon: IconUserCheck,
      description: "Clients in initial meetings and formalities",
      color: "emerald",
    },
    {
      title: "Documentation",
      value: metrics.documentation.toString(),
      icon: IconForms,
      description: "Clients in KYC and documentation phase",
      color: "amber",
    },
    {
      title: "Account Opening",
      value: metrics.accountOpening.toString(),
      icon: IconFileCheck,
      description: "Clients in final account opening stage",
      color: "rose",
    },
  ]

  const clientData = [
    {
      date: "Jan 23",
      "Clients Onboarded": metrics.total,
    },
    // Keep the sample data for the chart for now
    {
      date: "Feb 23",
      "Clients Onboarded": 78,
    },
    {
      date: "Mar 23",
      "Clients Onboarded": 112,
    },
    {
      date: "Apr 23",
      "Clients Onboarded": 145,
    },
  ]

  const stageData = [
    {
      stage: "Initiation",
      "Number of Clients": metrics.initiation,
    },
    {
      stage: "Documentation",
      "Number of Clients": metrics.documentation,
    },
    {
      stage: "Account Opening",
      "Number of Clients": metrics.accountOpening,
    },
  ]

  return (
    <main className="flex-1 p-8">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">Overview</h1>
          <p className="text-zinc-500 mt-1">Monitor client onboarding progress and performance</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {metricsConfig.map((metric) => (
            <div key={metric.title} className="bg-white rounded-xl p-6 shadow-sm border border-zinc-200">
              <div className="flex items-center justify-between">
                <p className="text-sm text-zinc-600">{metric.title}</p>
                <div className={`w-8 h-8 rounded-lg bg-${metric.color}-50 flex items-center justify-center`}>
                  <metric.icon className={`w-5 h-5 text-${metric.color}-500`} />
                </div>
              </div>
              <p className="text-2xl font-semibold mt-2 text-zinc-900">{metric.value}</p>
              <p className="text-xs text-zinc-500 mt-1">{metric.description}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-zinc-200">
            <h3 className="font-medium mb-4">Clients Onboarded Over Time</h3>
            <LineChart
              className="h-80"
              data={clientData}
              index="date"
              categories={["Clients Onboarded"]}
              colors={["blue"]}
              showAnimation
              showLegend={false}
              showGridLines={false}
              showYAxis={false}
              curveType="monotone"
            />
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-zinc-200">
            <h3 className="font-medium mb-4">Client Stage Distribution</h3>
            <BarChart
              className="h-80"
              data={stageData}
              index="stage"
              categories={["Number of Clients"]}
              colors={["blue"]}
              showAnimation
              showLegend={false}
              showGridLines={false}
              showYAxis={false}
            />
          </div>
        </div>
      </div>
    </main>
  )
}

