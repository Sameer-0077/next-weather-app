"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { WeatherSearch } from "@/components/WeatherSearch";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Thermometer, Wind, Eye } from "lucide-react";
import heroImage from "@/assets/weather-hero.jpg";

// -------------------------
// Types
// -------------------------
interface WeatherApiResponse {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  weather: {
    description: string;
  }[];
  wind: {
    speed: number;
  };
  visibility: number;
}

interface CurrentWeather {
  city: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  visibility: number;
  feelsLike: number;
}

// -------------------------
// Component
// -------------------------
const Home = () => {
  const [currentWeather, setCurrentWeather] = useState<CurrentWeather | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [city, setCity] = useState<string>("");

  const handleSearch = async (city: string) => {
    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_WEATHER_URL}${city}${process.env.NEXT_PUBLIC_API_KEY}`
      );
      if (!res.ok) throw new Error("Failed to fetch weather data");

      const data: WeatherApiResponse = await res.json();

      setCurrentWeather({
        city: data.name,
        temperature: data.main.temp,
        condition: data.weather[0].description,
        humidity: data.main.humidity,
        windSpeed: Math.round((data.wind.speed + 1) * 2 * 10) / 10,
        visibility: data.visibility / 1000,
        feelsLike: data.main.feels_like,
      });
      setCity(data.name);
    } catch (err) {
      console.log("Error:", (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => handleSearch("Your Location"),
        () => {}
      );
    }
  };

  // -------------------------
  // UI (unchanged)
  // -------------------------
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Hero Image */}
      <div className="absolute inset-0 z-0 opacity-30">
        <Image
          src={heroImage}
          alt="Weather Hero"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Content */}
      <div className="relative z-10 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-4">
            Weather <span className="text-yellow-400">Now</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white/80 max-w-2xl mx-auto leading-relaxed">
            Get real-time weather updates and 5-day forecasts for any city
            worldwide
          </p>
        </div>

        {/* Search Component */}
        <div className="mb-12">
          <WeatherSearch
            onSearch={handleSearch}
            onGetLocation={handleGetLocation}
          />
        </div>

        {/* Current Weather */}
        {loading && (
          <div className="text-center mb-8">
            <Card className="max-w-md mx-auto bg-white/20 backdrop-blur-md border border-white/30 animate-pulse">
              <CardContent className="p-6">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 bg-white/40 rounded-full"></div>
                  <div className="h-4 bg-white/40 rounded w-3/4"></div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {currentWeather && !loading && (
          <div className="mb-8">
            <Card className="max-w-2xl mx-auto bg-white/20 backdrop-blur-md border border-white/30">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {currentWeather.city}
                  </h2>
                  <div className="flex items-center justify-center gap-4">
                    <span className="text-5xl font-bold text-yellow-400">
                      {currentWeather.temperature}°C
                    </span>
                    <div className="text-left">
                      <p className="text-lg font-medium text-white">
                        {currentWeather.condition}
                      </p>
                      <p className="text-sm text-white/80">
                        Feels like {currentWeather.feelsLike}°C
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Thermometer className="w-6 h-6 text-yellow-400" />
                    <span className="text-sm font-medium text-white">
                      {currentWeather.humidity}%
                    </span>
                    <span className="text-xs text-white/80">Humidity</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <Wind className="w-6 h-6 text-yellow-400" />
                    <span className="text-sm font-medium text-white">
                      {currentWeather.windSpeed}km/h
                    </span>
                    <span className="text-xs text-white/80">Wind</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <Eye className="w-6 h-6 text-yellow-400" />
                    <span className="text-sm font-medium text-white">
                      {currentWeather.visibility}km
                    </span>
                    <span className="text-xs text-white/80">Visibility</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* 5-Day Forecast Button */}
        <div className="text-center mb-12">
          <Link
            href={{
              pathname: "/forecast",
              query: { city },
            }}
            passHref
          >
            <Button className="bg-yellow-400 text-blue-900 font-semibold px-8 py-4 hover:bg-yellow-500 transition-colors shadow-lg cursor-pointer">
              <Calendar className="w-5 h-5 mr-2" />
              View 5-Day Forecast
            </Button>
          </Link>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="bg-white/20 backdrop-blur-md border border-white/30 text-center hover:scale-105 transition-transform duration-300">
            <CardContent className="p-6">
              <Thermometer className="w-12 h-12 text-yellow-400 mx-auto mb-4 animate-bounce" />
              <h3 className="text-lg font-semibold mb-2 text-white">
                Real-time Data
              </h3>
              <p className="text-sm text-white/80">
                Get up-to-date weather conditions from reliable sources
                worldwide
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/20 backdrop-blur-md border border-white/30 text-center hover:scale-105 transition-transform duration-300">
            <CardContent className="p-6">
              <Calendar className="w-12 h-12 text-yellow-400 mx-auto mb-4 animate-bounce" />
              <h3 className="text-lg font-semibold mb-2 text-white">
                5-Day Forecast
              </h3>
              <p className="text-sm text-white/80">
                Plan ahead with detailed weather predictions for the next five
                days
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/20 backdrop-blur-md border border-white/30 text-center hover:scale-105 transition-transform duration-300">
            <CardContent className="p-6">
              <Wind className="w-12 h-12 text-yellow-400 mx-auto mb-4 animate-bounce" />
              <h3 className="text-lg font-semibold mb-2 text-white">
                Detailed Metrics
              </h3>
              <p className="text-sm text-white/80">
                Access comprehensive weather data including wind, humidity, and
                visibility
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Home;
