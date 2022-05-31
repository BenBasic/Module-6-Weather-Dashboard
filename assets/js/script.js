let cities = [];
let weatherSection = $("#weather-stuff");
let citySearch = "";
let apiKey = "7eed36f27d06c72d7bd4346eee02a6cf";

function searchWeather() {
    let queryURL = "https://api.openweathermap.org/data/3.0/weather?q=" + "Toronto" + "&limit=5&appid=" + apiKey;
    fetch(queryURL, {
    method: 'GET',
})
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    console.log(data);
  });
}

searchWeather();