"use client"

import { useState, useEffect, useRef } from "react"
import { Search, MapPin } from "lucide-react"
import { Input } from "@/components/ui/input"
import type { SearchLocation } from "@/lib/weather-api"

interface WeatherSearchProps {
  onSelectCity: (city: string) => void
}

export function WeatherSearch({ onSelectCity }: WeatherSearchProps) {
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<SearchLocation[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    const searchCities = async () => {
      if (query.length < 2) {
        setSuggestions([])
        return
      }

      setIsLoading(true)
      try {
        const response = await fetch(`/api/weather/search?q=${encodeURIComponent(query)}`)
        if (response.ok) {
          const data = await response.json()
          setSuggestions(data)
          setIsOpen(true)
        }
      } catch (error) {
        console.error("Error searching cities:", error)
      } finally {
        setIsLoading(false)
      }
    }

    const debounce = setTimeout(searchCities, 300)
    return () => clearTimeout(debounce)
  }, [query])

  const handleSelect = (location: SearchLocation) => {
    const cityName = `${location.name}, ${location.country}`
    setQuery(cityName)
    setIsOpen(false)
    onSelectCity(location.name)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && query.length >= 2) {
      setIsOpen(false)
      onSelectCity(query)
    }
  }

  return (
    <div ref={wrapperRef} className="relative w-full max-w-md mx-auto">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Buscar ciudad..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => suggestions.length > 0 && setIsOpen(true)}
          className="pl-12 pr-4 h-14 text-lg rounded-2xl border-border/50 bg-card/50 backdrop-blur-sm focus:bg-card transition-all"
        />
        {isLoading && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <div className="h-5 w-5 border-2 border-muted-foreground/30 border-t-muted-foreground rounded-full animate-spin" />
          </div>
        )}
      </div>

      {isOpen && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border/50 rounded-xl shadow-lg overflow-hidden z-50">
          {suggestions.map((location, index) => (
            <button
              key={`${location.name}-${location.lat}-${location.lon}-${index}`}
              onClick={() => handleSelect(location)}
              className="w-full px-4 py-3 flex items-center gap-3 hover:bg-muted/50 transition-colors text-left"
            >
              <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <div>
                <span className="font-medium">{location.name}</span>
                <span className="text-muted-foreground ml-1">
                  {location.region && `${location.region}, `}{location.country}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
