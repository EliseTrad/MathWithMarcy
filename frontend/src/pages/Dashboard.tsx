import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import type { AxiosError } from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { getUserStatistics } from '../api/statisticsApi';
import type { UserStatistics } from '../types/statistics';

type Category = {
  key: 'geometry' | 'algebra' | 'arithmetic' | 'wordProblem';
  title: string;
  displayName: string;
};

const categories: Category[] = [
  { key: 'geometry', title: 'Geometry', displayName: 'Geometry' },
  { key: 'algebra', title: 'Algebra', displayName: 'Algebra' },
  { key: 'arithmetic', title: 'Arithmetic', displayName: 'Arithmetic' },
  {
    key: 'wordProblem',
    title: 'Word Problems',
    displayName: 'Word Problems',
  },
];

const encouragementMessages = [
  "Keep going, you're getting sharper every day!",
  "Marcy's proud of your progress :)",
  'Every question makes you stronger!',
  "You're on fire! Keep up the amazing work!",
  "Practice makes perfect, and you're proving it!",
];

/**
 * Dashboard page:
 * - Auth required; redirects to /login if not authenticated
 * - Shows user statistics and progress by topic and difficulty
 */
const Dashboard: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [statistics, setStatistics] = useState<UserStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [encouragement, setEncouragement] = useState('');

  useEffect(() => {
    // Pick a random encouragement message
    const randomMsg =
      encouragementMessages[
        Math.floor(Math.random() * encouragementMessages.length)
      ];
    setEncouragement(randomMsg);
  }, []);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const stats = await getUserStatistics();
        setStatistics(stats);
      } catch (err) {
        const axiosError = err as AxiosError;

        if (axiosError.response?.status === 401) {
          setError('Your session has expired. Redirecting to login...');
          setTimeout(() => navigate('/login'), 2000);
        } else {
          setError('Unable to load statistics. Please try again later.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchStatistics();
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="container-fluid p-0 p-lg-2">
      {/* Header */}
      <div className="mb-4">
        <h2 className="h3 fw-bold text-danger mb-1">
          Welcome back, {user.name}!
        </h2>
        <p className="text-danger-emphasis mb-0">
          Here's your progress overview
        </p>
      </div>

      {/* Error message */}
      {error && (
        <div className="alert alert-danger rounded-4 mb-4" role="alert">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="text-center py-5">
          <div className="spinner-border text-danger mb-3" role="status">
            <span className="visually-hidden">Loading statistics...</span>
          </div>
          <p className="text-muted">Loading your progress...</p>
        </div>
      )}

      {/* No data state */}
      {!isLoading && statistics && statistics.totalAnswered === 0 && (
        <div className="text-center py-5">
          <img
            src="/marcy.png"
            alt="Marcy"
            className="img-fluid mb-4"
            style={{ maxWidth: '200px' }}
          />
          <h3 className="h4 text-danger mb-3">
            You haven't answered any questions yet
          </h3>
          <p className="text-muted mb-4">
            Let's get started on your math journey!
          </p>
          <button
            className="btn btn-danger btn-lg rounded-pill px-5"
            onClick={() => navigate('/questions')}
          >
            Start Practicing
          </button>
        </div>
      )}

      {/* Statistics Display */}
      {!isLoading && statistics && statistics.totalAnswered > 0 && (
        <>
          {/* Overall Statistics Cards */}
          <div className="row g-4 mb-4">
            <div className="col-12 col-md-4">
              <div
                className="card shadow-sm rounded-4 border-0 text-white h-100"
                style={{
                  background:
                    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                }}
              >
                <div className="card-body text-center">
                  <div className="display-4 fw-bold mb-2">
                    {statistics.totalAnswered}
                  </div>
                  <p className="mb-0 fs-5">Questions Answered</p>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div
                className="card shadow-sm rounded-4 border-0 text-white h-100"
                style={{
                  background:
                    'linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)',
                }}
              >
                <div className="card-body text-center">
                  <div className="display-4 fw-bold mb-2">
                    {statistics.correctAnswers}
                  </div>
                  <p className="mb-0 fs-5">Correct Answers</p>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div
                className="card shadow-sm rounded-4 border-0 text-white h-100"
                style={{
                  background:
                    'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
                }}
              >
                <div className="card-body text-center">
                  <div className="display-4 fw-bold mb-2">
                    {statistics.accuracy}%
                  </div>
                  <p className="mb-0 fs-5">Accuracy</p>
                </div>
              </div>
            </div>
          </div>

          {/* Topic Breakdown */}
          <div className="row g-4 mb-4">
            {categories.map((cat) => {
              const topicStats = statistics.topics[cat.key];
              const accuracy =
                topicStats.answered > 0
                  ? Math.round((topicStats.correct / topicStats.answered) * 100)
                  : 0;

              return (
                <div className="col-12 col-md-6 col-xl-3" key={cat.key}>
                  <div className="card shadow-sm rounded-4 h-100">
                    <div className="card-body d-flex flex-column">
                      <h3 className="h5 text-danger mb-3 fw-bold">
                        {cat.displayName}
                      </h3>

                      {/* Topic Progress */}
                      <div className="mb-3">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="text-muted">Overall Progress</span>
                          <span className="fw-bold text-danger fs-5">
                            {accuracy}%
                          </span>
                        </div>
                        <div
                          className="progress mb-2"
                          style={{ height: '12px' }}
                        >
                          <div
                            className="progress-bar bg-danger"
                            role="progressbar"
                            style={{ width: `${accuracy}%` }}
                            aria-valuenow={accuracy}
                            aria-valuemin={0}
                            aria-valuemax={100}
                          ></div>
                        </div>
                        <div className="text-muted small">
                          {topicStats.correct} / {topicStats.answered} correct
                        </div>
                      </div>

                      {/* Difficulty Breakdown */}
                      <div className="mb-4">
                        <p className="text-muted small mb-2 fw-semibold">
                          By Difficulty:
                        </p>
                        <ul className="list-unstyled small">
                          <li className="d-flex justify-content-between align-items-center mb-2">
                            <span
                              className="badge text-white px-3 py-1"
                              style={{ backgroundColor: '#32CD32' }}
                            >
                              Easy
                            </span>
                            <span className="fw-semibold">
                              {topicStats.byDifficulty.easy.correct} /{' '}
                              {topicStats.byDifficulty.easy.answered}
                            </span>
                          </li>
                          <li className="d-flex justify-content-between align-items-center mb-2">
                            <span
                              className="badge text-white px-3 py-1"
                              style={{ backgroundColor: '#FF69B4' }}
                            >
                              Medium
                            </span>
                            <span className="fw-semibold">
                              {topicStats.byDifficulty.medium.correct} /{' '}
                              {topicStats.byDifficulty.medium.answered}
                            </span>
                          </li>
                          <li className="d-flex justify-content-between align-items-center">
                            <span
                              className="badge text-white px-3 py-1"
                              style={{ backgroundColor: '#BA55D3' }}
                            >
                              Hard
                            </span>
                            <span className="fw-semibold">
                              {topicStats.byDifficulty.hard.correct} /{' '}
                              {topicStats.byDifficulty.hard.answered}
                            </span>
                          </li>
                        </ul>
                      </div>

                      {/* Practice Button */}
                      <div className="mt-auto">
                        <button
                          className="btn btn-outline-danger w-100 rounded-pill"
                          onClick={() => navigate('/questions')}
                        >
                          Practice {cat.displayName}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Overall Difficulty Summary */}
          <div className="card shadow-sm rounded-4 mb-4">
            <div className="card-body p-4">
              <h3 className="h5 text-danger mb-4 fw-bold">
                Overall Difficulty Breakdown
              </h3>
              <div className="row g-4">
                <div className="col-12 col-md-4">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span
                      className="badge text-white px-3 py-2"
                      style={{ backgroundColor: '#32CD32' }}
                    >
                      Easy
                    </span>
                    <span className="fw-bold">
                      {statistics.difficulties.easy.correct} /{' '}
                      {statistics.difficulties.easy.answered}
                    </span>
                  </div>
                  <div className="progress" style={{ height: '10px' }}>
                    <div
                      className="progress-bar"
                      role="progressbar"
                      style={{
                        width: `${
                          statistics.difficulties.easy.answered > 0
                            ? Math.round(
                                (statistics.difficulties.easy.correct /
                                  statistics.difficulties.easy.answered) *
                                  100
                              )
                            : 0
                        }%`,
                        backgroundColor: '#32CD32',
                      }}
                    ></div>
                  </div>
                  <div className="text-muted small mt-1">
                    {statistics.difficulties.easy.answered > 0
                      ? Math.round(
                          (statistics.difficulties.easy.correct /
                            statistics.difficulties.easy.answered) *
                            100
                        )
                      : 0}
                    % accuracy
                  </div>
                </div>
                <div className="col-12 col-md-4">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span
                      className="badge text-white px-3 py-2"
                      style={{ backgroundColor: '#FF69B4' }}
                    >
                      Medium
                    </span>
                    <span className="fw-bold">
                      {statistics.difficulties.medium.correct} /{' '}
                      {statistics.difficulties.medium.answered}
                    </span>
                  </div>
                  <div className="progress" style={{ height: '10px' }}>
                    <div
                      className="progress-bar"
                      role="progressbar"
                      style={{
                        width: `${
                          statistics.difficulties.medium.answered > 0
                            ? Math.round(
                                (statistics.difficulties.medium.correct /
                                  statistics.difficulties.medium.answered) *
                                  100
                              )
                            : 0
                        }%`,
                        backgroundColor: '#FF69B4',
                      }}
                    ></div>
                  </div>
                  <div className="text-muted small mt-1">
                    {statistics.difficulties.medium.answered > 0
                      ? Math.round(
                          (statistics.difficulties.medium.correct /
                            statistics.difficulties.medium.answered) *
                            100
                        )
                      : 0}
                    % accuracy
                  </div>
                </div>
                <div className="col-12 col-md-4">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span
                      className="badge text-white px-3 py-2"
                      style={{ backgroundColor: '#BA55D3' }}
                    >
                      Hard
                    </span>
                    <span className="fw-bold">
                      {statistics.difficulties.hard.correct} /{' '}
                      {statistics.difficulties.hard.answered}
                    </span>
                  </div>
                  <div className="progress" style={{ height: '10px' }}>
                    <div
                      className="progress-bar"
                      role="progressbar"
                      style={{
                        width: `${
                          statistics.difficulties.hard.answered > 0
                            ? Math.round(
                                (statistics.difficulties.hard.correct /
                                  statistics.difficulties.hard.answered) *
                                  100
                              )
                            : 0
                        }%`,
                        backgroundColor: '#BA55D3',
                      }}
                    ></div>
                  </div>
                  <div className="text-muted small mt-1">
                    {statistics.difficulties.hard.answered > 0
                      ? Math.round(
                          (statistics.difficulties.hard.correct /
                            statistics.difficulties.hard.answered) *
                            100
                        )
                      : 0}
                    % accuracy
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Encouragement Message */}
      <div
        className="alert alert-danger border-0 rounded-4 shadow-sm d-flex align-items-center gap-3"
        role="alert"
        style={{ backgroundColor: '#ffe6f0' }}
      >
        <img
          src="/marcy.png"
          alt="Marcy mascot smiling"
          width={56}
          height={56}
          className="rounded-circle border"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = '/marceline.png';
          }}
        />
        <div className="flex-grow-1">
          <strong className="text-danger fs-5">
            Hi! I'm Marcy —{' '}
            {statistics && statistics.totalAnswered > 0
              ? encouragement
              : "Let's start practicing some math problems together!"}
          </strong>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
