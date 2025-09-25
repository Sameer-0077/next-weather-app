"use client";
export const dynamic = "force-dynamic";

import {
  ArrowLeft,
  Cloud,
  Sun,
  CloudRain,
  Wind,
  Thermometer,
  Droplets,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import heroImage from "@/assets/weather-hero.jpg";
import { WeatherSearch } from "@/components/WeatherSearch";
import { useEffect, useRef, useState } from "react";

// Types

interface ForecastItemApi {
  dt_txt: string;
  main: {
    temp_max: number;
    temp_min: number;
    feels_like: number;
    humidity: number;
  };
  weather: {
    main: string;
    description: string;
  }[];
  wind: {
    speed: number;
  };
}

interface ForecastApiResponse {
  list: ForecastItemApi[];
  city: {
    name: string;
    country: string;
  };
}

interface ForecastItem {
  date: string;
  day: string;
  icon: typeof Sun; // Lucide icon component type
  temp_max: number;
  temp_min: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  feelsLike: number;
  description: string;
}

type ErrorResponse = { error?: string };

const Forecast = () => {
  const [loading, setLoading] = useState(false);
  const [searchCity, setSearchCity] = useState<string>("");
  const [forecastWeather, setForecastWeather] = useState<ForecastItem[]>([]);
  const [country, setCountry] = useState<string>("");

  const handleSearch = async (city: string) => {
    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_FORECAST_URL}${city}${process.env.NEXT_PUBLIC_API_KEY}`
      );
      const data: ForecastApiResponse = await res.json();

      if (!res.ok) {
        const errData: ErrorResponse = await res.json();
        throw new Error(errData.error ?? "API Error");
      }

      const dailyData: ForecastItem[] = data.list
        .filter((_, index) => index % 8 === 0)
        .slice(0, 5)
        .map((item) => {
          const dateObj = new Date(item.dt_txt.replace(" ", "T"));
          let icon: typeof Sun;
          switch (item.weather[0].main) {
            case "Clear":
              icon = Sun;
              break;
            case "Clouds":
              icon = Cloud;
              break;
            case "Rain":
              icon = CloudRain;
              break;
            default:
              icon = Sun;
          }

          return {
            date: dateObj.toISOString().split("T")[0],
            day: dateObj.toLocaleDateString("en-US", { weekday: "long" }),
            icon,
            temp_max: item.main.temp_max,
            temp_min: item.main.temp_min,
            condition: item.weather[0].main,
            humidity: item.main.humidity,
            windSpeed: Math.round(item.wind.speed),
            feelsLike: item.main.feels_like,
            description: item.weather[0].description,
          };
        });

      setForecastWeather(dailyData);
      setSearchCity(data.city.name);

      switch (data.city.country.toUpperCase()) {
        case "IN":
          setCountry("India");
          break;
        case "US":
          setCountry("United States");
          break;
        case "GB":
          setCountry("United Kingdom");
          break;
        case "CA":
          setCountry("Canada");
          break;
        case "AU":
          setCountry("Australia");
          break;
        default:
          setCountry("Unknown Country");
      }
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

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 relative overflow-hidden text-white">
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
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30 -z-10"
        style={{ backgroundImage: "url('/assets/weather-hero.jpg')" }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <Link href="/" passHref>
            <Button
              variant="ghost"
              className="mb-6 bg-white/20 text-white hover:bg-white/30 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Search
            </Button>
          </Link>

          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-2 text-white">
              5-Day Forecast
            </h1>
            <p className="text-xl text-white/70">
              {searchCity ? searchCity + ", " + country : "Search your city"}
            </p>
          </div>
        </div>

        <div className="mb-12">
          <WeatherSearch
            onSearch={handleSearch}
            onGetLocation={handleGetLocation}
          />
        </div>

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

        {!loading && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {forecastWeather.map((day, index) => {
              const IconComponent = day.icon;
              return (
                <Card
                  key={day.day}
                  className="glass-card hover:scale-105 transition-smooth animate-slide-in bg-white/10 border-white/20"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-lg font-semibold text-white">
                      {day.day}
                    </CardTitle>
                    <p className="text-sm text-white/70">{day.date}</p>
                  </CardHeader>

                  <CardContent className="text-center space-y-4">
                    <div className="flex justify-center">
                      <IconComponent className="w-12 h-12 text-yellow-400 animate-float" />
                    </div>

                    <div>
                      <div className="flex justify-center items-center gap-2 text-2xl font-bold">
                        <span className="text-white">{day.temp_max}°</span>
                        <span className="text-white/70 text-lg">
                          / {day.temp_min}°
                        </span>
                      </div>
                      <p className="text-sm text-yellow-400 font-medium mt-1">
                        {day.condition}
                      </p>
                    </div>

                    <div className="space-y-2 text-sm text-white/80">
                      <div className="flex items-center justify-center gap-2">
                        <Droplets className="w-4 h-4 text-yellow-400" />
                        <span>{day.humidity}</span>
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <Wind className="w-4 h-4 text-yellow-400" />
                        <span>{day.windSpeed}</span>
                      </div>
                    </div>

                    <p className="text-xs text-white/70 leading-relaxed">
                      {day.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {!loading && (
          <div
            className="mt-12 text-center animate-fade-in"
            style={{ animationDelay: "600ms" }}
          >
            <Card className="glass-card max-w-2xl mx-auto bg-white/10 border-white/20">
              <CardContent className="p-6 text-white">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Thermometer className="w-5 h-5 text-yellow-400" />
                  <h3 className="text-lg font-semibold">Weather Insights</h3>
                </div>
                <p className="text-white/80">
                  The upcoming week shows typical winter weather patterns with
                  temperatures ranging from 9°C to 24°C. Wednesday may bring
                  some light rain, while the weekend promises beautiful sunny
                  conditions perfect for outdoor activities.
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Forecast;
