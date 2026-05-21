"use client"

import type { ForecastResponse } from "@/lib/weather-api"

interface WeatherForecastProps {
  forecast: ForecastResponse
}

export function WeatherForecast({ forecast }: WeatherForecastProps) {
  const days = forecast.forecast.forecastday

  return (
    <div className="w-full max-w-lg mx-auto mt-6">
      <div className="bg-card/60 backdrop-blur-md border border-border/30 rounded-3xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-foreground mb-4">Pronostico</h3>
        
        <div className="space-y-3">
          {days.map((day) => {
            const date = new Date(day.date)
            const dayName = date.toLocaleDateString("es-ES", { weekday: "short" })
            const dayNumber = date.getDate()
            
            return (
              <div
                key={day.date}
                className="flex items-center justify-between p-3 rounded-xl bg-muted/30"
              >
                <div className="flex items-center gap-3 min-w-[100px]">
                  <span className="text-sm font-medium capitalize">{dayName}</span>
                  <span className="text-sm text-muted-foreground">{dayNumber}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  {day.day.condition.icon && (
                    <img
                      src={`https:${day.day.condition.icon}`}
                      alt={day.day.condition.text}
                      className="w-10 h-10"
                    />
                  )}
                  <span className="text-xs text-muted-foreground max-w-[80px] truncate">
                    {day.day.condition.text}
                  </span>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">
                    {Math.round(day.day.maxtemp_c)}°
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {Math.round(day.day.mintemp_c)}°
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
