const path = require("path");

const express = require("express");
const hbs = require("hbs");

const geocode = require("./utils/geocode");
const forecast = require("./utils/forecast");

const app = express();
const port = process.env.PORT || 3000;

//serving inline html with express

// app.get("", (req, res) => {
//   res.send("<h1>Hello express</h1>");
// });

// app.get("/help", (req, res) => {
//   res.send({ name: "Mahan", age: 36 });
// });

// app.get("/about", (req, res) => {
//   res.send("<h1>about Page</h1>");
// });

//sending json with express
app.get("/weather", (req, res) => {
  if (!req.query.address) {
    return res.send({ error: "Address must be provided" });
  }
  geocode(req.query.address, (geoError, geoData) => {
    if (geoError) {
      return res.send({ error: geoError });
    }
    forecast(geoData.lat, geoData.lon, (weatherError, weatherData) => {
      if (weatherError) {
        return res.send({ error: weatherError });
      }

      res.send({
        address: req.query.address,
        location: geoData.location,
        forecast: weatherData,
      });
    });
  });
});

app.get("/products", (req, res) => {
  //req.query is an object. it will show the query parameters that user has provided in the browser
  //e.g. http://localhost:3000/products?search=games&ratings=5
  // console.log(req.query);
  //returns => { search: 'games', ratings: '5' }

  if (!req.query.search) {
    return res.send({ error: "You must provide a search term" });
  }
  res.send({ products: [] });
});

//serving static html with express
//introducting the public directory of static pages to express
const publicDirPath = path.join(__dirname, "../public");
app.use(express.static(publicDirPath));
//no need to specify specific paths. express will automatically detect all the paths and serves
//the requested page

//using hbs to serve dynamic pages:
//need to set this option to tell the express to use hbs to render dynamic pages
app.set("view engine", "hbs");

//default folder for hbs must be called views and must be located in the root. to change this:
//changing default folder of hbs
const viewsPath = path.join(__dirname, "../templates/views");
app.set("views", viewsPath);

//introducing partials folder to hbs
const partialsPath = path.join(__dirname, "../templates/partials");
hbs.registerPartials(partialsPath);

//serving dynamic html with express and hbs
app.get("", (req, res) => {
  res.render("index", { title: "Weather", name: "Mahan" });
});
app.get("/about", (req, res) => {
  res.render("about", { title: "About", name: "Mahan" });
});

app.get("/help", (req, res) => {
  res.render("help", { title: "Help", message: "need help?", name: "Mahan" });
});
app.get("/help/*", (req, res) => {
  res.render("404", {
    title: "404 Page",
    errMsg: "Help Article Not Found",
    name: "Mahan",
  });
});

app.get("*", (req, res) => {
  res.render("404", {
    title: "404 Page",
    errMsg: "Page Not Found",
    name: "Mahan",
  });
});

app.listen(port, () => {
  console.log(
    new Date().getHours().toString().padStart(2, "0"),
    ":",
    new Date().getMinutes().toString().padStart(2, "0"),
    ":",
    new Date().getSeconds().toString().padStart(2, "0")
  );
  console.log("Server is up on port " + port);
});
