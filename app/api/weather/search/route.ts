import { NextRequest, NextResponse } from "next/server";
import { searchLocations, WeatherAPIError } from "@/lib/weather-api";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const city = searchParams.get("city");

  if (!city) {
    return NextResponse.json(
      { error: "Query parameter 'city' is required" },
      { status: 400 }
    );
  }

  try {
    const locations = await searchLocations(city);
    return NextResponse.json(locations);
  } catch (error) {
    if (error instanceof WeatherAPIError) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: "Failed to search locations" },
      { status: 500 }
    );
  }
}
