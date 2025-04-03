import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import MovieCard from '../components/MovieCard';
import movieService from '../services/movieService';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query') || '';
  
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const searchMovies = async () => {
      if (!query.trim()) {
        setMovies([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await movieService.searchMovies(query);
        setMovies(data);
        setError('');
      } catch (err) {
        setError('Failed to search movies. Please try again later.');
        console.error('Error searching movies:', err);
      } finally {
        setLoading(false);
      }
    };

    searchMovies();
  }, [query]);

  return (
    <div className="container py-5">
      <div className="d-flex align-items-center mb-4">
        <FaSearch className="me-2 text-primary" size={24} />
        <h1 className="mb-0">
          Search Results: {query ? `"${query}"` : ''}
        </h1>
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
              <p className="lead">
                {query ? `No movies found matching "${query}"` : 'Please enter a search term'}
              </p>
            </div>
          ) : (
            <>
              <p className="mb-4">Found {movies.length} result(s)</p>
              <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
                {movies.map((movie) => (
                  <div className="col" key={movie.id}>
                    <MovieCard movie={movie} />
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default SearchPage;
