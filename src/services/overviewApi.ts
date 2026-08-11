import { api } from "@/lib/api";

export interface TopicQuestion {
  id?: string;
  questionText: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface ClinicalTopicData {
  id: string;
  title: string;
  image: string;
  totalQ: number;
  durationMinutes?: number;
  correct: number;
  wrong: number;
  attemptsPct: number;
  accuracyPct: number;
  category: "all" | "weakest" | "inProgress";
  questions?: TopicQuestion[];
}

export interface DilemmaCardData {
  title: string;
  subtitle: string;
  image: string;
}

export interface DailyGoalData {
  goalTarget: number;
  weakestTopics: Array<{ name: string; score: string }>;
}

export interface StatCardData {
  title: string;
  value: string;
  subtext: string;
  percentage?: number;
  type: "radial" | "text";
}

export interface UserStatsData {
  questionsAttempted: StatCardData;
  accuracy: StatCardData;
  avgTime: StatCardData;
  weakestAreas: StatCardData;
  weakestTopicsList: Array<{ category: string; accuracyPct: number; questionsToRevisit: number }>;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const overviewApi = {
  getOverviewContent: async () => {
    const res = await api.get<ApiResponse<Record<string, any>>>("/overview/content");
    return res.data;
  },

  getUserStats: async () => {
    const res = await api.get<ApiResponse<UserStatsData>>("/overview/stats");
    return res.data;
  },
};
