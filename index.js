import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

import { config } from "dotenv";
config();
app.set("view engine", "ejs");

let dayDate;

app.get("/", (req, res) => {
  const sendData = {
    location: "",
    country: "",
    temp: "0",
    disc: "",
    feel: "0",
    humidity: "0",
    speed: "0",
    main: "",
    isInitialLoad: true, // Added this flag
  };
  res.render("index.ejs", { sendData: sendData });
});

app.post("/", async (req, res) => {
  let location = req.body.city;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${process.env.APIKEY}&units=metric`;
  let weatherIcon;
  let bgImage;
  try {
    const response = await axios.get(url);
    const weatherData = response.data;
    console.log(weatherData);
    const temp = Math.floor(weatherData.main.temp);
    const disc = weatherData.weather[0].description;
    const icon = weatherData.weather[0].icon;
    const main = weatherData.weather[0].main;
    const imageUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

    // Set weatherIcon.src based on weather conditions
    switch (main) {
      case "Clouds":
        weatherIcon = "icons/clouds.png";
        bgImage = `images/${
          weatherData.weather[0].icon.slice(-1) === "n" ? "night" : "day"
        }/cloudy.jpg`;
        break;
      case "Clear":
        weatherIcon = "icons/clear.png";
        bgImage = `images/${
          weatherData.weather[0].icon.slice(-1) === "n" ? "night" : "day"
        }/clear.jpg`;
        break;
      case "Rain":
        weatherIcon = "icons/rain.png";
        bgImage = `images/${
          weatherData.weather[0].icon.slice(-1) === "n" ? "night" : "day"
        }/rainy.jpg`;
        break;
      case "Drizzle":
        weatherIcon = "icons/drizzle.png";
        bgImage = `images/${
          weatherData.weather[0].icon.slice(-1) === "n" ? "night" : "day"
        }/rainy.jpg`;
        break;
      case "Mist":
      case "Fog":
      case "Haze":
        weatherIcon = "icons/mist.png";
        bgImage = `images/${
          weatherData.weather[0].icon.slice(-1) === "n" ? "night" : "day"
        }/haze.jpg`;
        break;
      default:
        break;
    }

    const sendData = {
      temp,
      disc,
      imageUrl,
      location: weatherData.name,
      feel: Math.floor(weatherData.main.feels_like),
      humidity: weatherData.main.humidity,
      speed: Math.floor(weatherData.wind.speed * 3.6),
      country: weatherData.sys.country,
      main,
      weatherIcon,
      bgImage,
      dayDate,
      isInitialLoad: false, // Flag is updated
    };
    res.render("index.ejs", { sendData });
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
