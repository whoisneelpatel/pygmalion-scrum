"use client"

import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

const data = [
  {
    month: "Jan",
    initiation: 40,
    documentation: 24,
    accountOpening: 18,
  },
  {
    month: "Feb",
    initiation: 45,
    documentation: 32,
    accountOpening: 22,
  },
  {
    month: "Mar",
    initiation: 48,
    documentation: 64,
    accountOpening: 33,
  },
]

export function StagesChart() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <AreaChart data={data}>
        <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
        <Tooltip />
        <Area type="monotone" dataKey="initiation" stackId="1" stroke="#2563eb" fill="#3b82f6" fillOpacity={0.2} />
        <Area type="monotone" dataKey="documentation" stackId="1" stroke="#16a34a" fill="#22c55e" fillOpacity={0.2} />
        <Area type="monotone" dataKey="accountOpening" stackId="1" stroke="#9333ea" fill="#a855f7" fillOpacity={0.2} />
      </AreaChart>
    </ResponsiveContainer>
  )
}

