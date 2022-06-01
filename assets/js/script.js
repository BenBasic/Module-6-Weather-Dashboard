let cities = [];
let weatherSection = $("#weather-stuff");
let citySearch = "";
let apiKey = "7eed36f27d06c72d7bd4346eee02a6cf";

function searchWeather() {
    let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + "Toronto" + "&limit=5&appid=" + apiKey + "&units=metric";
    fetch(queryURL, {
    method: 'GET',
})
.then( response => { 
    let date = moment().format("MM/DD/YYYY");
    let icon = response.weather[0].icon;
    let iconURL = "http://openweathermap.org/img/w/" + iconCode + ".png";
    let weatherTitle = $("<h2>").html(citySearch + date);
    
    weatherSection.prepend(weatherTitle);
    weatherSection.append($("<img>").attr("src", iconURL));
    return response.json();
}).then( data => {
    console.log(data);
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