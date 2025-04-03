import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaSave, FaArrowLeft, FaUpload, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';
import movieService from '../services/movieService';
import { useAuth } from '../context/AuthContext';
import defaultPoster from '../assets/default-movie.png';

const MovieFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState({
    title: '',
    director: '',
    actors: '',
    genre: '',
    releaseYear: new Date().getFullYear(),
    synopsis: '',
    posterPath: '',
    imagePublicId: ''
  });
  
  const [posterFile, setPosterFile] = useState(null);
  const [posterPreview, setPosterPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [initialLoading, setInitialLoading] = useState(isEditMode);

  useEffect(() => {
    // Redirect if not admin
    if (!isAdmin()) {
      navigate('/');
      return;
    }

    // Fetch movie data if in edit mode
    if (isEditMode) {
      const fetchMovie = async () => {
        try {
          setInitialLoading(true);
          const movieData = await movieService.getMovieById(id);
          
          setFormData({
            title: movieData.title,
            director: movieData.director,
            actors: movieData.actors.join(', '),
            genre: movieData.genre,
            releaseYear: movieData.releaseYear,
            synopsis: movieData.synopsis,
            posterPath: movieData.imageUrl,
            imagePublicId: movieData.imagePublicId
          });
          
          setPosterPreview(movieData.imageUrl);
        } catch (err) {
          setError('Failed to fetch movie details');
          console.error(err);
        } finally {
          setInitialLoading(false);
        }
      };

      fetchMovie();
    }
  }, [id, isEditMode, isAdmin, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle poster file selection
  const handlePosterChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.match('image.*')) {
        setError('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should not exceed 5MB');
        return;
      }
      
      setPosterFile(file);
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setPosterPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Reset poster file and preview
  const handleResetPoster = () => {
    setPosterFile(null);
    setPosterPreview(formData.posterPath || null);
    
    // Reset the file input
    const fileInput = document.getElementById('poster');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.title || !formData.director || !formData.genre) {
      setError('Please fill in all required fields');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      // Upload poster if selected
      let imageUrl = formData.posterPath;
      let imagePublicId = formData.imagePublicId;
      
      if (posterFile) {
        const uploadResponse = await movieService.uploadPoster(posterFile);
        imageUrl = uploadResponse.url;
        imagePublicId = uploadResponse.publicId;
      }
      
      // Prepare movie data
      const movieData = {
        title: formData.title,
        director: formData.director,
        actors: formData.actors.split(',').map(actor => actor.trim()).filter(actor => actor),
        genre: formData.genre,
        releaseYear: parseInt(formData.releaseYear),
        synopsis: formData.synopsis,
        imageUrl,
        imagePublicId
      };
      
      // Create or update movie
      if (isEditMode) {
        await movieService.updateMovie(id, movieData);
      } else {
        await movieService.createMovie(movieData);
      }
      
      // Redirect to admin dashboard
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to save movie');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <FaSpinner className="spinner-border me-2" />
        <span>Loading movie data...</span>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>{isEditMode ? 'Edit Movie' : 'Add New Movie'}</h1>
        <Link to="/admin/dashboard" className="btn btn-outline-secondary">
          <FaArrowLeft className="me-2" /> Back to Dashboard
        </Link>
      </div>

      {error && (
        <div className="alert alert-danger mb-4">
          <FaExclamationTriangle className="me-2" />
          {error}
        </div>
      )}

      <div className="card shadow">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-8">
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">
                    Title <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="director" className="form-label">
                    Director <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="director"
                    name="director"
                    value={formData.director}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="actors" className="form-label">
                    Actors (comma separated)
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="actors"
                    name="actors"
                    value={formData.actors}
                    onChange={handleChange}
                    placeholder="Actor 1, Actor 2, Actor 3"
                  />
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="genre" className="form-label">
                      Genre <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="genre"
                      name="genre"
                      value={formData.genre}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label htmlFor="releaseYear" className="form-label">
                      Release Year <span className="text-danger">*</span>
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="releaseYear"
                      name="releaseYear"
                      value={formData.releaseYear}
                      onChange={handleChange}
                      min="1900"
                      max="2100"
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="synopsis" className="form-label">
                    Synopsis
                  </label>
                  <textarea
                    className="form-control"
                    id="synopsis"
                    name="synopsis"
                    rows="5"
                    value={formData.synopsis}
                    onChange={handleChange}
                  ></textarea>
                </div>
              </div>

              <div className="col-md-4">
                <div className="mb-3">
                  <label className="form-label">Movie Poster</label>
                  <div className="card">
                    <img
                      src={posterPreview || defaultPoster}
                      alt="Movie Poster Preview"
                      className="card-img-top"
                      style={{ height: '300px', objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = defaultPoster;
                      }}
                    />
                    <div className="card-body">
                      <div className="mb-3">
                        <label htmlFor="poster" className="form-label">
                          Upload Poster
                        </label>
                        <input
                          type="file"
                          className="form-control"
                          id="poster"
                          accept="image/*"
                          onChange={handlePosterChange}
                        />
                        <div className="form-text">
                          Recommended size: 300x450 pixels. Max size: 5MB.
                        </div>
                        {posterFile && (
                          <button 
                            type="button" 
                            className="btn btn-sm btn-outline-secondary mt-2"
                            onClick={handleResetPoster}
                          >
                            Reset Poster
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-end mt-4">
              <Link to="/admin/dashboard" className="btn btn-secondary me-2">
                Cancel
              </Link>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <FaSpinner className="spinner-border me-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <FaSave className="me-2" />
                    Save Movie
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MovieFormPage;
