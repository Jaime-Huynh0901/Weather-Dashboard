let cityName = '';
let cityNameArray = ['Los Angeles'];
const apiKey = '03c42fd0107a2e74601d8b1da29c9b04';


getLocalStorage();

window.onload = event => {
    const lastSearch = `${cityNameArray[cityNameArray.length-1]}`
    getWeather(lastSearch);
    searchHistory(cityNameArray, cityNameArray.length);
}

$('.btn-cityName').on('click', (event) => {
    cityName = $('#cityName').val().trim();
    getWeather(cityName);
    setLocalStorage(cityName);
    searchHistory(cityNameArray, cityNameArray.length);
    $('#cityName').val('');
})

$('#searchList').on('click', event => {
    event.preventDefault();

    if (event.target.classList.contains('search-item')){
        const clickItem = event.target.text;
        getWeather(clickItem);
        setLocalStorage(clickItem);
        searchHistory(cityNameArray, cityNameArray.length);
    }
})

/*
*******************************************
*******************************************
        Function Declaration
*/

function getWeather(cityName) {
    
    const apiUrl = `https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`;

    $.ajax({
        url: apiUrl,
        method: 'GET'
    })
    .then ( response => {
        console.log(response);
        const oneCallUrl = `https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/onecall?lat=${response.coord.lat}&lon=${response.coord.lon}&exclude=hourly,minutely&appid=${apiKey}`;

        $.ajax({
            url: oneCallUrl,
            method: 'GET'
        })
        .then ( res => {
            console.log(res.daily[1].weather);
            generateHTML (res, cityName);
        })
    })
}

function generateHTML (data, cityName) {
    const currentDate = convertDate(data.daily[0].dt);
    const currentTemp = convertTemp(data.current.temp);
    $('#currentWeather').html(`
    <h2>${cityName} (${currentDate}) <span><img src='https://cors-anywhere.herokuapp.com/http://openweathermap.org/img/wn/${data.current.weather[0].icon}.png' alt ='Weather Icon'></span></h2>
    <p>Temperature: ${currentTemp} F</p>
    <p>Humidity: ${data.current.humidity} %</p>
    <p>Wind Speed: ${data.current.wind_speed} MPH</p>
    <p>UV Index: ${data.current.uvi}</p>
    `)

    for (let i = 1 ; i <=5; i++){
        const dailyDate = convertDate(data.daily[i].dt);
        const dailyTemp = convertTemp(data.daily[i].temp.day);
        $(`#title${[i]}`).html(`
        <h5>${dailyDate}</h5>
        <img src='https://cors-anywhere.herokuapp.com/http://openweathermap.org/img/wn/${data.daily[i].weather[0].icon}.png' alt ='Weather Icon'>
        <p>Temp: ${dailyTemp} F</p>
        <p>Humidity: ${data.daily[i].humidity} %</p>
        `)
    }
}

function convertDate (timestamp) {
  const myDate = new Date(timestamp * 1000);
  const year = myDate.getFullYear();
  const month = (myDate.getMonth() +1 );
  const date = myDate.getDate();
  const time = `${month}/${date}/${year}`;
  
  return time;
}

function convertTemp (temp) {
    const myTemp = ((temp -273.15) * 1.80 + 32).toFixed(1);
    return myTemp;
}

function setLocalStorage (cityName) {
    if (cityName == ''){
        return;
    }

    cityNameArray.push(cityName);
    localStorage.setItem('cityNameArray', JSON.stringify(cityNameArray));
}

function getLocalStorage () {
    let storedCityName = JSON.parse(localStorage.getItem('cityNameArray'));

    if (storedCityName !== null) {
        cityNameArray = storedCityName;
    }
}

function searchHistory (cityNameArray, arrayLength) {

    $('#searchList').empty();

    for (let j = arrayLength -1; j >=0; j--){
        const searchItem = $('<a>');
        searchItem.addClass('list-group-item list-group-item-action search-item');
        searchItem.attr('href','#');
        searchItem.text(cityNameArray[j]);
        $('#searchList').append(searchItem);
    }
}

