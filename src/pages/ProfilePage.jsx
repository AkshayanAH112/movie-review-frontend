import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import userService from '../services/userService';
import { FaUser, FaKey, FaSave, FaTimes } from 'react-icons/fa';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    bio: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const userData = await userService.getCurrentUserProfile();
        setProfile({
          name: userData.name || '',
          email: userData.email || '',
          bio: userData.bio || ''
        });
        setError('');
      } catch (err) {
        setError('Failed to load profile. Please try again later.');
        console.error('Error fetching user profile:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile(prevProfile => ({
      ...prevProfile,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    
    try {
      await userService.updateUserProfile(profile);
      setSuccess('Profile updated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err) {
      setError('Failed to update profile. Please try again.');
      console.error('Error updating profile:', err);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }
    
    try {
      await userService.changePassword(passwordData);
      setPasswordSuccess('Password changed successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setPasswordSuccess('');
      }, 3000);
    } catch (err) {
      setPasswordError('Failed to change password. Please check your current password and try again.');
      console.error('Error changing password:', err);
    }
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2 className="text-white mb-4">User Profile</h2>
      <div className="row">
        <div className="col-md-3">
          <div className="card profile-card mb-4">
            <div className="card-body text-center">
              <div className="avatar-placeholder mb-3 mx-auto">
                <FaUser size={50} className="text-primary" />
              </div>
              <h5 className="card-title text-white">{profile.name}</h5>
              <p className="text-light">{profile.email}</p>
            </div>
            <div className="list-group list-group-flush">
              <button 
                className={`list-group-item list-group-item-action ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('profile')}
              >
                <span className="text-white">Profile Information</span>
              </button>
              <button 
                className={`list-group-item list-group-item-action ${activeTab === 'security' ? 'active' : ''}`}
                onClick={() => setActiveTab('security')}
              >
                <span className="text-white">Security</span>
              </button>
            </div>
          </div>
        </div>
        
        <div className="col-md-9">
          {activeTab === 'profile' ? (
            <div className="card profile-card">
              <div className="card-header">
                <h5 className="mb-0 text-white">Profile Information</h5>
              </div>
              <div className="card-body">
                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="alert alert-success" role="alert">
                    {success}
                  </div>
                )}
                <form onSubmit={handleProfileSubmit}>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label text-white">Name</label>
                    <input
                      type="text"
                      className="form-control bg-dark text-white"
                      id="name"
                      name="name"
                      value={profile.name}
                      onChange={handleProfileChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label text-white">Email</label>
                    <input
                      type="email"
                      className="form-control bg-dark text-white"
                      id="email"
                      name="email"
                      value={profile.email}
                      onChange={handleProfileChange}
                      required
                      disabled
                    />
                    <div className="form-text text-light">Email cannot be changed.</div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="bio" className="form-label text-white">Bio</label>
                    <textarea
                      className="form-control bg-dark text-white"
                      id="bio"
                      name="bio"
                      rows="3"
                      value={profile.bio}
                      onChange={handleProfileChange}
                    ></textarea>
                  </div>
                  <div className="d-flex justify-content-end">
                    <button type="submit" className="btn btn-primary">
                      <FaSave className="me-2" /> Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <div className="card profile-card">
              <div className="card-header">
                <h5 className="mb-0 text-white">Change Password</h5>
              </div>
              <div className="card-body">
                {passwordError && (
                  <div className="alert alert-danger" role="alert">
                    {passwordError}
                  </div>
                )}
                {passwordSuccess && (
                  <div className="alert alert-success" role="alert">
                    {passwordSuccess}
                  </div>
                )}
                <form onSubmit={handlePasswordSubmit}>
                  <div className="mb-3">
                    <label htmlFor="currentPassword" className="form-label text-white">Current Password</label>
                    <input
                      type="password"
                      className="form-control bg-dark text-white"
                      id="currentPassword"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="newPassword" className="form-label text-white">New Password</label>
                    <input
                      type="password"
                      className="form-control bg-dark text-white"
                      id="newPassword"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="confirmPassword" className="form-label text-white">Confirm New Password</label>
                    <input
                      type="password"
                      className="form-control bg-dark text-white"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      required
                    />
                  </div>
                  <div className="d-flex justify-content-end">
                    <button type="submit" className="btn btn-primary">
                      <FaKey className="me-2" /> Update Password
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
