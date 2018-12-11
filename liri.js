require("dotenv").config();

// variables
var moment = require('moment');
moment().format();
// variable to store keys
var keys = require("./keys.js");
// NPM module used to access spotify api
// ask about how to handles this
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);

// Core node package for reading and writing files
var fs = require('fs');

// Grab the axios package...
var axios = require("axios");

var inquirer = require("inquirer");


function prompt() {
  inquirer.prompt([
    {
      type: "list",
      name: "doingWhat",
      message: "What would you like to know about?",
      choices: ["spotify-this-song", "movie-this", "concert-this", "do-what-it-says"]
    }

  ]).then(function (answers) {
    var doingWhat = answers.doingWhat;
    if (doingWhat === "do-what-it-says") {
      return showRandom()
    }
    promptSearch(doingWhat)
  })



}

function promptSearch(doingWhat) {
  inquirer.prompt([
    {
      type: "input",
      name: "input",
      message: "What do you want to search for?"
    }
  ]).then(function (answers) {
    var input = answers.input;
    justDoIt(doingWhat, input)

  })
}

function showSong(songName) {
  if (songName === "") {
    songName = "The Sign by Ace of Base"
  }
  spotify.search({ type: 'track', query: songName }, function (err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }
    var divider = "\n------------------------------------------------------------\n\n";
    // console.log(data.tracks.items[0]); 
    var songData = data.tracks.items[0];
    var song = [
      "Name: " + songData.name,
      "Artist: " + songData.artists[0].name,
      "Link " + songData.preview_url,
      "Album: " + songData.album.name
    ].join("\r\n");
    console.log("---------------------------------------");
    console.log(song);
    console.log("---------------------------------------");
    
    fs.appendFile("log.txt", song + divider, function (err) {

        if (err) {
          return console.log(err);
        }
        console.log("log.txt was updated!");

      });
  });

}
function justDoIt (command, searchTerm){
  switch (command) {
    case "spotify-this-song":
      showSong(searchTerm);
      break;
    case "movie-this":
      showMovie(searchTerm);
      break;
    case "concert-this":
      showBand(searchTerm);
      break;
    // case "":
    // showSong();
    // break;
33
  }
}
function showMovie(movieName) {
  if (movieName === "") {
    movieName = "Mr. Nobody"
    console.log("If you haven't watched Mr. Nobody then you should: <http://www.imdb.com/title/tt0485947/>. It's on Netflix!");
  } else{
  var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
  var divider = "\n------------------------------------------------------------\n\n";
  axios.get(queryUrl).then(
    function(response) {
        var movieData = response.data;
        // console.log(movieData);
        var movie = [
          "Title: " + movieData.Title,
          "Year: " + movieData.Year,
          "IMDBrating: " + movieData.imdbRating,
          "Rotten Tomatoes Rating: " + movieData.Ratings[1].Value,
          "Country: " + movieData.Country,
          "Language: " + movieData.Language,
          "Plot: " + movieData.Plot,
          "Actors: " + movieData.Actors
        ].join("\r\n");
        console.log("---------------------------------------");
        console.log(movie);
        console.log("---------------------------------------");
        
        fs.appendFile("log.txt", movie + divider, function (err) {
    
            if (err) {
              return console.log(err);
            }
            console.log("log.txt was updated!");
    
          });
      });
    }};

  // * If the user doesn't type a movie in, the program will output data for the movie 'Mr. Nobody.'
 


function showBand(bandName) {
    if (bandName === ""){
        bandName = "Muse"
    } var queryUrl = "https://rest.bandsintown.com/artists/" + bandName + "/events?app_id=codingbootcamp";
    var divider = "\n------------------------------------------------------------\n\n";
        axios.get(queryUrl).then(
            function(response) {
                var bandData = response.data[0];
                // console.log(bandData);
                var band = [
                 "Venue Name: " + bandData.venue.name,
                 "Venue Location: " + bandData.venue.city,
                 "Date: " + moment(bandData.datetime).format("MM-DD-YYYY")
                ].join("\r\n");
                console.log("---------------------------------------");
                console.log(band);
                console.log("---------------------------------------");
                
                fs.appendFile("log.txt", band + divider, function (err) {
            
                    if (err) {
                      return console.log(err);
                    }
                    console.log("log.txt was updated!");
            
                  });
            })
};


function showRandom() {
  fs.readFile("random.txt", "utf8", function (error, data) {
    if (error) {
      return console.log(error);
    }
    var randomIndex = 1;
    var randomData = data.split("/ ")[randomIndex].split(",");
    // console.log(randomData);
    justDoIt(randomData[0], randomData[1])
  })
}




prompt()

// NO CODE BELOW