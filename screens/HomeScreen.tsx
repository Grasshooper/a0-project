import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Audio } from 'expo-av';
import * as Location from 'expo-location';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import WeatherAnimation from '../components/WeatherAnimation';
import { useWeather } from '../hooks/useWeather';
import { getBackgroundColors } from '../utils/weatherStyles';

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  const [location, setLocation] = useState(null);
  const [sound, setSound] = useState();
  const { weather, loading, error } = useWeather(location);
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
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
    
    const soundFile = getWeatherSound(weather?.weather[0]?.main);
    if (soundFile) {
      const { sound: newSound } = await Audio.Sound.createAsync(soundFile, {
        shouldPlay: true,
        isLooping: true,
        volume: 0.1,
      });
      setSound(newSound);
    }
  };

  if (loading || !weather) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading your weather...</Text>
      </View>
    );
  }

  const bgColors = getBackgroundColors(weather?.weather[0]?.main, new Date().getHours());

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={bgColors}
        style={styles.background}
      >
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          <WeatherAnimation 
            weatherCondition={weather?.weather[0]?.main}
            style={styles.animation}
          />
          
          <BlurView intensity={20} style={styles.tempContainer}>
            <Text style={styles.temperature}>
              {Math.round(weather?.main?.temp)}°
            </Text>
            <Text style={styles.description}>
              {weather?.weather[0]?.description}
            </Text>
          </BlurView>
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  animation: {
    width: width * 0.8,
    height: width * 0.8,
  },
  tempContainer: {
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 20,
  },
  temperature: {
    fontSize: 72,
    fontWeight: '200',
    color: 'white',
  },
  description: {
    fontSize: 24,
    color: 'white',
    opacity: 0.8,
    textTransform: 'capitalize',
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginTop: 50,
  },
});