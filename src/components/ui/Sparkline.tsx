import { LineChart, Line, ResponsiveContainer } from "recharts"

interface SparklineProps {
  data: number[]
  color?: string
}

export function Sparkline({ data, color = "#2643e9" }: SparklineProps) {
  const chartData = data.map((value, index) => ({ value, index }))

  return (
    <div className="w-16 h-8">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <Line type="monotone" dataKey="value" stroke={color} strokeWidth={1} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
