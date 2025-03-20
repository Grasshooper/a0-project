import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Dimensions, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { Audio } from "expo-av";
import * as Location from "expo-location";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import WeatherAnimation from "../components/WeatherAnimation";
import { useWeather } from "../hooks/useWeather";
import { getBackgroundColors } from "../utils/weatherStyles";
import { getWeatherSound, getWeatherSoundVolume } from "../utils/weatherSounds";

const { width, height } = Dimensions.get("window");

export default function HomeScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [sound, setSound] = useState<Audio.Sound | undefined>();
  const { weather, loading, error } = useWeather(location);
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        const location = await Location.getCurrentPositionAsync({});
        setLocation(location);
      }
    })();
  }, []);

  useEffect(() => {
    if (weather) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();

      playWeatherSound();
    }
  }, [weather]);

  const playWeatherSound = async () => {
    if (sound) {
      await sound.unloadAsync();
    }

    // Fix: Provide a fallback if weather condition is undefined
    const weatherCondition = weather?.weather[0]?.main || "Clear";
    const soundFile = getWeatherSound(weatherCondition);

    if (soundFile) {
      const { sound: newSound } = await Audio.Sound.createAsync(soundFile, {
        shouldPlay: true,
        isLooping: true,
        volume: getWeatherSoundVolume(weatherCondition),
      });
      setSound(newSound);
    }
  };

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  if (loading || !weather) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading your weather...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Unable to load weather data</Text>
      </View>
    );
  }

  // Fix: Provide a fallback if weather condition is undefined
  const weatherCondition = weather.weather[0]?.main || "Clear";
  const bgColors = getBackgroundColors(weatherCondition, new Date().getHours());

  return (
    <View style={styles.container}>
      <LinearGradient colors={bgColors} style={styles.background}>
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          <WeatherAnimation
            weatherCondition={weatherCondition}
            style={styles.animation}
          />

          <BlurView intensity={20} style={styles.tempContainer}>
            <Text style={styles.temperature}>
              {Math.round(weather?.main?.temp)}°
            </Text>
            <Text style={styles.description}>
              {weather?.weather[0]?.description || "Weather data unavailable"}
            </Text>
            <Text style={styles.location}>
              {weather?.name || "Unknown location"},{" "}
              {weather?.sys?.country || ""}
            </Text>
          </BlurView>

          <View style={styles.detailsContainer}>
            <View style={styles.detailItem}>
              <MaterialCommunityIcons
                name="water-percent"
                size={24}
                color="white"
              />
              <Text style={styles.detailText}>
                {weather?.main?.humidity || 0}%
              </Text>
            </View>
            <View style={styles.detailItem}>
              <MaterialCommunityIcons
                name="weather-windy"
                size={24}
                color="white"
              />
              <Text style={styles.detailText}>
                {Math.round(weather?.wind?.speed || 0)} m/s
              </Text>
            </View>
            <View style={styles.detailItem}>
              <MaterialCommunityIcons name="eye" size={24} color="white" />
              <Text style={styles.detailText}>
                {(weather?.visibility || 0) / 1000} km
              </Text>
            </View>
          </View>
        </Animated.View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    width,
    height,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 50,
  },
  animation: {
    width: width * 0.8,
    height: width * 0.8,
  },
  tempContainer: {
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 20,
    width: width * 0.8,
  },
  temperature: {
    fontSize: 72,
    fontWeight: "200",
    color: "white",
  },
  description: {
    fontSize: 24,
    color: "white",
    opacity: 0.8,
    textTransform: "capitalize",
    marginBottom: 5,
  },
  location: {
    fontSize: 18,
    color: "white",
    opacity: 0.7,
  },
  detailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: width * 0.8,
    marginTop: 30,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 15,
    padding: 15,
  },
  detailItem: {
    alignItems: "center",
    justifyContent: "center",
  },
  detailText: {
    color: "white",
    marginTop: 5,
    fontSize: 16,
  },
  loadingText: {
    fontSize: 18,
    color: "#666",
    textAlign: "center",
    marginTop: 50,
  },
  errorText: {
    fontSize: 18,
    color: "#e53935",
    textAlign: "center",
    marginTop: 50,
  },
});
