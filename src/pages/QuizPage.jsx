import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/theme-context';

export default function QuizPage() {
  const { category } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { theme } = useTheme();

  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Theme-based classes
  const bgColor = theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50';
  const textColor = theme === 'dark' ? 'text-gray-100' : 'text-gray-800';
  const cardBg = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
  const optionBg = theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50';
  const optionHover = theme === 'dark' ? 'hover:border-emerald-400' : 'hover:border-emerald-300';
  const optionText = theme === 'dark' ? 'text-gray-200' : 'text-gray-700';
  const secondaryText = theme === 'dark' ? 'text-gray-300' : 'text-gray-600';
  const disabledButtonBg = theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200';
  const disabledButtonText = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  const secondaryButtonBg = theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300';
  const secondaryButtonText = theme === 'dark' ? 'text-gray-100' : 'text-gray-800';

  const formatCategory = (cat) => {
    return cat.toLowerCase().replace(/\s+/g, '_').replace(/&/g, 'and').replace(/'/g, '').replace(/-/g, '_');
  };

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    const fetchQuestions = async () => {
      setLoading(true);
      setError(null);
      try {
        const formattedCategory = formatCategory(category);
        const questionsRef = collection(db, 'categories', formattedCategory, 'questions');
        const snapshot = await getDocs(questionsRef);

        if (snapshot.empty) {
          throw new Error(`No questions found for category "${category}".`);
        }

        const loadedQuestions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const validQuestions = loadedQuestions.filter(q =>
          q.question && Array.isArray(q.options) && q.options.length > 0 && q.answer && q.options.includes(q.answer)
        );

        if (validQuestions.length === 0) {
          throw new Error('No valid questions found in this category.');
        }

        const shuffled = validQuestions.sort(() => 0.5 - Math.random()).slice(0, 10);
        setQuestions(shuffled);
        setSelectedOptions(new Array(shuffled.length).fill(null));
      } catch (err) {
        setError(err.message || 'Failed to load questions.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [category, user, navigate]);

  const handleOptionSelect = (option) => {
    const updated = [...selectedOptions];
    updated[currentQuestion] = option;
    setSelectedOptions(updated);
  };

  const handleNextQuestion = () => {
    if (selectedOptions[currentQuestion] === questions[currentQuestion].answer) {
      setScore(prev => prev + 1);
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setShowResult(true);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedOptions(new Array(questions.length).fill(null));
    setScore(0);
    setShowResult(false);
  };

  const navigateToReview = () => {
    navigate('/review', { 
      state: { 
        questions, 
        selectedOptions,
        category 
      } 
    });
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${bgColor}`}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className={`mt-4 text-lg font-medium ${textColor}`}>
            Loading {category.replace(/-/g, ' ')} questions...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${bgColor}`}>
        <div className={`text-center p-6 ${cardBg} rounded-lg shadow-md max-w-md mx-4`}>
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className={`${textColor} mb-6`}>{error}</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (showResult) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${bgColor} p-4`}>
        <div className={`${cardBg} p-8 rounded-xl shadow-lg max-w-md w-full text-center`}>
          <h2 className="text-3xl font-bold text-emerald-600 mb-4">Quiz Completed!</h2>
          <div className={`text-5xl font-bold mb-6 ${textColor}`}>
            {score} / {questions.length}
          </div>
          <div className={`w-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-4 mb-6`}>
            <div
              className="bg-emerald-500 h-4 rounded-full"
              style={{ width: `${(score / questions.length) * 100}%` }}
            />
          </div>
          <p className={`${secondaryText} mb-8`}>
            {score === questions.length
              ? "Perfect! You're a genius! 🎉"
              : score >= questions.length / 2
              ? "Good job! Keep learning! 👍"
              : "Keep practicing! You'll get better! 💪"}
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={restartQuiz}
              className="px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition font-medium"
            >
              Try Again
            </button>
            <button
              onClick={navigateToReview}
              className={`px-6 py-3 ${secondaryButtonBg} ${secondaryButtonText} rounded-lg transition font-medium`}
            >
              Review Answers
            </button>
            <button
              onClick={() => navigate('/')}
              className={`px-6 py-3 ${secondaryButtonBg} ${secondaryButtonText} rounded-lg transition font-medium`}
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const selectedOption = selectedOptions[currentQuestion];

  return (
    <div className={`min-h-screen ${bgColor} py-12 px-4 sm:px-6 lg:px-8`}>
      <div className={`max-w-3xl mx-auto ${cardBg} rounded-xl shadow-md overflow-hidden p-6 sm:p-8`}>
        <div className={`w-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2.5 mb-6`}>
          <div
            className="bg-emerald-500 h-2.5 rounded-full"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          />
        </div>

        <div className="flex justify-between items-center mb-8">
          <h2 className={`text-2xl font-bold ${textColor} capitalize`}>
            {category.replace(/-/g, ' ')} Quiz
          </h2>
          <div className={`${theme === 'dark' ? 'bg-emerald-900 text-emerald-200' : 'bg-emerald-100 text-emerald-800'} px-3 py-1 rounded-full text-sm font-medium`}>
            Question {currentQuestion + 1} / {questions.length}
          </div>
        </div>

        <div className="space-y-8">
          <div className={`${optionBg} p-6 rounded-lg`}>
            <h3 id="question-text" className={`text-xl font-medium ${textColor} mb-6`}>
              {questions[currentQuestion].question}
            </h3>

            <div role="radiogroup" aria-labelledby="question-text" className="space-y-3">
              {questions[currentQuestion].options.map((option, idx) => (
                <div
                  key={idx}
                  onClick={() => handleOptionSelect(option)}
                  className={`p-4 border rounded-lg cursor-pointer transition ${
                    selectedOption === option
                      ? theme === 'dark'
                        ? 'border-emerald-500 bg-emerald-900 bg-opacity-20'
                        : 'border-emerald-400 bg-emerald-100'
                      : `border-gray-200 ${optionHover}`
                  } ${optionText}`}
                  role="radio"
                  aria-checked={selectedOption === option}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleOptionSelect(option);
                    }
                  }}
                >
                  <div className="flex items-center">
                    <div
                      className={`w-5 h-5 rounded-full border mr-3 flex items-center justify-center ${
                        selectedOption === option
                          ? 'border-emerald-500 bg-emerald-500 text-white'
                          : theme === 'dark'
                          ? 'border-gray-500'
                          : 'border-gray-300'
                      }`}
                    >
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <span>{option}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={handlePreviousQuestion}
              disabled={currentQuestion === 0}
              className={`px-6 py-3 rounded-lg font-medium transition ${
                currentQuestion === 0
                  ? `${disabledButtonBg} ${disabledButtonText} cursor-not-allowed`
                  : 'bg-emerald-500 text-white hover:bg-emerald-600'
              }`}
            >
              Previous
            </button>

            <div className="flex gap-3">
            
              <button
                onClick={handleNextQuestion}
                disabled={!selectedOption}
                className={`px-6 py-3 rounded-lg font-medium transition ${
                  selectedOption
                    ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                    : `${disabledButtonBg} ${disabledButtonText} cursor-not-allowed`
                }`}
              >
                {currentQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}