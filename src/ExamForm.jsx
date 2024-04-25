// src/ExamForm.jsx
import React, { useState, useEffect, useRef } from 'react';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import './ExamForm.css';
import app from '../config/firebase';
import ExamEnd from './ExamEnd';
import StartExam from './StartExam';

const ExamForm = ({ score, setScore }) => {
  const [questionPaperCode, setQuestionPaperCode] = useState('');
  const [examStarted, setExamStarted] = useState(false);
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [timer, setTimer] = useState(30);
  const [timeoutMessage, setTimeoutMessage] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState({
    q1: '',
    q2: '',
    q3: '',
    q4: '',
    q5: '',
  });
  const [startExamData, setStartExamData] = useState({
    name: '',
    phone: '',
  });
  let countdownIntervalRef = useRef(null);
  const correctAnswers = {
    q1: '1',
    q2: '2',
    q3: '3',
    q4: '4',
    q5: '1',
  };

  const handleCountdown = () => {
    setTimer((prevTimer) => {
      if (prevTimer === 1) {
        clearInterval(countdownIntervalRef.current);
        setTimeoutMessage(true);
        submitExam('timeout');
        return 0;
      } else {
        return prevTimer - 1;
      }
    });
  };

  const handleVisibilityChange = () => {
    if (document.visibilityState === 'hidden' && examStarted && timer > 0 && !examSubmitted) {
      submitExam('auto');
    }
  };

  useEffect(() => {
    let intervalId;
    if (examStarted && timer > 0) {
      intervalId = setInterval(handleCountdown, 1000);
      document.addEventListener('visibilitychange', handleVisibilityChange);
    }

    return () => {
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [examStarted, timer, examSubmitted, score]);

  const startExam = (name, phone) => {
    setStartExamData({ name, phone });
    setExamStarted(true);
  };

  const submitButtonClicked = () => {
    if (timer > 0) {
      clearInterval(countdownIntervalRef.current);
      submitExam('button');
    }
  };

  const handleMCQChange = (questionId, selectedOption) => {
    setSelectedAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: selectedOption,
    }));
  };

  const submitExam = async (source) => {
    const db = getFirestore(app);
    let calculatedScore = 0;
    try {
      
      Object.keys(selectedAnswers).forEach((questionId) => {
        if (selectedAnswers[questionId] === correctAnswers[questionId]) {
          calculatedScore += 1;
        }
      });

      // console.log('Score:', calculatedScore);
      // setScore(calculatedScore);

      const docRef = await addDoc(collection(db, 'examForms'), {
        name: startExamData.name,
        phone: startExamData.phone,
        score: calculatedScore,
        source,
      });

      console.log('Document written with ID: ', docRef.id);
    

   // Delay the state update after the rendering phase
   setTimeout(() => {
    setExamSubmitted(true);
    setExamStarted(false);
    setTimer(30);
    setQuestionPaperCode('');
    setSelectedAnswers({
      q1: '',
      q2: '',
      q3: '',
      q4: '',
      q5: '',
    });
    setTimeoutMessage(false);
  }, 0);
}  catch (e) {
  console.error('Error adding document: ', e);
}

// Update the score immediately, as it doesn't cause a re-render
setScore(calculatedScore);
};
  ;

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

          <label htmlFor="questionPaperCode">Question Paper Code:</label>
          <input
            type="text"
            id="questionPaperCode"
            value={questionPaperCode}
            onChange={(e) => setQuestionPaperCode(e.target.value)}
            required
          />
<div className="mcq-question">
  <label>Question 1:</label>
  <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat, numquam inventore. Animi, ipsa maxime. Laboriosam sapiente aliquid hic esse, dolor, odio cum perspiciatis at assumenda vitae architecto, nostrum fugiat. Nihil.</p>
  <div>
    <label>
      <input
        type="radio"
        name="q1"
        value="1"
        checked={selectedAnswers.q1 === '1'}
        onChange={() => handleMCQChange('q1', '1')}
      />
      Option 1
    </label>
  </div>
  <div>
    <label>
      <input
        type="radio"
        name="q1"
        value="2"
        checked={selectedAnswers.q1 === '2'}
        onChange={() => handleMCQChange('q1', '2')}
      />
      Option 2
    </label>
  </div>
  <div>
    <label>
      <input
        type="radio"
        name="q1"
        value="3"
        checked={selectedAnswers.q1 === '3'}
        onChange={() => handleMCQChange('q1', '3')}
      />
      Option 3
    </label>
  </div>
  <div>
    <label>
      <input
        type="radio"
        name="q1"
        value="4"
        checked={selectedAnswers.q1 === '4'}
        onChange={() => handleMCQChange('q1', '4')}
      />
      Option 4
    </label>
  </div>
</div>

<div className="mcq-question">
  <label>Question 2:</label>
  <div>
    <label>
      <input
        type="radio"
        name="q2"
        value="1"
        checked={selectedAnswers.q2 === '1'}
        onChange={() => handleMCQChange('q2', '1')}
      />
      Option 1
    </label>
  </div>
  <div>
    <label>
      <input
        type="radio"
        name="q2"
        value="2"
        checked={selectedAnswers.q2 === '2'}
        onChange={() => handleMCQChange('q2', '2')}
      />
      Option 2
    </label>
  </div>
  <div>
    <label>
      <input
        type="radio"
        name="q2"
        value="3"
        checked={selectedAnswers.q2 === '3'}
        onChange={() => handleMCQChange('q2', '3')}
      />
      Option 3
    </label>
  </div>
</div>

<div className="mcq-question">
  <label>Question 3:</label>
  <div>
    <label>
      <input
        type="radio"
        name="q3"
        value="1"
        checked={selectedAnswers.q3 === '1'}
        onChange={() => handleMCQChange('q3', '1')}
      />
      Option 1
    </label>
  </div>
  <div>
    <label>
      <input
        type="radio"
        name="q3"
        value="2"
        checked={selectedAnswers.q3 === '2'}
        onChange={() => handleMCQChange('q3', '2')}
      />
      Option 2
    </label>
  </div>
  <div>
    <label>
      <input
        type="radio"
        name="q3"
        value="3"
        checked={selectedAnswers.q3 === '3'}
        onChange={() => handleMCQChange('q3', '3')}
      />
      Option 3
    </label>
  </div>
  <div>
    <label>
      <input
        type="radio"
        name="q3"
        value="4"
        checked={selectedAnswers.q3 === '4'}
        onChange={() => handleMCQChange('q3', '4')}
      />
      Option 4
    </label>
  </div>
</div>

<div className="mcq-question">
  <label>Question 4:</label>
  <div>
    <label>
      <input
        type="radio"
        name="q4"
        value="1"
        checked={selectedAnswers.q4 === '1'}
        onChange={() => handleMCQChange('q4', '1')}
      />
      Option 1
    </label>
  </div>
  <div>
    <label>
      <input
        type="radio"
        name="q4"
        value="2"
        checked={selectedAnswers.q4 === '2'}
        onChange={() => handleMCQChange('q4', '2')}
      />
      Option 2
    </label>
  </div>
  <div>
    <label>
      <input
        type="radio"
        name="q4"
        value="3"
        checked={selectedAnswers.q4 === '3'}
        onChange={() => handleMCQChange('q4', '3')}
      />
      Option 3
    </label>
  </div>
  <div>
    <label>
      <input
        type="radio"
        name="q4"
        value="4"
        checked={selectedAnswers.q4 === '4'}
        onChange={() => handleMCQChange('q4', '4')}
      />
      Option 4
    </label>
  </div>
</div>

<div className="mcq-question">
  <label>Question 5:</label>
  <div>
    <label>
      <input
        type="radio"
        name="q5"
        value="1"
        checked={selectedAnswers.q5 === '1'}
        onChange={() => handleMCQChange('q5', '1')}
      />
      Option 1
    </label>
  </div>
  <div>
    <label>
      <input
        type="radio"
        name="q5"
        value="2"
        checked={selectedAnswers.q5 === '2'}
        onChange={() => handleMCQChange('q5', '2')}
      />
      Option 2
    </label>
  </div>
  <div>
    <label>
      <input
        type="radio"
        name="q5"
        value="3"
        checked={selectedAnswers.q5 === '3'}
        onChange={() => handleMCQChange('q5', '3')}
      />
      Option 3
    </label>
  </div>
  <div>
    <label>
      <input
        type="radio"
        name="q5"
        value="4"
        checked={selectedAnswers.q5 === '4'}
        onChange={() => handleMCQChange('q5', '4')}
      />
      Option 4
    </label>
  </div>
</div>


          <button type="button" onClick={submitButtonClicked}>
            Submit Exam
          </button>
        </form>
      ) : (
        <ExamEnd score={score} />
      )}
    </div>
  );
};

export default ExamForm;
