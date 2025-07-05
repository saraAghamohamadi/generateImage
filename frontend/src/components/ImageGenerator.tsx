import React, { useState } from 'react';
import api from '../services/api';

interface ImageGeneratorProps {
  credits: number;
  onImageGenerated: () => void;
}

const ImageGenerator: React.FC<ImageGeneratorProps> = ({ credits, onImageGenerated }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!prompt) {
      setError('Please enter a prompt.');
      return;
    }
    if (credits <= 0) {
      setError('You have no credits left!');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      await api.post('/generate/', { prompt });
      onImageGenerated(); // Notify parent to refetch data
      setPrompt(''); // Clear prompt on success
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to generate image.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mb-12 p-8 bg-gray-800 rounded-2xl shadow-xl">
      <div className="relative">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="A majestic lion jumping from a fire hoop..."
          className="w-full p-4 pr-48 text-lg text-white bg-gray-700 border-2 border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-shadow"
          rows={3}
          disabled={loading}
        />
        <button
          onClick={handleGenerate}
          disabled={loading || credits <= 0}
          className="absolute top-1/2 right-4 -translate-y-1/2 px-8 py-3 font-bold text-white bg-purple-600 rounded-lg hover:bg-purple-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-all transform hover:scale-105"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
          ) : (
            'Generate'
          )}
        </button>
      </div>
      {error && <p className="text-red-400 mt-3 text-center">{error}</p>}
    </section>
  );
};

export default ImageGenerator;