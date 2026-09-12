"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Check,
  HelpCircle,
  Clock,
  ArrowLeft,
  Info,
} from "lucide-react";

interface SpecialtyConfig {
  id: string;
  title: string;
  subtitle: string;
  attempted: number;
  totalQ: number;
  accuracy: number;
  averageTime: string;
  topics: string[];
}

const specialtiesMap: Record<string, SpecialtyConfig> = {
  cardiovascular: {
    id: "cardiovascular",
    title: "Cardiovascular Medicine",
    subtitle: "Practice cardiovascular CPS questions.",
    attempted: 132,
    totalQ: 650,
    accuracy: 66,
    averageTime: "1m 14s",
    topics: [
      "Coronary Artery Disease",
      "Heart Failure",
      "Myocardial Infarction",
      "Atrial Fibrillation",
      "Hypertension Management",
      "Heart Valve Disorders",
      "Peripheral Artery Disease",
      "Congestive Heart Failure",
      "Cardiac Rehabilitation",
    ],
  },
  respiratory: {
    id: "respiratory",
    title: "Respiratory Medicine",
    subtitle: "Practice respiratory CPS questions.",
    attempted: 110,
    totalQ: 550,
    accuracy: 70,
    averageTime: "1m 10s",
    topics: [
      "Asthma & COPD",
      "Pneumonia & Lower RTI",
      "Pulmonary Embolism",
      "Pleural Effusion & Pneumothorax",
      "Interstitial Lung Disease",
      "Bronchiectasis & Cystic Fibrosis",
      "Sleep Apnoea",
      "Occupational Lung Disease",
    ],
  },
  gastroenterology: {
    id: "gastroenterology",
    title: "Gastroenterology & Nutrition",
    subtitle: "Practice gastroenterology & nutrition CPS questions.",
    attempted: 145,
    totalQ: 600,
    accuracy: 74,
    averageTime: "1m 18s",
    topics: [
      "Gastro-oesophageal Reflux Disease (GORD)",
      "Inflammatory Bowel Disease (Crohn's & UC)",
      "Peptic Ulcer Disease",
      "Irritable Bowel Syndrome (IBS)",
      "Coeliac Disease & Malabsorption",
      "Liver Cirrhosis & Hepatitis",
      "Pancreatitis & Gallbladder Disease",
      "Nutritional Deficiencies & Obesity",
    ],
  },
  neurology: {
    id: "neurology",
    title: "Neurology & Psychiatry",
    subtitle: "Practice neurology & psychiatry CPS questions.",
    attempted: 98,
    totalQ: 520,
    accuracy: 64,
    averageTime: "1m 22s",
    topics: [
      "Stroke & TIA",
      "Epilepsy & Seizure Disorders",
      "Migraine & Headache Disorders",
      "Parkinson's & Movement Disorders",
      "Multiple Sclerosis",
      "Dementia & Cognitive Impairment",
      "Depressive & Anxiety Disorders",
      "Psychosis & Bipolar Disorder",
    ],
  },
  renal: {
    id: "renal",
    title: "Renal & Urology Medicine",
    subtitle: "Practice renal & urology CPS questions.",
    attempted: 85,
    totalQ: 480,
    accuracy: 68,
    averageTime: "1m 15s",
    topics: [
      "Acute Kidney Injury (AKI)",
      "Chronic Kidney Disease (CKD)",
      "Glomerulonephritis & Nephrotic Syndrome",
      "Urinary Tract Infections (UTI)",
      "Nephrolithiasis (Renal Stones)",
      "Benign Prostatic Hyperplasia (BPH)",
      "Haematuria Investigation",
      "Electrolyte & Acid-Base Disorders",
    ],
  },
  endocrinology: {
    id: "endocrinology",
    title: "Endocrinology & Metabolic",
    subtitle: "Practice endocrinology & metabolic CPS questions.",
    attempted: 120,
    totalQ: 500,
    accuracy: 72,
    averageTime: "1m 12s",
    topics: [
      "Type 1 & Type 2 Diabetes Mellitus",
      "Diabetic Ketoacidosis (DKA) & HHS",
      "Hypothyroidism & Hyperthyroidism",
      "Adrenal Insufficiency & Cushing's",
      "Pituitary Disorders & Hyperprolactinaemia",
      "Calcium & Parathyroid Disorders",
      "Polycystic Ovary Syndrome (PCOS)",
      "Dyslipidaemia & Metabolic Syndrome",
    ],
  },
  dermatology: {
    id: "dermatology",
    title: "Dermatology, ENT & Eyes",
    subtitle: "Practice dermatology, ENT & ophthalmology CPS questions.",
    attempted: 95,
    totalQ: 490,
    accuracy: 75,
    averageTime: "1m 08s",
    topics: [
      "Eczema & Dermatitis",
      "Psoriasis & Papulosquamous Disorders",
      "Skin Cancers & Lesions",
      "Otitis Media & Externae",
      "Sinusitis & Allergic Rhinitis",
      "Hearing Loss & Vertigo (Ménière's)",
      "Red Eye & Conjunctivitis",
      "Glaucoma & Retinal Disorders",
    ],
  },
  infectious: {
    id: "infectious",
    title: "Infectious Disease & Haematology",
    subtitle: "Practice infectious disease & haematology CPS questions.",
    attempted: 140,
    totalQ: 580,
    accuracy: 69,
    averageTime: "1m 16s",
    topics: [
      "Sepsis & Septic Shock",
      "HIV/AIDS & Opportunistic Infections",
      "Tuberculosis & Mycobacterial Disease",
      "Vector-Borne & Travel Infections",
      "Iron Deficiency & Megaloblastic Anaemia",
      "Haemoglobinopathies & Thalassaemia",
      "Leukaemias & Lymphomas",
      "Coagulation Disorders & DVT",
    ],
  },
  immunology: {
    id: "immunology",
    title: "Immunology, Allergies & Genetics",
    subtitle: "Practice immunology, allergies & genetics CPS questions.",
    attempted: 80,
    totalQ: 450,
    accuracy: 67,
    averageTime: "1m 20s",
    topics: [
      "Anaphylaxis & Drug Allergies",
      "Systemic Lupus Erythematosus (SLE)",
      "Rheumatoid Arthritis",
      "Primary Immunodeficiency Disorders",
      "Vasculitis & Connective Tissue Diseases",
      "Inherited Single-Gene Disorders",
      "Chromosomal Abnormalities",
      "Autoimmune Blistering Diseases",
    ],
  },
  musculoskeletal: {
    id: "musculoskeletal",
    title: "Musculoskeletal Medicine",
    subtitle: "Practice musculoskeletal CPS questions.",
    attempted: 115,
    totalQ: 520,
    accuracy: 71,
    averageTime: "1m 13s",
    topics: [
      "Osteoarthritis & Degenerative Joint Disease",
      "Osteoporosis & Fragility Fractures",
      "Gout & Pseudogout",
      "Septic Arthritis & Osteomyelitis",
      "Back Pain & Sciatica",
      "Soft Tissue Injuries & Tendinopathies",
      "Polymyalgia Rheumatica & Giant Cell Arteritis",
      "Fibromyalgia & Chronic Pain",
    ],
  },
  paediatrics: {
    id: "paediatrics",
    title: "Paediatrics",
    subtitle: "Practice paediatrics CPS questions.",
    attempted: 150,
    totalQ: 620,
    accuracy: 76,
    averageTime: "1m 09s",
    topics: [
      "Paediatric Respiratory Distress (Croup, Bronchiolitis)",
      "Febrile Child & Sepsis in Neonates",
      "Paediatric Gastroenteritis & Dehydration",
      "Growth & Developmental Milestones",
      "Childhood Immunisation Schedules",
      "Paediatric Exanthems & Rashes",
      "Congenital Heart Disease",
      "Non-Accidental Injury & Safeguarding",
    ],
  },
  pharmacology: {
    id: "pharmacology",
    title: "Pharmacology & Therapeutics",
    subtitle: "Practice pharmacology and therapeutics CPS questions.",
    attempted: 160,
    totalQ: 640,
    accuracy: 73,
    averageTime: "1m 11s",
    topics: [
      "Antimicrobial Stewardship & Prescribing",
      "Cardiovascular Drugs & Antihypertensives",
      "Analgesics & Opiate Prescribing",
      "Anticoagulation & Reversal Agents",
      "Adverse Drug Reactions & Interactions",
      "Therapeutic Drug Monitoring (TDM)",
      "Toxicology & Overdose Management",
      "Renal & Hepatic Dosing Adjustments",
    ],
  },
  reproductive: {
    id: "reproductive",
    title: "Reproductive & Sexual Health",
    subtitle: "Practice reproductive medicine CPS questions.",
    attempted: 125,
    totalQ: 530,
    accuracy: 70,
    averageTime: "1m 14s",
    topics: [
      "Antenatal Care & Common Pregnancy Complications",
      "Pre-eclampsia & Gestational Hypertension",
      "Obstetric Emergencies (APH, PPH, Shoulder Dystocia)",
      "Contraceptive Counselling & Emergency Contraception",
      "Menstrual Disorders & Abnormal Uterine Bleeding",
      "Infertility Investigation",
      "Menopause & HRT",
      "Sexually Transmitted Infections (STIs)",
    ],
  },
};

export default function SpecialtyPracticeSettingsPage() {
  const router = useRouter();
  const params = useParams();
  const rawId = typeof params?.specialityId === "string" ? params.specialityId.toLowerCase() : "cardiovascular";
  const specialty = specialtiesMap[rawId] || specialtiesMap.cardiovascular;

  // Practice settings state
  const [timerEnabled, setTimerEnabled] = useState(true);
  const [questionType, setQuestionType] = useState<"SBA" | "EMQ" | "Both">("SBA");
  const [topicMode, setTopicMode] = useState<"all" | "choose">("all");
  const [selectedTopics, setSelectedTopics] = useState<string[]>(specialty.topics);

  const toggleTopic = (topic: string) => {
    if (selectedTopics.includes(topic)) {
      if (selectedTopics.length > 1) {
        setSelectedTopics(selectedTopics.filter((t) => t !== topic));
      }
    } else {
      setSelectedTopics([...selectedTopics, topic]);
    }
  };

  const handleSelectAllTopics = () => {
    setTopicMode("all");
    setSelectedTopics(specialty.topics);
  };

  const handleChooseTopics = () => {
    setTopicMode("choose");
  };

  const progressPercent = Math.round((specialty.attempted / specialty.totalQ) * 100);

  return (
    <div className="space-y-6 sm:space-y-7 pb-8">
      {/* 1. Page Header with Back Link */}
      <div className="space-y-1">
        <Link
          href="/dashboard/clinical-problem-solving"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5E718D] hover:text-[#0F172A] transition-colors mb-1 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Clinical Problem Solving</span>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
          {specialty.title}
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm font-medium">
          {specialty.subtitle}
        </p>
      </div>

      {/* 2. Top Stats (3 Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Questions Attempted */}
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-[#5E718D]">Questions Attempted</p>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
                {specialty.attempted.toLocaleString()}
              </span>
              <span className="text-sm font-bold text-slate-400">
                / {specialty.totalQ.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="space-y-1.5 pt-2">
            <div className="w-full h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#1D82EB] rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400">
              <span>Current Progress</span>
              <span className="text-slate-700 font-bold">{progressPercent}%</span>
            </div>
          </div>
        </div>

        {/* Card 2: Overall Accuracy */}
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-[#5E718D]">Overall Accuracy</p>
            <div className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
              {specialty.accuracy}%
            </div>
          </div>

          {/* Radial Accuracy Gauge with inner gap padding */}
          <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="23.5" fill="#F1F5F9" />
              <circle
                cx="40"
                cy="40"
                r="33"
                stroke="#EDF2F7"
                strokeWidth="6.5"
                fill="none"
              />
              <circle
                cx="40"
                cy="40"
                r="33"
                stroke="#1D82EB"
                strokeWidth="6.5"
                strokeDasharray={2 * Math.PI * 33}
                strokeDashoffset={(2 * Math.PI * 33) * (1 - specialty.accuracy / 100)}
                strokeLinecap="butt"
                fill="none"
                className="transition-all duration-700 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[11px] sm:text-xs font-bold text-[#0F172A]">
                {specialty.accuracy}%
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Average Time / Question */}
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-[#5E718D]">Average Time/ Question</p>
            <div className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
              {specialty.averageTime}
            </div>
          </div>

          <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
            <svg className="w-14 h-14 text-[#1D82EB]" viewBox="0 0 48 48" fill="none">
              <path
                d="M21 4H27M24 4V8"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d="M37 11L39 9"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle
                cx="24"
                cy="26"
                r="17"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeDasharray="4 3"
                strokeLinecap="round"
              />
              <path
                d="M24 26V18M24 26L31 26"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="24" cy="26" r="2.5" fill="currentColor" />
            </svg>
          </div>
        </div>
      </div>

      {/* 3. Main Practice Settings & Session Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left: Practice Settings Card (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-2xs space-y-6">
          <h2 className="text-lg font-bold text-[#0F172A]">Practice Settings</h2>

          {/* Row 1: Timer Toggle */}
          <div className="flex items-center justify-between py-1">
            <span className="text-sm font-medium text-slate-700">Timer</span>
            <div className="flex items-center gap-3">
              <span className={`text-xs font-semibold ${!timerEnabled ? "text-slate-900" : "text-slate-400"}`}>
                Off
              </span>
              <button
                type="button"
                onClick={() => setTimerEnabled(!timerEnabled)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${
                  timerEnabled ? "bg-[#1D82EB]" : "bg-slate-300"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out mt-0.5 ml-0.5 ${
                    timerEnabled ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
              <span className={`text-xs font-semibold ${timerEnabled ? "text-slate-900" : "text-slate-400"}`}>
                On
              </span>
            </div>
          </div>

          <div className="border-t border-slate-100" />

          {/* Row 2: Question Type Selection */}
          <div className="flex items-center justify-between py-1">
            <span className="text-sm font-medium text-slate-700">Question Type</span>
            <div className="flex items-center gap-2">
              {(["SBA", "EMQ", "Both"] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setQuestionType(type)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    questionType === type
                      ? "bg-[#ecfdf5] text-[#059669] border border-[#a7f3d0] shadow-2xs"
                      : "bg-[#f8fafc] text-slate-600 border border-slate-200/80 hover:bg-slate-100"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-100" />

          {/* Row 3: Topics Filter Header */}
          <div className="flex items-center justify-between py-1">
            <span className="text-sm font-medium text-slate-700">Topics</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSelectAllTopics}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  topicMode === "all"
                    ? "bg-[#ecfdf5] text-[#059669] border border-[#a7f3d0] shadow-2xs"
                    : "bg-[#f8fafc] text-slate-600 border border-slate-200/80 hover:bg-slate-100"
                }`}
              >
                All Topics
              </button>
              <button
                type="button"
                onClick={handleChooseTopics}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  topicMode === "choose"
                    ? "bg-[#ecfdf5] text-[#059669] border border-[#a7f3d0] shadow-2xs"
                    : "bg-[#f8fafc] text-slate-600 border border-slate-200/80 hover:bg-slate-100"
                }`}
              >
                Choose Topics
              </button>
            </div>
          </div>

          {/* Selectable Topics Checkbox List */}
          <div className="space-y-3 pt-2">
            {specialty.topics.map((topic) => {
              const isChecked = selectedTopics.includes(topic);
              return (
                <label
                  key={topic}
                  onClick={() => toggleTopic(topic)}
                  className="flex items-center gap-3 cursor-pointer select-none group"
                >
                  <div
                    className={`w-4 h-4 rounded-[4px] flex items-center justify-center transition-all ${
                      isChecked
                        ? "bg-[#1D82EB] text-white"
                        : "border border-slate-300 bg-white group-hover:border-slate-400"
                    }`}
                  >
                    {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span
                    className={`text-xs sm:text-[13px] font-medium transition-colors ${
                      isChecked ? "text-slate-900" : "text-slate-500 group-hover:text-slate-700"
                    }`}
                  >
                    {topic}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Right: Session Card (1 Col) */}
        <div className="lg:col-span-1 bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-2xs flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-[#0F172A]">Session</h2>

            {/* Previous Session Found Notice */}
            <div className="bg-[#ecfdf5] border border-[#a7f3d0] rounded-xl p-4 sm:p-5 space-y-2">
              <div className="flex items-center gap-2 text-[#059669]">
                <HelpCircle className="w-4 h-4 shrink-0" />
                <span className="text-xs sm:text-[13px] font-bold">
                  Previous session found
                </span>
              </div>
              <p className="text-xs sm:text-[13px] font-bold text-slate-900 leading-snug">
                EMQ · SBA · All Topics
              </p>
              <p className="text-xs text-slate-500 leading-relaxed">
                Continue where you left off.
              </p>
            </div>
          </div>

          {/* Action CTA Buttons */}
          <div className="space-y-3 pt-4">
            <Link
              href={`/practice/clinical?topic=${encodeURIComponent(specialty.title)}&speciality=${encodeURIComponent(specialty.title)}&type=${questionType}&mode=resume`}
              className="w-full py-3 rounded-xl bg-[#1D82EB] hover:bg-[#1875d2] active:scale-[0.99] text-white font-bold text-xs sm:text-sm text-center shadow-xs shadow-blue-500/20 flex items-center justify-center transition-all cursor-pointer"
            >
              <span>Resume Session</span>
            </Link>

            <Link
              href={`/practice/clinical?topic=${encodeURIComponent(specialty.title)}&speciality=${encodeURIComponent(specialty.title)}&type=${questionType}&mode=new`}
              className="w-full py-3 rounded-xl bg-brand-orange hover:bg-brand-orange/90 active:scale-[0.99] text-white font-bold text-xs sm:text-sm text-center shadow-xs shadow-brand-orange/20 flex items-center justify-center transition-all cursor-pointer"
            >
              <span>Start New Session</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
