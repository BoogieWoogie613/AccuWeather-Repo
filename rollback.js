document.addEventListener("DOMContentLoaded", function() {
    const apiKey = "ArunmN8U9ApjCoCC22bYPBv9JRasfGFq";
    const form = document.getElementById("cityForm");
    const weatherDiv = document.getElementById("weather");
    const hourlyDiv = document.getElementById("hourlyContent");
    const dailyDiv = document.getElementById("dailyContent");
    let currentSlide = 0;
    let hourlyData = [];
    let dailyData = [];

    form.addEventListener("submit", function(event) {
        event.preventDefault();
        const city = document.getElementById("cityInput").value;
        getWeather(city);
    });

    function getWeather(city) {
        const url = `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${apiKey}&q=${city}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    const locationKey = data[0].Key;
                    fetchWeatherData(locationKey);
                    fetchHourlyForecast(locationKey);
                    fetchDailyForecast(locationKey);
                } else {
                    weatherDiv.innerHTML = `<p>City not found.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching location data:", error);
                weatherDiv.innerHTML = `<p>Error fetching location data.</p>`;
            });
    }

    function fetchWeatherData(locationKey) {
        const url = `http://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=${apiKey}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    displayWeather(data[0]);
                } else {
                    weatherDiv.innerHTML = `<p>No weather data available.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching weather data:", error);
                weatherDiv.innerHTML = `<p>Error fetching weather data.</p>`;
            });
    }

    function fetchHourlyForecast(locationKey) {
        const url = `http://dataservice.accuweather.com/forecasts/v1/hourly/1hour/${locationKey}?apikey=${apiKey}`;
    
        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    hourlyData = data;
                    displayHourlyWeather(currentSlide);
                } else {
                    hourlyDiv.innerHTML = `<p>No hourly weather data available.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching hourly weather data:", error);
                hourlyDiv.innerHTML = `<p>Error fetching hourly weather data.</p>`;
            });
    }

    function fetchDailyForecast(locationKey) {
        const url = `http://dataservice.accuweather.com/forecasts/v1/daily/5day/${locationKey}?apikey=${apiKey}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data && data.DailyForecasts && data.DailyForecasts.length > 0) {
                    dailyData = data.DailyForecasts;
                    displayDailyWeather();
                } else {
                    dailyDiv.innerHTML = `<p>No daily weather data available.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching daily weather data:", error);
                dailyDiv.innerHTML = `<p>Error fetching daily weather data.</p>`;
            });
    }

    function displayWeather(data) {
        const dateTime = data.LocalObservationDateTime;
        const weatherIcon = data.WeatherIcon;
        const iconPhrase = data.WeatherText;
        const temperature = data.Temperature.Metric.Value;
        const weatherContent = `
            <div class="weather-container">
                <div class="weather-text">
                    <h2>Current Weather</h2>
                    <p>Temperature: ${temperature}°C</p>
                    <p>Weather: ${iconPhrase}</p>
                    <p>Date: ${dateTime}</p>
                </div>
                <div class="weather-image">
                    <img src="https://developer.accuweather.com/sites/default/files/${weatherIcon.toString().padStart(2, '0')}-s.png" alt="${iconPhrase}">
                </div>
            </div>
        `;
        weatherDiv.innerHTML = weatherContent;
    }

    function displayHourlyWeather(slideIndex) {
        const hour = hourlyData[slideIndex];
        const dateTime = new Date(hour.DateTime).toLocaleString();
        const temperature = hour.Temperature.Value;
        const iconPhrase = hour.IconPhrase;
        const weatherIcon = hour.WeatherIcon;
        const hourlyContent = `
            <div class="hourly-container">
                <div class="hourly-text">
                    <h2>Hourly Weather</h2>
                    <p>Time: ${dateTime}</p>
                    <p>Temperature: ${temperature}°C</p>
                    <p>Condition: ${iconPhrase}</p>
                </div>
                <div class="hourly-image">
                    <img src="https://developer.accuweather.com/sites/default/files/${weatherIcon.toString().padStart(2, '0')}-s.png" alt="${iconPhrase}">
                </div>
            </div>
        `;
        hourlyDiv.innerHTML = hourlyContent;
    }

    function displayDailyWeather() {
        const dayContent = dailyData.slice(0, 5).map(day => {
            const date = new Date(day.Date).toLocaleDateString();
            const maxTemp = day.Temperature.Maximum.Value;
            const dayIcon = day.Day.Icon;
            const dayIconPhrase = day.Day.IconPhrase;
            return `
                <div class="daily-item">
                    <div class="daily-content">
                        <p><strong>Date:</strong> ${date}</p>
                        <p><strong>Condition:</strong> ${dayIconPhrase}</p>
                    </div>
                    <div class="daily-image">
                        <img src="https://developer.accuweather.com/sites/default/files/${dayIcon.toString().padStart(2, '0')}-s.png" alt="${dayIconPhrase}">
                    </div>
                    <div class="daily-temp">
                        <p><strong>Max Temp:</strong> ${maxTemp}°C</p>
                    </div>
                </div>
            `;
        }).join('');
    
        dailyDiv.innerHTML = `
            <h2>5-Day Forecast</h2>
            <div class="forecast-row">
                ${dayContent}
            </div>
        `;
    }
       
    
    
});
