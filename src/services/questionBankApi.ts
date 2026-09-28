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

// Client-side cache for instant navigation & starting practice sessions
const fullBankCache = new Map<string, { data: QuestionBankItemData; cachedAt: number }>();
const specialtySummaryClientCache = new Map<string, { data: QuestionBankItemData; cachedAt: number }>();
const CLIENT_BANK_TTL_MS = 15 * 60 * 1000;

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
    if (!freeOnly) {
      const cached = fullBankCache.get(id);
      if (cached && Date.now() - cached.cachedAt < CLIENT_BANK_TTL_MS) {
        return { success: true, data: cached.data };
      }
    }

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
    if (res.data?.success && res.data.data && !freeOnly) {
      const d = res.data.data;
      const entry = { data: d, cachedAt: Date.now() };
      fullBankCache.set(id, entry);
      if (d.specialty) fullBankCache.set(d.specialty.toLowerCase().trim(), entry);
      if (d.title) fullBankCache.set(d.title.toLowerCase().trim(), entry);
    }
    return res.data;
  },

  getQuestionBankBySpecialty: async (specialty: string, summary: boolean = true, freeOnly: boolean = false) => {
    const norm = specialty.toLowerCase().trim();
    if (!freeOnly) {
      if (summary) {
        const cached = specialtySummaryClientCache.get(norm);
        if (cached && Date.now() - cached.cachedAt < CLIENT_BANK_TTL_MS) {
          return { success: true, data: cached.data };
        }
      } else {
        const cached = fullBankCache.get(norm);
        if (cached && Date.now() - cached.cachedAt < CLIENT_BANK_TTL_MS) {
          return { success: true, data: cached.data };
        }
      }
    }

    const params = new URLSearchParams();
    if (summary) params.append("summary", "true");
    else params.append("summary", "false");
    if (freeOnly) params.append("free", "true");
    const res = await api.get<ApiResponse<QuestionBankItemData>>(
      `/question-bank/specialty/${encodeURIComponent(specialty)}?${params.toString()}`
    );

    if (res.data?.success && res.data.data && !freeOnly) {
      const d = res.data.data;
      const entry = { data: d, cachedAt: Date.now() };
      if (summary) {
        specialtySummaryClientCache.set(norm, entry);
        if (d.id) specialtySummaryClientCache.set(d.id, entry);
        if (d.specialty) specialtySummaryClientCache.set(d.specialty.toLowerCase().trim(), entry);
        if (d.title) specialtySummaryClientCache.set(d.title.toLowerCase().trim(), entry);
      } else {
        fullBankCache.set(norm, entry);
        if (d.id) fullBankCache.set(d.id, entry);
        if (d.specialty) fullBankCache.set(d.specialty.toLowerCase().trim(), entry);
        if (d.title) fullBankCache.set(d.title.toLowerCase().trim(), entry);
      }
    }
    return res.data;
  },

  prefetchQuestionBank: (idOrSpecialty: string) => {
    if (!idOrSpecialty) return;
    const norm = idOrSpecialty.toLowerCase().trim();
    if (!fullBankCache.has(norm) && !fullBankCache.has(idOrSpecialty)) {
      questionBankApi.getQuestionBankBySpecialty(idOrSpecialty, false).catch(() => {});
    }
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

