import * as Location from 'expo-location';
import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
const { width: SCREEN_WIDTH } = Dimensions.get("window");
import { Fontisto } from '@expo/vector-icons';


export default function App() {

  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);

  const API_KEY = "84bf5cc4934bc68ad98e93aaaecf6cf4";

  const icons = {
    "Rain": "rains",
    "Clouds": "cloudy",
    "Clear": "day-suny",
    "Atmosphere": "cloudy-gusts",
    "Snow": "snow",
    "Drizzle": "rain",
    "Thunderstrom": "ligntning",
  }

  const [city, setCity] = useState("Loading :) ");

  const getWeather = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setOk(false);
    }
    const { coords: { latitude, longitude } } = await Location.getCurrentPositionAsync({ accuracy: 5 })

    const location = await Location.reverseGeocodeAsync({ latitude, longitude }, { useGoogleMaps: false });
    setCity(location[0].city);

    const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&units=metric&appid=${API_KEY}`);
    const json = await response.json();
    setDays(json.daily);
    console.log(json.daily);
  };

  useEffect(() => {
    getWeather();
  }, [])


  return (
    <View style={styles.container}>
      <StatusBar style='auto' />

      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView pagingEnabled horizontal contentContainerStyle={styles.weather} showsHorizontalScrollIndicator={false}>

        {days.length === 0 ? (
          <View style={{ ...styles.day, alignItems: "center" }}>
            <ActivityIndicator size="large" color="#000" style={{ marginTop: 10 }} />
          </View>)
          :
          (
            days.map((day, index) =>
              <View key={index} style={styles.day}>
                <Text style={styles.date}>
                  {new Date(day.dt * 1000).toLocaleDateString('ko-KR', { weekday: 'long', month: 'short', day: 'numeric' })}
                </Text>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%", paddingRight: 20 }}>
                  <Text style={styles.temp}>{parseFloat(day.temp.day).toFixed(1)}</Text>
                  <Fontisto name={icons[day.weather[0].main]} size={68} color="white" />
                </View>
                <Text style={styles.description}>{day.weather[0].main}</Text>

                <Text style={styles.tinyText}>{day.weather[0].description}</Text>

              </View>
            )
          )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'mediumslateblue',
  },
  city: {
    flex: 1.2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cityName: {
    fontSize: 68,
    fontWeight: 800,
    color: "#fff"
  },
  weather: {
    paddingTop: 50,
  },
  day: {
    width: SCREEN_WIDTH,
    alignItems: 'start',
    paddingLeft: 30,
  },
  date: {
    fontSize: 50,
    color: "#fff",
  },
  temp: {
    fontSize: 120,
    marginTop: 10,
    color: "#fff",
  },
  description: {
    fontSize: 60,
    marginTop: 10,
    color: "#fff",
  },
  tinyText: {
    fontSize: 30,
    color: "#fff",
  }
})
