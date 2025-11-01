/**
 * DTO for user statistics response
 */

export interface DifficultyStats {
  answered: number;
  correct: number;
}

export interface TopicDifficultyBreakdown {
  easy: DifficultyStats;
  medium: DifficultyStats;
  hard: DifficultyStats;
}

export interface TopicStats {
  answered: number;
  correct: number;
  byDifficulty: TopicDifficultyBreakdown;
}

export interface TopicsStats {
  geometry: TopicStats;
  algebra: TopicStats;
  arithmetic: TopicStats;
  wordProblem: TopicStats;
}

export interface DifficultiesStats {
  easy: DifficultyStats;
  medium: DifficultyStats;
  hard: DifficultyStats;
}

export interface UserStatisticsDto {
  totalAnswered: number;
  correctAnswers: number;
  accuracy: number;
  topics: TopicsStats;
  difficulties: DifficultiesStats;
}
