import { api } from "@/lib/api";

export interface QuestionBankQuestion {
  id: string;
  questionText: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  subTopic?: string;
  questionType?: "SBA" | "EMQ" | "RANKING" | "SELECT_3";
  themeNumber?: number | null;
  cases?: any;
  idealOrder?: string[];
  correctAnswers?: string[];
  peerStats?: Record<string, number>;
  totalAttempts?: number;
  selectionCounts?: Record<string, number>;
  instruction?: string;
  references?: string;
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
  totalQuestions?: number;
  sbaCount?: number;
  emqCount?: number;
  emqThemesCount?: number;
  rankingCount?: number;
  select3Count?: number;
  subTopics?: string[];
  subTopicCounts?: Record<
    string,
    { total: number; ranking: number; select3: number; sba: number; emq: number }
  >;
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

  recordQuestionAnswer: async (
    questionId: string,
    payload: {
      selectedOptions?: string[];
      rankOrder?: string[];
    }
  ) => {
    const res = await api.post<
      ApiResponse<{
        questionId: string;
        peerStats: Record<string, number>;
        totalAttempts: number;
        selectionCounts: Record<string, number>;
        userSelections?: string[];
      }>
    >(`/question-bank/questions/${questionId}/answer`, payload);
    return res.data;
  },
};

