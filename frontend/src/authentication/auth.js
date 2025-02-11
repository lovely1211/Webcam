import React, { useState } from 'react';
import './auth.css';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosInstance';

const Auth = ({ onLogin }) => {
  const [isLoginPage, setIsLoginPage] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const navigate = useNavigate();

  const toggleAuthPage = () => {
    setIsLoginPage(!isLoginPage);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = { ...formData, [name]: value };
    setFormData(updatedFormData);
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const { data } = await axiosInstance.post("/register", formData);
      localStorage.setItem("userInfo", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);
      alert("Registration successful");
      navigate('/');
    } catch (error) {
      setError("Registration failed. Please try again.");
      console.error(error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axiosInstance.post('/login', {
        email: formData.email.toLowerCase(),
        password: formData.password,
      });

      localStorage.setItem('token', data.token);
      localStorage.setItem("userInfo", JSON.stringify(data.user));
      alert("Login successful");
      onLogin(data.token);
      navigate('/');
    } catch (error) {
      setError('Login failed. Please check your credentials.');
      console.error(error);
    }
  };

  return (
      <div className="auth_container">
        <form
          onSubmit={!isLoginPage ? handleRegister : handleLogin}
        >
          {!isLoginPage && (
            <div className="input_container">
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
          )}
          <div className="input_container">
            <label>Email</label>
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>
          <div className="pass input_container">
            <label>Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
            />
            <button
              type="button"
              className='btn'
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          {!isLoginPage && (
            <div className="pass input_container">
              <label>Confirm Password</label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
              />
              <button
                type="button"
                className='btn'
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>
          )}
          <button
            type="submit"
            className="submit_btn"
          >
            {isLoginPage ? `Sign in` : `Sign up`}
          </button>
          {error && <p className="error">{error}</p>}
          <div>
            <p>
              {isLoginPage ? `Don't have an account? ` : `Already have an account? `}
              <span
                onClick={toggleAuthPage}
              >
                {isLoginPage ? 'Sign up' : 'Sign in'}
              </span>
            </p>
          </div>
        </form>
      </div>
  );
};

export default Auth;
