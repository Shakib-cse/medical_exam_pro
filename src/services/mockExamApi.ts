import { api } from "@/lib/api";

export interface MockExamCardData {
  id: string;
  title: string;
  description?: string;
  difficultyBadge: string;
  difficultyType: "moderate" | "advanced" | "clinical" | "standard";
  duration: string;
  durationMinutes: number;
  questions: number;
  bestScore?: string | null;
  notAttempted?: boolean;
  status: "Completed" | "In progress" | "Not started";
  actionText: "Restart" | "Resume" | "Start";
  progress: number;
  category?: string;
}

export interface MockExamHistoryRow {
  id: string;
  mockExamId?: string;
  date: string;
  examType: string;
  score: string;
  scoreColor: "green" | "amber" | "rose";
  timeTaken: string;
  status: string;
}

export interface MockQuestion {
  id: string;
  questionText: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  order: number;
}

export interface MockExamDetail {
  id: string;
  title: string;
  description?: string;
  difficultyBadge: string;
  difficultyType: string;
  durationMinutes: number;
  questionCount: number;
  questions: MockQuestion[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const mockExamApi = {
  getMockExams: async () => {
    const res = await api.get<ApiResponse<MockExamCardData[]>>("/mock-exams");
    return res.data;
  },

  getExamHistory: async () => {
    const res = await api.get<ApiResponse<MockExamHistoryRow[]>>("/mock-exams/history");
    return res.data;
  },

  getMockExamById: async (id: string) => {
    const res = await api.get<ApiResponse<MockExamDetail>>(`/mock-exams/${id}`);
    return res.data;
  },

  startExam: async (id: string) => {
    const res = await api.post<ApiResponse<any>>(`/mock-exams/${id}/start`);
    return res.data;
  },

  submitExam: async (attemptId: string, payload: { userAnswers: Record<string, number>; timeTakenSeconds: number }) => {
    const res = await api.post<ApiResponse<any>>(`/mock-exams/attempt/${attemptId}/submit`, payload);
    return res.data;
  },
};
