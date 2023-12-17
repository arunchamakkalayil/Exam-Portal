// src/StartExam.jsx
import React, { useState } from 'react';
import { getFirestore, collection, where, query, getDocs } from 'firebase/firestore';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './StartExam.css';
import logo from './assets/logo.png';

const StartExam = ({ onStart }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const handleStart = async () => {
    if (name.trim() === '' || !/^\d{10}$/.test(phone)) {
      toast.error('Please enter a valid name and phone number.');
      return;
    }

    const db = getFirestore();
    const examFormsRef = collection(db, 'examForms');
    const phoneQuery = query(examFormsRef, where('phone', '==', phone));
    const phoneSnapshot = await getDocs(phoneQuery);

    if (!phoneSnapshot.empty) {
      toast.error(' Response already exists. You cannot start the exam again.');
      return;
    }

    onStart(name, phone);
  };

  return (
    <div className="start-exam-container">
      <img src={logo} alt="Logo" className="logo" />
      <div>
        <h2>Exam Instructions</h2>
        <ul>
          <li>You can submit your response only once.</li>
          <li>Ensure you have a stable internet connection.</li>
          <li>Do not close or refresh the page during the exam.</li>
          <li>If you need to end the exam, click the "End Exam" button.</li>
          <li>Do not close or refresh the page until you have submitted the exam.</li>
        </ul>
      </div>
      <div>
        <label htmlFor="name">Name:</label>
        <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
        <label htmlFor="phone">Phone Number:</label>
        <input
          type="tel"
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          pattern="[0-9]{10}"
          required
        />
        <button type="button" onClick={handleStart}>
          Start Exam
        </button>
      </div>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick pauseOnFocusLoss draggable pauseOnHover />
    </div>
  );
};

export default StartExam;
