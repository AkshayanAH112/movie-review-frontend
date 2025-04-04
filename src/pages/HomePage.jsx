import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import movieService from '../services/movieService';
import { FaFilm, FaSpinner, FaStar, FaTicketAlt, FaPlayCircle } from 'react-icons/fa';
import moviesImage from '../assets/movies.jpg';

const HomePage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    
    const fetchMovies = async () => {
      try {
        setLoading(true);
        let movieData;
        
        // Log the API request
        console.log(`Fetching movies from database${selectedGenre ? ` for genre: ${selectedGenre}` : ''}`);
        
        if (selectedGenre) {
          movieData = await movieService.getMoviesByGenre(selectedGenre);
        } else {
          movieData = await movieService.getAllMovies();
        }
        
        // Log the response from the API
        console.log('Movies fetched from database:', movieData);
        
        if (!movieData || movieData.length === 0) {
          console.warn('No movies returned from the database');
          setMovies([]);
          setFeaturedMovies([]);
          setLoading(false);
          return;
        }
        
        setMovies(movieData);
        
        // Set featured movies from database
        if (!selectedGenre && movieData.length > 0) {
          // Filter movies with valid poster URLs
          const moviesWithPosters = movieData.filter(movie => 
            movie.posterUrl && movie.posterUrl.trim() !== ''
          );
          
          console.log('Movies with valid posters:', moviesWithPosters.length);
          
          // Sort by rating (highest first) and take top 5
          const topRatedMovies = [...moviesWithPosters]
            .sort((a, b) => (b.rating || 0) - (a.rating || 0))
            .slice(0, 5);
          
          if (topRatedMovies.length > 0) {
            console.log('Setting featured movies from database:', topRatedMovies);
            setFeaturedMovies(topRatedMovies);
          } else {
            // Fallback to mock data if no movies with posters are found
            console.log('No movies with posters found, using fallback data');
            setFeaturedMovies([]);
          }
        }
        
        // Extract unique genres
        if (!selectedGenre) {
          const uniqueGenres = [...new Set(movieData.map(movie => movie.genre))];
          setGenres(uniqueGenres);
        }
      } catch (err) {
        console.error('Error fetching movies:', err);
        setError(`Failed to fetch movies: ${err.message || 'Unknown error'}`);
        setLoading(false);
        
        // Fallback to empty arrays in case of error
        setFeaturedMovies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [selectedGenre]);

  // Debug log to check featured movies
  useEffect(() => {
    console.log('Featured movies:', featuredMovies);
  }, [featuredMovies]);

  const handleGenreChange = (genre) => {
    setSelectedGenre(genre);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <div className="spinner-border text-primary me-2" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <span>Loading movies...</span>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <div className="page-header" style={{ 
        padding: '20px 0', 
        textAlign: 'center',
        position: 'relative',
        backgroundImage: `url(${moviesImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        {/* Overlay with reduced opacity */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(15, 15, 26, 0.85)',
          zIndex: 1
        }}></div>
        
        <div className="container" style={{ 
          maxWidth: '1000px', 
          margin: '0 auto',
          position: 'relative',
          zIndex: 2
        }}>
          <div className="row align-items-center justify-content-center" style={{ padding: '0 15px' }}>
            <div className="col-lg-8 text-center">
              <h1 className="display-4 fw-bold mb-3">
                D <span className="text-primary">MOVIES</span> <FaFilm className="disco-ball" />
              </h1>
              <p className="mb-3">
                Explore the latest releases, read reviews, and share your thoughts on your favorite films.
              </p>
              <div className="d-flex flex-wrap gap-3 justify-content-center">
                <Link to="/movies" className="btn btn-primary btn-lg d-inline-flex align-items-center">
                  <FaTicketAlt className="me-2" /> Browse Movies
                </Link>
                {!isLoggedIn && (
                  <Link to="/register" className="btn btn-outline-light btn-lg d-inline-flex align-items-center">
                    <FaPlayCircle className="me-2" /> Join Now
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Section */}
      <div style={{ 
        position: 'relative',
        backgroundImage: `url(${moviesImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        padding: '40px 0'
      }}>
        {/* Overlay with reduced opacity */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(15, 15, 26, 0.9)',
          zIndex: 1
        }}></div>
        
        <div className="container py-5" style={{
          position: 'relative',
          zIndex: 2
        }}>
          {/* Genre Filter */}
          <div className="mb-5">
            <h2 className="mb-4 text-center">Browse by Genre</h2>
            <div className="d-flex flex-wrap gap-2 justify-content-center">
              <button
                className={`btn ${!selectedGenre ? 'btn-primary' : 'btn-outline-light'}`}
                onClick={() => handleGenreChange('')}
              >
                All
              </button>
              {genres.map((genre) => (
                <button
                  key={genre}
                  className={`btn ${selectedGenre === genre ? 'btn-primary' : 'btn-outline-light'}`}
                  onClick={() => handleGenreChange(genre)}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {/* Movie Grid */}
          <h2 className="mb-4">{selectedGenre ? `${selectedGenre} Movies` : 'Latest Movies'}</h2>
          {movies.length === 0 ? (
            <div className="text-center py-5">
              <p className="lead">No movies found.</p>
            </div>
          ) : (
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
              {movies.map((movie) => (
                <div className="col fade-in" key={movie.id}>
                  <MovieCard movie={movie} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default HomePage;
