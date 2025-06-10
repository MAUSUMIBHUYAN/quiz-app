import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/theme-context';

export default function ReviewPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { theme } = useTheme();

  // If no state is passed, redirect to home
  if (!state?.questions) {
    navigate('/');
    return null;
  }

  const { questions, selectedOptions, category } = state;

  // Theme-based classes
  const bgColor = theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50';
  const textColor = theme === 'dark' ? 'text-gray-100' : 'text-gray-800';
  const cardBg = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
  const secondaryText = theme === 'dark' ? 'text-gray-300' : 'text-gray-600';
  const correctColor = theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600';
  const incorrectColor = theme === 'dark' ? 'text-red-400' : 'text-red-600';
  const optionText = theme === 'dark' ? 'text-gray-200' : 'text-gray-700';

  const calculateScore = () => {
    let score = 0;
    questions.forEach((question, index) => {
      if (selectedOptions[index] === question.answer) {
        score++;
      }
    });
    return score;
  };

  const score = calculateScore();

  return (
    <div className={`min-h-screen ${bgColor} py-12 px-4 sm:px-6 lg:px-8`}>
      <div className={`max-w-4xl mx-auto ${cardBg} rounded-xl shadow-md overflow-hidden p-6 sm:p-8`}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className={`text-2xl font-bold ${textColor}`}>Quiz Review</h1>
            <p className={`${secondaryText} capitalize`}>{category.replace(/-/g, ' ')}</p>
          </div>
          <div className={`text-lg font-medium ${textColor} bg-emerald-500/10 px-4 py-2 rounded-full`}>
            Score: <span className="font-bold">{score} / {questions.length}</span>
          </div>
        </div>

        <div className="space-y-6">
          {questions.map((question, questionIndex) => {
            const isCorrect = selectedOptions[questionIndex] === question.answer;
            const userAnswer = selectedOptions[questionIndex] || 'Not answered';

            return (
              <div key={questionIndex} className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <div className="flex items-start mb-4">
                  <div className={`mr-3 text-lg font-medium ${textColor}`}>{questionIndex + 1}.</div>
                  <div className="flex-1">
                    <h3 className={`text-lg font-medium ${textColor}`}>{question.question}</h3>
                    <div className="mt-4 space-y-3">
                      {question.options.map((option, optionIndex) => {
                        let optionStyle = '';
                        if (option === question.answer) {
                          optionStyle = `border-2 ${theme === 'dark' ? 'border-emerald-500 bg-emerald-900/30' : 'border-emerald-400 bg-emerald-100'}`;
                        } else if (option === selectedOptions[questionIndex] && !isCorrect) {
                          optionStyle = `border-2 ${theme === 'dark' ? 'border-red-500 bg-red-900/30' : 'border-red-400 bg-red-100'}`;
                        } else {
                          optionStyle = theme === 'dark' ? 'border-gray-600' : 'border-gray-200';
                        }

                        return (
                          <div
                            key={optionIndex}
                            className={`p-3 rounded-md border ${optionStyle} ${optionText}`}
                          >
                            <div className="flex items-center">
                              <div className={`w-5 h-5 rounded-full border mr-3 flex items-center justify-center ${
                                theme === 'dark' ? 'border-gray-500' : 'border-gray-300'
                              }`}>
                                {String.fromCharCode(65 + optionIndex)}
                              </div>
                              <span>{option}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className={`mt-4 p-3 rounded-md ${
                  isCorrect 
                    ? theme === 'dark' ? 'bg-emerald-900/30' : 'bg-emerald-100'
                    : theme === 'dark' ? 'bg-red-900/30' : 'bg-red-100'
                }`}>
                  <p className={isCorrect ? correctColor : incorrectColor}>
                    <span className="font-semibold">Your answer:</span> {userAnswer}
                    {!isCorrect && (
                      <span className={`block ${correctColor}`}>
                        <span className="font-semibold">Correct answer:</span> {question.answer}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
          <button
            onClick={() => navigate('/')}
            className={`px-6 py-3 ${
              theme === 'dark' 
                ? 'bg-gray-700 hover:bg-gray-600' 
                : 'bg-gray-200 hover:bg-gray-300'
            } ${textColor} rounded-lg font-medium transition`}
          >
            Back to Home
          </button>
          <button
            onClick={() => navigate(`/quiz/${category}`)}
            className={`px-6 py-3 ${
              theme === 'dark' 
                ? 'bg-emerald-600 hover:bg-emerald-700' 
                : 'bg-emerald-500 hover:bg-emerald-600'
            } text-white rounded-lg font-medium transition`}
          >
            Retake Quiz
          </button>
        </div>
      </div>
    </div>
  );
}