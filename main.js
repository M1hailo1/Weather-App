//Kupljenje mesta u koja unosim zeljene podatke
const userLocation = document.getElementById("userLocation");
const converter = document.getElementById("converter");
const weatherIcon = document.querySelector(".weatherIcon");
const temperature = document.querySelector(".temperature");
const feelsLike = document.querySelector(".feelsLike");
const description = document.querySelector(".description");
const date = document.querySelector(".date");
const city = document.querySelector(".city");
const HValue = document.getElementById("HValue");
const WValue = document.getElementById("WValue");
const SRValue = document.getElementById("SRValue");
const SSValue = document.getElementById("SSValue");
const CValue = document.getElementById("CValue");
const MTValue = document.getElementById("MTValue");
const MinTValue = document.getElementById("MinTValue");
const PValue = document.getElementById("PValue");
const Forecast = document.querySelector(".Forecast");

//Kreiranje promenljive za poziv API-a sa mojim API kljucem
//WEATHER_API = `https://api.openweathermap.org/data/2.5/weather?appid=${myKey}&q=`;
//WEATHER_DATA = `https://api.openweathermap.org/data/2.5/weather?appid=${myKey}&exclude=minutely&units=metric&`;

//const WEATHER_API = "/.netlify/functions/proxy";
const WEATHER_API =
  "https://snazzy-bunny-a1ecf0.netlify.app/.netlify/functions/proxy";

window.onload = function () {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        //fetch(
        //`https://api.openweathermap.org/data/2.5/weather?appid=${myKey}&lat=${position.coords.latitude}&lon=${position.coords.longitude}`
        //)
        fetch(
          `${WEATHER_API}?lat=${position.coords.latitude}&lon=${position.coords.longitude}`
        )
          .then((response) => response.json())
          .then((data) => {
            userLocation.value = data.name;
            findLocation();
          })
          .catch(() => {
            userLocation.value = "Kragujevac";
            findLocation();
          });
      },
      function () {
        userLocation.value = "Kragujevac";
        findLocation();
      }
    );
  } else {
    userLocation.value = "Kragujevac";
    findLocation();
  }
};

//Poziv API-a kako bi dobili zeljene podatke
function findLocation() {
  //fetch(WEATHER_API + userLocation.value)
  fetch(WEATHER_API + "?q=" + userLocation.value)
    .then((response) => response.json())
    .then((data) => {
      if (data.cod != "" && data.cod != 200) {
        alert(data.message);
        return;
      }
      console.log(data);
      city.innerHTML = data.name + ", " + data.sys.country;
      weatherIcon.style.background = `url(https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png)`;
      //fetch(WEATHER_DATA + `lon=${data.coord.lon}&lat=${data.coord.lat}`)
      fetch(`${WEATHER_API}?lon=${data.coord.lon}&lat=${data.coord.lat}`)
        .then((response) => response.json())
        .then((data) => {
          console.log(data);

          temperature.innerHTML = TemConverter(
            (Math.round(data.main.temp * 2) / 2).toFixed(1)
          );
          feelsLike.innerHTML = "Feels like " + data.main.feels_like;
          description.innerHTML =
            `<i class="fa-brands fa-cloudversify"></i> &nbsp;` +
            data.weather[0].description;
          const options = {
            weekday: "long",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          };
          date.innerHTML = getLongFormatDateTime(
            data.dt,
            data.timezone,
            options
          );
          HValue.innerHTML =
            `<span class="units">${Math.round(data.main.humidity)}</span>` +
            "<span class='units'>%</span>";
          WValue.innerHTML =
            `<span class="units">${Math.round(data.wind.speed)}</span>` +
            "<span class='units'>m/s</span>";
          const options1 = {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          };
          SRValue.innerHTML =
            "Sunrise " +
            getLongFormatDateTime(data.sys.sunrise, data.timezone, options1);
          SSValue.innerHTML =
            "Sunset " +
            getLongFormatDateTime(data.sys.sunset, data.timezone, options1);
          CValue.innerHTML =
            `<span class="units">${data.clouds.all}</span>` +
            "<span class='units'>%</span>";
          MTValue.innerHTML =
            "Max Temp. " +
            TemConverter((Math.round(data.main.temp_max * 2) / 2).toFixed(1));
          MinTValue.innerHTML =
            "Min Temp. " +
            TemConverter((Math.round(data.main.temp_min * 2) / 2).toFixed(1));
          PValue.innerHTML =
            `<span class="units">${data.main.pressure}</span>` +
            "<span class='units'> hPa</span>";
        });
    });
}

//Formatiranje datuma
function formatUnixTime(dtValue, offSet, options = {}) {
  const date = new Date((dtValue + offSet) * 1000);
  return date.toLocaleTimeString([], { timeZone: "UTC", ...options });
}

function getLongFormatDateTime(dtValue, offSet, options) {
  return formatUnixTime(dtValue, offSet, options);
}

//Konverzija temperature u Fahrenheit po potrebi
function TemConverter(temp) {
  let tempValue1 = temp;
  let tempValue2 = Math.round(temp);
  let message = "";
  if (converter.value == "°C") {
    message = tempValue1 + "<span>" + "\xB0C</span>";
  } else {
    let ctof = (tempValue2 * 9) / 5 + 32;
    message = ctof + "<span>" + "\xB0F</span>";
  }
  return message;
}

//Potvrdjivanje izbora grada koristeci Enter
userLocation.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    findLocation();
  }
});

converter.addEventListener("change", function () {
  findLocation();
});
