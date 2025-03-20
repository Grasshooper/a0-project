import { KnownWeatherCondition, WeatherCondition } from "./weatherSounds";

// Updated return type to match what LinearGradient expects
export const getBackgroundColors = (
  weather: WeatherCondition | undefined,
  hour: number
): [string, string] => {
  const isNight = hour < 6 || hour > 18;

  // Define gradients with explicit tuple types
  const gradients: Record<KnownWeatherCondition | "default", [string, string]> =
    {
      Clear: isNight ? ["#1a237e", "#000000"] : ["#4fc3f7", "#29b6f6"],
      Clouds: isNight ? ["#37474f", "#263238"] : ["#90a4ae", "#78909c"],
      Rain: isNight ? ["#263238", "#000000"] : ["#546e7a", "#37474f"],
      Snow: isNight ? ["#455a64", "#263238"] : ["#cfd8dc", "#b0bec5"],
      Thunderstorm: ["#1a237e", "#000000"],
      Drizzle: ["#546e7a", "#37474f"], // Same as rain
      Mist: ["#90a4ae", "#78909c"], // Similar to clouds
      Fog: ["#90a4ae", "#78909c"], // Similar to clouds
      Haze: ["#90a4ae", "#78909c"], // Similar to clouds
      Dust: ["#bcaaa4", "#8d6e63"], // Brown-ish
      Smoke: ["#78909c", "#546e7a"], // Dark gray
      default: ["#4fc3f7", "#29b6f6"],
    };

  // Check if the weather condition exists in our gradients object
  if (weather && typeof weather === "string" && weather in gradients) {
    return gradients[weather as KnownWeatherCondition];
  }

  return gradients.default;
};
