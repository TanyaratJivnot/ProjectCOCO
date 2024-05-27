const express = require('express');
const router = express.Router();

const cache = {
    data: null,
    timestamp: null,
    ttl: 60000 // 60 seconds (1 minute)
};

async function getWeatherData() {
    const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=13.91301&lon=100.49883&appid=8996956bada63816da0df68bbf3a1c84&units=metric`;
    
    const now = Date.now();

    // Check if cache is valid
    if (cache.data && (now - cache.timestamp < cache.ttl)) {
        return cache.data;
    }

    try {
        const response = await fetch(weatherURL);
        const weatherData = await response.json();
        const isRaining = weatherData.weather.some(w => w.main === "Rain");

        const data = {
            temperature: weatherData.main.temp,
            icon: isRaining ? "fa-cloud-sun-rain" : "fa-cloud-sun"
        };

        // Update cache
        cache.data = data;
        cache.timestamp = now;

        return data;
    } catch (error) {
        console.error("Error fetching weather data:", error);
        throw error;
    }
}

module.exports = getWeatherData;
