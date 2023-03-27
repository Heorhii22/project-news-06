import { format } from 'date-fns';
const WEATHER_KEY = 'c6d27dc8c63eae4b1bf25b80583f432d';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather?';
let currentCity;
let refs = {};
function getWeatherRefs() {
  //   console.log('refs');
  refs = {
    degs: document.querySelector('.weather__deg'),
    weather: document.querySelector('.weather__value'),
    city: document.querySelector('.weather__city'),
    day: document.querySelector('.weather__day'),
    year: document.querySelector('.weather__year'),
    img: document.querySelector('.weather__img'),
  };
  renderWeater();
  return refs;
}

getUserGeolocation();

async function getUserGeolocation() {
  const response = await fetch('https://ipinfo.io/json?token=2f70f8945bdfe0');
  const userGeoInfo = await response.json();
  currentCity = userGeoInfo.city;
  return currentCity;
}

async function fetchWeather(currentCity) {
  const url = `${BASE_URL}q=${currentCity}&units=metric&appid=${WEATHER_KEY}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    //  console.log(data);
    return data;
  } catch (error) {
    //  console.log(error);
  }
}

// async function fetchWeatherByGeo(city) {
//   const url = `${BASE_URL}q=${city}&appid=${WEATHER_KEY}&units=metric`;
//   try {
//     const response = await fetch(url);
//     const data = await response.json();
//     console.log(data);
//     return data;
//   } catch (error) {
//     //  console.log(error);
//   }
// }

async function renderWeater() {
  const data = await fetchWeather(currentCity);
  const { feels_like } = data.main;
  const weather = data.weather[0];
  const { icon } = data.weather[0];
  refs.degs.textContent = `${Math.floor(feels_like)}°`;
  refs.weather.textContent = weather.main;
  refs.city.textContent = data.name;

  refs.day.textContent = format(new Date(), 'eee');
  refs.year.textContent = format(new Date(), 'dd LLL y');
  refs.img.setAttribute(
    'src',
    `https://openweathermap.org/img/wn/${icon}@4x.png`
  );
}

// async function getGeoposition() {
//   {
//     fetchWeatherByGeo(currentCity).then(data => {
//       const { temp } = data.main;
//       const weather = data.weather[0];
//       const { icon } = data.weather[0];
//       refs.degs.textContent = `${Math.floor(temp)}°`;
//       refs.weather.textContent = weather.main;
//       refs.city.textContent = data.name;

//       refs.day.textContent = format(new Date(), 'eee');
//       refs.year.textContent = format(new Date(), 'dd LLL y');
//       refs.img.setAttribute(
//         'src',
//         `https://openweathermap.org/img/wn/${icon}@4x.png`
//       );
//     });
//   }
// }

// getGeoposition();

export { getWeatherRefs };
