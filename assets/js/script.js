//var apiKey1 = ea9abd5092bfe7b22130b95 1bffc64cf
//var myApiKey = apiKey1
var header = document.querySelector(".header")
var userInput = document.querySelector("#userInput")
var searchBtn = document.querySelector("#searchBtn")
var temp = document.querySelector("#temp")
var wind = document.querySelector("#wind")
var humidity = document.querySelector("#humidity")
var uvi = document.querySelector("#uvi")
var currentCity = document.querySelector(".currentCity")
var fiveDayForecast = document.querySelector(".fiveDayForecast")
var cityName = document.querySelector("#name")
var previous = document.querySelector(".previous-searches")
var currentIcon = document.querySelector("#currentIcon")

// global var 
var lat;
var lon;
var search;
var preSearch;
var previousBtnEl;
var todayDate = new Date().toLocaleDateString('en-us', { year: "numeric", month: "numeric", day: "numeric"});
var today = todayDate;
var daily;

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
                console.log(lat, lon)
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

                fiveDay()
            })
        }
    })
}

// fiveday forecast functions
var fiveDay = function() {
    fiveDayForecast.innerHTML = "";

    for (var i = 0; i <6; i++) {
        var forecastDate = new Date(daily[i].dt * 1000).toLocaleDateString({weekday: "long", year: "numeric", month: "numeric"})
        var temp = "Temp: " + Math.round(daily[i].temp["max"]) + "\u00B0" + "F"
        var wind = "Wind: " + Math.round(daily[i].wind_speed) + "mph";
        var humidity = "Humidity: " + Math.round(daily[i].humidity) + "%";

        var icon = daily[i].weather[0]["icon"];
        var iconUrl = "https://openweathermap.org/img/wn/" + icon + ".png";

        // create elements to appendChild
        var divEl = createItem("div", "col-xs divCard fiveDayForecast");
        var dayDate = createItem("h5", "dayDate");
        dayDate.innerHTML = forecastDate;
        var iconImg = createItem("img", "iconImg");
        iconImg.setAttribute("src", iconUrl);
        iconImg.style.width = "20px";
        var ulListEl = createItem("ul", "ulList");
        ulListEl.style.listStyle = "none";
        ulListEl.style.paddingLeft = "0px";
        var listItemA = createItem("li", "listItem");
        listItemA.innerHTML = temp;
        var listItemB = createItem("li", "listItem");
        listItemB.innerHTML = wind;
        var listItemC = createItem("li", "listItem");
        listItemC.innerHTML = humidity;

        fiveDayForecast.appendChild(divEl);
        divEl.appendChild(dayDate);
        divEl.appendChild(iconImg);
        divEl.appendChild(ulListEl);
        ulListEl.append(listItemA, listItemB, listItemC);
    }
}

var previousSearches = function() {

    var getSearches = JSON.parse(localStorage.getItem("searches")) || [];
    if(userInput.value != "") {
        getSearches.push(userInput.value);
    }
    var saveSearches = localStorage.setItem("searches", JSON.stringify(getSearches))
    previous.innerHTML = "";

    for (var i = 0; i < getSearches.length; i++) {
        previousBtnEl = createItem("button", "btn btn-secondary previousList");
        search = getSearches[i];
        previousBtnEl.innerHTML = search;
        previousBtnEl.setAttribute("cityName", search);
        $(previous).append(previousBtnEl);
    }
};

// search history functions
function searchHistory(e) {

    var button = e.target;
    preSearch = button.getAttribute("cityName");
    userInput.value = preSearch;

    var userInputEl = preSearch;
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + userInputEl + "&units=imperial&APPID=ea9abd5092bfe7b22130b951bffc64cf"
    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                lon = data.coord.lon
                lat = data.coord.lat

                getWeather();
            })
        }
    })
};

document.onload = previousSearches()

searchBtn.addEventListener("click", getLonLat)
previous.addEventListener("click", searchHistory)