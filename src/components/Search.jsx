import  { useState } from "react";
import axios from "axios";

const API_KEY = "8fc6c84a"; 

const Search = () => {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const movieName = event.target.value;
    setQuery(movieName);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
        const response = await axios.get(
          `http://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`
        );

      if (response.data && response.data.Search) {
        setMovies(response.data.Search);
        setSelectedMovie(null); 
      } else {
        setMovies([]);
        setError("No movies found.");
      }
    } catch (error) {
      setError("Error while fetching the data");
      console.error("Error while fetching the data", error);
    }
  };

  const handleMovieClick = async (movie) => {
    try {
      const response = await axios.get(
        `http://www.omdbapi.com/?apikey=${API_KEY}&i=${movie.imdbID}`
      );

      if (response.data) {
            setSelectedMovie(response.data);
      }
    } catch (error) {
         setError("Error while fetching movie details");
      console.error("Error while fetching movie details", error);
    }
  };

  return (
    <>
      <div>
        <form onSubmit={handleSubmit}>
          <input
                type="text"
                  placeholder="Search for a movie"
                value={query}
                onChange={handleChange}
          />
          <button type="submit">Search</button>
        </form>
        {error && <div>{error}</div>}
        <div>
          {selectedMovie ? (
            <div>
              <h2>{selectedMovie.Title}</h2>
              <img src={selectedMovie.Poster} alt={`${selectedMovie.Title} poster`} />
                 <p><strong>Year:</strong> {selectedMovie.Year}</p>
                <p><strong>Plot:</strong> {selectedMovie.Plot}</p>
                <p><strong>Genre:</strong> {selectedMovie.Genre}</p>
                <p><strong>Director:</strong> {selectedMovie.Director}</p>
                <p><strong>Actors:</strong> {selectedMovie.Actors}</p>
                <button onClick={() => setSelectedMovie(null)}>Back to Search Results</button>
            </div>
          ) : (
            <ul>
              {movies.length > 0 ? (
                movies.map((movie) => (
                  <li key={movie.imdbID} onClick={() => handleMovieClick(movie)}>
                    <img src={movie.Poster} alt={`${movie.Title} poster`} />
                    <div>
                      <h3>{movie.Title}</h3>
                      <p>{movie.Year}</p>
                    </div>
                  </li>
                ))
              ) : (
                <li>No results</li>
              )}
            </ul>
          )}
        </div>
      </div>
    </>
  );
};

export default Search;
