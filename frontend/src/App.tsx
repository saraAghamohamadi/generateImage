import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import SignUp from './components/SignUp'; // Import SignUp
import Dashboard from './components/Dashboard';
import ImageDetail from './components/ImageDetail';

const App = () => {
  const isAuthenticated = !!localStorage.getItem('accessToken');

  return (
    <Router>
      <div  style={{display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100vw', height: '100vh'}}>
         <div className="min-h-screen bg-gray-900 text-white font-sans">
        <Routes>
          <Route path="/login" element={ <Login />} />
          <Route path="/signup" element={<SignUp /> } /> {/* Add this line */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/history/:id" element={<ImageDetail /> } />
          <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
        </Routes>
      </div>
      </div>
     
    </Router>
  );
};

export default App;