const Weather = require('../models/Weather');
const axios = require('axios');
const loadConfig = require('./loadConfig');

const getExternalWeather = async () => {
  const { WEATHER_API_KEY: secret, lat, long, isCelsius } = await loadConfig();
  
  //units = standard, metric, imperial
  const units = isCelsius?'metric':'imperial'

  // Fetch data from external API
  try {
    const res = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${secret}&units=${units}`
    );

    const resRain = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&cnt=1&appid=${secret}`
    );

    // Save weather data
    const cursor = res.data;
    const isDay = (Math.floor(Date.now()/1000) < cursor.sys.sunset) | 0
    const weatherData = await Weather.create({
      externalLastUpdate: cursor.dt,
      tempC: Math.round(cursor.main.temp),
      tempF: Math.round(cursor.main.temp),
      isDay: isDay,
      cloud: cursor.clouds.all,
      conditionText: cursor.weather[0].main,
      conditionCode: cursor.weather[0].id,
      humidity: cursor.main.humidity,
      windK: cursor.wind.speed,
      windM: 0,
      rain: Math.round(resRain.data.list[0].pop * 100),
    });
    return weatherData;
  } catch (err) {
    throw new Error('External API request failed');
  }
};

module.exports = getExternalWeather;
