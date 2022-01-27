import React, { useState, useEffect } from "react";
import axios from "./axios";
import "./Row.css";
import Youtube from "react-youtube";

// this is our baseImgUrl we append to later to retrieve the movie image
const baseImgUrl = "https://image.tmdb.org/t/p/original";

function Row({ title, fetchUrl, isLargeRow }) {
  const [movies, setMovies] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState("");

  // Options for react-youtube
  const opts = {
    height: "390",
    width: "100%",
    playerVars: {
      autoplay: 1,
    },
  };

  // useEffect() is when a snippet of code which runs depending on a specific condition
  // When our Row function loads we want pull data from our TMDB
  // If we leave out [fetchUrl] on line 35 it will run once when the row loads and thats it since we have fetchUrl anytime our fetchUrl changes we run this code block again
  useEffect(() => {
    async function fetchData() {
      // our request line is fetching our url from axios.js and appending it to our request: "https://api.themoviedb.org/3/trending/all/week?api_key=${API_KEY}&language=en-US" this goes to our axios.js -> app.js -> requests.js
      const request = await axios.get(fetchUrl);
      // setMovies is taking our array which was from request.data.results
      setMovies(request.data.results);
      return request;
    }
    fetchData();
    // we have [fetchURL] since the variable is pulled in from outside, and is being used for the useEffect we must include it since its dependent on our variable fetchUrl
    // fetchUrl is being passed in from our Row function in line 8 so we know its coming form outside
  }, [fetchUrl]);

  // when the user clicks on a picture we pass in the movie with our map function
  const handleClick = async (movie) => {
    if (trailerUrl) {
      setTrailerUrl("");
    } else {
      let trailerurl = await axios.get(
        `/movie/${movie.id}/videos?api_key=790b4955f0732c4cf2faa0d4d3ad4ad8`
      );
      setTrailerUrl(trailerurl.data.results[0]?.key);
    }
  };

  // console.table(movies) this displays out data as a table
  return (
    // our rows are inside of a container so we can scroll through them
    <div className="row">
      <h2>{title}</h2>

      <div className="row_posters">
        {/* several row_posters */}
        For every obj in our list we return an image
        {movies.map(
          (movie) =>
            movie.backdrop_path !== null && (
              //Depending on  what is passed in if its a largeRow it will get an additional class
              <img
                className={`row_poster ${isLargeRow && "row_posterLarge"}`}
                src={`${baseImgUrl}${
                  isLargeRow ? movie.poster_path : movie.backdrop_path
                }`}
                alt={movie.name}
                key={movie.id}
                onClick={() => handleClick(movie)}
              />
            )
        )}
      </div>
      {/* When we have a trailerUrl then we show the video */}
      {trailerUrl && <Youtube videoId={trailerUrl} opts={opts} />}
    </div>
  );
}

export default Row;
