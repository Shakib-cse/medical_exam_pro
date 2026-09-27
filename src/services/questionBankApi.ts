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

let cachedFreeSamplePromise: Promise<ApiResponse<QuestionBankItemData[]>> | null = null;
let cachedFreeSampleData: ApiResponse<QuestionBankItemData[]> | null = null;
let freeSampleCachedAt = 0;
const FREE_SAMPLE_TTL_MS = 15 * 60 * 1000;

export const questionBankApi = {
  getQuestionBanks: async () => {
    const res = await api.get<ApiResponse<QuestionBankItemData[]>>("/question-bank");
    return res.data;
  },

  getFreeSampleBanks: async (forceRefresh: boolean = false) => {
    if (!forceRefresh && cachedFreeSampleData && Date.now() - freeSampleCachedAt < FREE_SAMPLE_TTL_MS) {
      return cachedFreeSampleData;
    }
    if (!forceRefresh && cachedFreeSamplePromise) {
      return cachedFreeSamplePromise;
    }
    cachedFreeSamplePromise = (async () => {
      try {
        const res = await api.get<ApiResponse<QuestionBankItemData[]>>("/question-bank/free-sample");
        cachedFreeSampleData = res.data;
        freeSampleCachedAt = Date.now();
        return res.data;
      } finally {
        cachedFreeSamplePromise = null;
      }
    })();
    return cachedFreeSamplePromise;
  },

  getQuestionBankById: async (id: string, freeOnly: boolean = false) => {
    if (freeOnly && cachedFreeSampleData?.data) {
      const match = cachedFreeSampleData.data.find(
        (b) =>
          b.id === id ||
          b.title?.toLowerCase().trim() === id.toLowerCase().trim() ||
          b.specialty?.toLowerCase().trim() === id.toLowerCase().trim()
      );
      if (match) {
        return {
          success: true,
          data: match,
        };
      }
    }
    const query = freeOnly ? "?free=true" : "";
    const res = await api.get<ApiResponse<QuestionBankItemData>>(`/question-bank/${id}${query}`);
    return res.data;
  },

  getQuestionBankBySpecialty: async (specialty: string, summary: boolean = true, freeOnly: boolean = false) => {
    const params = new URLSearchParams();
    if (summary) params.append("summary", "true");
    else params.append("summary", "false");
    if (freeOnly) params.append("free", "true");
    const res = await api.get<ApiResponse<QuestionBankItemData>>(
      `/question-bank/specialty/${encodeURIComponent(specialty)}?${params.toString()}`
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

