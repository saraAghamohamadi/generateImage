// src/components/ImageDetail.tsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
export interface ImageRequest {
  id: number;
  prompt: string;
  image: string;
  timestamp: string;
}
const ImageDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get the image ID from the URL
  const [request, setRequest] = useState<ImageRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    
    const fetchImageDetails = async () => {
      try {
        setLoading(true);
        const response = await api.get<ImageRequest>(`/history/${id}/`);
        setRequest(response.data);
      } catch (err) {
        setError('Failed to load image details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchImageDetails();
  }, [id]);

  if (loading) {
    return <div className="text-center p-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center p-10 text-red-400">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="mb-8">
        <Link to="/dashboard" className="text-purple-400 hover:text-purple-300">
          &larr; Back to Dashboard
        </Link>
      </div>

      {request && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div className="bg-gray-800 p-2 rounded-lg shadow-xl">
            <img 
              src={`${request.image}`} 
              alt={request.prompt} 
              className="w-full rounded-md"
            />
          </div>
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-400 mb-2">Prompt</h2>
              <p className="text-lg bg-gray-800 p-4 rounded-lg">{request.prompt}</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-400 mb-2">Generated On</h2>
              <p className="text-lg bg-gray-800 p-4 rounded-lg">
                {new Date(request.timestamp).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageDetail;