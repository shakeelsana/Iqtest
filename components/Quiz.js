// components/Quiz.js
'use client'

import React, { useState, useEffect } from 'react';
import { fetchQuizQuestions, submitQuizAnswers } from '../utils/api';
import Image from 'next/image';

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [quizResult, setQuizResult] = useState(null);

  useEffect(() => {
    fetchQuizQuestions()
      .then((data) => {
        console.log('API Response:', data); // Log the data returned from the API
        if (Array.isArray(data) && data.length > 0) {
          setQuestions(data);
        } else {
          setQuestions(null); // Set questions to null to indicate that there was an error
        }
      })
      .catch((error) => {
        console.log('Error fetching questions:', error);
        setQuestions(null); // Set questions to null to indicate that there was an error
      });
  }, []);

  console.log('Questions State:', questions); // Log the state data
  
  if (questions === null) {
    return <div>Error fetching questions. Please try again later.</div>;
  }
  
  if (questions.length === 0) {
    return <div>Loading...</div>; // Display a loading message while fetching questions
  }

  const handleAnswerChange = (answer) => {
    // Save the selected answer to the state
    setSelectedAnswer(answer);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === null) {
      alert('Please select an answer');
      return;
    }

    // Save the selected answer to the answers array
    const newAnswers = [...answers, selectedAnswer];
    setAnswers(newAnswers);

    // Go to the next question or submit if this is the last question
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null); // Reset the selected answer for the next question
    } else {
      handleSubmit(newAnswers);
    }
  };

  const handleSubmit = async (answers) => {
    console.log('Questions:', questions);  // Log the questions array to the console

    // Convert the answers to the format expected by the API
    const formattedAnswers = answers.map((answer, index) => {
      const question = questions[index];
      if (!question) {
        console.error(`Question not found at index ${index}`);
        return null;
      }

      return {
        iq_question_id: question.id,
        iq_answer_option_id: answer,
      };
    });

    // Filter out any null values
    const validAnswers = formattedAnswers.filter((answer) => answer !== null);

    try {
      const result = await submitQuizAnswers(validAnswers);
      setQuizResult(result);
      console.log('Quiz results:', result);
      // TODO: Handle the display of quiz results here
    } catch (error) {
      console.log('Error submitting quiz:', error);
    }
  };

  if (questions.length === 0) {
    return <div>Loading...</div>; // Display a loading message while fetching questions
  }

  if (quizResult !== null) {
    return (
      <div>
        <h1>Quiz Result</h1>
        <div>
          {/* Display your quiz results here */}
          <p>{JSON.stringify(quizResult)}</p>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const questionOptions = currentQuestion.options;
  const answerOptions = currentQuestion.answerOptions;

  return (
    <div>
      <h1>Quiz</h1>
      <div>
        <p>
          Question {currentQuestionIndex + 1}: {currentQuestion.question}
        </p>
        <div>
        <h3>Options:</h3>
        <ul>
        {questionOptions ? (
          questionOptions.map((option) => (
         <li key={option.id}>
            {(option.text || option.src) ? (  // Updated condition
                <>
                    {option.text && <span>{String(option.text)}</span>}
                    {option.src && <img src={option.src} alt={String(option.text)} />}
                </>
            ) : (
              <span>No option available</span>
            )}
        </li>
    ))
) : (
    <p>Loading question options...</p>
)}
        </ul>
      </div>
      <div>
  <h3>Answers:</h3>
  {answerOptions ? (
    answerOptions.map((answerOption) => (
    <label key={answerOption.id}>
        <input
        type="radio"
        name="answer"
        value={answerOption.id}
        onChange={() => handleAnswerChange(answerOption.id)}
        checked={selectedAnswer === answerOption.id}
        />
        
        {(answerOption.text || answerOption.src) ? (  // Updated condition
                <>
                    {answerOption.text && <span>{String(answerOption.text)}</span>}
                    {answerOption.src && <img src={answerOption.src} alt={String(answerOption.text)} />}
                </>
            ) : (
            <span>No answer option available</span>
        )}
    </label>
    ))
) : (
    <p>Loading answer options...</p>
)}

</div>
        <button onClick={handleNextQuestion}>Next</button>
      </div>
    </div>
  );
};

export default Quiz;
