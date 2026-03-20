import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { fetchQuestions } from "../api/mockApi";
import type { Plan, Question, Section, TrackProgress } from "../types";

type AppContextValue = {
  plan: Plan;
  setPlan: (plan: Plan) => void;
  activeTab: Section;
  setActiveTab: (tab: Section) => void;
  questions: Question[];
  loading: boolean;
  progress: TrackProgress[];
  markQuestionAttempted: (questionId: string) => void;
  markQuestionCompleted: (questionId: string) => void;
  markQuestionNotCompleted: (questionId: string) => void;
  selectedQuestionId: string | null;
  openQuestion: (questionId: string) => void;
  closeQuestion: () => void;
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

const PLAN_KEY = "techprep-plan";
const TAB_KEY = "techprep-active-tab";
const QUESTIONS_KEY = "techprep-questions";
const DATA_VERSION = "2";

export function AppProvider({ children }: { children: ReactNode }) {
  const [plan, setPlan] = useState<Plan>(() => (localStorage.getItem(PLAN_KEY) as Plan) || "free");
  const [activeTab, setActiveTab] = useState<Section>(() => (localStorage.getItem(TAB_KEY) as Section) || "dsa");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);

  const openQuestion = (questionId: string) => setSelectedQuestionId(questionId);
  const closeQuestion = () => setSelectedQuestionId(null);

  useEffect(() => {
    const loadQuestions = async () => {
      const savedVersion = localStorage.getItem("techprep-data-version");
      const savedQuestions = localStorage.getItem(QUESTIONS_KEY);
      if (savedQuestions && savedVersion === DATA_VERSION) {
        setQuestions(JSON.parse(savedQuestions));
        setLoading(false);
        return;
      }

      try {
        const data = await fetchQuestions();
        await new Promise((resolve) => setTimeout(resolve, 400));
        setQuestions(data);
      } catch (error) {
        console.error("Failed to load questions", error);
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, []);

  useEffect(() => {
    localStorage.setItem(PLAN_KEY, plan);
  }, [plan]);

  useEffect(() => {
    localStorage.setItem(TAB_KEY, activeTab);
  }, [activeTab]);

  useEffect(() => {
    if (questions.length > 0) {
      localStorage.setItem(QUESTIONS_KEY, JSON.stringify(questions));
      localStorage.setItem("techprep-data-version", DATA_VERSION);
    }
  }, [questions]);

  const markQuestionAttempted = (questionId: string) => {
    setQuestions((prev) =>
      prev.map((question) =>
        question.id === questionId
          ? { ...question, status: "attempted", lastAttemptedAt: new Date().toISOString() }
          : question
      )
    );
  };

  const markQuestionCompleted = (questionId: string) => {
    setQuestions((prev) =>
      prev.map((question) =>
        question.id === questionId
          ? { ...question, status: "completed", lastAttemptedAt: new Date().toISOString() }
          : question
      )
    );
  };

  const markQuestionNotCompleted = (questionId: string) => {
    setQuestions((prev) =>
      prev.map((question) =>
        question.id === questionId
          ? { ...question, status: "attempted", lastAttemptedAt: new Date().toISOString() }
          : question
      )
    );
  };

  const progress = useMemo(() => {
    const tracks: Array<{ section: Section; label: string }> = [
      { section: "dsa", label: "DSA Interview Questions" },
      { section: "sql", label: "SQL Interview Questions" },
      { section: "core-cs", label: "Core CS Interview Questions" },
    ];

    return tracks.map((track) => {
      const trackQuestions = questions.filter((question) => question.section === track.section);
      const completed = trackQuestions.filter((question) => question.status === "completed").length;
      return { section: track.section, label: track.label, completed, total: trackQuestions.length };
    });
  }, [questions]);

  return (
    <AppContext.Provider
      value={{
        plan,
        setPlan,
        activeTab,
        setActiveTab,
        questions,
        loading,
        progress,
        markQuestionAttempted,
        markQuestionCompleted,
        markQuestionNotCompleted,
        selectedQuestionId,
        openQuestion,
        closeQuestion,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used inside AppProvider");
  }
  return context;
}
