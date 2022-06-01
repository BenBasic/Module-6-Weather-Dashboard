let cities = [];
let weatherSection = $("#weather-stuff");
let citySearch = "Dubai";
let apiKey = "7eed36f27d06c72d7bd4346eee02a6cf";

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
    let iconURL = "http://openweathermap.org/img/w/" + icon + ".png";
    let weatherTitle = $("<h2>").html(citySearch + date).attr({"class": "weather title"});
    let currentTemperature = data.main.temp;
    let temperatureDisplay = $("<h2>").html(currentTemperature).attr({"class": "temp"});
    let currentHumidity = data.main.humidity;
    let humidityDisplay = $("<h2>").html(currentHumidity + "%").attr({"class": "humidity"});
    let currentWind = data.wind.speed;
    let windDisplay = $("<h2>").html(currentWind).attr({"class": "wind"});
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

            let UVDisplay = $("<h3>").html(uvi)
            weatherSection.append(UVDisplay);

        })
    }

    function forecast() {
        let forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + citySearch + "&appid=" + apiKey;
        fetch(forecastURL, {
            method: 'GET',
        })
        .then( forecastResponse => { 
            return forecastResponse.json();
        }).then( forecastData => {
            console.log(forecastData);
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

//   .then(function (response) {
//     console.log(response);

//     //Do something related to promise here I guess



    
//     return response.json();
//   })
//   .then(function (data) {
//     console.log(data);
//   })
//   .catch(err => {
//     console.log('Oh noooo!!');
//     console.log(err);
//   });
// }

searchWeather();