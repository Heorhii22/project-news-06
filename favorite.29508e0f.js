fetch("https://ipinfo.io/json?token=2f70f8945bdfe0").then((function(e){return e.json()})).then((function(e){var t;t=e.city,fetch("https://api.openweathermap.org/data/2.5/weather?q=".concat(t,"&appid=").concat("c6d27dc8c63eae4b1bf25b80583f432d")).then((function(e){return e.json()})).then((function(e){var t=Math.round(e.main.feels_like-273.15)+"&deg;",a='<div class="weather-card"><div class="weather-card__info"><p class="weather-card__temperature">'.concat(t,'</p><p class="weather-card__main">').concat(e.weather[0].main,'</p><p class="weather-card__geolocation">').concat(e.name,'</p><img src="http://openweathermap.org/img/w/').concat(e.weather[0].icon,'.png"></div></div>');return document.body.insertAdjacentHTML("beforeend",a)}))}));
//# sourceMappingURL=favorite.29508e0f.js.map
