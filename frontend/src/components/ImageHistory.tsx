import React from 'react';
import { Link } from 'react-router-dom';
// import { ImageRequest } from '../types';
export interface ImageRequest {
  id: number;
  prompt: string;
  image: string;
  timestamp: string;
}
interface ImageHistoryProps {
  history: ImageRequest[];
}

const ImageHistory: React.FC<ImageHistoryProps> = ({ history }) => {
  return (
    <section>
      <h2 className="text-2xl font-semibold mb-6">Your Creations</h2>
      {history.length === 0 ? (
        <div className="text-center py-16 px-8 bg-gray-800 rounded-2xl">
          <p className="text-gray-400">Your creations will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {history.map((item) => (
            // Wrap the div in a Link component
            <Link to={`/history/${item.id}`} key={item.id}>
              <div className="group relative overflow-hidden bg-gray-800 rounded-lg shadow-lg aspect-square cursor-pointer transition-transform transform hover:scale-105">
                <img 
                  // Ensure the image URL is correct
                  src={`${item.image}`} 
                  alt={item.prompt} 
                  className="w-full h-full object-cover" 
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-end p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-xs text-white truncate">{item.prompt}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
};

export default ImageHistory;