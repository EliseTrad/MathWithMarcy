import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Topic, Difficulty } from '../types/questions';
import { useAppDispatch, useAppSelector } from '../store';
import {
  fetchQuestions,
  submitAnswer,
  setSelectedTopic,
  setSelectedDifficulty,
  setUserAnswer,
  toggleShowHint,
  nextQuestion,
  resetQuiz,
  clearQuestionsError,
  setPracticeStarted,
} from '../store/slices/questionsSlice';
import QuestionCard from '../components/questions/QuestionCard';
import FeedbackMessage from '../components/questions/FeedbackMessage';
import TopicSelector from '../components/questions/TopicSelector';

/**
 * Main Questions Page - Practice math with Marcy
 */
const Questions: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    selectedTopic,
    selectedDifficulty,
    questions,
    currentQuestionIndex,
    userAnswer,
    isSubmitting,
    feedback,
    showHint,
    score,
    error,
    isPracticeStarted,
  } = useAppSelector((state) => state.questions);

  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    return () => {
      dispatch(clearQuestionsError());
    };
  }, [dispatch]);

  /**
   * Start practice session
   */
  const handleStartPractice = async () => {
    if (!selectedTopic || !selectedDifficulty) {
      return;
    }

    const result = await dispatch(
      fetchQuestions({
        topic: selectedTopic,
        difficulty: selectedDifficulty,
        limit: 10,
      })
    );

    if (fetchQuestions.rejected.match(result)) {
      if (result.payload?.includes('401')) {
        setTimeout(() => navigate('/login'), 2000);
      }
      dispatch(setPracticeStarted(false));
    }
  };

  /**
   * Submit answer to the current question
   */
  const handleSubmitAnswer = async () => {
    if (!currentQuestion || !userAnswer.trim()) return;

    await dispatch(
      submitAnswer({
        questionId: currentQuestion.question_id,
        userAnswer: userAnswer.trim(),
      })
    );
  };

  /**
   * Move to next question
   */
  const handleNextQuestion = () => {
    dispatch(nextQuestion());

    // Check if this was the last question
    if (currentQuestionIndex >= questions.length - 1) {
      dispatch(setPracticeStarted(false));
    }
  };

  /**
   * Reset and go back to topic selection
   */
  const handleBackToSelection = () => {
    dispatch(resetQuiz());
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
                  Score: {score}
                </div>
              </div>
            )}

            {/* Error message */}
            {error && (
              <div className="alert alert-danger rounded-4" role="alert">
                {error}
              </div>
            )}

            {/* Topic Selection */}
            {!isPracticeStarted && (
              <TopicSelector
                selectedTopic={selectedTopic}
                selectedDifficulty={selectedDifficulty}
                onTopicChange={(topic: Topic) =>
                  dispatch(setSelectedTopic(topic))
                }
                onDifficultyChange={(difficulty: Difficulty) =>
                  dispatch(setSelectedDifficulty(difficulty))
                }
                onStartPractice={handleStartPractice}
              />
            )}

            {/* Practice Session Complete */}
            {isPracticeStarted &&
              questions.length > 0 &&
              currentQuestionIndex >= questions.length && (
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
                    <p className="lead mb-4">You scored {score}!</p>
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
            {isPracticeStarted && currentQuestion && !feedback && (
              <div className="backdrop-panel">
                <div className="mb-3 text-center">
                  <span className="badge bg-primary rounded-pill">
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </span>
                </div>
                <QuestionCard
                  question={currentQuestion}
                  userAnswer={userAnswer}
                  onAnswerChange={(answer: string) =>
                    dispatch(setUserAnswer(answer))
                  }
                  onSubmit={handleSubmitAnswer}
                  showHint={showHint}
                  onToggleHint={() => dispatch(toggleShowHint())}
                  isSubmitting={isSubmitting}
                />
              </div>
            )}

            {/* Feedback Display */}
            {isPracticeStarted && feedback && (
              <div className="backdrop-panel">
                <FeedbackMessage
                  isCorrect={feedback.is_correct}
                  message={feedback.message}
                  correctAnswer={feedback.correct_answer}
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
