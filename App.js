import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as Location from 'expo-location'

import WeatherInfo from './components/WeatherInfo'

const WEATHER_API_KEY = 'f1cbb869a7756659d760ff5c765ff189'
const BASE_WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather?'

export default function App() {
  const [errorMessage, setErrorMessage] = useState(null)
  const [currentWeather, setCurrentWeather] = useState(null)
  const [unitsSystem, setUnitsSystem] = useState('metric')

  useEffect(() => {
    load()
  }, [])

  async function load() {
    try {
      let { status } = await Location.requestPermissionsAsync()

      if (status !== 'granted') {
        setErrorMessage('Acess to location is needed to run the app')
        return
      }
      const location = await Location.getCurrentPositionAsync()

      const { latitude, longitude } = location.coords

      const weatherUrl = `${BASE_WEATHER_URL}lat=${latitude}&lon=${longitude}&units=${unitsSystem}&appid=${WEATHER_API_KEY}`
      
      const response = await fetch(weatherUrl)

      const result = await response.json()

      if(response.ok) {
        setCurrentWeather(result)
      } else {
        setErrorMessage(result.message)
      }

    } catch(error) {
      setErrorMessage(error.message)
    }
  }

  if(currentWeather) {
    const { main : {temp}} = currentWeather
    return (
      <View style={styles.container}>
        <StatusBar style="auto" />
        <View style={styles.main}>
          <WeatherInfo currentWeather={currentWeather} />
        </View>
      </View>
    )} else {
    return (
      <View style={styles.container}>
        <Text>{errorMessage}</Text>
        <StatusBar style="auto" />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  main: {
    justifyContent: 'center',
    flex: 1
  }
});
