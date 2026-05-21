import { NextRequest, NextResponse } from "next/server";
import { getForecast, WeatherAPIError } from "@/lib/weather-api";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");
  const days = searchParams.get("days") || "3";

  if (!query) {
    return NextResponse.json(
      { error: "Query parameter 'q' is required" },
      { status: 400 }
    );
  }

  try {
    const forecast = await getForecast(query, parseInt(days));
    return NextResponse.json(forecast);
  } catch (error) {
    if (error instanceof WeatherAPIError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.code === 1006 ? 404 : 500 }
      );
    }
    return NextResponse.json(
      { error: "Failed to fetch forecast data" },
      { status: 500 }
    );
  }
}
