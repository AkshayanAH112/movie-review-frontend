import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUserPlus, FaUser, FaEnvelope, FaLock, FaArrowLeft } from 'react-icons/fa';
import moviesImage from '../assets/movies.jpg';
import { toast } from 'react-toastify';

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: 'USER' // Default role
      };
      
      await register(userData);
      
      // Show success toast with animation
      toast.success('Registration successful! Welcome to MovieReview', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        style: {
          background: 'linear-gradient(to right, #1a1a2e, #16213e)',
          color: 'white',
          borderRadius: '10px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)'
        }
      });
      
      // Delay redirect to show the toast
      setTimeout(() => {
        // Redirect to home page after successful registration
        navigate('/');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ height: '100vh', padding: 0, margin: 0 }}>
      <div className="row justify-content-center" style={{ height: '100%', margin: 0 }}>
        <div className="col-md-10" style={{ height: '100%', padding: 0 }}>
          <div className="login-card" style={{ height: '100%' }}>
            <div className="row g-0" style={{ height: '100%' }}>
              {/* Left side with image */}
              <div className="col-md-5 d-none d-md-block" style={{ padding: 0, height: '100%' }}>
                <div style={{ height: '100%', overflow: 'hidden' }}>
                  <img src={moviesImage} alt="Movies" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              </div>
              
              {/* Right side with form */}
              <div className="col-md-7" style={{ 
                height: '100%', 
                overflowY: 'auto', 
                padding: 20, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)'
              }}>
                <div className="card-body p-5" style={{ width: '100%', height: '100%', overflowY: 'auto', justifyContent: 'center', display: 'flex', flexDirection: 'column' }}>
                  <div className="text-start mb-4">
                    <Link to="/" className="btn btn-outline-primary btn-sm">
                      <FaArrowLeft className="me-2" /> Back to Home
                    </Link>
                  </div>
                  <div className="text-center mb-4">
                    <FaUserPlus className="text-primary" size={50} />
                    <h2 className="mt-3 text-white">Register</h2>
                    <p className="text-light">Create a new account</p>
                  </div>
              
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label text-light">
                    Full Name
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <FaUser />
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="email" className="form-label text-light">
                    Email Address
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <FaEnvelope />
                    </span>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="password" className="form-label text-light">
                    Password
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <FaLock />
                    </span>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="confirmPassword" className="form-label text-light">
                    Confirm Password
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <FaLock />
                    </span>
                    <input
                      type="password"
                      className="form-control"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm your password"
                      required
                    />
                  </div>
                </div>
                
                <button
                  type="submit"
                  className="btn btn-primary w-100 py-2"
                  disabled={loading}
                >
                  {loading ? 'Registering...' : 'Register'}
                </button>
              </form>
              
              <div className="mt-4 text-center">
                <p className="text-light">
                  Already have an account?{' '}
                  <Link to="/login" className="text-primary text-decoration-none">
                    Login here
                  </Link>
                </p>
              </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
