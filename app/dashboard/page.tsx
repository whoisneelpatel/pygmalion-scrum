"use client"

import { Card, LineChart, BarChart, type Color, Flex, Metric, Text, Title, Badge } from "@tremor/react"
import { IconUsers, IconUserCheck, IconForms, IconFileCheck } from "@tabler/icons-react"

const metrics = [
  {
    title: "Total Onboarding",
    value: "145",
    icon: IconUsers,
    description: "Total clients in onboarding process",
    color: "blue" as Color,
  },
  {
    title: "Initiation Stage",
    value: "48",
    icon: IconUserCheck,
    description: "Clients in initial meetings and formalities",
    color: "emerald" as Color,
  },
  {
    title: "Documentation",
    value: "64",
    icon: IconForms,
    description: "Clients in KYC and documentation phase",
    color: "amber" as Color,
  },
  {
    title: "Account Opening",
    value: "33",
    icon: IconFileCheck,
    description: "Clients in final account opening stage",
    color: "rose" as Color,
  },
]

const clientData = [
  {
    date: "Jan 23",
    "Clients Onboarded": 45,
  },
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
    "Number of Clients": 48,
  },
  {
    stage: "Documentation",
    "Number of Clients": 64,
  },
  {
    stage: "Account Opening",
    "Number of Clients": 33,
  },
]

export default function DashboardPage() {
  return (
    <main className="flex-1 p-8">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">Overview</h1>
          <p className="text-zinc-500 mt-1">Monitor client onboarding progress and performance</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric) => (
            <Card key={metric.title} decoration="top" decorationColor={metric.color}>
              <Flex justifyContent="between" alignItems="center">
                <Text>{metric.title}</Text>
                <Badge color={metric.color}>
                  <metric.icon className="h-4 w-4" />
                </Badge>
              </Flex>
              <Metric className="mt-2">{metric.value}</Metric>
              <Text className="mt-2 text-xs">{metric.description}</Text>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <Title>Clients Onboarded Over Time</Title>
            <LineChart
              className="mt-6 h-80"
              data={clientData}
              index="date"
              categories={["Clients Onboarded"]}
              colors={["blue"]}
              yAxisWidth={40}
              showAnimation
              showLegend={false}
            />
          </Card>
          <Card>
            <Title>Client Stage Distribution</Title>
            <BarChart
              className="mt-6 h-80"
              data={stageData}
              index="stage"
              categories={["Number of Clients"]}
              colors={["blue"]}
              yAxisWidth={40}
              showAnimation
              showLegend={false}
            />
          </Card>
        </div>
      </div>
    </main>
  )
}

