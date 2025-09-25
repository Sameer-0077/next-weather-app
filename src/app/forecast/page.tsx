"use client";

import {
  ArrowLeft,
  Cloud,
  Sun,
  CloudRain,
  Wind,
  Thermometer,
  Droplets,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import heroImage from "@/assets/weather-hero.jpg";
import { WeatherSearch } from "@/components/WeatherSearch";
import { useEffect, useState } from "react";
import { error } from "console";

// Mock forecast data

const forecastData = [
  {
    day: "Today",
    date: "Dec 24",
    high: 22,
    low: 15,
    condition: "Sunny",
    icon: Sun,
    humidity: "65%",
    wind: "12 km/h",
    description: "Clear sky with gentle breeze",
  },
  {
    day: "Tomorrow",
    date: "Dec 25",
    high: 18,
    low: 12,
    condition: "Cloudy",
    icon: Cloud,
    humidity: "72%",
    wind: "8 km/h",
    description: "Partly cloudy throughout the day",
  },
  {
    day: "Wednesday",
    date: "Dec 26",
    high: 16,
    low: 9,
    condition: "Rainy",
    icon: CloudRain,
    humidity: "85%",
    wind: "15 km/h",
    description: "Light rain expected in the afternoon",
  },
  {
    day: "Thursday",
    date: "Dec 27",
    high: 20,
    low: 13,
    condition: "Partly Cloudy",
    icon: Cloud,
    humidity: "68%",
    wind: "10 km/h",
    description: "Mix of sun and clouds",
  },
  {
    day: "Friday",
    date: "Dec 28",
    high: 24,
    low: 16,
    condition: "Sunny",
    icon: Sun,
    humidity: "58%",
    wind: "14 km/h",
    description: "Beautiful sunny weather",
  },
];

const Forecast = () => {
  const searchParams = useSearchParams();
  const city = searchParams.get("city");
  const [loading, setLoading] = useState(false);
  const [searchCity, setSearchCity] = useState<string>("");
  const [forecastWeather, setForecastWeather] = useState<any[]>([]);
  const [country, setCountry] = useState<string>("");
  // const [icon, setIcon] = useState<string>("")

  const handleSearch = async (city: string) => {
    try {
      setLoading(true);
      const res: any = await fetch(
        `${process.env.NEXT_PUBLIC_FORECAST_URL}${city}${process.env.NEXT_PUBLIC_API_KEY}`
      );
      const data: any = await res.json();
      if (!res.ok) throw new Error(data.error);
      const dailyData = data.list
        .filter((_: any, index: number) => index % 8 === 0)
        .slice(0, 5)
        .map((item: any) => {
          const dateObj = new Date(item.dt_txt.replace(" ", "T"));
          let icon;
          if (item.weather[0].main === "Clear") icon = Sun;
          else if (item.weather[0].main === "Clouds") icon = Cloud;
          else if (item.weather[0].main === "Rain") icon = CloudRain;
          else  icon = Sun;
          return {
            date: dateObj.toISOString().split("T")[0], // e.g. "2025-09-25"
            day: dateObj.toLocaleDateString("en-US", { weekday: "long" }), // e.g. "Thursday"

            icon: icon,
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
      // console.log(dailyData);

      setSearchCity(data.city.name);

      switch (data.city.country.toUpperCase()) {
        case "IN":
          return setCountry("India");
        case "US":
          return setCountry("United States");
        case "GB":
          return setCountry("United Kingdom");
        case "CA":
          return setCountry("Canada");
        case "AU":
          return setCountry("Australia");

        default:
          return "Unknown Country";
      }
    } catch (error: any) {
      console.log("Error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (city) {
      handleSearch(city);
    }
  }, []);

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => handleSearch("Your Location"),
        () => {}
      );
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8  relative overflow-hidden text-white">
      {/* Optional: add faint hero image overlay */}
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

        {/* Forecast Cards */}
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

        {/* Additional Info */}
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
