import React from 'react';
import type { Topic, Difficulty } from '../../types/questions';
import { TOPICS, DIFFICULTIES } from '../../types/questions';

interface TopicSelectorProps {
  selectedTopic: Topic | null;
  selectedDifficulty: Difficulty | null;
  onTopicChange: (topic: Topic) => void;
  onDifficultyChange: (difficulty: Difficulty) => void;
  onStartPractice: () => void;
}

/**
 * Component for selecting topic and difficulty before starting practice
 */
const TopicSelector: React.FC<TopicSelectorProps> = ({
  selectedTopic,
  selectedDifficulty,
  onTopicChange,
  onDifficultyChange,
  onStartPractice,
}) => {
  const handleStartClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (!selectedTopic || !selectedDifficulty) {
      return;
    }

    onStartPractice();
  };

  return (
    <div className="card shadow-lg rounded-4 border-0">
      <div className="card-body p-4 p-md-5">
        <div className="text-center mb-4">
          <img
            src="/marcy.png"
            alt="Marcy"
            className="img-fluid mb-3"
            style={{ maxWidth: '150px' }}
          />
          <h2 className="h3 text-danger mb-2">Let's Practice Math!</h2>
          <p className="text-muted">
            Choose a topic and difficulty level to get started.
          </p>
        </div>

        {/* Topic selection */}
        <div className="mb-4">
          <label className="form-label fw-semibold text-danger">
            Select Topic:
          </label>
          <div className="d-grid gap-2">
            {TOPICS.map((topic) => (
              <button
                key={topic}
                type="button"
                className={`btn ${
                  selectedTopic === topic ? 'btn-danger' : 'btn-outline-danger'
                } rounded-pill`}
                onClick={() => onTopicChange(topic)}
              >
                {topic}
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty selection */}
        <div className="mb-4">
          <label className="form-label fw-semibold text-danger">
            Select Difficulty:
          </label>
          <div className="d-flex gap-2 justify-content-center">
            {DIFFICULTIES.map((difficulty) => (
              <button
                key={difficulty}
                type="button"
                className={`btn ${
                  selectedDifficulty === difficulty
                    ? 'btn-warning'
                    : 'btn-outline-warning'
                } rounded-pill flex-fill`}
                onClick={() => onDifficultyChange(difficulty)}
              >
                {difficulty}
              </button>
            ))}
          </div>
        </div>

        {/* Start button */}
        <button
          type="button"
          className="btn btn-danger btn-lg w-100 rounded-pill"
          onClick={handleStartClick}
          disabled={!selectedTopic || !selectedDifficulty}
        >
          Start Practice Session
        </button>
      </div>
    </div>
  );
};

export default TopicSelector;
