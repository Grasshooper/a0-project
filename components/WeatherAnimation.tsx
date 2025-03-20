import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import LottieView from 'lottie-react-native';

const animations = {
  Clear: require('../assets/animations/clear-day.json'),
  Clouds: require('../assets/animations/cloudy.json'),
  Rain: require('../assets/animations/rain.json'),
  Snow: require('../assets/animations/snow.json'),
  Thunderstorm: require('../assets/animations/thunder.json'),
};

export default function WeatherAnimation({ weatherCondition, style }) {
  const getAnimation = () => {
    return animations[weatherCondition] || animations.Clear;
  };

  return (
    <View style={[styles.container, style]}>
      <LottieView
        source={getAnimation()}
        autoPlay
        loop
        style={styles.animation}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  animation: {
    width: '100%',
    height: '100%',
  },
});