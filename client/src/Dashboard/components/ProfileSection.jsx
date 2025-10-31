import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const ProfileSection = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    image: '',
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userId = user._id;

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) {
        toast.error('User not logged in');
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get(`http://localhost:3000/profile?userId=${userId}`);
        setProfile(res.data);
        setPreview(res.data.image ? `http://localhost:3000/uploads/${res.data.image}` : null);
      } catch (err) {
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      toast.error('User not logged in');
      return;
    }
    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('name', profile.name);
    formData.append('email', profile.email);
    if (e.target.profilePic.files[0]) {
      formData.append('profilePic', e.target.profilePic.files[0]);
    }
    try {
      const res = await axios.put('http://localhost:3000/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setProfile(res.data);
      setPreview(res.data.image ? `http://localhost:3000/uploads/${res.data.image}` : null);
      localStorage.setItem('user', JSON.stringify({ ...user, name: res.data.name, profilePic: res.data.image }));
      toast.success('Profile updated!');
    } catch (err) {
      toast.error('Failed to update profile');
    }
  };

  if (loading) return <p className="text-var(--text-muted)">Loading profile...</p>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-6 p-6 rounded-lg shadow-md"
      style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}
    >
      <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--accent)' }}>User Profile</h3>
      <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6 mb-6">
        <div className="relative">
          <img
            src={preview || 'https://via.placeholder.com/150'}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover ring-2 ring-[var(--accent)]/20"
          />
        </div>
        <div>
          <p className="text-lg font-medium">{profile.name}</p>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{profile.email}</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-var(--text-secondary) mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={profile.name}
            onChange={handleChange}
            className="w-full p-2 rounded-md"
            style={{ backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
          />
        </div>
        <div>
          <label className="block text-var(--text-secondary) mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={profile.email}
            onChange={handleChange}
            className="w-full p-2 rounded-md"
            style={{ backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
          />
        </div>
        <div>
          <label className="block text-var(--text-secondary) mb-1">Profile Picture</label>
          <input
            type="file"
            name="profilePic"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-2 rounded-md file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[var(--accent)] file:text-var(--bg-primary) hover:file:bg-[var(--accent)]/80"
            style={{ backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 rounded-md font-bold"
          style={{ backgroundColor: 'var(--accent)', color: 'var(--bg-primary)' }}
        >
          Update Profile
        </button>
      </form>
    </motion.div>
  );
};

export default ProfileSection;