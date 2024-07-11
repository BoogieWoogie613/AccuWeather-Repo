document.addEventListener("DOMContentLoaded", function() {
    const apiKey = "XI5yrUD1JxiNnAx0MSUyBXZWmYvdCQ1F"; // Replace with your actual API key
    const form = document.getElementById("cityForm");
    const weatherDiv = document.getElementById("weather");
    const hourlyDiv = document.getElementById("hourly");


    form.addEventListener("submit", function(event) {
        event.preventDefault();
        const city = document.getElementById("cityInput").value;
        getWeather(city);
    });

    // Get Location Key sa Postman >> Uses the city name
    function getWeather(city) {
        const url = `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${apiKey}&q=${city}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    const locationKey = data[0].Key;
                    fetchWeatherData(locationKey);
                } else {
                    weatherDiv.innerHTML = `<p>City not found.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching location data:", error);
                weatherDiv.innerHTML = `<p>Error fetching location data.</p>`;
            });
    }

    // Get Current Location sa Postman >> Uses the city location ID instead of the city name itself
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

    //Get Hourly Weather
    function fetchHourlyForecast(locationKey){
      const url = `http://dataservice.accuweather.com/forecasts/v1/hourly/1hour/${locationKey}?apikey=${apiKey}`;

      fetch(url)
          .then(response => response.json())
          .then(data => {
              if (data && data.length > 0) {
                  displayHourlyWeather(data[0]);
              } else {
                  hourlyDiv.innerHTML = `<p>No weather data available.</p>`;
              }
          })
          .catch(error => {
              console.error("Error fetching weather data:", error);
              hourlyDiv.innerHTML = `<p>Error fetching weather data.</p>`;
          });


    }

    // Display fetchWeatherData()
    function displayWeather(data) {
      const dateTime = data.DateTime;
      const epochDateTime = data.EpochTime;
      const weatherIcon = data.WeatherIcon;
      const iconPhrase = data.IconPhrase;
      const temperature = data.Temperature.Metric.Value;
      const weather = data.WeatherText;
        const weatherContent = `
            <h2>Weather</h2>
            <p>Temperature: ${temperature}°C</p>
            <p>Epoch: ${epochDateTime}</p>
            <p>Weather: ${weather}</p>
            <p>Date: ${dateTime}</p>
            <p>Weather: ${weatherIcon}</p>
            <p>Icon: ${iconPhrase}</p>
        `;
        weatherDiv.innerHTML = weatherContent;
    }

    // Display fetchHourlyForecast()
    function displayHourlyWeather(data) {
        const dateTime = data.DateTime;
        const epochDateTime = data.EpochDateTime;
        const weatherIcon = data.WeatherIcon;
        const iconPhrase = data.IconPhrase;
        const temperature = data.Temperature.Metric.Value;
        const weather = data.WeatherText;
        const hourlyContent = `
            <h2>Hourly</h2>
            <p>Date: ${dateTime}</p>
            <p>Epoch: ${epochDateTime}</p>
            <p>Weather: ${weatherIcon}</p>
            <p>Icon: ${iconPhrase}</p>
            <p>Temperature: ${temperature}</p>
            <p>Weather: ${weather}</p>
        `;
        hourlyDiv.innerHTML = hourlyContent;
    }


});
