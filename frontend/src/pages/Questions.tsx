import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { AxiosError } from 'axios';
import type { Question, Topic, Difficulty } from '../types/questions';
import { getQuestions, submitAnswer } from '../api/questionsApi';
import QuestionCard from '../components/questions/QuestionCard';
import FeedbackMessage from '../components/questions/FeedbackMessage';
import TopicSelector from '../components/questions/TopicSelector';

type ErrorPayload = {
  message?: string | string[];
};

/**
 * Main Questions Page - Practice math with Marcy
 */
const Questions: React.FC = () => {
  const navigate = useNavigate();

  // Selection state
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<Difficulty | null>(null);

  // Questions state
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [questionsError, setQuestionsError] = useState<string | null>(null);

  // Answer state
  const [userAnswer, setUserAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    isCorrect: boolean;
    message: string;
    correctAnswer?: string;
  } | null>(null);

  // UI state
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [isPracticeStarted, setIsPracticeStarted] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];

  /**
   * Fetch questions from the backend
   */
  const fetchQuestions = async () => {
    if (!selectedTopic || !selectedDifficulty) {
      return;
    }

    setIsLoadingQuestions(true);
    setQuestionsError(null);

    try {
      const fetchedQuestions = await getQuestions({
        topic: selectedTopic,
        difficulty: selectedDifficulty,
        random: true,
      });

      if (fetchedQuestions.length === 0) {
        setQuestionsError(
          'No questions found for this topic and difficulty. Please try another selection.'
        );
        setIsPracticeStarted(false);
      } else {
        setQuestions(fetchedQuestions);
        setCurrentQuestionIndex(0);
        setScore({ correct: 0, total: 0 });
      }
    } catch (error) {
      const axiosError = error as AxiosError<ErrorPayload>;

      if (axiosError.response?.status === 401) {
        setQuestionsError('Your session has expired. Please log in again.');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setQuestionsError('Unable to load questions. Please try again later.');
      }
      setIsPracticeStarted(false);
    } finally {
      setIsLoadingQuestions(false);
    }
  };

  /**
   * Start practice session
   */
  const handleStartPractice = () => {
    setIsPracticeStarted(true);
    fetchQuestions();
  };

  /**
   * Submit answer to the current question
   */
  const handleSubmitAnswer = async () => {
    if (!currentQuestion || !userAnswer.trim()) return;

    setIsSubmitting(true);

    try {
      const result = await submitAnswer(
        currentQuestion.question_id,
        userAnswer.trim()
      );

      setFeedback({
        isCorrect: result.isCorrect,
        message: result.message,
        correctAnswer: result.correctAnswer,
      });

      // Update score
      setScore((prev) => ({
        correct: prev.correct + (result.isCorrect ? 1 : 0),
        total: prev.total + 1,
      }));
    } catch (error) {
      const axiosError = error as AxiosError<ErrorPayload>;

      if (axiosError.response?.status === 401) {
        setQuestionsError('Your session has expired. Please log in again.');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setQuestionsError('Unable to submit answer. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Move to next question
   */
  const handleNextQuestion = () => {
    setFeedback(null);
    setUserAnswer('');
    setShowHint(false);

    // Check if there are more questions
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // End of questions - show completion message or fetch new ones
      setIsPracticeStarted(false);
      setQuestions([]);
    }
  };

  /**
   * Reset and go back to topic selection
   */
  const handleBackToSelection = () => {
    setIsPracticeStarted(false);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setFeedback(null);
    setUserAnswer('');
    setShowHint(false);
    setQuestionsError(null);
  };

  return (
    <section
      className="min-vh-100 py-5"
      style={{
        backgroundImage: 'url(/bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-8 col-xl-7">
            {/* Header with score */}
            {isPracticeStarted && (
              <div className="d-flex justify-content-between align-items-center mb-4">
                <button
                  type="button"
                  className="btn btn-outline-danger rounded-pill"
                  onClick={handleBackToSelection}
                >
                  ← Change Topic
                </button>
                <div className="badge bg-success rounded-pill px-3 py-2">
                  Score: {score.correct} / {score.total}
                </div>
              </div>
            )}

            {/* Error message */}
            {questionsError && (
              <div className="alert alert-danger rounded-4" role="alert">
                {questionsError}
              </div>
            )}

            {/* Loading state */}
            {isLoadingQuestions && (
              <div className="text-center py-5">
                <div className="spinner-border text-danger" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3 text-muted">Loading questions...</p>
              </div>
            )}

            {/* Topic Selection */}
            {!isPracticeStarted && !isLoadingQuestions && (
              <TopicSelector
                selectedTopic={selectedTopic}
                selectedDifficulty={selectedDifficulty}
                onTopicChange={setSelectedTopic}
                onDifficultyChange={setSelectedDifficulty}
                onStartPractice={handleStartPractice}
              />
            )}

            {/* Practice Session Complete */}
            {isPracticeStarted &&
              questions.length > 0 &&
              currentQuestionIndex >= questions.length &&
              !isLoadingQuestions && (
                <div className="card shadow-lg rounded-4 border-0">
                  <div className="card-body p-5 text-center">
                    <img
                      src="/marcy.png"
                      alt="Marcy celebrating"
                      className="img-fluid mb-4"
                      style={{ maxWidth: '200px' }}
                    />
                    <h2 className="h3 text-danger mb-3">
                      Great Job! Session Complete!
                    </h2>
                    <p className="lead mb-4">
                      You scored {score.correct} out of {score.total}!
                    </p>
                    <div className="d-flex gap-2 justify-content-center">
                      <button
                        type="button"
                        className="btn btn-danger rounded-pill px-4"
                        onClick={handleStartPractice}
                      >
                        Practice More
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-danger rounded-pill px-4"
                        onClick={handleBackToSelection}
                      >
                        Change Topic
                      </button>
                    </div>
                  </div>
                </div>
              )}

            {/* Question Display */}
            {isPracticeStarted &&
              currentQuestion &&
              !isLoadingQuestions &&
              !feedback && (
                <div className="backdrop-panel">
                  <div className="mb-3 text-center">
                    <span className="badge bg-primary rounded-pill">
                      Question {currentQuestionIndex + 1} of {questions.length}
                    </span>
                  </div>
                  <QuestionCard
                    question={currentQuestion}
                    userAnswer={userAnswer}
                    onAnswerChange={setUserAnswer}
                    onSubmit={handleSubmitAnswer}
                    showHint={showHint}
                    onToggleHint={() => setShowHint(!showHint)}
                    isSubmitting={isSubmitting}
                  />
                </div>
              )}

            {/* Feedback Display */}
            {isPracticeStarted && feedback && (
              <div className="backdrop-panel">
                <FeedbackMessage
                  isCorrect={feedback.isCorrect}
                  message={feedback.message}
                  correctAnswer={feedback.correctAnswer}
                  onNext={handleNextQuestion}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Questions;
