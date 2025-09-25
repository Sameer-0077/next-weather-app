import { useState } from "react";
import { Search, MapPin, Cloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface WeatherSearchProps {
  onSearch: (city: string) => void;
  onGetLocation: () => void;
}

export const WeatherSearch = ({
  onSearch,
  onGetLocation,
}: WeatherSearchProps) => {
  const [city, setCity] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim()) {
      onSearch(city.trim());
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-4 items-center"
      >
        {/* Input Field */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-yellow-400 w-6 h-6" />
          <Input
            type="text"
            placeholder="Enter city name..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="pl-14 pr-6 w-full text-center sm:text-left
                       text-gray-700 placeholder-white bg-white backdrop-blur-md
                       border border-white/30 focus:border-yellow-400 focus:ring-yellow-400"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <Button
            type="submit"
            className="bg-yellow-400 text-blue-900 font-semibold px-6 py-2 hover:bg-yellow-500 transition-colors cursor-pointer"
          >
            <Search className="w-5 h-5 mr-2" />
            Search
          </Button>

          <Button
            type="button"
            onClick={onGetLocation}
            className="bg-blue-200/30 text-white font-semibold px-6 py-2 hover:bg-blue-300/50 transition-colors cursor-pointer"
          >
            <MapPin className="w-5 h-5 mr-2" />
            My Location
          </Button>
        </div>
      </form>

      {/* Info Text */}
      <div className="flex items-center justify-center mt-8 text-white/80">
        <Cloud className="w-5 h-5 mr-2 text-yellow-400" />
        <span className="text-sm">
          Search for weather in any city worldwide
        </span>
      </div>
    </div>
  );
};
