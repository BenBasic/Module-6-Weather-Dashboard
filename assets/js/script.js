let cities = [];
let weatherSection = $("#weather-stuff");
let forecastSection = $("#forecast-stuff");
let citySearch = "";
let apiKey = "7eed36f27d06c72d7bd4346eee02a6cf";
let searchEl = document.querySelector("#search-btn");
let cityEl = document.querySelector("#search-city");
let searchHistory = $('#search-history');

function searchWeather() {
    let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + citySearch + "&limit=5&appid=" + apiKey + "&units=metric";
    fetch(queryURL, {
    method: 'GET',
})
.then( response => { 
    return response.json();
}).then( data => {
    console.log(data);
    let date = moment().format("MM/DD/YYYY");
    let icon = data.weather[0].icon;
    let iconURL = "http://openweathermap.org/img/wn/" + icon + ".png";
    let weatherTitle = $("<h2>").html(citySearch + " (" + date + ")").attr({"class": "card-header"});
    let currentTemperature = data.main.temp;
    let temperatureDisplay = $("<h2>").html("Temperature: " + currentTemperature + " °C").attr({"class": "temp"});
    let currentHumidity = data.main.humidity;
    let humidityDisplay = $("<h2>").html("Humidity: " + currentHumidity + "%").attr({"class": "humidity"});
    let currentWind = data.wind.speed;
    let windDisplay = $("<h2>").html("Wind: " + currentWind + " km/h").attr({"class": "wind"});
    let lat = data.coord.lat;
    let lon = data.coord.lon;
    let dt = data.dt;
    console.log(lat,lon,dt);
    
    

    function getUVIndex() {
        let UVIndexURL = "https://api.openweathermap.org/data/2.5/onecall/timemachine?lat=" + lat + "&lon=" + lon + "&dt=" + dt + "&daily" + "&appid=" + apiKey;
        fetch(UVIndexURL, {
            method: 'GET',
        })
        .then( UVResponse => {
            return UVResponse.json();
        })
        .then( UVData => {
            console.log(UVData);

            let uvi = UVData.current.uvi;
            console.log(uvi);

            let UVDisplay = $("<h3>").html("UV Index: " + uvi).attr({"class": "uvi"});
            weatherSection.append(UVDisplay);

            if (uvi <= 2) {
                $(".uvi").attr({"class": "uvi good"});
            };
            if (uvi > 2 && uvi <= 5) {
                $(".uvi").attr({"class": "uvi bad"});
            };
            if (uvi > 5) {
                $(".uvi").attr({"class": "uvi terrible"});
            };

        })
    }

    function forecast() {
        let forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + citySearch + "&appid=" + apiKey + "&units=metric";
        fetch(forecastURL, {
            method: 'GET',
        })
        .then( forecastResponse => { 
            return forecastResponse.json();
        }).then( forecastData => {
            console.log(forecastData);
            let forecastDays = 1;
            
            for (i = 7; i < forecastData.list.length; i+=8) {
                let forecastContainer = $('<section>').attr({"class": "card-p3 forecast-container"});
                let forecastHeader = $('<h2>').attr({"class": "card-header"});
                let forecastImageLink = "https://openweathermap.org/img/wn/" + forecastData.list[i].weather[0].icon + ".png";
                let forecastImage = $('<img>').attr({"src": forecastImageLink});
                let forecastTemperatureLink = forecastData.list[i].main.temp;
                let forecastTemperature = $('<h2>');
                let forecastWindLink = forecastData.list[i].wind.speed;
                let forecastWind = $('<h2>');
                let forecastHumidityLink = forecastData.list[i].main.humidity;
                let forecastHumidity = $('<h2>');
                

                forecastHeader.text(moment().add(forecastDays, 'd').format('D/M/YYYY'))
                forecastTemperature.text(forecastTemperatureLink + " °C");
                forecastWind.text(forecastWindLink + " km/h");
                forecastHumidity.text(forecastHumidityLink + "%")

                forecastSection.append(forecastContainer)
                forecastContainer.append(forecastHeader);
                forecastContainer.append(forecastImage);
                forecastContainer.append(forecastTemperature);
                forecastContainer.append(forecastHumidity)
                forecastContainer.append(forecastWind);

                forecastDays++;

            }
        })
    }





    weatherSection.prepend(weatherTitle);
    weatherSection.append($("<img>").attr("src", iconURL));
    weatherSection.append(temperatureDisplay);
    weatherSection.append(humidityDisplay);
    weatherSection.append(windDisplay);
    getUVIndex();
    forecast();
});
}

function addHistory() {
    if (!cities.includes(citySearch)) {
        
        cities.push(citySearch);
        let historyBtn = $('<button>').attr({"class": "m-2"});
        historyBtn.text(citySearch);
        searchHistory.append(historyBtn);
        localStorage.setItem('City History', JSON.stringify(cities));
    }
}

$("#search-btn").click(function() {
    event.preventDefault();
    citySearch = $("#search-city").val().trim();
    addHistory();
    searchWeather();
});