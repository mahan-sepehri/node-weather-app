const request = require("request");

const forecast = (lat, lon, callback) => {
  const weatherUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&units=metric&appid=999e9db341d92a0741aa0d66491ef63a`;
  request({ url: weatherUrl, json: true }, (error, response) => {
    if (error) {
      callback("Unable to connect to weather service", undefined);
    } else if (response.body.cod === "400") {
      callback("Unable to find location", undefined);
    } else {
      callback(undefined, {
        description: response.body.current.weather[0].description.toUpperCase(),
        current: `It is currently ${response.body.current.temp} degrees out. and it feels like ${response.body.current.feels_like} degrees`,
      });
    }
  });
};

module.exports = forecast;
