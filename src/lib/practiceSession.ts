export interface CPSSavedSession {
  speciality: string;
  specialitySlug: string;
  questionType: "SBA" | "EMQ" | "Both";
  timer: "on" | "off";
  topics: string;
  selectedTopicNames?: string[];
  currentIndex: number;
  totalQuestions: number;
  attemptedCount?: number;
  correctCount?: number;
  userSbaAnswers: Record<number, string>;
  userEmqAnswers: Record<number, Record<string, string>>;
  emqSubmitted: Record<number, boolean>;
  flagged: Record<number, boolean>;
  elapsedSeconds: number;
  isCompleted: boolean;
  lastUpdated: number;
}

export interface CPSSpecialtyStats {
  attempted: number;
  correct: number;
  accuracy: number;
  totalTimeSeconds: number;
  averageTime: string;
  progressPercent: number;
}

export function formatAverageTime(seconds: number): string {
  if (!seconds || seconds <= 0) return "0s";
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  if (mins > 0) {
    return `${mins}m ${secs < 10 ? `0${secs}` : secs}s`;
  }
  return `${secs}s`;
}

// Canonical mapping of all 18 specialties and all their slug/title aliases
export const SPECIALTY_ALIAS_MAP: Record<string, string[]> = {
  cardiovascular: [
    "cardiovascular",
    "cardiovascular_medicine",
    "cardiology",
    "cardiology_respiratory_focus",
    "cardiovascular medicine",
    "cardiology & respiratory focus",
  ],
  dermatology: ["dermatology"],
  endocrinology: [
    "endocrinology",
    "endocrinology_diabetes",
    "endocrinology_and_diabetes",
    "endocrinology & diabetes",
  ],
  ent: ["ent", "ear_nose_throat", "ear_nose_and_throat", "ear, nose and throat"],
  gastroenterology: [
    "gastroenterology",
    "gastroenterology_hepatology",
    "gastroenterology_and_hepatology",
    "gastroenterology & hepatology",
  ],
  immunology: [
    "immunology",
    "genetics",
    "genetics_immunology",
    "genetics_and_immunology",
    "genetics & immunology",
  ],
  haematology: [
    "haematology",
    "hematology",
    "haematology_oncology",
    "haematology_and_oncology",
    "haematology & oncology",
  ],
  infectious: [
    "infectious",
    "infectious_diseases",
    "infectious diseases",
  ],
  neurology: ["neurology"],
  ophthalmology: ["ophthalmology"],
  paediatrics: ["paediatrics", "pediatrics"],
  pharmacology: ["pharmacology"],
  psychiatry: ["psychiatry"],
  renal: [
    "renal",
    "renal_medicine",
    "renal_medicine_urology",
    "renal_medicine_and_urology",
    "renal medicine & urology",
  ],
  reproductive: [
    "reproductive",
    "reproductive_medicine",
    "reproductive medicine",
  ],
  respiratory: [
    "respiratory",
    "respiratory_medicine",
    "respiratory medicine",
  ],
  musculoskeletal: [
    "musculoskeletal",
    "rheumatology",
    "rheumatology_musculoskeletal_medicine",
    "rheumatology & musculoskeletal medicine",
  ],
  surgery: [
    "surgery",
    "surgery_orthopaedics",
    "surgery_and_orthopaedics",
    "surgery & orthopaedics",
  ],
};

export function getSpecialtyAliases(input: string): string[] {
  if (!input) return [];
  const clean = input.toLowerCase().replace(/[^a-z0-9]/g, "_").replace(/_+/g, "_").replace(/^_|_$/g, "");
  const aliases = new Set<string>([clean]);
  const cleanParts = clean.split("_");

  for (const [key, list] of Object.entries(SPECIALTY_ALIAS_MAP)) {
    const matches =
      clean === key ||
      cleanParts.includes(key) ||
      list.some((a) => {
        const aClean = a.toLowerCase().replace(/[^a-z0-9]/g, "_").replace(/_+/g, "_").replace(/^_|_$/g, "");
        return aClean === clean || cleanParts.includes(aClean) || aClean.split("_").includes(clean);
      });

    if (matches) {
      aliases.add(key);
      for (const a of list) {
        const aClean = a.toLowerCase().replace(/[^a-z0-9]/g, "_").replace(/_+/g, "_").replace(/^_|_$/g, "");
        aliases.add(aClean);
      }
    }
  }

  return Array.from(aliases);
}

export function getCPSSessionKey(specialtySlugOrName: string): string {
  const clean = specialtySlugOrName.toLowerCase().replace(/[^a-z0-9]/g, "_").replace(/_+/g, "_").replace(/^_|_$/g, "");
  return `cps_session_${clean}`;
}

export function getCPSStatsKey(specialtySlugOrName: string): string {
  const clean = specialtySlugOrName.toLowerCase().replace(/[^a-z0-9]/g, "_").replace(/_+/g, "_").replace(/^_|_$/g, "");
  return `cps_stats_${clean}`;
}

export function getSavedCPSSession(specialtySlugOrName: string): CPSSavedSession | null {
  if (typeof window === "undefined") return null;
  try {
    const aliases = getSpecialtyAliases(specialtySlugOrName);
    for (const alias of aliases) {
      const raw = localStorage.getItem(`cps_session_${alias}`);
      if (raw) {
        const parsed = JSON.parse(raw) as CPSSavedSession;
        if (parsed && typeof parsed === "object") {
          return parsed;
        }
      }
    }
  } catch (err) {
    console.error("Error reading saved CPS session:", err);
  }
  return null;
}

export function saveCPSSession(session: CPSSavedSession): void {
  if (typeof window === "undefined") return;
  try {
    const aliases = getSpecialtyAliases(session.speciality || session.specialitySlug);
    const sessionJson = JSON.stringify(session);

    for (const alias of aliases) {
      localStorage.setItem(`cps_session_${alias}`, sessionJson);
    }

    // Also update cumulative stats for this specialty across all aliases
    updateCumulativeStatsFromSession(session);

    // Also update global key for hero banner
    localStorage.setItem(
      "medicalexampro_practice_session",
      JSON.stringify({
        topic: session.speciality,
        currentIndex: session.currentIndex,
        totalQuestions: session.totalQuestions,
        progressPct: Math.round(
          ((session.currentIndex + 1) / Math.max(1, session.totalQuestions)) * 100
        ),
        isSaved: !session.isCompleted,
      })
    );
  } catch (err) {
    console.error("Error saving CPS session:", err);
  }
}

function updateCumulativeStatsFromSession(session: CPSSavedSession): void {
  if (typeof window === "undefined") return;
  try {
    const aliases = getSpecialtyAliases(session.speciality || session.specialitySlug);
    const cumulative = {
      attempted: 0,
      correct: 0,
      totalTimeSeconds: 0,
    };

    for (const alias of aliases) {
      const existingRaw = localStorage.getItem(`cps_stats_${alias}`);
      if (existingRaw) {
        try {
          const parsed = JSON.parse(existingRaw);
          if (parsed && typeof parsed.attempted === "number") {
            if (parsed.attempted > cumulative.attempted) {
              cumulative.attempted = parsed.attempted;
              cumulative.correct = parsed.correct || 0;
              cumulative.totalTimeSeconds = parsed.totalTimeSeconds || 0;
            }
          }
        } catch {
          // ignore
        }
      }
    }

    // Current session counts
    const currentAttempted =
      session.attemptedCount ??
      (Object.keys(session.userSbaAnswers || {}).length +
        Object.values(session.userEmqAnswers || {}).reduce(
          (acc: number, curr: any) => acc + Object.keys(curr || {}).length,
          0
        ));
    const currentCorrect = session.correctCount || 0;
    const currentTime = session.elapsedSeconds || 0;

    // Use higher of cumulative or current session if session in progress
    const effectiveAttempted = Math.max(cumulative.attempted, currentAttempted);
    const effectiveCorrect = Math.max(cumulative.correct, currentCorrect);
    const effectiveTime = Math.max(cumulative.totalTimeSeconds, currentTime);

    const statsPayload = JSON.stringify({
      attempted: effectiveAttempted,
      correct: effectiveCorrect,
      totalTimeSeconds: effectiveTime,
    });

    const progressPct =
      session.totalQuestions > 0
        ? Math.min(100, Math.round((effectiveAttempted / session.totalQuestions) * 100))
        : 0;
    const accuracyPct =
      effectiveAttempted > 0 ? Math.round((effectiveCorrect / effectiveAttempted) * 100) : 0;

    const topicAttemptPayload = JSON.stringify({
      correct: effectiveCorrect,
      wrong: Math.max(0, effectiveAttempted - effectiveCorrect),
      totalQ: session.totalQuestions,
      attemptsPct: progressPct,
      accuracyPct: accuracyPct,
      hasAttempted: true,
    });

    for (const alias of aliases) {
      localStorage.setItem(`cps_stats_${alias}`, statsPayload);
      localStorage.setItem(`topic_last_attempt_${alias}`, topicAttemptPayload);
    }
  } catch (err) {
    console.error("Error updating cumulative stats:", err);
  }
}

export function getSpecialtyStats(
  specialtySlugOrName: string,
  totalQuestions: number = 0
): CPSSpecialtyStats {
  if (typeof window === "undefined") {
    return {
      attempted: 0,
      correct: 0,
      accuracy: 0,
      totalTimeSeconds: 0,
      averageTime: "0s",
      progressPercent: 0,
    };
  }

  try {
    const aliases = getSpecialtyAliases(specialtySlugOrName);
    let attempted = 0;
    let correct = 0;
    let totalTime = 0;

    for (const alias of aliases) {
      // 1. Check cps_stats_*
      const rawStats = localStorage.getItem(`cps_stats_${alias}`);
      if (rawStats) {
        try {
          const parsed = JSON.parse(rawStats);
          if (parsed && typeof parsed.attempted === "number") {
            if (parsed.attempted > attempted) {
              attempted = parsed.attempted;
              correct = parsed.correct || 0;
              totalTime = parsed.totalTimeSeconds || 0;
            }
          }
        } catch {}
      }

      // 2. Check cps_session_*
      const rawSession = localStorage.getItem(`cps_session_${alias}`);
      if (rawSession) {
        try {
          const session = JSON.parse(rawSession);
          if (session) {
            const sAttempted =
              session.attemptedCount ??
              (Object.keys(session.userSbaAnswers || {}).length +
                Object.values(session.userEmqAnswers || {}).reduce(
                  (acc: number, curr: any) => acc + Object.keys(curr || {}).length,
                  0
                ));
            const sCorrect = session.correctCount || 0;
            const sTime = session.elapsedSeconds || 0;

            if (sAttempted > attempted) {
              attempted = sAttempted;
              correct = sCorrect;
              totalTime = sTime;
            }
          }
        } catch {}
      }

      // 3. Check topic_last_attempt_*
      const rawTopic = localStorage.getItem(`topic_last_attempt_${alias}`);
      if (rawTopic) {
        try {
          const t = JSON.parse(rawTopic);
          if (t && typeof t.correct === "number") {
            const tAttempted = (t.correct || 0) + (t.wrong || 0);
            if (tAttempted > attempted) {
              attempted = tAttempted;
              correct = t.correct || 0;
            }
          }
        } catch {}
      }
    }

    const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;
    const avgSec = attempted > 0 ? Math.round(totalTime / attempted) : 0;
    const progressPercent =
      totalQuestions > 0
        ? attempted > 0
          ? Math.max(1, Math.min(100, Math.round((attempted / totalQuestions) * 100)))
          : 0
        : 0;

    return {
      attempted,
      correct,
      accuracy,
      totalTimeSeconds: totalTime,
      averageTime: formatAverageTime(avgSec),
      progressPercent,
    };
  } catch (err) {
    console.error("Error calculating specialty stats:", err);
    return {
      attempted: 0,
      correct: 0,
      accuracy: 0,
      totalTimeSeconds: 0,
      averageTime: "0s",
      progressPercent: 0,
    };
  }
}

export function markCPSSessionCompleted(specialtySlugOrName: string): void {
  if (typeof window === "undefined") return;
  try {
    const aliases = getSpecialtyAliases(specialtySlugOrName);
    for (const alias of aliases) {
      const session = getSavedCPSSession(alias);
      if (session) {
        session.isCompleted = true;
        saveCPSSession(session);
      }
    }
  } catch (err) {
    console.error("Error marking CPS session completed:", err);
  }
}

export function clearCPSSession(specialtySlugOrName: string): void {
  if (typeof window === "undefined") return;
  try {
    const aliases = getSpecialtyAliases(specialtySlugOrName);
    for (const alias of aliases) {
      localStorage.removeItem(`cps_session_${alias}`);
    }
  } catch (err) {
    console.error("Error clearing CPS session:", err);
  }
}
