// Import necessary dependencies
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Define the Login component
const Login = () => {
  // Use the useNavigate hook
  const navigate = useNavigate();

  // State to manage username and password
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Function to handle login button click
  const handleLogin = () => {
    // Your login logic here
    // For simplicity, using hardcoded values. You should replace this with your authentication logic.

    const hardcodedUsername = 'admin';
    const hardcodedPassword = 'admin123';

    if (username === hardcodedUsername && password === hardcodedPassword) {
      // If login is successful, navigate to the dashboard
      navigate('/dashboard');
    } else {
      // Handle unsuccessful login (show an error message, etc.)
      alert('Invalid username or password');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <label htmlFor="username">Username:</label>
      <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />

      <label htmlFor="password">Password:</label>
      <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />

      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

// Export the Login component
export default Login;
