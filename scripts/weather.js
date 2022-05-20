function getWeather() {
    const appid = "970432d5da619d20b2d585399f6ca3aa";
    const form = document.getElementById("weather-form");
    const lat = form.elements["latitude"].value;
    const long = form.elements["longitude"].value;


    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    getCurrentWeather(lat, long, appid, requestOptions);
    getFiveDayWeather(lat, long, appid, requestOptions);
}

function getCurrentWeather(lat, long, appid, opts) {
    const weatherLocation = document.getElementById("weather-locaiton");
    const weatherIcon = document.getElementById("weather-icon");
    const weatherTemp = document.getElementById("current-temp");
    const weatherStats = document.getElementById("current-stats");

    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${appid}&units=metric`, opts)
        .then(response => response.json())
        .then(res => {

            //set current location and date
            let cuurentLocation = `<h1 class="location-date__location">${res.name}, ${res.sys.country}</h1> <div>${new Date(res.dt * 1000).toDateString()}</div>`;
            weatherLocation.innerHTML = cuurentLocation;

            //set current weather
            weatherIcon.innerHTML = `<img src="icons/${res.weather[0].icon}.svg" class="current-weather__icon" alt="">`;
            weatherTemp.innerHTML = `<div class="current-weather__temp-value">${Math.round(res.main.temp)}&deg;</div><div class="current-weather__temp-summary">${res.weather[0].description}</div>`;
            weatherStats.innerHTML = `<div>
                                            <div class="current-weather__stats-value">${res.main.temp_max}&deg</div>
                                            <div class="current-weather__stats-label">High</div>
                                            <div class="current-weather__stats-value">${res.main.temp_min}&deg</div>
                                            <div class="current-weather__stats-label">Low</div>
                                        </div>
                                        <div>
                                            <div class="current-weather__stats-value">${res.wind.speed}mph</div>
                                            <div class="current-weather__stats-label">Wind</div>
                                            <div class="current-weather__stats-value">${res.main.humidity}%</div>
                                            <div class="current-weather__stats-label">Humidity</div>
                                        </div>
                                        <div>
                                            <div class="current-weather__stats-value">05:27</div>
                                            <div class="current-weather__stats-label">Sunrise</div>
                                            <div class="current-weather__stats-value">20:57</div>
                                            <div class="current-weather__stats-label">Sunset</div>
                                        </div>`;
        })
        .catch(error => console.log('error', error));
}

function getFiveDayWeather(lat, long, appid, opts) {
    const weatherContainer = document.getElementById("weather-container");
    const weatherToday = document.getElementById("forcast-today");
    const weattherFiveDays = document.getElementById("forcast-five-days");

    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=${appid}&units=metric`, opts)
        .then(response => response.json())
        .then(result => {
            const todaysForcast = result.list.slice(0, 7);

            //Todays weather
            let todaysWeatherEle = ``;
            todaysForcast.forEach(fcr => {
                const time = fcr.dt_txt.split(" ")[1].split(":");
                todaysWeatherEle += `<div class="forcast-day card"> 
                                        <div class="forcast-day__time py-2">${time[0]}:${time[1]}</div>
                                        <div class="forcast-day__icon-container"><img src="icons/${fcr.weather[0].icon}.svg" class="forcast-day__icon" alt=""></div>
                                        <div class="forcast-day__temp py-2">${Math.round(fcr.main.temp)}&deg;</div>
                                    </div>`;
            });
            weatherToday.innerHTML = todaysWeatherEle;

            //Five days weather
            let fiveDaysWeatherEle = ``;
            const fiveDaysForcast = result.list.slice(7, result.list.length);
            // console.groupCollapsed(fiveDaysForcast);
            for (let i = 0; i < fiveDaysForcast.length; i += 8) {
                const item = fiveDaysForcast[i];
                const date =item.dt_txt.split(" ")[0].split("-");
                
                fiveDaysWeatherEle += `<div class="forcast-row card"> 
                                    <div class="forcast-day__hour py-2 capitalize"><div>${date[2]}/${date[1]}</div><div class="forcast-row__label">${item.weather[0].description}</div></div>
                                    <div class="forcast-day__icon-container "><img src="icons/${item.weather[0].icon}.svg" class="forcast-day__icon" alt=""></div>
                                    <div class="grid py-2"><div>${Math.round(item.main.temp_min)}&deg;</div><div class="forcast-row__label">Low</div></div>
                                    <div class="grid py-2"><div>${Math.round(item.main.temp_max)}&deg;</div><div class="forcast-row__label">High</div></div>
                                    <div class="grid py-2"><div>${Math.round(item.main.humidity)}%</div><div class="forcast-row__label">Humidity</div></div>
                                    <div class="grid py-2"><div>${Math.round(item.wind.speed)}mph</div><div class="forcast-row__label">Wind</div></div>
                                </div>`;
            }
            weattherFiveDays.innerHTML = fiveDaysWeatherEle;
        })
        .catch(error => console.log('error', error));
}
