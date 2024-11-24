"use client";

import { useState } from "react";
import { fetchWeather } from "../utils/weather";

interface WeatherData {
  name: string;
  sys: { country: string; sunrise: number; sunset: number };
  main: { temp: number; feels_like: number; humidity: number; pressure: number };
  weather: { description: string; icon: string; main: string }[];
  wind: { speed: number };
}

export default function Weather() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);

  const handleFetchWeather = async () => {
    if (!city.trim()) {
      setError("Please enter a valid city name.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const data = await fetchWeather(city);

      setWeather(data);
      setHistory((prev) => {
        const newHistory = [city, ...prev.filter((c) => c.toLowerCase() !== city.toLowerCase())];
        return newHistory.slice(0, 5);
      });
    } catch {
      setError("City not found or API error.");
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  const addToFavorites = () => {
    if (weather && !favorites.includes(weather.name)) {
      setFavorites((prev) => [...prev, weather.name]);
    }
  };

  const handleFavoriteClick = (favorite: string) => {
    setCity(favorite);
    handleFetchWeather();
  };

  const getBackgroundClass = () => {
    if (!weather) return "bg-blue-500";

    const condition = weather.weather[0].main.toLowerCase();

    if (condition.includes("clear")) return "bg-yellow-400";
    if (condition.includes("clouds")) return "bg-gray-400";
    if (condition.includes("rain")) return "bg-blue-700";
    if (condition.includes("snow")) return "bg-white";

    return "bg-blue-500";
  };

  return (
    <div className={`${getBackgroundClass()} min-h-screen flex items-center justify-center px-4`}>
      <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Weather App</h2>
        <div className="mb-4">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city name"
            className="border p-2 rounded w-full text-black bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={handleFetchWeather}
          className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full transition ${
            loading ? "opacity-50" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Fetching..." : "Get Weather"}
        </button>
        {weather && (
          <button
            onClick={addToFavorites}
            className="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full transition"
          >
            Add to Favorites
          </button>
        )}
        {error && <p className="text-red-500 mt-4">{error}</p>}
        {weather && (
          <div className="mt-6 text-black text-center">
            <h3 className="text-xl font-bold">
              {weather.name}, {weather.sys.country}
            </h3>
            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt={weather.weather[0].description}
              className="w-16 h-16 mx-auto"
            />
            <p>Temperature: {weather.main.temp}°C</p>
            <p>Weather: {weather.weather[0].description}</p>
            <p>Feels Like: {weather.main.feels_like}°C</p>
            <p>Humidity: {weather.main.humidity}%</p>
            <p>Pressure: {weather.main.pressure} hPa</p>
            <p>Wind Speed: {weather.wind.speed} m/s</p>
            <p>Sunrise: {new Date(weather.sys.sunrise * 1000).toLocaleTimeString()}</p>
            <p>Sunset: {new Date(weather.sys.sunset * 1000).toLocaleTimeString()}</p>
          </div>
        )}
        {history.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-bold mb-2 text-gray-700">Search History</h3>
            <ul className="list-disc list-inside text-black">
              {history.map((item, index) => (
                <li
                  key={index}
                  className="cursor-pointer hover:underline text-blue-600"
                  onClick={() => setCity(item)}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
        {favorites.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-bold mb-2 text-gray-700">Favorites</h3>
            <ul className="list-disc list-inside text-black">
              {favorites.map((fav, index) => (
                <li
                  key={index}
                  className="cursor-pointer hover:underline text-green-600"
                  onClick={() => handleFavoriteClick(fav)}
                >
                  {fav}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
