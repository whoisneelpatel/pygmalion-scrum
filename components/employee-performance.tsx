"use client"

import { BarChart } from "@tremor/react"

const chartdata = [
  {
    name: "John Smith",
    "Clients Onboarded": 12,
  },
  {
    name: "Sarah Johnson",
    "Clients Onboarded": 18,
  },
  {
    name: "Michael Brown",
    "Clients Onboarded": 8,
  },
  {
    name: "Emily Davis",
    "Clients Onboarded": 15,
  },
  {
    name: "David Wilson",
    "Clients Onboarded": 10,
  },
]

const dataFormatter = (number: number) => {
  return Intl.NumberFormat("us").format(number).toString()
}

export function EmployeePerformance() {
  return (
    <div className="mt-4">
      <BarChart
        className="h-80"
        data={chartdata}
        index="name"
        categories={["Clients Onboarded"]}
        colors={["blue"]}
        valueFormatter={dataFormatter}
        yAxisWidth={48}
      />
    </div>
  )
}

