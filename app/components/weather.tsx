"use client";

import { useState } from "react";
import { fetchWeather } from "../utils/weather";

export default function Weather() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<any>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); 

  const handleFetchWeather = async () => {
    try {
      setLoading(true); 
      setError(""); 
      const data = await fetchWeather(city);
      setWeather(data);
    } catch (err) {
      setError("City not found or API error.");
      setWeather(null);
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow-lg max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Weather App</h2>
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
        className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ${loading ? "opacity-50" : ""}`}
        disabled={loading} 
      >
        {loading ? "Loading..." : "Get Weather"}
      </button>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {weather && (
        <div className="mt-6 text-black">
          <h3 className="text-xl font-bold">
            {weather.name}, {weather.sys.country}
          </h3>
          <p>Temperature: {weather.main.temp}°C</p>
          <p>Weather: {weather.weather[0].description}</p>
          <p>Humidity: {weather.main.humidity}%</p>
          <p>Wind Speed: {weather.wind.speed} m/s</p>
        </div>
      )}
    </div>
  );
}
