import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./Card"
import { Sparkline } from "./Sparkline"

interface MetricTileProps {
  title: string
  value: string | number
  change?: number
  data?: number[]
  icon?: React.ReactNode
}

export function MetricTile({ title, value, change, data, icon }: MetricTileProps) {
  return (
    <Card className="hover:shadow-xl transition-all duration-300 hover:border-primary/30 group">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
          {title}
        </CardTitle>
        {icon && (
          <div className="text-muted-foreground group-hover:text-primary transition-colors p-2 bg-primary/5 group-hover:bg-primary/10">
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-primary mb-2">{value}</div>
        <div className="flex items-center justify-between">
          {change !== undefined && (
            <div className="flex items-center space-x-1">
              <div className={`w-2 h-2 ${change >= 0 ? "bg-green-500" : "bg-red-500"}`}></div>
              <p className={`text-xs font-medium ${change >= 0 ? "text-green-600" : "text-red-600"}`}>
                {change >= 0 ? "+" : ""}
                {change}%
              </p>
            </div>
          )}
          {data && <Sparkline data={data} />}
        </div>
      </CardContent>
    </Card>
  )
}
