// Weather API utility functions
// API Documentation: https://www.weatherapi.com/docs/

const API_BASE_URL = "https://api.weatherapi.com/v1";

export interface WeatherLocation {
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
  localtime: string;
}

export interface WeatherCondition {
  text: string;
  icon: string;
  code: number;
}

export interface CurrentWeather {
  temp_c: number;
  temp_f: number;
  is_day: number;
  condition: WeatherCondition;
  wind_mph: number;
  wind_kph: number;
  wind_dir: string;
  humidity: number;
  cloud: number;
  feelslike_c: number;
  feelslike_f: number;
  uv: number;
  vis_km: number;
}

export interface WeatherResponse {
  location: WeatherLocation;
  current: CurrentWeather;
}

export interface ForecastDay {
  date: string;
  day: {
    maxtemp_c: number;
    maxtemp_f: number;
    mintemp_c: number;
    mintemp_f: number;
    avgtemp_c: number;
    avgtemp_f: number;
    condition: WeatherCondition;
    daily_chance_of_rain: number;
  };
}

export interface ForecastResponse {
  location: WeatherLocation;
  current: CurrentWeather;
  forecast: {
    forecastday: ForecastDay[];
  };
}

export interface SearchLocation {
  id: number;
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
}

export class WeatherAPIError extends Error {
  constructor(
    message: string,
    public code?: number
  ) {
    super(message);
    this.name = "WeatherAPIError";
  }
}

function getApiKey(): string {
  const apiKey = process.env.WEATHER_API_KEY;
  if (!apiKey) {
    throw new WeatherAPIError(
      "WEATHER_API_KEY environment variable is not set"
    );
  }
  return apiKey;
}

/**
 * Get current weather for a location
 * @param query - City name, coordinates (lat,lon), or IP address
 */
export async function getCurrentWeather(
  query: string
): Promise<WeatherResponse> {
  const apiKey = getApiKey();
  const url = `${API_BASE_URL}/current.json?key=${apiKey}&q=${encodeURIComponent(query)}&aqi=no`;

  const response = await fetch(url);

  if (!response.ok) {
    const error = await response.json();
    throw new WeatherAPIError(
      error.error?.message || "Failed to fetch weather data",
      error.error?.code
    );
  }

  return response.json();
}

/**
 * Get weather forecast for a location
 * @param query - City name, coordinates (lat,lon), or IP address
 * @param days - Number of days of forecast (1-10)
 */
export async function getForecast(
  query: string,
  days: number = 3
): Promise<ForecastResponse> {
  const apiKey = getApiKey();
  const url = `${API_BASE_URL}/forecast.json?key=${apiKey}&q=${encodeURIComponent(query)}&days=${days}&aqi=no`;

  const response = await fetch(url);

  if (!response.ok) {
    const error = await response.json();
    throw new WeatherAPIError(
      error.error?.message || "Failed to fetch forecast data",
      error.error?.code
    );
  }

  return response.json();
}

/**
 * Search for locations by name
 * @param query - Search query (city name)
 */
export async function searchLocations(
  query: string
): Promise<SearchLocation[]> {
  const apiKey = getApiKey();
  const url = `${API_BASE_URL}/search.json?key=${apiKey}&q=${encodeURIComponent(query)}`;

  const response = await fetch(url);

  if (!response.ok) {
    const error = await response.json();
    throw new WeatherAPIError(
      error.error?.message || "Failed to search locations",
      error.error?.code
    );
  }

  return response.json();
}
