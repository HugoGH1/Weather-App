import { NextRequest, NextResponse } from "next/server";
import { getCurrentWeather, WeatherAPIError } from "@/lib/weather-api";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json(
      { error: "Query parameter 'q' is required" },
      { status: 400 }
    );
  }

  try {
    const weather = await getCurrentWeather(query);
    return NextResponse.json(weather);
  } catch (error) {
    if (error instanceof WeatherAPIError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.code === 1006 ? 404 : 500 }
      );
    }
    return NextResponse.json(
      { error: "Failed to fetch weather data" },
      { status: 500 }
    );
  }
}
