import React, { useState } from 'react';
import axios from 'axios';

export const fetchQuizQuestions = async () => {
  const API_URL = 'https://personality-quest.p.rapidapi.com/iq_test/start_guest_test';

  const options = {
    method: 'GET',
    url: API_URL,
    headers: {
      'X-RapidAPI-Key': '59a801cf1amsh08f604f0a7f1d1ep1736bfjsnaac2e3ceec85',
      'X-RapidAPI-Host': 'personality-quest.p.rapidapi.com',
    },
  };

    try {
    const response = await axios.request(options);
    console.log(response.data);  // Log the API response to inspect the structure
    
    // Since the response data is an array of questions, we can directly map over it
    return response.data.map((question) => {
      // Return the question object with its details
      return {
        id: question.iq_question_id,
        question: question.question || 'No question text available',
        options: Array.isArray(question.IQ_Question_Options) ? question.IQ_Question_Options.map(option => ({
          id: option.iq_question_option_id,
          text: option.option || '',
          src: option.option_src || '',
        })) : [],
        answerOptions: Array.isArray(question.IQ_Answer_Options) ? question.IQ_Answer_Options.map(answerOption => ({
          id: answerOption.iq_answer_option_id,
          text: answerOption.answer || '',
          src: answerOption.answer_src || '',
        })) : [],
        // ... any other properties you want to include
      };
    }).filter((question) => {
      // Filter out questions with no options
      return question.options.length > 0;
    });  
  } catch (error) {
    console.error('Error fetching questions:', error);
    return [];
  }
};

export const submitQuizAnswers = async (answers) => {
  const API_URL = 'https://personality-quest.p.rapidapi.com/iq_test/submit_guest_test';

  const options = {
    method: 'POST',
    url: 'https://personality-quest.p.rapidapi.com/iq_test/submit_guest_test',
    headers: {
      'content-type': 'application/json',
      'X-RapidAPI-Key': 'b197267008mshf4a27514944e4f6p186a86jsna18ae7c3dabb',
      'X-RapidAPI-Host': 'personality-quest.p.rapidapi.com',
    },
    data: answers,  // Use the answers parameter to populate the data field
  };
  
  try {
    const response = await axios.request(options);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error submitting quiz answers:', error);
    throw error;
  }  
};

