import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube, FaFilm, FaEnvelope, FaChevronRight } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-glow"></div>
      <div className="container">
        <div className="row">
          <div className="col-lg-4 mb-4 mb-lg-0">
            <Link to="/" className="footer-logo text-white text-decoration-none d-flex align-items-center">
              <div className="footer-logo-icon">
                <FaFilm />
              </div>
              <span className="footer-logo-text">Movie<span className="text-primary">Review</span></span>
            </Link>
            <p className="mt-2 mb-3 small">
              Discover the best movies with our community reviews. Join us to share your thoughts and explore cinema together.
            </p>
            <div className="social-icons">
              <a href="#" aria-label="Facebook" className="social-icon"><FaFacebookF /></a>
              <a href="#" aria-label="Twitter" className="social-icon"><FaTwitter /></a>
              <a href="#" aria-label="Instagram" className="social-icon"><FaInstagram /></a>
              <a href="#" aria-label="Youtube" className="social-icon"><FaYoutube /></a>
            </div>
          </div>
          
          <div className="col-lg-2 col-md-4 mb-4 mb-md-0">
            <h5 className="footer-heading">Explore</h5>
            <ul className="footer-links">
              <li>
                <FaChevronRight className="footer-link-icon" />
                <Link to="/">Home</Link>
              </li>
              <li>
                <FaChevronRight className="footer-link-icon" />
                <Link to="/movies">Movies</Link>
              </li>
              <li>
                <FaChevronRight className="footer-link-icon" />
                <Link to="/login">Login</Link>
              </li>
              <li>
                <FaChevronRight className="footer-link-icon" />
                <Link to="/register">Register</Link>
              </li>
            </ul>
          </div>
          
          <div className="col-lg-2 col-md-4 mb-4 mb-md-0">
            <h5 className="footer-heading">Genres</h5>
            <ul className="footer-links">
              <li>
                <FaChevronRight className="footer-link-icon" />
                <Link to="/search?genre=action">Action</Link>
              </li>
              <li>
                <FaChevronRight className="footer-link-icon" />
                <Link to="/search?genre=comedy">Comedy</Link>
              </li>
              <li>
                <FaChevronRight className="footer-link-icon" />
                <Link to="/search?genre=drama">Drama</Link>
              </li>
              <li>
                <FaChevronRight className="footer-link-icon" />
                <Link to="/search?genre=horror">Horror</Link>
              </li>
            </ul>
          </div>
          
          <div className="col-lg-4 col-md-4">
            <h5 className="footer-heading">Newsletter</h5>
            <form className="footer-newsletter">
              <div className="input-group">
                <input type="email" className="form-control" placeholder="Your email" />
                <button type="submit" className="btn btn-primary">
                  <FaEnvelope />
                </button>
              </div>
            </form>
          </div>
        </div>
        
        <div className="copyright">
          <p>&copy; {currentYear} <span className="text-primary">MovieReview</span>. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
