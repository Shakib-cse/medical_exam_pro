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

export function getCurrentUserId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const userRaw = localStorage.getItem("auth_user");
    if (userRaw) {
      const u = JSON.parse(userRaw);
      if (u && (u.id || u.userId)) return String(u.id || u.userId);
    }
    const token = localStorage.getItem("auth_token");
    if (token) {
      const parts = token.split(".");
      if (parts.length === 3) {
        const payload = JSON.parse(atob(parts[1]));
        if (payload && (payload.userId || payload.id)) {
          return String(payload.userId || payload.id);
        }
      }
    }
  } catch {}
  return null;
}

export function getUserPrefix(userId?: string | null): string {
  const u = userId !== undefined ? userId : getCurrentUserId();
  return u ? `user_${u}_` : "";
}

export function migrateLegacyDataIfNeeded(): void {
  if (typeof window === "undefined") return;
  try {
    // The previous account which created the legacy un-prefixed data (User M)
    const legacyOwnerId = "2e0dc655-736a-4965-912c-df96772cf016";
    const prefix = `user_${legacyOwnerId}_`;

    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (!key) continue;
      if (key.startsWith("user_")) continue;

      if (
        key.startsWith("cps_session_") ||
        key.startsWith("cps_stats_") ||
        key.startsWith("topic_last_attempt_") ||
        key === "medicalexampro_flagged_questions" ||
        key === "medicalexampro_practice_session" ||
        key === "medicalexampro_user_stats"
      ) {
        const value = localStorage.getItem(key);
        if (value) {
          const newKey = `${prefix}${key}`;
          if (!localStorage.getItem(newKey)) {
            localStorage.setItem(newKey, value);
          }
          localStorage.removeItem(key);
        }
      }
    }
  } catch (e) {
    console.warn("Legacy data migration error:", e);
  }
}

export function getCPSSessionKey(specialtySlugOrName: string, userId?: string | null): string {
  const clean = specialtySlugOrName.toLowerCase().replace(/[^a-z0-9]/g, "_").replace(/_+/g, "_").replace(/^_|_$/g, "");
  return `${getUserPrefix(userId)}cps_session_${clean}`;
}

export function getCPSStatsKey(specialtySlugOrName: string, userId?: string | null): string {
  const clean = specialtySlugOrName.toLowerCase().replace(/[^a-z0-9]/g, "_").replace(/_+/g, "_").replace(/^_|_$/g, "");
  return `${getUserPrefix(userId)}cps_stats_${clean}`;
}

export function getSavedCPSSession(specialtySlugOrName: string, userId?: string | null): CPSSavedSession | null {
  if (typeof window === "undefined") return null;
  migrateLegacyDataIfNeeded();
  try {
    const userPrefix = getUserPrefix(userId);
    const aliases = getSpecialtyAliases(specialtySlugOrName);
    for (const alias of aliases) {
      const raw = localStorage.getItem(`${userPrefix}cps_session_${alias}`);
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

export function saveCPSSession(session: CPSSavedSession, userId?: string | null): void {
  if (typeof window === "undefined") return;
  try {
    const userPrefix = getUserPrefix(userId);
    const aliases = getSpecialtyAliases(session.speciality || session.specialitySlug);
    const sessionJson = JSON.stringify(session);

    for (const alias of aliases) {
      localStorage.setItem(`${userPrefix}cps_session_${alias}`, sessionJson);
    }

    // Also update cumulative stats for this specialty across all aliases
    updateCumulativeStatsFromSession(session, userId);

    // Also update global key for hero banner
    localStorage.setItem(
      `${userPrefix}medicalexampro_practice_session`,
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

function updateCumulativeStatsFromSession(session: CPSSavedSession, userId?: string | null): void {
  if (typeof window === "undefined") return;
  try {
    const userPrefix = getUserPrefix(userId);
    const aliases = getSpecialtyAliases(session.speciality || session.specialitySlug);
    const cumulative = {
      attempted: 0,
      correct: 0,
      totalTimeSeconds: 0,
    };

    for (const alias of aliases) {
      const existingRaw = localStorage.getItem(`${userPrefix}cps_stats_${alias}`);
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
      localStorage.setItem(`${userPrefix}cps_stats_${alias}`, statsPayload);
      localStorage.setItem(`${userPrefix}topic_last_attempt_${alias}`, topicAttemptPayload);
    }
  } catch (err) {
    console.error("Error updating cumulative stats:", err);
  }
}

export function getSpecialtyStats(
  specialtySlugOrName: string,
  totalQuestions: number = 0,
  userId?: string | null
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

  migrateLegacyDataIfNeeded();

  try {
    const userPrefix = getUserPrefix(userId);
    const aliases = getSpecialtyAliases(specialtySlugOrName);
    let attempted = 0;
    let correct = 0;
    let totalTime = 0;

    for (const alias of aliases) {
      // 1. Check user-scoped cps_stats_*
      const rawStats = localStorage.getItem(`${userPrefix}cps_stats_${alias}`);
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

      // 2. Check user-scoped cps_session_*
      const rawSession = localStorage.getItem(`${userPrefix}cps_session_${alias}`);
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

      // 3. Check user-scoped topic_last_attempt_*
      const rawTopic = localStorage.getItem(`${userPrefix}topic_last_attempt_${alias}`);
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

export function markCPSSessionCompleted(specialtySlugOrName: string, userId?: string | null): void {
  if (typeof window === "undefined") return;
  try {
    const aliases = getSpecialtyAliases(specialtySlugOrName);
    for (const alias of aliases) {
      const session = getSavedCPSSession(alias, userId);
      if (session) {
        session.isCompleted = true;
        saveCPSSession(session, userId);
      }
    }
  } catch (err) {
    console.error("Error marking CPS session completed:", err);
  }
}

export function clearCPSSession(specialtySlugOrName: string, userId?: string | null): void {
  if (typeof window === "undefined") return;
  try {
    const userPrefix = getUserPrefix(userId);
    const aliases = getSpecialtyAliases(specialtySlugOrName);
    for (const alias of aliases) {
      localStorage.removeItem(`${userPrefix}cps_session_${alias}`);
    }
  } catch (err) {
    console.error("Error clearing CPS session:", err);
  }
}

export const CPS_SPECIALTIES_CONFIG: Array<{
  id: string;
  title: string;
  totalQ: number;
  sbaCount: number;
  emqCount: number;
}> = [
  { id: "cardiovascular", title: "Cardiovascular Medicine", totalQ: 495, sbaCount: 248, emqCount: 247 },
  { id: "dermatology", title: "Dermatology", totalQ: 402, sbaCount: 201, emqCount: 201 },
  { id: "endocrinology", title: "Endocrinology & Diabetes", totalQ: 469, sbaCount: 256, emqCount: 213 },
  { id: "ent", title: "ENT", totalQ: 313, sbaCount: 156, emqCount: 157 },
  { id: "gastroenterology", title: "Gastroenterology & Hepatology", totalQ: 595, sbaCount: 301, emqCount: 294 },
  { id: "immunology", title: "Genetics & Immunology", totalQ: 204, sbaCount: 100, emqCount: 104 },
  { id: "haematology", title: "Haematology & Oncology", totalQ: 468, sbaCount: 234, emqCount: 234 },
  { id: "infectious", title: "Infectious Diseases", totalQ: 241, sbaCount: 116, emqCount: 125 },
  { id: "neurology", title: "Neurology", totalQ: 462, sbaCount: 230, emqCount: 232 },
  { id: "ophthalmology", title: "Ophthalmology", totalQ: 275, sbaCount: 137, emqCount: 138 },
  { id: "paediatrics", title: "Paediatrics", totalQ: 605, sbaCount: 305, emqCount: 300 },
  { id: "pharmacology", title: "Pharmacology", totalQ: 758, sbaCount: 338, emqCount: 420 },
  { id: "psychiatry", title: "Psychiatry", totalQ: 365, sbaCount: 173, emqCount: 192 },
  { id: "renal", title: "Renal Medicine & Urology", totalQ: 588, sbaCount: 256, emqCount: 332 },
  { id: "reproductive", title: "Reproductive Medicine", totalQ: 788, sbaCount: 394, emqCount: 394 },
  { id: "respiratory", title: "Respiratory Medicine", totalQ: 754, sbaCount: 346, emqCount: 408 },
  { id: "musculoskeletal", title: "Rheumatology & Musculoskeletal Medicine", totalQ: 597, sbaCount: 297, emqCount: 300 },
  { id: "surgery", title: "Surgery & Orthopaedics", totalQ: 123, sbaCount: 63, emqCount: 60 },
];

export const TOTAL_CPS_QUESTIONS = 8502;
export const TOTAL_PD_QUESTIONS = 2505;
export const TOTAL_OVERALL_QUESTIONS = TOTAL_CPS_QUESTIONS + TOTAL_PD_QUESTIONS; // 11,007

export interface PDDomainConfig {
  id: string;
  title: string;
  subtitle: string;
  totalQ: number;
  rankingCount: number;
  select3Count: number;
  topics: string[];
}

export const PD_DOMAINS_CONFIG: PDDomainConfig[] = [
  {
    id: "coping-with-pressure",
    title: "Coping with Pressure",
    subtitle: "Practice prioritisation under stress, fatigue, handover, escalation, and safety under acute pressure.",
    totalQ: 399,
    rankingCount: 195,
    select3Count: 204,
    topics: [
      "Delegation, Competence & Escalation",
      "Fatigue, Wellbeing & Fitness to Work",
      "Handover & Continuity of Care",
      "Prioritisation & Workload Management",
      "Resource Constraints & Service Pressure",
      "Safety & Accuracy Under Pressure",
    ],
  },
  {
    id: "empathy-and-sensitivity",
    title: "Empathy & Sensitivity",
    subtitle: "Practice patient-centred judgement, communication, autonomy, consent, and vulnerability.",
    totalQ: 1072,
    rankingCount: 537,
    select3Count: 535,
    topics: [
      "Autonomy, Consent & Family Involvement",
      "Communication & Accessibility",
      "Cultural, Religious & Individual Needs",
      "Dignity, Respect & Non-Discrimination",
      "Emotional Support & Difficult Conversations",
      "Safeguarding & Vulnerability",
    ],
  },
  {
    id: "professional-integrity",
    title: "Professionalism & Integrity",
    subtitle: "Practice probity, GMC standards, confidentiality, speaking up, and record keeping.",
    totalQ: 1034,
    rankingCount: 521,
    select3Count: 513,
    topics: [
      "Colleague Conduct & Speaking Up",
      "Confidentiality & Information Governance",
      "Honesty, Candour & Record Keeping",
      "Professional Boundaries & Conflicts of Interest",
      "Professional Duties & Safe Practice",
      "Research, Audit & Academic Integrity",
    ],
  },
];

export const PD_DOMAIN_ALIAS_MAP: Record<string, string[]> = {
  "coping-with-pressure": [
    "coping-with-pressure",
    "coping_with_pressure",
    "coping with pressure",
  ],
  "empathy-and-sensitivity": [
    "empathy-and-sensitivity",
    "empathy-sensitivity",
    "empathy_and_sensitivity",
    "empathy & sensitivity",
    "empathy and sensitivity",
  ],
  "professional-integrity": [
    "professional-integrity",
    "professionalism-and-integrity",
    "professionalism-integrity",
    "professionalism_and_integrity",
    "professionalism & integrity",
    "professionalism and integrity",
  ],
};

export interface FlaggedQuestionOption {
  id: string;
  label: string; // "A", "B", "C", "D"
  text: string;
  isCorrect?: boolean;
  isUserSelected?: boolean;
}

export interface FlaggedQuestionItem {
  id: string;
  prompt: string;
  questionNumber?: string;
  category: string;
  speciality: string;
  flaggedDate: string;
  vignette?: string;
  question?: string;
  options?: FlaggedQuestionOption[];
  userAnswer?: string;
  correctAnswer?: string;
  explanation?: string;
  notes?: string;
}

export const SAMPLE_FLAGGED_QUESTIONS: FlaggedQuestionItem[] = [
  {
    id: "fq-24",
    questionNumber: "Q24",
    prompt: "A 45-year-old male presents with acute chest pain and shortness of breath. ECGshows ST elevation in leads V1-V4...",
    category: "Cardiovascular",
    speciality: "Cardiology",
    flaggedDate: "2 days ago",
    vignette: "A 45-year-old male presents with acute chest pain and shortness of breath. ECG shows ST elevation in leads V1-V4. Blood pressure is 135/85 mmHg, pulse is 88 bpm. Troponin T is markedly elevated.",
    question: "What is the most appropriate immediate reperfusion strategy for this patient?",
    options: [
      { id: "opt-a", label: "A", text: "Medical therapy with dual antiplatelet and enoxaparin" },
      { id: "opt-b", label: "B", text: "Primary Percutaneous Coronary Intervention (PCI) within 120 minutes", isCorrect: true },
      { id: "opt-c", label: "C", text: "Intravenous thrombolysis with Alteplase", isUserSelected: true, isCorrect: false },
      { id: "opt-d", label: "D", text: "Urgent coronary artery bypass grafting (CABG)" },
    ],
    explanation: "Primary PCI is the preferred reperfusion strategy for patients with acute STEMI presenting within 12 hours of symptom onset.",
  },
  {
    id: "fq-16",
    questionNumber: "Q16",
    prompt: "Which of the following is the most appropriate initial diagnostic test for a suspected pulmonary embolism in a pregnant patient?",
    category: "Pulmonology",
    speciality: "Respiratory",
    flaggedDate: "3 days ago",
    vignette: "A 28-year-old pregnant woman at 26 weeks gestation presents with sudden onset dyspnoea and pleuritic chest pain. Vital signs show HR 112 bpm, BP 118/74 mmHg, SpO2 94% on room air.",
    question: "Which of the following is the most appropriate initial diagnostic test for a suspected pulmonary embolism in a pregnant patient?",
    options: [
      { id: "opt-a", label: "A", text: "Chest radiography (CXR)", isCorrect: true },
      { id: "opt-b", label: "B", text: "D-dimer assay", isUserSelected: true, isCorrect: false },
      { id: "opt-c", label: "C", text: "CT pulmonary angiogram (CTPA)" },
      { id: "opt-d", label: "D", text: "Ventilation-perfusion (V/Q) scan" },
    ],
    explanation: "In pregnant patients with suspected pulmonary embolism, a normal chest X-ray guides the choice of subsequent imaging (V/Q scan if CXR is normal, CTPA if abnormal).",
  },
  {
    id: "fq-56",
    questionNumber: "Q56",
    prompt: "Which imaging modality is preferred for diagnosing gallstones in symptomatic patients?",
    category: "Gastroenterology",
    speciality: "Gastroenterology / Nutrition",
    flaggedDate: "4 days ago",
    vignette: "A 42-year-old female presents with recurrent right upper quadrant colicky pain after fatty meals. Physical examination is unremarkable with no jaundice.",
    question: "Which imaging modality is preferred for diagnosing gallstones in symptomatic patients?",
    options: [
      { id: "opt-a", label: "A", text: "Transabdominal Ultrasound (US)", isCorrect: true },
      { id: "opt-b", label: "B", text: "Abdominal CT scan with IV contrast", isUserSelected: true, isCorrect: false },
      { id: "opt-c", label: "C", text: "Magnetic resonance cholangiopancreatography (MRCP)" },
      { id: "opt-d", label: "D", text: "Plain abdominal radiography" },
    ],
    explanation: "Transabdominal ultrasound has high sensitivity (>95%) and specificity for gallstones, without exposing the patient to ionizing radiation.",
  },
  {
    id: "fq-48",
    questionNumber: "Q48",
    prompt: "What is the first-line treatment for anaphylaxis in an adult patient?",
    category: "Psychiatry",
    speciality: "Emergency Medicine",
    flaggedDate: "5 days ago",
    vignette: "A 34-year-old patient develops sudden stridor, diffuse urticaria, facial angioedema, and hypotension (BP 80/50 mmHg) shortly after administration of IV antibiotics.",
    question: "What is the first-line treatment for anaphylaxis in an adult patient?",
    options: [
      { id: "opt-a", label: "A", text: "Intramuscular adrenaline (epinephrine) 1:1000", isCorrect: true },
      { id: "opt-b", label: "B", text: "Intravenous hydrocortisone 200mg", isUserSelected: true, isCorrect: false },
      { id: "opt-c", label: "C", text: "Oral cetirizine 10mg" },
      { id: "opt-d", label: "D", text: "Nebulised salbutamol 5mg" },
    ],
    explanation: "Intramuscular adrenaline (epinephrine) 0.5 mg (0.5 mL of 1:1000) into the anterolateral thigh is the first-line emergency management for anaphylaxis.",
  },
  {
    id: "fq-86",
    questionNumber: "Q86",
    prompt: "What is the recommended initial intervention for treating anaphylaxis in an adult?",
    category: "Immunology",
    speciality: "Immunology / Allergies",
    flaggedDate: "6 days ago",
    vignette: "A 22-year-old male is brought to the emergency department after suffering multiple wasp stings. He is wheezing with widespread erythema and tachycardia.",
    question: "What is the recommended initial intervention for treating anaphylaxis in an adult?",
    options: [
      { id: "opt-a", label: "A", text: "Intramuscular epinephrine (0.5 mg, 1:1000)", isCorrect: true },
      { id: "opt-b", label: "B", text: "High-dose intravenous diphenhydramine" },
      { id: "opt-c", label: "C", text: "Subcutaneous terbutaline", isUserSelected: true, isCorrect: false },
      { id: "opt-d", label: "D", text: "Inhaled ipratropium bromide" },
    ],
    explanation: "Immediate intramuscular administration of epinephrine in the anterolateral aspect of the middle third of the thigh is life-saving in severe systemic allergic reactions.",
  },
  {
    id: "fq-25",
    questionNumber: "Q25",
    prompt: "A 65-year-old woman with type-2 diabetes was seen in the clinic for management of her cardiovascular risk...",
    category: "Pulmonology",
    speciality: "Cardiovascular & Pulmonology",
    flaggedDate: "1 day ago",
    vignette: "A 65-year-old woman with type-2 diabetes was seen in the clinic for management of her cardiovascular risk. She had no history of cardiovascular disease and did not smoke. Her BMI was 25 kg/m² and her blood pressure was 125/80 mmHg. She had normal renal function and had no proteinuria. Her haemoglobin A1c was 6.5% (48 mmol/mol) and serum LDL cholesterol was 2.1 mmol/L (81 mg/dL). She was taking enalapril 10 mg daily, amlodipine 5 mg daily, gliclazide 80 mg twice daily and metformin 500 mg three times daily.",
    question: "What is the most appropriate change to her treatment to reduce her cardiovascular risk?",
    options: [
      { id: "opt-a", label: "A", text: "Immediate thrombolysis with Tenecteplase" },
      { id: "opt-b", label: "B", text: "Primary Percutaneous Coronary Intervention (PCI) within 90 minutes", isUserSelected: true, isCorrect: false },
      { id: "opt-c", label: "C", text: "Dual antiplatelet therapy and risk assessment using the GRACE score", isCorrect: true },
      { id: "opt-d", label: "D", text: "Aspirin 300mg and discharge with urgent outpatient follow-up" },
    ],
    explanation: "Dual antiplatelet therapy and risk assessment using the GRACE score is recommended for targeted risk reduction in high-risk diabetic cardiovascular patients.",
  },
];

export const FLAGGED_STORAGE_KEY = "medicalexampro_flagged_questions";

export function getFlaggedQuestions(userId?: string | null): FlaggedQuestionItem[] {
  if (typeof window === "undefined") return [];
  migrateLegacyDataIfNeeded();
  try {
    const userPrefix = getUserPrefix(userId);
    const key = `${userPrefix}${FLAGGED_STORAGE_KEY}`;
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Enrich any older items that might lack options or questionNumber
        return parsed.map((item, idx) => {
          const sample = SAMPLE_FLAGGED_QUESTIONS.find(
            (s) => s.id === item.id || (s.prompt && item.prompt && s.prompt.slice(0, 30) === item.prompt.slice(0, 30))
          );
          return {
            ...item,
            questionNumber: item.questionNumber || sample?.questionNumber || `Q${idx + 1}`,
            vignette: item.vignette || sample?.vignette || item.prompt,
            question: item.question || sample?.question || item.prompt,
            options: item.options && item.options.length > 0 ? item.options : sample?.options || [
              { id: "a", label: "A", text: "Option A" },
              { id: "b", label: "B", text: "Option B", isUserSelected: true, isCorrect: false },
              { id: "c", label: "C", text: "Option C", isCorrect: true },
              { id: "d", label: "D", text: "Option D" },
            ],
            notes: item.notes || "",
          };
        });
      }
    }
    // For legacy user M who had sample flagged questions, initialize them
    const legacyOwnerId = "2e0dc655-736a-4965-912c-df96772cf016";
    const currentId = userId !== undefined ? userId : getCurrentUserId();
    if (currentId === legacyOwnerId) {
      localStorage.setItem(key, JSON.stringify(SAMPLE_FLAGGED_QUESTIONS));
      return SAMPLE_FLAGGED_QUESTIONS;
    }
    return [];
  } catch (e) {
    console.error("Error reading flagged questions:", e);
    return [];
  }
}

export function saveFlaggedQuestions(questions: FlaggedQuestionItem[], userId?: string | null): void {
  if (typeof window === "undefined") return;
  try {
    const userPrefix = getUserPrefix(userId);
    const key = `${userPrefix}${FLAGGED_STORAGE_KEY}`;
    localStorage.setItem(key, JSON.stringify(questions));
    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new CustomEvent("flagged_questions_update"));

    // Sync to backend so admin-dashboard immediately accesses flagged questions across ports
    fetch("http://localhost:3030/api/v1/overview/content/flagged_questions", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "Flagged Questions",
        content: questions,
      }),
    }).catch(() => {});
  } catch (e) {
    console.error("Error saving flagged questions:", e);
  }
}

export function toggleFlaggedQuestion(
  item: Omit<FlaggedQuestionItem, "flaggedDate"> & { flaggedDate?: string },
  isFlagged: boolean,
  userId?: string | null
): void {
  if (typeof window === "undefined") return;
  try {
    const current = getFlaggedQuestions(userId);
    let updated: FlaggedQuestionItem[];
    if (isFlagged) {
      const flaggedItem = {
        id: item.id,
        questionNumber: item.questionNumber || `Q${current.length + 1}`,
        prompt: item.prompt,
        category: item.category || "General",
        speciality: item.speciality || "General Medicine",
        flaggedDate: item.flaggedDate || "Just now",
        vignette: item.vignette || item.prompt,
        question: item.question || item.prompt,
        options: item.options,
        userAnswer: item.userAnswer,
        correctAnswer: item.correctAnswer,
        explanation: item.explanation,
        notes: item.notes || "",
      };
      const exists = current.some((q) => q.id === item.id || (q.prompt && item.prompt && q.prompt === item.prompt));
      if (!exists) {
        updated = [flaggedItem, ...current];
      } else {
        updated = current;
      }
      fetch("http://localhost:3030/api/v1/overview/flags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(flaggedItem),
      }).catch(() => {});
    } else {
      updated = current.filter((q) => q.id !== item.id && q.prompt !== item.prompt);
      fetch(`http://localhost:3030/api/v1/overview/flags/${item.id}`, {
        method: "DELETE",
      }).catch(() => {});
    }
    saveFlaggedQuestions(updated, userId);
  } catch (e) {
    console.error("Error toggling flagged question:", e);
  }
}

export interface AggregatePracticeStats {
  totalQuestions: number;
  attempted: number;
  correct: number;
  incorrect: number;
  unattempted: number;
  flagged: number;
  cps?: {
    totalQuestions: number;
    attempted: number;
    correct: number;
    incorrect: number;
    unattempted: number;
  };
  pd?: {
    totalQuestions: number;
    attempted: number;
    correct: number;
    incorrect: number;
    unattempted: number;
  };
}

export function getAggregatePracticeStats(userId?: string | null): AggregatePracticeStats {
  if (typeof window === "undefined") {
    return {
      totalQuestions: TOTAL_OVERALL_QUESTIONS,
      attempted: 0,
      correct: 0,
      incorrect: 0,
      unattempted: TOTAL_OVERALL_QUESTIONS,
      flagged: 0,
    };
  }

  migrateLegacyDataIfNeeded();

  const userPrefix = getUserPrefix(userId);
  let cpsAttempted = 0;
  let cpsCorrect = 0;

  // 1. Accumulate CPS Specialty Stats (User-scoped)
  for (const spec of CPS_SPECIALTIES_CONFIG) {
    const byId = getSpecialtyStats(spec.id, spec.totalQ, userId);
    const byTitle = getSpecialtyStats(spec.title, spec.totalQ, userId);
    const st = byTitle.attempted >= byId.attempted ? byTitle : byId;
    cpsAttempted += st.attempted;
    cpsCorrect += st.correct;
  }

  let pdAttempted = 0;
  let pdCorrect = 0;

  // 2. Accumulate Professional Dilemmas (PD) Stats (User-scoped)
  for (const domain of PD_DOMAINS_CONFIG) {
    const byId = getPDStats(domain.id, domain.totalQ, userId);
    const byTitle = getPDStats(domain.title, domain.totalQ, userId);
    const st = byTitle.attempted >= byId.attempted ? byTitle : byId;
    pdAttempted += st.attempted;
    pdCorrect += st.correct;
  }

  const attempted = cpsAttempted + pdAttempted;
  const correct = cpsCorrect + pdCorrect;
  const incorrect = Math.max(0, attempted - correct);
  const totalQuestions = TOTAL_OVERALL_QUESTIONS;
  const unattempted = Math.max(0, totalQuestions - attempted);

  // 3. Read user-scoped flagged questions count (CPS + PD + Mock)
  const flaggedItems = getFlaggedQuestions(userId);
  let flagged = flaggedItems.length;

  // Also verify against active session flagged counts for this user only (CPS, PD, and Mock sessions)
  try {
    const cpsPrefix = `${userPrefix}cps_session_`;
    const pdPrefix = `${userPrefix}pd_session_`;
    const mockPrefix = `${userPrefix}mock_session_`;
    const seenSpecialties = new Set<string>();
    let sessionFlaggedCount = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith(cpsPrefix) || key.startsWith(pdPrefix) || key.startsWith(mockPrefix))) {
        const raw = localStorage.getItem(key);
        if (raw) {
          const parsed = JSON.parse(raw);
          const specId = parsed.speciality || parsed.specialitySlug || parsed.domain || parsed.domainSlug || parsed.mockId || key;
          if (!seenSpecialties.has(specId)) {
            seenSpecialties.add(specId);
            if (parsed.flagged && typeof parsed.flagged === "object") {
              sessionFlaggedCount += Object.values(parsed.flagged).filter(Boolean).length;
            }
          }
        }
      }
    }
    if (sessionFlaggedCount > flagged) {
      flagged = sessionFlaggedCount;
    }
  } catch {}

  // Check user-scoped saved user stats fallback ONLY if matching this user and local attempts are 0
  if (attempted === 0) {
    try {
      const savedUserStats = localStorage.getItem(`${userPrefix}medicalexampro_user_stats`);
      if (savedUserStats) {
        const parsed = JSON.parse(savedUserStats);
        if (typeof parsed.attempted === "number" && parsed.attempted > 0) {
          const uAttempted = parsed.attempted;
          const uIncorrect =
            typeof parsed.incorrectCount === "number"
              ? parsed.incorrectCount
              : Math.round(uAttempted * (1 - (parsed.overallAccuracy || 0) / 100));
          const uUnattempted =
            typeof parsed.unattemptedCount === "number"
              ? parsed.unattemptedCount
              : Math.max(0, TOTAL_OVERALL_QUESTIONS - uAttempted);
          const uFlagged = typeof parsed.flaggedCount === "number" ? parsed.flaggedCount : flagged;
          return {
            totalQuestions: TOTAL_OVERALL_QUESTIONS,
            attempted: uAttempted,
            correct: Math.max(0, uAttempted - uIncorrect),
            incorrect: uIncorrect,
            unattempted: uUnattempted,
            flagged: uFlagged,
            cps: {
              totalQuestions: TOTAL_CPS_QUESTIONS,
              attempted: cpsAttempted,
              correct: cpsCorrect,
              incorrect: Math.max(0, cpsAttempted - cpsCorrect),
              unattempted: Math.max(0, TOTAL_CPS_QUESTIONS - cpsAttempted),
            },
            pd: {
              totalQuestions: TOTAL_PD_QUESTIONS,
              attempted: pdAttempted,
              correct: pdCorrect,
              incorrect: Math.max(0, pdAttempted - pdCorrect),
              unattempted: Math.max(0, TOTAL_PD_QUESTIONS - pdAttempted),
            },
          };
        }
      }
    } catch {}
  }

  return {
    totalQuestions,
    attempted,
    correct,
    incorrect,
    unattempted,
    flagged,
    cps: {
      totalQuestions: TOTAL_CPS_QUESTIONS,
      attempted: cpsAttempted,
      correct: cpsCorrect,
      incorrect: Math.max(0, cpsAttempted - cpsCorrect),
      unattempted: Math.max(0, TOTAL_CPS_QUESTIONS - cpsAttempted),
    },
    pd: {
      totalQuestions: TOTAL_PD_QUESTIONS,
      attempted: pdAttempted,
      correct: pdCorrect,
      incorrect: Math.max(0, pdAttempted - pdCorrect),
      unattempted: Math.max(0, TOTAL_PD_QUESTIONS - pdAttempted),
    },
  };
}

// ==========================================
// ADMIN QUESTION REPORTS & FLAGGED OVERVIEW
// ==========================================

export interface QuestionReport {
  id: string;
  questionId: string;
  questionNumber?: string;
  prompt: string;
  category: string;
  speciality: string;
  userId: string;
  userEmail: string;
  userName: string;
  notes: string; // The user's feedback/explanation of what is incorrect or what should be improved
  reportedAt: string;
  status: "pending" | "reviewed" | "resolved";
}

export const ADMIN_REPORTS_STORAGE_KEY = "medicalexampro_admin_reports";

export function getAdminQuestionReports(): QuestionReport[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(ADMIN_REPORTS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
    // Seed initial reports if empty for demonstration
    const initialReports: QuestionReport[] = [
      {
        id: "rep-1",
        questionId: "fq-25",
        questionNumber: "Q25",
        prompt: "A 65-year-old woman with type-2 diabetes was seen in the clinic for management of her cardiovascular risk...",
        category: "Pulmonology",
        speciality: "Cardiovascular & Pulmonology",
        userId: "2e0dc655-736a-4965-912c-df96772cf016",
        userEmail: "shakibwork333@gmail.com",
        userName: "Dr. Shakib",
        notes: "Option B mentions PCI within 90 minutes, but guideline NICE CG95 recommends GRACE risk stratification first for non-STEMI/high-risk NSTE-ACS.",
        reportedAt: "Today at 08:30",
        status: "pending",
      },
      {
        id: "rep-2",
        questionId: "fq-16",
        questionNumber: "Q16",
        prompt: "Which of the following is the most appropriate initial diagnostic test for a suspected pulmonary embolism in a pregnant patient?",
        category: "Pulmonology",
        speciality: "Respiratory",
        userId: "15584bfb-fc07-4c83-9699-213cf6b76c24",
        userEmail: "candidate@example.com",
        userName: "Alex Morgan",
        notes: "Please clarify in explanation that CXR is initial to exclude pneumothorax before choosing V/Q or CTPA.",
        reportedAt: "Yesterday at 14:15",
        status: "reviewed",
      },
    ];
    localStorage.setItem(ADMIN_REPORTS_STORAGE_KEY, JSON.stringify(initialReports));
    return initialReports;
  } catch (e) {
    console.error("Error reading admin reports:", e);
    return [];
  }
}

export function saveQuestionReport(
  report: Omit<QuestionReport, "id" | "reportedAt" | "status"> & {
    id?: string;
    reportedAt?: string;
    status?: "pending" | "reviewed" | "resolved";
  }
): void {
  if (typeof window === "undefined") return;
  try {
    const existing = getAdminQuestionReports();
    const repId = report.id || `rep-${Date.now()}`;
    const reportItem: QuestionReport = {
      id: repId,
      questionId: report.questionId,
      questionNumber: report.questionNumber || "Q",
      prompt: report.prompt,
      category: report.category || "General",
      speciality: report.speciality || "Clinical",
      userId: report.userId || "anonymous",
      userEmail: report.userEmail || "user@example.com",
      userName: report.userName || "User",
      notes: report.notes,
      reportedAt: report.reportedAt || new Date().toLocaleString(),
      status: report.status || "pending",
    };

    const idx = existing.findIndex(
      (r) => r.id === repId || (r.questionId === report.questionId && r.userId === report.userId)
    );
    let updated: QuestionReport[];
    if (idx >= 0) {
      updated = [...existing];
      updated[idx] = { ...updated[idx], notes: report.notes, reportedAt: new Date().toLocaleString() };
    } else {
      updated = [reportItem, ...existing];
    }

    localStorage.setItem(ADMIN_REPORTS_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new CustomEvent("admin_reports_update"));

    // Sync to backend so admin-dashboard immediately accesses candidate reports
    fetch("http://localhost:3030/api/v1/overview/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reportItem),
    }).catch(() => {});
  } catch (e) {
    console.error("Error saving question report:", e);
  }
}

export function updateReportStatus(reportId: string, status: "pending" | "reviewed" | "resolved"): void {
  if (typeof window === "undefined") return;
  try {
    const existing = getAdminQuestionReports();
    const updated = existing.map((r) => (r.id === reportId ? { ...r, status } : r));
    localStorage.setItem(ADMIN_REPORTS_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new CustomEvent("admin_reports_update"));

    fetch(`http://localhost:3030/api/v1/overview/reports/${reportId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    }).catch(() => {});
  } catch (e) {
    console.error("Error updating report status:", e);
  }
}

export function deleteReport(reportId: string): void {
  if (typeof window === "undefined") return;
  try {
    const existing = getAdminQuestionReports();
    const updated = existing.filter((r) => r.id !== reportId);
    localStorage.setItem(ADMIN_REPORTS_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new CustomEvent("admin_reports_update"));

    fetch(`http://localhost:3030/api/v1/overview/reports/${reportId}`, {
      method: "DELETE",
    }).catch(() => {});
  } catch (e) {
    console.error("Error deleting report:", e);
  }
}

export interface AdminFlaggedOverviewItem extends FlaggedQuestionItem {
  userId?: string;
}

export function getAllUsersFlaggedQuestions(): AdminFlaggedOverviewItem[] {
  if (typeof window === "undefined") return [];
  const results: AdminFlaggedOverviewItem[] = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.includes(FLAGGED_STORAGE_KEY)) {
        let uId = "legacy";
        const match = key.match(/^user_([^_]+)_/);
        if (match) uId = match[1];
        const raw = localStorage.getItem(key);
        if (raw) {
          try {
            const list = JSON.parse(raw);
            if (Array.isArray(list)) {
              for (const item of list) {
                results.push({ ...item, userId: uId });
              }
            }
          } catch {}
        }
      }
    }
  } catch (e) {
    console.error("Error scanning all users flagged questions:", e);
  }
  return results;
}

// ==========================================
// PROFESSIONAL DILEMMAS (SJT) SESSION & STATS
// ==========================================

export interface PDSavedSession {
  domain: string;
  domainSlug: string;
  questionType: "Ranking" | "Select - 3" | "Both" | string;
  timer: "on" | "off";
  topics: string;
  selectedTopicNames?: string[];
  currentIndex: number;
  totalQuestions: number;
  attemptedCount?: number;
  correctCount?: number;
  userRankings: Record<number, string[]>;
  userSelections: Record<number, string[]>;
  questionScores: Record<number, number>;
  submittedAnswers: Record<number, boolean>;
  flagged: Record<number, boolean>;
  elapsedSeconds: number;
  isCompleted: boolean;
  lastUpdated: number;
}



export function getPDAliases(input: string): string[] {
  if (!input) return [];
  const clean = input.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");
  for (const [key, aliases] of Object.entries(PD_DOMAIN_ALIAS_MAP)) {
    if (key === clean || aliases.some((a) => a.toLowerCase().replace(/[^a-z0-9]+/g, "-") === clean)) {
      return Array.from(new Set([key, ...aliases.map((a) => a.toLowerCase().replace(/[^a-z0-9]+/g, "-"))]));
    }
  }
  return [clean];
}

export function getSavedPDSession(domainSlugOrName: string, userId?: string | null): PDSavedSession | null {
  if (typeof window === "undefined") return null;
  migrateLegacyDataIfNeeded();
  try {
    const userPrefix = getUserPrefix(userId);
    const aliases = getPDAliases(domainSlugOrName);
    for (const alias of aliases) {
      const raw = localStorage.getItem(`${userPrefix}pd_session_${alias}`);
      if (raw) {
        const parsed = JSON.parse(raw) as PDSavedSession;
        if (parsed && typeof parsed === "object") {
          return parsed;
        }
      }
    }
  } catch (err) {
    console.error("Error reading saved PD session:", err);
  }
  return null;
}

export function savePDSession(session: PDSavedSession, userId?: string | null): void {
  if (typeof window === "undefined") return;
  try {
    const userPrefix = getUserPrefix(userId);
    const aliases = getPDAliases(session.domain || session.domainSlug);
    const sessionJson = JSON.stringify(session);

    for (const alias of aliases) {
      localStorage.setItem(`${userPrefix}pd_session_${alias}`, sessionJson);
    }

    updateCumulativePDStatsFromSession(session, userId);

    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new CustomEvent("pd_session_update"));
  } catch (err) {
    console.error("Error saving PD session:", err);
  }
}

export function updateCumulativePDStatsFromSession(session: PDSavedSession, userId?: string | null): void {
  if (typeof window === "undefined") return;
  try {
    const userPrefix = getUserPrefix(userId);
    const aliases = getPDAliases(session.domain || session.domainSlug);
    const cumulative = {
      attempted: 0,
      correct: 0,
      totalTimeSeconds: 0,
    };

    for (const alias of aliases) {
      const existingRaw = localStorage.getItem(`${userPrefix}pd_stats_${alias}`);
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
        } catch {}
      }
    }

    const sessionAttempted =
      session.attemptedCount ?? Object.keys(session.submittedAnswers || {}).length;
    const sessionCorrect =
      session.correctCount ??
      Object.values(session.questionScores || {}).filter((s) => s >= 70).length;
    const sessionTime = session.elapsedSeconds || 0;

    const effectiveAttempted = Math.max(cumulative.attempted, sessionAttempted);
    const effectiveCorrect = Math.max(cumulative.correct, sessionCorrect);
    const effectiveTime = Math.max(cumulative.totalTimeSeconds, sessionTime);

    const statsPayload = JSON.stringify({
      attempted: effectiveAttempted,
      correct: effectiveCorrect,
      totalTimeSeconds: effectiveTime,
      lastUpdated: Date.now(),
    });

    for (const alias of aliases) {
      localStorage.setItem(`${userPrefix}pd_stats_${alias}`, statsPayload);
    }
  } catch (err) {
    console.error("Error updating cumulative PD stats:", err);
  }
}

export function getPDStats(
  domainSlugOrName: string,
  totalQuestions: number = 0,
  userId?: string | null
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

  migrateLegacyDataIfNeeded();

  try {
    const userPrefix = getUserPrefix(userId);
    const aliases = getPDAliases(domainSlugOrName);
    let attempted = 0;
    let correct = 0;
    let totalTime = 0;

    for (const alias of aliases) {
      const rawStats = localStorage.getItem(`${userPrefix}pd_stats_${alias}`);
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

      const rawSession = localStorage.getItem(`${userPrefix}pd_session_${alias}`);
      if (rawSession) {
        try {
          const session = JSON.parse(rawSession);
          if (session) {
            const sAttempted =
              session.attemptedCount ?? Object.keys(session.submittedAnswers || {}).length;
            const sCorrect =
              session.correctCount ??
              Object.values(session.questionScores || {}).filter((s: any) => s >= 70).length;
            const sTime = session.elapsedSeconds || 0;

            if (sAttempted > attempted) {
              attempted = sAttempted;
              correct = sCorrect;
              totalTime = sTime;
            }
          }
        } catch {}
      }
    }

    const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;
    const avgSec = attempted > 0 ? totalTime / attempted : 0;
    const progressPercent =
      totalQuestions > 0 ? Math.min(100, Math.round((attempted / totalQuestions) * 100)) : 0;

    return {
      attempted,
      correct,
      accuracy,
      totalTimeSeconds: totalTime,
      averageTime: formatAverageTime(avgSec),
      progressPercent,
    };
  } catch (err) {
    console.error("Error reading PD stats:", err);
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

export function markPDSessionCompleted(domainSlugOrName: string, userId?: string | null): void {
  if (typeof window === "undefined") return;
  try {
    const aliases = getPDAliases(domainSlugOrName);
    for (const alias of aliases) {
      const session = getSavedPDSession(alias, userId);
      if (session) {
        session.isCompleted = true;
        savePDSession(session, userId);
      }
    }
  } catch (err) {
    console.error("Error marking PD session completed:", err);
  }
}

export function clearPDSession(domainSlugOrName: string, userId?: string | null): void {
  if (typeof window === "undefined") return;
  try {
    const userPrefix = getUserPrefix(userId);
    const aliases = getPDAliases(domainSlugOrName);
    for (const alias of aliases) {
      localStorage.removeItem(`${userPrefix}pd_session_${alias}`);
    }
  } catch (err) {
    console.error("Error clearing PD session:", err);
  }
}

// ==========================================
// MOCK EXAM SESSIONS & STATS
// ==========================================

export interface MockSavedSession {
  mockId: string;
  mockTitle: string;
  currentIndex: number;
  totalQuestions: number;
  userAnswers: Record<string, any>;
  flagged: Record<string, boolean>;
  isBreakActive: boolean;
  breakSecondsLeft: number;
  examSecondsLeft: number;
  isCompleted: boolean;
  score?: number;
  lastUpdated: number;
}

export function getMockSession(mockId: string, userId?: string | null): MockSavedSession | null {
  if (typeof window === "undefined" || !mockId) return null;
  try {
    const userPrefix = getUserPrefix(userId);
    const raw = localStorage.getItem(`${userPrefix}mock_session_${mockId}`);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading saved mock session:", err);
  }
  return null;
}

export function saveMockSession(session: MockSavedSession, userId?: string | null): void {
  if (typeof window === "undefined" || !session.mockId) return;
  try {
    const userPrefix = getUserPrefix(userId);
    const sessionJson = JSON.stringify(session);
    localStorage.setItem(`${userPrefix}mock_session_${session.mockId}`, sessionJson);
    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new CustomEvent("mock_session_update"));
    window.dispatchEvent(new CustomEvent("practice_session_update"));
  } catch (err) {
    console.error("Error saving mock session:", err);
  }
}

export function clearMockSession(mockId: string, userId?: string | null): void {
  if (typeof window === "undefined" || !mockId) return;
  try {
    const userPrefix = getUserPrefix(userId);
    localStorage.removeItem(`${userPrefix}mock_session_${mockId}`);
    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new CustomEvent("mock_session_update"));
    window.dispatchEvent(new CustomEvent("practice_session_update"));
  } catch (err) {
    console.error("Error clearing mock session:", err);
  }
}

export function markMockSessionCompleted(
  mockId: string,
  score: number,
  userId?: string | null,
  details?: { totalQuestions?: number; correct?: number; incorrect?: number }
): void {
  if (typeof window === "undefined" || !mockId) return;
  try {
    const userPrefix = getUserPrefix(userId);
    const key = `${userPrefix}mock_completed_${mockId}`;
    localStorage.setItem(
      key,
      JSON.stringify({
        mockId,
        score,
        totalQuestions: details?.totalQuestions,
        correct: details?.correct,
        incorrect: details?.incorrect,
        completedAt: new Date().toISOString(),
      })
    );
    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new CustomEvent("mock_session_update"));
    window.dispatchEvent(new CustomEvent("practice_session_update"));
  } catch (err) {
    console.error("Error marking mock session completed:", err);
  }
}

