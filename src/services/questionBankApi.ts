import { api } from "@/lib/api";

export interface QuestionBankQuestion {
  id: string;
  questionText: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  subTopic?: string;
  questionType?: "SBA" | "EMQ";
  themeNumber?: number | null;
  cases?: any;
}

export interface QuestionBankItemData {
  id: string;
  title: string;
  description?: string;
  specialty: string;
  category: string;
  type: string; // "Clinical" | "SJT"
  difficultyBadge: string;
  difficultyType: "moderate" | "advanced" | "clinical" | "standard";
  durationMinutes?: number;
  questionCount: number;
  subTopics?: string[];
  questions?: QuestionBankQuestion[];
  avgAcc: string;
  isUnattempted: boolean;
  lastAttempted?: string;
  stats?: {
    attempted: number;
    correct: number;
    accuracy: number;
    averageTimeSeconds: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const questionBankApi = {
  getQuestionBanks: async () => {
    const res = await api.get<ApiResponse<QuestionBankItemData[]>>("/question-bank");
    return res.data;
  },

  getQuestionBankById: async (id: string) => {
    const res = await api.get<ApiResponse<QuestionBankItemData>>(`/question-bank/${id}`);
    return res.data;
  },

  getQuestionBankBySpecialty: async (specialty: string, summary: boolean = true) => {
    const query = summary ? "?summary=true" : "?summary=false";
    const res = await api.get<ApiResponse<QuestionBankItemData>>(
      `/question-bank/specialty/${encodeURIComponent(specialty)}${query}`
    );
    return res.data;
  },

  startBankAttempt: async (bankId: string) => {
    const res = await api.post<ApiResponse<any>>(`/question-bank/${bankId}/start`);
    return res.data;
  },

  submitBankAttempt: async (
    attemptId: string,
    payload: { userAnswers: Record<string, number>; timeTakenSeconds: number }
  ) => {
    const res = await api.post<ApiResponse<any>>(`/question-bank/attempt/${attemptId}/submit`, payload);
    return res.data;
  },
};

