/**
 * GraphQL queries and mutations for the MathWithMarcy application
 */
import { gql } from '@apollo/client';

/**
 * Authentication Mutations
 */
export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(input: { email: $email, password: $password }) {
      accessToken
      user {
        user_id
        name
        email
      }
    }
  }
`;

export const REGISTER_MUTATION = gql`
  mutation Register($name: String!, $email: String!, $password: String!) {
    register(input: { name: $name, email: $email, password: $password }) {
      user_id
      name
      email
    }
  }
`;

/**
 * User Profile Queries and Mutations
 */
export const GET_ME_QUERY = gql`
  query GetMe {
    me {
      user_id
      name
      email
      created_at
      updated_at
    }
  }
`;

export const UPDATE_USER_MUTATION = gql`
  mutation UpdateUser($name: String, $email: String) {
    updateUser(input: { name: $name, email: $email }) {
      user_id
      name
      email
      created_at
      updated_at
    }
  }
`;

export const CHANGE_PASSWORD_MUTATION = gql`
  mutation ChangePassword($currentPassword: String!, $newPassword: String!) {
    changePassword(
      input: { currentPassword: $currentPassword, newPassword: $newPassword }
    )
  }
`;

export const DELETE_USER_MUTATION = gql`
  mutation DeleteUser {
    deleteUser
  }
`;

/**
 * Questions Queries and Mutations
 */
export const GET_QUESTIONS_QUERY = gql`
  query GetQuestions($topic: String, $difficulty: String, $limit: Int) {
    questions(
      input: { topic: $topic, difficulty: $difficulty, limit: $limit }
    ) {
      question_id
      topic
      difficulty
      question_text
      hint
      correct_answer
      created_at
      updated_at
    }
  }
`;

export const SUBMIT_ANSWER_MUTATION = gql`
  mutation SubmitAnswer($questionId: Int!, $userAnswer: String!) {
    submitAnswer(questionId: $questionId, userAnswer: $userAnswer) {
      is_correct
      message
      correct_answer
    }
  }
`;

/**
 * User Statistics Query
 */
export const GET_USER_STATISTICS_QUERY = gql`
  query GetUserStatistics {
    myStatistics {
      totalAnswered
      correctAnswers
      accuracy
      topics {
        geometry {
          answered
          correct
          byDifficulty {
            easy {
              answered
              correct
            }
            medium {
              answered
              correct
            }
            hard {
              answered
              correct
            }
          }
        }
        algebra {
          answered
          correct
          byDifficulty {
            easy {
              answered
              correct
            }
            medium {
              answered
              correct
            }
            hard {
              answered
              correct
            }
          }
        }
        arithmetic {
          answered
          correct
          byDifficulty {
            easy {
              answered
              correct
            }
            medium {
              answered
              correct
            }
            hard {
              answered
              correct
            }
          }
        }
        wordProblem {
          answered
          correct
          byDifficulty {
            easy {
              answered
              correct
            }
            medium {
              answered
              correct
            }
            hard {
              answered
              correct
            }
          }
        }
      }
      difficulties {
        easy {
          answered
          correct
        }
        medium {
          answered
          correct
        }
        hard {
          answered
          correct
        }
      }
    }
  }
`;

/**
 * Type definitions for GraphQL responses
 */
export type LoginResponse = {
  login: {
    accessToken: string;
    user: {
      user_id: number;
      name: string;
      email: string;
    };
  };
};

export type RegisterResponse = {
  register: {
    user_id: number;
    name: string;
    email: string;
  };
};

export type GetMeResponse = {
  me: {
    user_id: number;
    name: string;
    email: string;
    created_at: string;
    updated_at: string;
  };
};

export type UpdateUserResponse = {
  updateUser: {
    user_id: number;
    name: string;
    email: string;
    created_at: string;
    updated_at: string;
  };
};

export type ChangePasswordResponse = {
  changePassword: boolean;
};

export type DeleteUserResponse = {
  deleteUser: boolean;
};

export type Question = {
  question_id: number;
  topic: string;
  difficulty: string;
  question_text: string;
  hint: string;
  correct_answer: string;
  created_at: string;
  updated_at: string;
};

export type GetQuestionsResponse = {
  questions: Question[];
};

export type SubmitAnswerResponse = {
  submitAnswer: {
    is_correct: boolean;
    message: string;
    correct_answer?: string;
  };
};

export type TopicStatistic = {
  topic: string;
  total_answered: number;
  total_correct: number;
  total_incorrect: number;
  accuracy_percentage: number;
};

export type DifficultyStatistic = {
  difficulty: string;
  total_answered: number;
  total_correct: number;
  total_incorrect: number;
  accuracy_percentage: number;
};

export type UserStatisticsResponse = {
  myStatistics: {
    totalAnswered: number;
    correctAnswers: number;
    accuracy: number;
    topics: {
      geometry: {
        answered: number;
        correct: number;
        byDifficulty: {
          easy: { answered: number; correct: number };
          medium: { answered: number; correct: number };
          hard: { answered: number; correct: number };
        };
      };
      algebra: {
        answered: number;
        correct: number;
        byDifficulty: {
          easy: { answered: number; correct: number };
          medium: { answered: number; correct: number };
          hard: { answered: number; correct: number };
        };
      };
      arithmetic: {
        answered: number;
        correct: number;
        byDifficulty: {
          easy: { answered: number; correct: number };
          medium: { answered: number; correct: number };
          hard: { answered: number; correct: number };
        };
      };
      wordProblem: {
        answered: number;
        correct: number;
        byDifficulty: {
          easy: { answered: number; correct: number };
          medium: { answered: number; correct: number };
          hard: { answered: number; correct: number };
        };
      };
    };
    difficulties: {
      easy: { answered: number; correct: number };
      medium: { answered: number; correct: number };
      hard: { answered: number; correct: number };
    };
  };
};
