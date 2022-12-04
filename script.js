const weatherDiv = document.querySelector(".weather");
const userInput = document.querySelector("#userInput");
const okUserInput = document.querySelector("#okUserInput");
const currentLocation = document.querySelector("#currentLocation");

class App {
  constructor() {
    this.apiKey = "50653196992aeec2be1dd86c17e40203";
    this.compassSectors = [
      "N",
      "NNE",
      "NE",
      "ENE",
      "E",
      "ESE",
      "SE",
      "SSE",
      "S",
      "SSW",
      "SW",
      "WSW",
      "W",
      "WNW",
      "NW",
      "NNW",
      "N",
    ];
  }

  setPosition(latitude, longitude) {
    this.latitude = latitude;
    this.longitude = longitude;
  }

  findWindDirection(deg) {
    return this.compassSectors[Math.round((deg % 360) / 22.5)];
  }

  async fetchWeatherByLatAndLon() {
    if (!this.latitude || !this.longitude) {
      return;
    }

    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${this.latitude}&lon=${this.longitude}&units=metric&appid=${this.apiKey}`
    );
    const data = await res.json();

    return data;
  }

  async fetchCountry(code) {
    const res = await fetch(`https://restcountries.com/v3.1/alpha/${code}`);
    const data = await res.json();

    return data[0].name.common;
  }

  async show(data) {
    const city = data.name;
    const country = await this.fetchCountry(data.sys.country);
    const weather = data.weather[0];

    let div = `
      <div class="d-flex justify-content-between align-items-center">
        <h4>${city}, ${country}</h4>
        <h6>${new Date(data.dt * 1000).toLocaleString("az-AZ")}</h6>
      </div>

      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4>${weather.main}</h4>
          <p>${weather.description}</p>
        </div>

        <img src="http://openweathermap.org/img/wn/${
          weather.icon
        }@4x.png" width="100">
      </div>

      <div class="row gy-4 mb-4">
        <div class="col-6 col-sm-3">
          <p class="mb-2">Real feel</p>
          <h5>${data.main.feels_like} °C</h5>
        </div>

        <div class="col-6 col-sm-3">
          <p class="mb-2">Temp</p>
          <h5>${data.main.temp} °C</h5>
        </div>

        <div class="col-6 col-sm-3">
          <p class="mb-2">Min temp</p>
          <h5>${data.main.temp_min} °C</h5>
        </div>

        <div class="col-6 col-sm-3">
          <p class="mb-2">Max temp</p>
          <h5>${data.main.temp_max} °C</h5>
        </div>
      </div>

      <div class="row gy-4">
        <div class="col-6 col-sm-3">
          <p class="mb-2">Humidity</p>
          <h5>${data.main.humidity} %</h5>
        </div>

        <div class="col-6 col-sm-3">
          <p class="mb-2">Pressure</p>
          <h5>${data.main.pressure} hPa</h5>
        </div>

        <div class="col-6 col-sm-3">
          <p class="mb-2">Wind speed</p>
          <h5>${data.wind.speed} m/s</h5>
        </div>

        <div class="col-6 col-sm-3">
          <p class="mb-2">Wind direction</p>
          <h5>${this.findWindDirection(data.wind.deg)}</h5>
        </div>
      </div>
    `;

    weatherDiv.innerHTML = div;
  }
}

const app = new App();

currentLocation.addEventListener("click", () => {
  navigator.geolocation.getCurrentPosition(async (position) => {
    app.setPosition(position.coords.latitude, position.coords.longitude);
    const data = await app.fetchWeatherByLatAndLon();

    app.show(data);
    userInput.value = "";
  });
});

okUserInput.addEventListener("click", async () => {
  const value = userInput.value;

  if (/\d+/g.test(value)) {
    const [lat, lon] = value.replace(/\s+/g, "").split(",");
    app.setPosition(+lat, +lon);

    const data = await app.fetchWeatherByLatAndLon();

    app.show(data);
  } else {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${value}&units=metric&appid=${app.apiKey}`
    );
    const data = await res.json();

    app.show(data);
  }
});
