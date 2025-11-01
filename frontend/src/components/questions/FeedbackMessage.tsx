import React from 'react';

interface FeedbackMessageProps {
  isCorrect: boolean;
  message: string;
  correctAnswer?: string;
  onNext: () => void;
}

/**
 * Component to display feedback after answer submission
 */
const FeedbackMessage: React.FC<FeedbackMessageProps> = ({
  isCorrect,
  message,
  correctAnswer,
  onNext,
}) => {
  return (
    <div
      className={`alert ${
        isCorrect ? 'alert-success' : 'alert-warning'
      } rounded-4 shadow-sm`}
      role="alert"
    >
      <div className="d-flex align-items-center gap-3">
        <img
          src="/marcy.png"
          alt="Marcy"
          className="rounded-circle"
          style={{ width: '60px', height: '60px', objectFit: 'cover' }}
        />
        <div className="flex-grow-1">
          <h5 className="mb-2">{isCorrect ? 'Awesome!' : 'Keep trying!'}</h5>
          <p className="mb-2">{message}</p>
          {!isCorrect && correctAnswer && (
            <p className="mb-0">
              <strong>The correct answer is:</strong> {correctAnswer}
            </p>
          )}
        </div>
      </div>
      <button
        type="button"
        className="btn btn-primary rounded-pill mt-3 w-100"
        onClick={onNext}
      >
        Next Question →
      </button>
    </div>
  );
};

export default FeedbackMessage;
