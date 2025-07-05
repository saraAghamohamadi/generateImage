import React, { useState, useEffect } from 'react';
import api from '../services/api';
import ImageGenerator from './ImageGenerator';
import ImageHistory from './ImageHistory';
// import { UserProfile, ImageRequest } from '../types'; // We will define this type file

// Define types in a new file src/types.ts

export interface UserProfile {
  credits: number;
  api_key: string;
  user: {
    username: string;
  };
}
export interface ImageRequest {
  id: number;
  prompt: string;
  image: string;
  timestamp: string;
}


const Dashboard: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [history, setHistory] = useState<ImageRequest[]>([]);
  const [error, setError] = useState('');
  const [apiKeyCopied, setApiKeyCopied] = useState(false);

  const handleCopyApiKey = () => {
    if (profile?.api_key) {
      navigator.clipboard.writeText(profile.api_key);
      setApiKeyCopied(true);
      setTimeout(() => setApiKeyCopied(false), 2000); // Reset after 2 seconds
    }
  };
  const fetchDashboardData = async () => {
    try {
      const [profileRes, historyRes] = await Promise.all([
        api.get<UserProfile>('/dashboard/'),
        api.get<ImageRequest[]>('/history/')
      ]);
      setProfile(profileRes.data);
      setHistory(historyRes.data);
    } catch (err) {
      setError('Failed to load dashboard data.');
      console.error(err);
    }
  };
  
  useEffect(() => {
    fetchDashboardData();
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.location.href = '/login';
  };

  const onImageGenerated = () => {
    // Refetch everything to ensure data is fresh
    fetchDashboardData();
  };

  if (!profile) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">DreamScape</h1>
        <div className="flex items-center space-x-4">
          <div className="px-4 py-2 text-lg font-semibold bg-gray-800 rounded-lg">
            Credits: <span className="text-purple-400">{profile.credits}</span>
          </div>
          <button onClick={handleLogout} className="px-4 py-2 font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors">
            Logout
          </button>
        </div>
      </header>

      <main>
        {error && <p className="text-red-400 mb-4">{error}</p>}
        <ImageGenerator credits={profile.credits} onImageGenerated={onImageGenerated} />
        <section className="my-12 p-6 bg-gray-800 rounded-2xl shadow-xl">
          <h2 className="text-xl font-semibold mb-4">Your API Key</h2>
          <p className="text-gray-400 mb-4">
            Use this key in your scripts to generate images programmatically.
          </p>
          <div className="flex items-center p-4 bg-gray-900 rounded-lg">
            <pre className="flex-grow text-purple-300 font-mono text-sm overflow-x-auto">
              <code>{profile.api_key}</code>
            </pre>
            <button
              onClick={handleCopyApiKey}
              className="ml-4 px-4 py-2 font-semibold text-white bg-purple-600 rounded-lg hover:bg-purple-700 disabled:bg-green-600 transition-colors"
              disabled={apiKeyCopied}
            >
              {apiKeyCopied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </section>
        <ImageHistory history={history} />
      </main>
    </div>
  );
};

export default Dashboard;