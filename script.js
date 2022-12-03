const currentLocation = document.querySelector("#currentLocation");

class App {
  constructor() {
    this.apiKey = "50653196992aeec2be1dd86c17e40203";
  }

  setPosition(latitude, longitude) {
    this.latitude = latitude;
    this.longitude = longitude;
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
}

const app = new App();

currentLocation.addEventListener("click", () => {
  navigator.geolocation.getCurrentPosition(async (position) => {
    app.setPosition(position.coords.latitude, position.coords.longitude);
    const data = await app.fetchWeatherByLatAndLon();

    console.log(data);
  });
});
