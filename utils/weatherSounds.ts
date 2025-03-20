/**
 * Utility function to get the appropriate sound file for each weather condition
 */

// Define known weather conditions
export type KnownWeatherCondition =
  | "Clear"
  | "Clouds"
  | "Rain"
  | "Snow"
  | "Thunderstorm"
  | "Drizzle"
  | "Mist"
  | "Fog"
  | "Haze"
  | "Dust"
  | "Smoke";
export type WeatherCondition = KnownWeatherCondition | string;

// Define the sound files record with proper typing
type SoundFiles = Record<KnownWeatherCondition, any>;

/**
 * Returns the appropriate sound file based on weather condition
 * @param weatherCondition - The main weather condition from OpenWeatherMap API
 * @returns The sound file resource for the given weather condition
 */
export const getWeatherSound = (weatherCondition: WeatherCondition): any => {
  // Map of weather conditions to their corresponding sound files
  const sounds: SoundFiles = {
    // Basic weather conditions
    Clear: require("../assets/sounds/clear.mp3"),
    Clouds: require("../assets/sounds/wind.mp3"),
    Rain: require("../assets/sounds/rain.mp3"),
    Snow: require("../assets/sounds/snow.mp3"),
    Thunderstorm: require("../assets/sounds/thunder.mp3"),

    // Additional weather conditions that might come from the API
    Drizzle: require("../assets/sounds/light-rain.mp3"),
    Mist: require("../assets/sounds/wind.mp3"),
    Fog: require("../assets/sounds/wind.mp3"),
    Haze: require("../assets/sounds/wind.mp3"),
    Dust: require("../assets/sounds/wind.mp3"),
    Smoke: require("../assets/sounds/wind.mp3"),
  };

  // Safely check if the condition exists in our sounds object
  if (
    weatherCondition &&
    typeof weatherCondition === "string" &&
    weatherCondition in sounds
  ) {
    return sounds[weatherCondition as KnownWeatherCondition];
  }

  // Default to Clear if condition not found or undefined
  return sounds.Clear;
};

/**
 * Gets volume level appropriate for the weather condition
 * @param weatherCondition - The main weather condition from OpenWeatherMap API
 * @returns Volume level between 0.0 and 1.0
 */
export const getWeatherSoundVolume = (
  weatherCondition: WeatherCondition
): number => {
  const volumes: Record<string, number> = {
    Clear: 0.1, // Gentle ambient sound
    Clouds: 0.15, // Slightly louder wind
    Rain: 0.2, // Medium volume for rain
    Drizzle: 0.15, // Light rain at lower volume
    Snow: 0.08, // Very quiet snow sounds
    Thunderstorm: 0.25, // Louder for thunder
    default: 0.1, // Default volume
  };

  // Check if the condition exists in our volumes object
  if (
    weatherCondition &&
    typeof weatherCondition === "string" &&
    weatherCondition in volumes
  ) {
    return volumes[weatherCondition];
  }

  // Default volume if condition not found
  return volumes.default;
};
