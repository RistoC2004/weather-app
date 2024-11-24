export const fetchWeather = async (city: string) => {
    const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch weather data");
    }
    return response.json();
  };
  