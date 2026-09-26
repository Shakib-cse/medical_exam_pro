import { api } from "@/lib/api";

export interface MockExamCardData {
  id: string;
  examNumber?: number;
  title: string;
  description?: string;
  difficultyBadge: string;
  difficultyType: "moderate" | "advanced" | "clinical" | "standard" | string;
  duration: string;
  durationMinutes: number;
  cpsDurationMinutes?: number;
  pdDurationMinutes?: number;
  breakDurationMinutes?: number;
  questions: number;
  cpsQuestionCount?: number;
  pdQuestionCount?: number;
  bestScore?: string | null;
  score?: number;
  dateTaken?: string;
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

export interface MockEmqCase {
  id?: string;
  caseNumber: number;
  vignette: string;
  question: string;
  answer?: string;
  correctOption: string;
  explanation: string;
}

export interface MockQuestion {
  id: string;
  section: "CPS" | "PD";
  questionType: "SBA" | "EMQ" | "SELECT_3" | "RANKING";
  questionText: string;
  vignette?: string;
  options: string[];
  optionsDict?: Record<string, string>;
  correctAnswer: number;
  correctOption?: string;
  correctAnswers?: string[];
  idealOrder?: string[];
  explanation?: string;
  references?: string;
  themeNumber?: number;
  themeTitle?: string;
  cases?: MockEmqCase[];
  subTopic?: string;
  order: number;
}

export interface MockExamDetail {
  id: string;
  examNumber?: number;
  title: string;
  description?: string;
  difficultyBadge: string;
  difficultyType: string;
  durationMinutes: number;
  cpsDurationMinutes?: number;
  pdDurationMinutes?: number;
  breakDurationMinutes?: number;
  questionCount: number;
  cpsQuestionCount?: number;
  pdQuestionCount?: number;
  category?: string;
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

  submitExam: async (attemptId: string, payload: { userAnswers: Record<string, any>; timeTakenSeconds: number }) => {
    const res = await api.post<ApiResponse<any>>(`/mock-exams/attempt/${attemptId}/submit`, payload);
    return res.data;
  },
};
