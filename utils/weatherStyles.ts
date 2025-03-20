export const getBackgroundColors = (weather, hour) => {
  const isNight = hour < 6 || hour > 18;
  
  const gradients = {
    Clear: isNight 
      ? ['#1a237e', '#000000']
      : ['#4fc3f7', '#29b6f6'],
    Clouds: isNight
      ? ['#37474f', '#263238']
      : ['#90a4ae', '#78909c'],
    Rain: isNight
      ? ['#263238', '#000000']
      : ['#546e7a', '#37474f'],
    Snow: isNight
      ? ['#455a64', '#263238']
      : ['#cfd8dc', '#b0bec5'],
    Thunderstorm: ['#1a237e', '#000000'],
    default: ['#4fc3f7', '#29b6f6'],
  };

  return gradients[weather] || gradients.default;
};