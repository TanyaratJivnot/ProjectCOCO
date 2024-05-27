const express = require('express');
const router = express.Router();
// Assuming Node.js >= 17.5 for native fetch support.
async function getWeatherData() {
    const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=13.91301&lon=100.49883&appid=8996956bada63816da0df68bbf3a1c84&units=metric`;
    try {
        const response = await fetch(weatherURL);
        const weatherData = await response.json();
        const isRaining = weatherData.weather.some(w => w.main === "Rain");
        return {
            temperature: weatherData.main.temp,
            icon: isRaining ? "fa-cloud-sun-rain" : "fa-cloud-sun"
        };
    } catch (error) {
        console.error("Error fetching weather data:", error);
        throw error;
    }
}

module.exports = getWeatherData;
