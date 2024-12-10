const apiKey = "c524fac4b59e4ee39cb185215240812";

const weatherForm = document.querySelector("form");
const cityInput = document.getElementById("cityInput");
const card = document.querySelector(".weather");
const mainDayName = document.querySelector(".mainDayName");
const mainDayDate = document.querySelector(".mainDayDate");
const mainCityName = document.querySelector(".mainCityName");
const mainCityTemp = document.querySelector(".mainCityTemp");
const mainDesc = document.querySelector(".mainDesc");

window.addEventListener("load", function () {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      try {
        const weatherData = await getWeatherDataByLocation(latitude, longitude);
        displayWeatherData(weatherData);
      } catch (err) {
        console.log(`${err} Failed to get weather data`);
      }
    });
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
});
async function getWeatherDataByLocation(lat, lon) {
  const response = await fetch(
    `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${lat},${lon}&days=3`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch weather data");
  }
  return await response.json();
}
weatherForm.addEventListener("submit", async function (e) {
  e.preventDefault();
  const city = cityInput.value;
  if (city) {
    try {
      const weatherData = await getWeatherData(city);
      console.log(weatherData);
      displayWeatherData(weatherData);
      clearField();
    } catch (err) {
      console.log(`${err} Please Enter A Valid City`);
    }
  }
});

async function getWeatherData(city) {
  const respnse = await fetch(
    `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=3`
  );
  if (!respnse.ok) {
    throw new Error(`${respnse}`);
  }
  return await respnse.json();
}

function displayWeatherData(data) {
  const {
    current: {
      condition: { code, text },
      wind_dir,
    },
    forecast: {
      forecastday: [dayOne, dayTwo, dayThree],
    },
    location: { name },
  } = data;

  const { day, month, weekday } = formatDate(dayOne.date);
  const { weekday: weekday_1 } = formatDate(dayTwo.date);
  const { weekday: weekday_2 } = formatDate(dayThree.date);

  mainDayName.textContent = `${weekday}`;
  mainDayDate.textContent = `${day} ${month}`;
  document.querySelector(".dayName_1").textContent = `${weekday_1}`;
  document.querySelector(".dayName_2").textContent = `${weekday_2}`;

  mainCityName.textContent = name;
  mainCityTemp.textContent = `${dayOne.day.avgtemp_c}°C`;
  mainDesc.textContent = text;
  document.querySelector(
    ".rain"
  ).textContent = `${dayOne.day.daily_chance_of_rain} %`;
  document.querySelector(".wind").textContent = `${dayOne.day.avgvis_km} km/h`;
  document.querySelector(".dirction").textContent = getWindDirection(wind_dir);
  document.querySelector(".mainEmoji").textContent = getWeatherEmoji(code);
  document.querySelector(
    ".cityTempMax_1"
  ).textContent = `${dayTwo.day.maxtemp_c}°C`;
  document.querySelector(
    ".cityTempMin_1"
  ).textContent = `${dayTwo.day.mintemp_c}°C`;
  document.querySelector(
    ".cityTempMax_2"
  ).textContent = `${dayThree.day.maxtemp_c}°C`;
  document.querySelector(
    ".cityTempMin_2"
  ).textContent = `${dayThree.day.mintemp_c}°C`;
  document.querySelector(".desc_1").textContent = dayTwo.day.condition.text;
  document.querySelector(".desc_2").textContent = dayThree.day.condition.text;
  document.querySelector(".emoji_1").textContent = getWeatherEmoji(
    dayTwo.day.condition.code
  );
  document.querySelector(".emoji_2").textContent = getWeatherEmoji(
    dayThree.day.condition.code
  );
}
function clearField() {
  cityInput.blur();
  cityInput.value = "";
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "long" });
  const weekday = date.toLocaleString("en-US", { weekday: "long" });
  return { day, month, weekday };
}

function getWindDirection(direction) {
  if (direction === "N") return "North";
  else if (direction === "S") return "South";
  else if (direction === "E") return "East";
  else if (direction === "W") return "West";
  else if (direction === "NE") return "Northeast";
  else if (direction === "NW") return "Northwest";
  else if (direction === "SE") return "Southeast";
  else if (direction === "SW") return "Southwest";
  else return "Unknown Direction";
}
function getWeatherEmoji(conditionCode) {
  switch (conditionCode) {
    case 1000:
      return "☀️";
    case 1003:
    case 1006:
    case 1009:
      return "☁️";
    case 1030:
      return "🌫️";
    case 1063:
    case 1183:
    case 1195:
      return "🌧️";
    case 1114:
    case 1117:
    case 1210:
      return "❄️";
    case 1087:
      return "🌩️";
    default:
      return "☁️";
  }
}
