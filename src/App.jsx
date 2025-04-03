import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './App.css';
import './styles/DarkTheme.css';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MovieDetailsPage from './pages/MovieDetailsPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import MovieFormPage from './pages/MovieFormPage';
import MoviesPage from './pages/MoviesPage';
import SearchPage from './pages/SearchPage';
import ProfilePage from './pages/ProfilePage';
import MyReviewsPage from './pages/MyReviewsPage';

// Protected Route Component
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, loading, isAdmin } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (requireAdmin && !isAdmin()) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="d-flex flex-column min-vh-100">
          <Navbar />
          <main className="flex-grow-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/movies" element={<MoviesPage />} />
              <Route path="/movies/:id" element={<MovieDetailsPage />} />
              <Route path="/search" element={<SearchPage />} />
              
              {/* Protected User Routes */}
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/my-reviews" 
                element={
                  <ProtectedRoute>
                    <MyReviewsPage />
                  </ProtectedRoute>
                } 
              />
              
              {/* Admin Routes */}
              <Route 
                path="/admin/dashboard" 
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <AdminDashboardPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/movies/add" 
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <MovieFormPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/movies/edit/:id" 
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <MovieFormPage />
                  </ProtectedRoute>
                } 
              />
              
              {/* 404 Route */}
              <Route 
                path="*" 
                element={
                  <div className="container py-5 text-center">
                    <h1>404 - Page Not Found</h1>
                    <p>The page you are looking for does not exist.</p>
                  </div>
                } 
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
