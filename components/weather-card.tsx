"use client"

import { Cloud, Droplets, Wind, Thermometer, Eye, Gauge } from "lucide-react"
import type { WeatherResponse } from "@/lib/weather-api"

interface WeatherCardProps {
  weather: WeatherResponse
}

export function WeatherCard({ weather }: WeatherCardProps) {
  const { location, current } = weather

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="bg-card/60 backdrop-blur-md border border-border/30 rounded-3xl p-8 shadow-sm">
        {/* Location Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-foreground">{location.name}</h2>
          <p className="text-muted-foreground">
            {location.region && `${location.region}, `}{location.country}
          </p>
          <p className="text-xs text-muted-foreground/70 mt-1">
            Actualizado: {current.is_day ? "Dia" : "Noche"}, {location.localtime.split(" ")[1]}
          </p>
        </div>

        {/* Main Temperature */}
        <div className="flex items-center justify-center gap-6 mb-8">
          <div className="relative">
            {current.condition.icon && (
              <img
                src={`https:${current.condition.icon}`}
                alt={current.condition.text}
                className="w-24 h-24"
              />
            )}
          </div>
          <div>
            <div className="text-7xl font-light tracking-tighter text-foreground">
              {Math.round(current.temp_c)}
              <span className="text-3xl align-top">°</span>
            </div>
            <p className="text-muted-foreground text-center">{current.condition.text}</p>
          </div>
        </div>

        {/* Feels Like */}
        <div className="flex items-center justify-center gap-2 mb-8 text-muted-foreground">
          <Thermometer className="h-4 w-4" />
          <span>Sensacion termica: {Math.round(current.feelslike_c)}°C</span>
        </div>

        {/* Weather Details Grid */}
        <div className="grid grid-cols-2 gap-4">
          <WeatherDetail
            icon={<Droplets className="h-5 w-5" />}
            label="Humedad"
            value={`${current.humidity}%`}
          />
          <WeatherDetail
            icon={<Wind className="h-5 w-5" />}
            label="Viento"
            value={`${current.wind_kph} km/h`}
          />
          <WeatherDetail
            icon={<Eye className="h-5 w-5" />}
            label="Visibilidad"
            value={`${current.vis_km} km`}
          />
          <WeatherDetail
            icon={<Cloud className="h-5 w-5" />}
            label="Nubosidad"
            value={`${current.cloud}%`}
          />
          <WeatherDetail
            icon={<Droplets className="h-5 w-5" />}
            label="Precipitacion"
            value={`${current.condition} mm`}
          />
        </div>
      </div>
    </div>
  )
}

function WeatherDetail({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">
      <div className="text-muted-foreground">{icon}</div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-medium text-foreground">{value}</p>
      </div>
    </div>
  )
}
