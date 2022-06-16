const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const https= require("https");
const bodyParser= require("body-parser");

const app= express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req,res){
  res.render("home.ejs");
});


app.post("/", function(req, res){
  console.log(req.body.cityName);

  const query = req.body.cityName;
  const appidkey= process.env.APP_ID;
  const unit = "metric";

  const url= ("https://api.openweathermap.org/data/2.5/weather?q=" + query +"&appid=" + appidkey + "&units=" + unit);

  https.get(url, function(response){
    console.log(response.statusCode);

    response.on("data", function(data){
      const weather= JSON.parse(data);

      if (weather.main == undefined) {
        res.render("home.ejs", { weather: null, error: 'Error, please try again' });
      } else {

        const temp = weather.main.temp;
        const description = weather.weather[0].description;
        const icon = weather.weather[0].icon;
        const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

        const low = weather.main.temp_min;
        const high = weather.main.temp_max;
        const highlow = Math.round(low) + "°c / " + Math.round(high) + "°c";

        const cityName = weather.name;
        const country = weather.sys.country;
        const location = cityName + ", " + country;

        let now = new Date();
        let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

        let day = days[now.getDay()];
        let date = now.getDate();
        let month = months[now.getMonth()];
        let year = now.getFullYear();

        let today = (day + ", " + date + " " + month + " " + year);


        //console.log(temp);
        //console.log(description);
        //console.log(icon);

        //res.write("<p>The weather in " + query + " is " + description + "</p>");
        //res.write("<h1>The temperature in " + query + " is " + temp + " degrees Celsius.</h1>");
        //res.write("<img src=" + imageURL + ">");
        //res.send();

        res.render("display.ejs", {
          Location: location,
          Date: today,
          image: imageURL,
          Temp: temp,
          Weather: description,
          Highlow: highlow
        });
      }
    });
  });

});

app.listen(process.env.PORT || 3000, function(){
  console.log("Server is running on port 3000");
});

//➔
