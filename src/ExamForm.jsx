// src/ExamForm.jsx
import React, { useState, useEffect } from 'react';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import './ExamForm.css';
import app from '../config/firebase';
import ExamEnd from './ExamEnd';
import StartExam from './StartExam';

const ExamForm = () => {
  const [questionPaperCode, setQuestionPaperCode] = useState('');
  const [question1, setQuestion1] = useState('');
  const [question2, setQuestion2] = useState('');
  const [question3, setQuestion3] = useState('');
  const [question4, setQuestion4] = useState('');
  const [examStarted, setExamStarted] = useState(false);
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [timer, setTimer] = useState(60);
  const [timeoutMessage, setTimeoutMessage] = useState(false);
  let countdownInterval;

  // State to store name and phone received from StartExam component
  const [startExamData, setStartExamData] = useState({
    name: '',
    phone: '',
  });

  useEffect(() => {
    const beforeUnloadHandler = (e) => {
      if (examStarted && timer > 0) {
        const confirmationMessage = 'Are you sure you want to leave? Your progress will be lost.';
        e.returnValue = confirmationMessage;
        return confirmationMessage;
      }
    };

    const handleCountdown = () => {
      setTimer((prevTimer) => {
        if (prevTimer === 0) {
          clearInterval(countdownInterval);
          setTimeoutMessage(true);
          return 0;
        } else {
          return prevTimer - 1;
        }
      });
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && examStarted && timer > 0 && !examSubmitted) {
        // If the window loses focus and the exam is started and the timer is running, auto-submit the exam
        submitExam('auto');
        endExam();
      }
    };

    if (examStarted && timer > 0) {
      countdownInterval = setInterval(handleCountdown, 1000);
      document.addEventListener('visibilitychange', handleVisibilityChange);
    }

    return () => {
      clearInterval(countdownInterval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [examStarted, timer]);

  const startExam = (name, phone) => {
    // Set the name and phone received from StartExam component
    setStartExamData({
      name,
      phone,
    });
    setExamStarted(true);
  };

  const submitButtonClicked = () => {
    if (timer > 0) {
      clearInterval(countdownInterval);
      submitExam('button');
    }
  };

  const submitExam = async (source) => {
    if (!examStarted) {
      return;
    }

    const db = getFirestore(app);
    try {
      const docRef = await addDoc(collection(db, 'examForms'), {
        name: startExamData.name,
        phone: startExamData.phone,
        questionPaperCode,
        question1,
        question2,
        question3,
        question4,
        source,
      });

      console.log('Document written with ID: ', docRef.id);
    } catch (e) {
      console.error('Error adding document: ', e);
    }

    setExamSubmitted(true);
    setExamStarted(false);
    setTimer(60);
    setQuestionPaperCode('');
    setQuestion1('');
    setQuestion2('');
    setQuestion3('');
    setQuestion4('');
    setTimeoutMessage(false);
  };

  const endExam = () => {
    clearInterval(countdownInterval);
    setExamStarted(false);
    setTimer(0);
    // Additional logic to handle the end of the exam due to user inactivity
  };

  return (
    <div className="exam-form-container">
      {!examStarted && timer > 0 && !examSubmitted ? (
        <StartExam onStart={startExam} />
      ) : timer > 0 && !examSubmitted ? (
        <form className="exam-form">
          {timeoutMessage && <p>Time is up! The exam has timed out.</p>}
          <div className="timer-container">
            <p>Time remaining: {timer} seconds</p>
          </div>

          {/* Name and Phone fields are removed as they are received from StartExam component */}

          <label htmlFor="questionPaperCode">Question Paper Code:</label>
          <input
            type="text"
            id="questionPaperCode"
            value={questionPaperCode}
            onChange={(e) => setQuestionPaperCode(e.target.value)}
            required
          />

          <label htmlFor="question1">Question 1:</label>
          <textarea id="question1" value={question1} onChange={(e) => setQuestion1(e.target.value)} rows={10}></textarea>

          <label htmlFor="question2">Question 2:</label>
          <textarea id="question2" value={question2} onChange={(e) => setQuestion2(e.target.value)} rows={10}></textarea>

          <label htmlFor="question3">Question 3:</label>
          <textarea id="question3" value={question3} onChange={(e) => setQuestion3(e.target.value)} rows={10}></textarea>

          <label htmlFor="question4">Question 4:</label>
          <textarea id="question4" value={question4} onChange={(e) => setQuestion4(e.target.value)} rows={10}></textarea>

          <button type="button" onClick={submitButtonClicked}>
            Submit Exam
          </button>
        </form>
      ) : (
        <ExamEnd />
      )}
    </div>
  );
};

export default ExamForm;
