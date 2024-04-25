// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ExamForm from './ExamForm';
import AdminLogin from './AdminLogin'; // Import your AdminLogin component
import { useState } from 'react';
import './App.css';

function App() {
  const [score, setScore] = useState(0);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<AdminLogin />} />
          <Route path="/" element={<ExamForm score={score} setScore={setScore} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
