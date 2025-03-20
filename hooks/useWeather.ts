import { useState, useEffect } from 'react';

const API_KEY = '89f0ebfa3ad7675443f0176c8412f2c9'; // Free OpenWeatherMap API key

export function useWeather(location) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!location) return;

    const fetchWeather = async () => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${location.coords.latitude}&lon=${location.coords.longitude}&units=metric&appid=${API_KEY}`
        );
        const data = await response.json();
        setWeather(data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchWeather();
  }, [location]);

  return { weather, loading, error };
}