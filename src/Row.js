import React, { useState, useEffect } from 'react';
import YouTube from 'react-youtube';
import axios from './axios';
import './Row.css'
import movieTrailer from 'movie-trailer';

const base_url = "http://image.tmdb.org/t/p/original/"

 function Row({title, fetchUrl, isLargeRow}) {
     const [ movies, setMovies ] = useState([]);
     const [trailerUrl, setTrailerUrl ] = useState("")

     useEffect(() =>{
         async function fetchData(){
             const request = await axios.get(fetchUrl);
             setMovies(request.data.results)
             return request
         }
         fetchData()
     },[fetchUrl]);

     const opts ={
         height:"390",
         width: "100%",
         playerVars: {
             //https://developers.google.com/youtube/player_parameters
             autoplay:1,
         }
     }

     const handleClick = (movie) => {
        if(trailerUrl){
            setTrailerUrl("");
        }else{
            movieTrailer(movie?.title || movie?.name || movie?.original_name || movie?.original_title || "")
            .then((url) =>{
                console.log(movie.name)
               const urlParams = new URLSearchParams(new URL(url).search);
               setTrailerUrl(urlParams.get('v'))
            }).catch(error => console.log(error))
        }
     }
    //  console.log(movies)
    return (
        <div className="row">
            <h2>{title}</h2>
            <div className="row__posters">
               { movies.map((movie) => 
                <img 
                    onClick={() => handleClick(movie)}
                    className={`row__poster ${isLargeRow && "row__posterLarge"}`}
                    src={`${base_url}${isLargeRow? movie.poster_path : movie.backdrop_path}`}
                    alt={movie.name} key={movie.id} />
                
            )}
            </div>
           {trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}
        </div>

    )
}

export default Row