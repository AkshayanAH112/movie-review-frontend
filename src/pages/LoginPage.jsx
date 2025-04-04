import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaSignInAlt, FaLock, FaEnvelope, FaArrowLeft } from 'react-icons/fa';
import moviesImage from '../assets/movies.jpg';
import { toast } from 'react-toastify';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get redirect path from location state or default to home page
  const from = location.state?.from?.pathname || '/';
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      await login(formData);
      
      // Show success toast with animation
      toast.success('Login successful! Welcome back', {
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
        // Redirect to the page user was trying to access or home page
        navigate(from, { replace: true });
      }, 2000);
    } catch (err) {
      setError(err.message || 'Invalid email or password');
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
                padding: 50, 
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
                    <FaSignInAlt className="text-primary" size={50} />
                    <h2 className="mt-3 text-white">Login</h2>
                    <p className="text-light">Sign in to your account</p>
                  </div>
                  
                  {error && (
                    <div className="alert alert-danger" role="alert">
                      {error}
                    </div>
                  )}
                  
                  <form onSubmit={handleSubmit}>
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
                    
                    <div className="mb-4">
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
                    
                    <button
                      type="submit"
                      className="btn btn-primary w-100 py-2"
                      disabled={loading}
                    >
                      {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                  </form>
                  
                  <div className="mt-4 text-center">
                    <p className="text-light">
                      Don't have an account?{' '}
                      <Link to="/register" className="text-primary text-decoration-none">
                        Register here
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

export default LoginPage;
