import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaSearch, FaUser, FaSignOutAlt, FaFilm, FaHome, FaTicketAlt, FaInfoCircle, FaStar } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [scrolled, setScrolled] = useState(false);

  // Add scroll effect to navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?query=${searchTerm}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Check if the current path is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className={`navbar navbar-expand-lg navbar-dark sticky-top ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <div className="brand-logo">
            <FaFilm className="me-2" />
          </div>
          <span className="brand-text">Movie<span className="text-primary">Review</span></span>
        </Link>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/') ? 'active' : ''}`} to="/">
                <FaHome className="nav-icon" /> <span>Home</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/movies') ? 'active' : ''}`} to="/movies">
                <FaTicketAlt className="nav-icon" /> <span>Movies</span>
              </Link>
            </li>
            {isAdmin() && (
              <li className="nav-item">
                <Link className={`nav-link ${isActive('/admin/dashboard') ? 'active' : ''}`} to="/admin/dashboard">
                  <FaInfoCircle className="nav-icon" /> <span>Admin</span>
                </Link>
              </li>
            )}
          </ul>
          
          <form className="d-flex me-2" onSubmit={handleSearch}>
            <div className="search-box">
              <input
                type="text"
                className="form-control search-input"
                placeholder="Search movies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="btn btn-primary search-btn" type="submit">
                <FaSearch />
              </button>
            </div>
          </form>
          
          <ul className="navbar-nav">
            {user ? (
              <>
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle user-dropdown"
                    href="#"
                    id="navbarDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                  >
                    <div className="user-avatar">
                      <FaUser />
                    </div>
                    <span className="ms-2">{user.name}</span>
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li>
                      <Link className="dropdown-item" to="/profile">
                        <FaUser className="me-2" /> Profile
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/my-reviews">
                        <FaStar className="me-2" /> My Reviews
                      </Link>
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button className="dropdown-item" onClick={handleLogout}>
                        <FaSignOutAlt className="me-2" /> Logout
                      </button>
                    </li>
                  </ul>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className={`nav-link ${isActive('/login') ? 'active' : ''}`} to="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link btn btn-primary btn-register" to="/register">
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
