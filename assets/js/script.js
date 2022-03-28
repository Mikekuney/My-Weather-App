//var apiKey1 = ea9abd5092bfe7b22130b951bffc64cf
//var myApiKey = apiKey1
var userInput = document.querySelector("#userInput")
var temp = document.querySelector("#temp")
var wind = document.querySelector("#wind")
var humidity = document.querySelector("#humidity")
var uvi = document.querySelector("#uvi")

// call function to create elements
var createItem = function (element, className) {
    var newItem = document.createElement(element);
    newItem.setAttribute('class', className);
    return newItem;
}
// fetching api for lon/lat coordinates
var getLonLat = function (event) {
    event.preventDefault();

    if (!userInput.value) {
        alert("Please enter a city");
    }

    var userInputEl = userInput.value;
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + userInputEl + "&units=imperial&APPID=ea9abd5092bfe7b22130b951bffc64cf"
    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                lon = data.coord.lon
                lat = data.coord.lat
                console.log(lat, lonS)
                getWeather();
                previousSearches();
            })
        }
    })
};

// call api to get weather function
var getWeather = function() {

    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&exclude=hourly&appid=ea9abd5092bfe7b22130b951bffc64cf";

    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function (data) {
                console.log(data.daily)
                daily = data.daily
                var icon = data.current.weather[0]["icon"]
                var iconUrl = "https://openweathermap.org/img/w/" + icon + ".png"
                var iconAdd = currentIcon.setAttribute("src", iconUrl)

                cityName.innerHTMl = userInput.value + " (" + today + ") "
                temp.innerHTML = "Temp: " + Math.round(data.current.temp) + "\u00B0" + "F"
                wind.innerHTML = "Wind: " + Math.round(data.current.wind_speed) + "mph"
                humidity.innerHTML = "Humidity: " + Math.round(data.current.humidity) + "%"
                uvi.innerHTML = "UVI Index: "
                var uviCurrent = createItem("span", "uvi-current")
                uviCurrent.innerHTML = data.current.uvi
                uvi.appendChild(uviCurrent)
                    if(data.current.uvi <= 2) {
                        uviCurrent.className = "uvi-low"
                    } else if(data.current.uvi > 2 && data.current.uvi <= 5) {
                        uviCurrent.className = "uvi-moderate"
                    } else if(data.current.uvi > 5 && data.current.uvi < 7) {
                        uviCurrent.className = "uvi-high"
                    } else {
                        uviCurrent.className = "uvi-very-high"
                    }
                userInput.value = ""


            })
        }
    })
}