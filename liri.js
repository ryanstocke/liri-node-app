require("dotenv").config();

// variables
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

    // console.log(data.tracks.items[0]); 
    var songData = data.tracks.items[0];
    var song = {
      name: songData.name,
      artist: songData.artists[0].name,
      link: songData.preview_url,
      album: songData.album.name
    }
    console.log(song);
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

  }
}
function showMovie(movieName) {

  //   * Title of the movie.
  //   * Year the movie came out.
  //   * IMDB Rating of the movie.
  //   * Rotten Tomatoes Rating of the movie.
  //   * Country where the movie was produced.
  //   * Language of the movie.
  //   * Plot of the movie.
  //   * Actors in the movie.




  // * If the user doesn't type a movie in, the program will output data for the movie 'Mr. Nobody.'
}
function showBand(bandName) {

}
function showRandom() {
  fs.readFile("random.txt", "utf8", function (error, data) {
    if (error) {
      return console.log(error);
    }
    var randomIndex = Math.floor(Math.random() * 3);
    var randomData = data.split("/")[randomIndex].split(",");
    console.log(randomData);
    justDoIt(randomData[0], randomData[1])
  })
}

// functions



// 


//omdb function
// for (var i = 2; i < nodeArgs.length; i++) {

//     if (i > 2 && i < nodeArgs.length) {
//       movieName = movieName + "+" + nodeArgs[i];
//     }
//     else {
//       movieName += nodeArgs[i];

//     }
//   }
//   var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

// console.log(queryUrl);

// axios.get(queryUrl).then(
//   function(response) {
//     console.log("Release Year: " + response.data.Year);
//   }
// );



prompt()

// NO CODE BELOW