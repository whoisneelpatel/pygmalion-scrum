"use client"

import { AreaChart } from "@tremor/react"

const chartdata = [
  {
    date: "Jan 23",
    Initiation: 40,
    Documentation: 24,
    "Account Opening": 18,
  },
  {
    date: "Feb 23",
    Initiation: 45,
    Documentation: 32,
    "Account Opening": 22,
  },
  {
    date: "Mar 23",
    Initiation: 48,
    Documentation: 64,
    "Account Opening": 33,
  },
  {
    date: "Apr 23",
    Initiation: 52,
    Documentation: 58,
    "Account Opening": 38,
  },
  {
    date: "May 23",
    Initiation: 46,
    Documentation: 49,
    "Account Opening": 42,
  },
]

const valueFormatter = (number: number) => `${number}`

export function StageDistribution() {
  return (
    <div className="mt-4">
      <AreaChart
        className="h-80"
        data={chartdata}
        index="date"
        categories={["Initiation", "Documentation", "Account Opening"]}
        colors={["blue", "green", "purple"]}
        valueFormatter={valueFormatter}
        showLegend
        stack
      />
    </div>
  )
}

