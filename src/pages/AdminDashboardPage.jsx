import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaSpinner, FaExclamationTriangle, FaFilm, FaSearch } from 'react-icons/fa';
import movieService from '../services/movieService';
import { useAuth } from '../context/AuthContext';

const AdminDashboardPage = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Redirect if not admin
    if (!isAdmin()) {
      navigate('/');
      return;
    }

    const fetchMovies = async () => {
      try {
        setLoading(true);
        const data = await movieService.getAllMovies();
        setMovies(data);
      } catch (err) {
        setError('Failed to fetch movies');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [isAdmin, navigate]);

  const handleDeleteMovie = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      try {
        await movieService.deleteMovie(id);
        setMovies(movies.filter(movie => movie.id !== id));
      } catch (err) {
        setError(`Failed to delete movie: ${err.message}`);
      }
    }
  };

  const filteredMovies = movies.filter(movie => 
    movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    movie.director.toLowerCase().includes(searchTerm.toLowerCase()) ||
    movie.genre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <div className="spinner-border text-primary me-2" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <span className="text-light">Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="admin-header">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold text-light mb-3">
                Admin Dashboard <FaFilm className="text-primary ms-2" />
              </h1>
              <p className="text-light-50 mb-0">
                Manage movies, reviews, and user content from this central dashboard.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="input-group w-50">
          <span className="input-group-text bg-dark border-secondary text-light">
            <FaSearch />
          </span>
          <input 
            type="text" 
            className="form-control admin-search" 
            placeholder="Search movies..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Link to="/admin/movies/add" className="btn btn-primary">
          <FaPlus className="me-2" /> Add New Movie
        </Link>
      </div>

      {error && (
        <div className="alert alert-danger mb-4">
          <FaExclamationTriangle className="me-2" />
          {error}
        </div>
      )}

      <div className="admin-card shadow">
        <div className="admin-card-header">
          <h5 className="mb-0 text-primary">Manage Movies</h5>
        </div>
        <div className="card-body p-0">
          {filteredMovies.length === 0 ? (
            <div className="p-4 text-center">
              <p className="mb-0 text-light-50">
                {searchTerm ? 'No movies found matching your search.' : 'No movies found. Add your first movie!'}
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-dark table-hover table-bordered border-secondary mb-0">
                <thead>
                  <tr className="bg-dark-secondary">
                    <th className="text-light">Title</th>
                    <th className="text-light">Director</th>
                    <th className="text-light">Genre</th>
                    <th className="text-light">Release Year</th>
                    <th className="text-light">Rating</th>
                    <th className="text-light">Reviews</th>
                    <th className="text-light text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMovies.map((movie) => (
                    <tr key={movie.id}>
                      <td>
                        <Link to={`/movies/${movie.id}`} className="text-primary text-decoration-none">
                          {movie.title}
                        </Link>
                      </td>
                      <td className="text-light">{movie.director}</td>
                      <td className="text-light">{movie.genre}</td>
                      <td className="text-light">{movie.releaseYear}</td>
                      <td className="text-light">
                        <span className="admin-badge admin-badge-primary">
                          {movie.averageRating ? movie.averageRating.toFixed(1) : 'N/A'}
                        </span>
                      </td>
                      <td className="text-light">
                        <span className="admin-badge admin-badge-secondary">
                          {movie.reviewCount || 0}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex justify-content-center gap-2">
                          <Link 
                            to={`/admin/movies/edit/${movie.id}`}
                            className="btn btn-sm btn-outline-primary admin-action-btn"
                            title="Edit movie"
                          >
                            <FaEdit /> <span className="d-none d-md-inline">Edit</span>
                          </Link>
                          <button
                            className="btn btn-sm btn-outline-danger admin-action-btn"
                            onClick={() => handleDeleteMovie(movie.id, movie.title)}
                            title="Delete movie"
                          >
                            <FaTrash /> <span className="d-none d-md-inline">Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div className="admin-card-header">
          <div className="d-flex justify-content-between align-items-center">
            <small className="text-light-50">Total: {filteredMovies.length} movies</small>
            <small className="text-light-50">
              {searchTerm && `Filtered from ${movies.length} total movies`}
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
