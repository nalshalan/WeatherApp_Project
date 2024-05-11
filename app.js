const API_KEY = "a1609b81b12685995cbc23ff3acfa234";

let stateCode = "";
let countryCode = "";
let limit = 5;

function getWeather(event) {
    event.preventDefault();
    const cityNameInput = document.getElementById("cityInput");

    fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${cityNameInput.value},${stateCode},${countryCode}&limit=${limit}&appid=${API_KEY}`)
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        console.log(data);
        console.log(data[0]);
        const area = { lat: data[0].lat, lon: data[0].lon };
        selectedAreas.addArea(area);
        weatherData(area.lat, area.lon);
    })
    .catch((err) => {
        console.log(err);
    });
}
const form = document.getElementById("weather-form");
console.log(form);

form.addEventListener("submit", (event) => {
    event.preventDefault();
    getWeather(event);
});

function weatherData(lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`)
    .then((response) => {
        return response.json();
    })
    .then((data) => {

        const weatherContainer = document.createElement("div");
        weatherContainer.classList.add("weather-container");

        const cityNameHeader = document.createElement("h2");
        cityNameHeader.textContent = data.name;
        weatherContainer.append(cityNameHeader);

        const tempPar = document.createElement("p");
        tempPar.textContent = `Temperature: ${Math.round((data.main.temp - 273.15) * (9/5) + 32)} deg. F`;
        weatherContainer.append(tempPar);

        const weatherPar = document.createElement("p");
        weatherPar.textContent = `Weather: ${data.weather[0].description}`;
        weatherContainer.append(weatherPar);

        const weatherIcon = document.createElement("img");
        weatherIcon.src = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
        weatherIcon.alt = data.weather[0].description;
        weatherIcon.title = data.weather[0].description;
        weatherContainer.appendChild(weatherIcon);

        const weatherContainerDiv = document.querySelector(".cityWeather");
        weatherContainerDiv.innerHTML = "";
        weatherContainerDiv.appendChild(weatherContainer);
        
    })
    .catch((err) => {
        console.log(err);
    });
}

class SelectedAreas {
    constructor() {
        this.areas = [];
        this.lastUpdate = null;
    }

    addArea(area) {
        this.areas.push(area);
    }

    removeArea(index) {
        this.areas.splice(index, 1);
    }

    refetchWeather() {
        this.lastUpdate = new Date();
        this.areas.forEach(area => {
            weatherData(area.lat, area.lon);
        });
        console.log("Last Update:", this.lastUpdate);
    }
}

const selectedAreas = new SelectedAreas();

const refetchButton = document.createElement("button");
refetchButton.textContent = "Refetch Weather for Selected Areas";
refetchButton.addEventListener("click", () => {
    selectedAreas.refetchWeather();
});
document.body.appendChild(refetchButton);