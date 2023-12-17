// src/ExamEnd.jsx
import React from 'react';
import './ExamEnd.css'; // Import the CSS file

const ExamEnd = () => {
  return (
    <div className="exam-end-container">
      <img
        src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' color='green' stroke-linejoin='round'%3E%3Cpath d='M22 11.08V12a10 10 0 1 1-5.93-9.14'%3E%3C/path%3E%3Cpolyline points='22 4 12 14.01 9 11.01'%3E%3C/polyline%3E%3C/svg%3E"
        alt="Check Mark"
        className="check-mark"
      />
    
      <p>Response Submitted Successfully</p>
      {/* You can add additional content or actions here */}
    </div>
  );
};

export default ExamEnd;
