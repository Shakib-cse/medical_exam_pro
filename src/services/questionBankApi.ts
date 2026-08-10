import { api } from "@/lib/api";

export interface QuestionBankQuestion {
  id: string;
  questionText: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  subTopic?: string;
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
  questionCount: number;
  questions?: QuestionBankQuestion[];
  avgAcc: string;
  isUnattempted: boolean;
  lastAttempted?: string;
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
};
