import { useState, useEffect } from 'react';
import MovieCard from '../components/MovieCard';
import movieService from '../services/movieService';
import { FaFilm } from 'react-icons/fa';

const MoviesPage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const data = await movieService.getAllMovies();
        setMovies(data);
        setError('');
      } catch (err) {
        setError('Failed to load movies. Please try again later.');
        console.error('Error fetching movies:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  return (
    <div className="container py-5">
      <div className="d-flex align-items-center mb-4">
        <FaFilm className="me-2 text-primary" size={24} />
        <h1 className="mb-0">All Movies</h1>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : error ? (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      ) : (
        <>
          {movies.length === 0 ? (
            <div className="text-center py-5">
              <p className="lead">No movies found.</p>
            </div>
          ) : (
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
              {movies.map((movie) => (
                <div className="col" key={movie.id}>
                  <MovieCard movie={movie} />
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MoviesPage;
