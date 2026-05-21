"use client"

import { useState } from "react"
import { CloudSun } from "lucide-react"
import { WeatherSearch } from "@/components/weather-search"
import { WeatherCard } from "@/components/weather-card"
import { WeatherForecast } from "@/components/weather-forecast"
import type { WeatherResponse, ForecastResponse } from "@/lib/weather-api"

export default function Home() {
  const [weather, setWeather] = useState<WeatherResponse | null>(null)
  const [forecast, setForecast] = useState<ForecastResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSelectCity = async (city: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const [weatherRes, forecastRes] = await Promise.all([
        fetch(`/api/weather?city=${encodeURIComponent(city)}`),
        fetch(`/api/weather/forecast?city=${encodeURIComponent(city)}&days=5`),
      ])

      if (!weatherRes.ok || !forecastRes.ok) {
        throw new Error("No se pudo obtener el clima")
      }

      const [weatherData, forecastData] = await Promise.all([
        weatherRes.json(),
        forecastRes.json(),
      ])

      setWeather(weatherData)
      setForecast(forecastData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al obtener el clima")
      setWeather(null)
      setForecast(null)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Subtle gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-muted/30 via-background to-muted/20 -z-10" />
      
      <div className="container mx-auto px-4 py-12 md:py-20">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <CloudSun className="h-10 w-10 text-foreground" strokeWidth={1.5} />
            <h1 className="text-4xl md:text-5xl font-light tracking-tight text-foreground">
              Clima
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Consulta el clima en cualquier ciudad del mundo
          </p>
        </header>

        {/* Search */}
        <section className="mb-12">
          <WeatherSearch onSelectCity={handleSelectCity} />
        </section>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <div className="h-12 w-12 border-2 border-muted-foreground/20 border-t-foreground rounded-full animate-spin" />
              <p className="text-muted-foreground">Obteniendo clima...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="max-w-md mx-auto text-center py-12">
            <div className="bg-destructive/10 text-destructive rounded-2xl p-6">
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* Weather Display */}
        {weather && !isLoading && (
          <div className="animate-in fade-in duration-500">
            <WeatherCard weather={weather} />
            {forecast && <WeatherForecast forecast={forecast} />}
          </div>
        )}

        {/* Empty State */}
        {!weather && !isLoading && !error && (
          <div className="text-center py-20">
            <CloudSun className="h-20 w-20 mx-auto text-muted-foreground/30 mb-6" strokeWidth={1} />
            <p className="text-muted-foreground text-lg">
              Busca una ciudad para ver su clima
            </p>
          </div>
        )}
      </div>
    </main>
  )
}
