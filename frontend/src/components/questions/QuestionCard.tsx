import React from 'react';
import type { Question } from '../../types/questions';

interface QuestionCardProps {
  question: Question;
  userAnswer: string;
  onAnswerChange: (answer: string) => void;
  onSubmit: () => void;
  showHint: boolean;
  onToggleHint: () => void;
  isSubmitting: boolean;
}

/**
 * Component to display a single question with input field
 */
const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  userAnswer,
  onAnswerChange,
  onSubmit,
  showHint,
  onToggleHint,
  isSubmitting,
}) => {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isSubmitting) {
      onSubmit();
    }
  };

  return (
    <div className="card shadow-lg rounded-4 border-0 mb-4">
      <div className="card-body p-4 p-md-5">
        {/* Topic and Difficulty badges */}
        <div className="d-flex gap-2 mb-3">
          <span className="badge bg-danger-subtle text-danger">
            {question.topic}
          </span>
          <span className="badge bg-warning-subtle text-warning">
            {question.difficulty}
          </span>
        </div>

        {/* Question text */}
        <h3 className="h4 text-danger mb-4">{question.question_text}</h3>

        {/* Hint section */}
        {question.hint && (
          <div className="mb-4">
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary rounded-pill"
              onClick={onToggleHint}
            >
              {showHint ? '🙈 Hide Hint' : '💡 Show Hint'}
            </button>
            {showHint && (
              <div className="alert alert-info mt-3 rounded-4">
                <strong>Hint:</strong> {question.hint}
              </div>
            )}
          </div>
        )}

        {/* Answer input */}
        <div className="mb-4">
          <label htmlFor="answer-input" className="form-label fw-semibold">
            Your Answer:
          </label>
          <input
            id="answer-input"
            type="text"
            className="form-control form-control-lg rounded-4"
            value={userAnswer}
            onChange={(e) => onAnswerChange(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your answer here..."
            disabled={isSubmitting}
            autoFocus
          />
        </div>

        {/* Submit button */}
        <button
          type="button"
          className="btn btn-danger btn-lg w-100 rounded-pill"
          onClick={onSubmit}
          disabled={!userAnswer.trim() || isSubmitting}
        >
          {isSubmitting ? 'Checking...' : 'Submit Answer'}
        </button>
      </div>
    </div>
  );
};

export default QuestionCard;
