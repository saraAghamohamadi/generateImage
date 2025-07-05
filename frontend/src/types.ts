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