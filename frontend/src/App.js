import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Camera from './components/webcam';
import Auth from './authentication/auth'
import Gallery from './components/gallery';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(localStorage.getItem('token'))
  );

  const handleLogin = (token) => {
    setIsAuthenticated(true);
    localStorage.setItem('token', token); 
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={isAuthenticated ? <Camera /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={<Auth onLogin={handleLogin} />}
        />
        <Route path="/gallery" element={<Gallery />} />
      </Routes>
    </Router>
  );
}

export default App;
