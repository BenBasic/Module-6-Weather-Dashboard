// Sets an empty array for city search history to be populated later after searches are made
let cities = [];

// Variables referencing JQuery in the index.html
let weatherSection = $("#weather-stuff");
let forecastSection = $("#forecast-stuff");
let searchEl = document.querySelector("#search-btn");
let cityEl = document.querySelector("#search-city");
let searchHistory = $('#search-history');

// Sets citySearch to empty to later hold the value of the city searched by the user
let citySearch = "";

// API Key for accessing api data
let apiKey = "7eed36f27d06c72d7bd4346eee02a6cf";


// Function which runs the main program of gathering data from the api and displaying it
function searchWeather() {
    // Accessing data from the api with the searched city and metric units
    let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + citySearch + "&limit=5&appid=" + apiKey + "&units=metric";
    fetch(queryURL, {
    method: 'GET',
})
.then( response => { 
    // Returns json object for reference
    return response.json();
}).then( data => {
    console.log(data);
    // Clears any previously displayed weather data to prevent program from adding on additional city data to clutter the display
    weatherSection.empty();
    forecastSection.empty();

    // Sets the date variable to the current date
    let date = moment().format("MM/DD/YYYY");

    // Variables referencing data from the api, and variables referencing JQuery to add to index.html
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
    
    
    // Function to gather data for the UV Index
    function getUVIndex() {
        // Accessing data from the api with the searched city's latitude, longitude dt (time measurmenet) to gather UV Index data
        let UVIndexURL = "https://api.openweathermap.org/data/2.5/onecall/timemachine?lat=" + lat + "&lon=" + lon + "&dt=" + dt + "&daily" + "&appid=" + apiKey;
        fetch(UVIndexURL, {
            method: 'GET',
        })
        .then( UVResponse => {
            // Returns json object for reference
            return UVResponse.json();
        })
        .then( UVData => {
            console.log(UVData);

            // Defining uvi variable with the current UV Index data from the api
            let uvi = UVData.current.uvi;
            console.log(uvi);

            // Creates a JQuery for the index.html and appends it with the UV Index data
            let UVDisplay = $("<h3>").html("UV Index: " + uvi).attr({"class": "uvi"});
            weatherSection.append(UVDisplay);

            // Series of if statements which will change the color of the UV Index depending on its value depending on how severe it is
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

    // Function to gather data for the 5 day forecast
    function forecast() {
        // Accessing data from the api with the searched city to gather the 5 day forecast data
        let forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + citySearch + "&appid=" + apiKey + "&units=metric";
        fetch(forecastURL, {
            method: 'GET',
        })
        .then( forecastResponse => { 
            // Returns json object for reference
            return forecastResponse.json();
        }).then( forecastData => {
            console.log(forecastData);
            // Assigning the forecastDays variable a value of 1, which will then increase in value to create new boxes for each day in the 5 day forecast
            let forecastDays = 1;
            
            // For loop which will gather the weather data for the following 5 days for the exact time as the current search
            for (i = 7; i < forecastData.list.length; i+=8) {

                // Variables referencing data from the api, and variables referencing JQuery to add to index.html
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
                

                // Assigning the text which will display for each part of weather data
                forecastHeader.text(moment().add(forecastDays, 'd').format('D/M/YYYY'))
                forecastTemperature.text(forecastTemperatureLink + " °C");
                forecastWind.text(forecastWindLink + " km/h");
                forecastHumidity.text(forecastHumidityLink + "%")

                // Appending the data to forecastSection so that it displays on the page
                forecastSection.append(forecastContainer)
                forecastContainer.append(forecastHeader);
                forecastContainer.append(forecastImage);
                forecastContainer.append(forecastTemperature);
                forecastContainer.append(forecastHumidity)
                forecastContainer.append(forecastWind);

                // Increment forecastDays by 1 to add a new card when the for loop begins again
                forecastDays++;

            }
        })
    }


    // Prepending and appending current weather data to the index.html to display on the page
    weatherSection.prepend(weatherTitle);
    weatherSection.append($("<img>").attr("src", iconURL));
    weatherSection.append(temperatureDisplay);
    weatherSection.append(humidityDisplay);
    weatherSection.append(windDisplay);
    // Calls function to begin displaying UV Index data
    getUVIndex();
    // Calls function to begin displaying the 5 day forecast data
    forecast();
});
}

// Function which adds a city the user searches to a list that will display after being searched
function addCities() {
    // If statement checking if the cities array doesn't include the name of the city typed in city search
    if (!cities.includes(citySearch)) {
        
        // Pushing the searched city into the cities array
        cities.push(citySearch);
        // Assigning historyBtn a JQuery and text to match the city being searched
        let historyBtn = $('<button>').attr({"class": "m-2"});
        historyBtn.text(citySearch);
        // Appending the historyBtn to the search history list in the index.html
        searchHistory.append(historyBtn);
        // Assigns the currently searched city into local storage for later reference to load the previous city search history
        localStorage.setItem('City History', JSON.stringify(cities));
    }
}

// Function which loads the past city searches to display when loading the page
function pastSearches() {
    // Assigning the cities array the value of the city history in local storage
    cities = JSON.parse(localStorage.getItem('City History'));
    // If statement checking if the cities array is already populated
    if (cities !== null) {
        // For loop which will increment through the cities array to find each item inside of local storage
        for (let i = 0; i < cities.length; i++) {
            // Assigning historyBtn a JQuery and text to match the city name of the cities inside of the cities array
            let historyBtn = $('<button>').attr({"class": "m-2"});
            historyBtn.text(cities[i]);
            // Appending historyBtn to the search history list in the index.html
            searchHistory.append(historyBtn);
        }
        // Exits the for loop
        return;
    }
    // Prevents function from making the program cease to function if it doesn't detect anything inside of the cities array
    cities = [];
}

// Calls pastSearches function to load and display past city searches
pastSearches();

// Assigning the search button to perform a city weather data search upon clicking
$("#search-btn").click(function() {
    // Prevents page from reloading
    event.preventDefault();
    // Assigns citySearch to the value the user typed into the input and trimming the value
    citySearch = $("#search-city").val().trim();
    // Calls addCities function to add the city being searched to a city history list of buttons and city history local storage
    addCities();
    // Calls searchWeather to runs the main program of gathering data from the api and displaying it 
    searchWeather();
});

// Assigning buttons in city search history a button to perform data searches based on those city named once clicked
searchHistory.on('click', function() {
    // Prevents page from reloading
    event.preventDefault();
    // If statement to check if the target matches the button being clicked
    if (event.target.matches('button')) {
        // Assigns the city being searched the target of the text content for that button
        citySearch = event.target.textContent;
        // Calls searchWeather to runs the main program of gathering data from the api and displaying it
        searchWeather();
    }
});