import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  PlayCircle,
  Zap,
  CheckCircle2,
  Loader2,
  Lightbulb,
} from "lucide-react";
import { getCategories, getQuestions } from "../utils/api";
import GPTAds from "../components/GPTAds";
import RewardedAd from "../components/RewardedAd";
import QuizContestCard from "../components/QuizContestCard";

const DID_YOU_KNOW_FACTS = [
  "One of the world's richest cricket leagues is IPL.",
  "A cat has 32 muscles in each ear.",
  "Honey never spoils. You can eat 3000-year-old honey.",
  "Octopuses have three hearts.",
  "Bananas are berries, but strawberries aren't.",
  "A day on Venus is longer than a year on Venus.",
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [luckyQuiz, setLuckyQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [randomFact, setRandomFact] = useState("");
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { questionId: { selected, isCorrect } }
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    const fetchLandingData = async () => {
      try {
        const categories = await getCategories();
        if (categories.length > 0) {
          const shuffled = [...categories].sort(() => 0.5 - Math.random());
          const category = shuffled[0];

          const questions = await getQuestions(category, "", 2);
          if (questions.length > 0) {
            setLuckyQuiz({
              category,
              questions,
            });
          }
        }
        setRandomFact(
          DID_YOU_KNOW_FACTS[
            Math.floor(Math.random() * DID_YOU_KNOW_FACTS.length)
          ],
        );
      } catch (err) {
        console.error("Failed to fetch landing data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLandingData();
  }, []);

  const handleAnswer = (questionId, option, correctAnswer) => {
    if (selectedAnswers[questionId]) return; // Prevent multiple clicks

    const isCorrect = option === correctAnswer;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: { selected: option, isCorrect },
    }));

    // Advance to next question or redirect to home after delay
    if (luckyQuiz) {
      if (currentQuestionIndex < luckyQuiz.questions.length - 1) {
        setTimeout(() => {
          setCurrentQuestionIndex((prev) => prev + 1);
        }, 1500);
      } else {
        // Last question answered - redirect to success page
        setTimeout(() => {
          navigate("/success");
        }, 2000);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-white animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20 animate-fade-in">
      {/* Rewarded Ad Popup */}
      <RewardedAd />
      
      {/* Top Ad */}
      <GPTAds />

      {/* Lucky Picks Quiz - Sequential Questions */}
      <div className="space-y-6">
        {luckyQuiz && currentQuestionIndex < luckyQuiz.questions.length && (
          <div className="bg-white rounded-[30px] shadow-xl overflow-hidden animate-slide-up">
            <div className="bg-[#9187e6] px-6 py-4 text-center">
              <h2 className="text-white text-[18px] font-bold tracking-tight">
                Answer Two questions & win 200 Coins
              </h2>
            </div>

            <div className="p-6 space-y-6">
              {/* Question Box */}
              <div className="bg-[#f0f0fa] p-6 rounded-[20px] text-center min-h-[100px] flex items-center justify-center">
                <h3 className="text-[17px] font-bold text-[#2d2747] leading-tight">
                  {luckyQuiz.questions[currentQuestionIndex].questionText}
                </h3>
              </div>

              {/* Options Grid */}
              <div className="grid grid-cols-2 gap-3">
                {luckyQuiz.questions[currentQuestionIndex].options.map(
                  (opt, i) => {
                    const q = luckyQuiz.questions[currentQuestionIndex];
                    const selection = selectedAnswers[q.id];
                    const isSelected = selection?.selected === opt;
                    const isCorrect = opt === q.correctAnswer;
                    const hasAnswered = !!selection;

                    let bgColor = "bg-[#6a5ae0]";
                    if (hasAnswered) {
                      if (isCorrect) bgColor = "bg-green-500";
                      else if (isSelected) bgColor = "bg-red-500";
                      else bgColor = "bg-[#6a5ae0]/40";
                    }

                    return (
                      <button
                        key={i}
                        disabled={hasAnswered}
                        onClick={() => handleAnswer(q.id, opt, q.correctAnswer)}
                        className={`py-4 ${bgColor} text-white text-[14px] font-bold rounded-[16px] shadow-sm transition-all text-center px-2 relative overflow-hidden
                                                ${!hasAnswered ? "hover:translate-y-[-2px] active:scale-95" : "cursor-default"}
                                            `}
                      >
                        {opt}
                        {hasAnswered && isCorrect && isSelected && (
                          <div className="absolute inset-0 bg-white/20 animate-ping pointer-events-none" />
                        )}
                      </button>
                    );
                  },
                )}
              </div>

              <div className="text-center">
                <p className="text-[14px] font-medium text-gray-400 uppercase tracking-widest">
                  Question {currentQuestionIndex + 1} of{" "}
                  {luckyQuiz.questions.length}
                </p>
              </div>
            </div>
          </div>
        )}

        {luckyQuiz && currentQuestionIndex >= luckyQuiz.questions.length && (
          <div className="bg-white rounded-[30px] p-8 shadow-xl text-center space-y-4 animate-slide-up">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-[#2d2747]">Awesome!</h2>
            <p className="text-gray-500">
              You've answered all questions. Want more?
            </p>
          </div>
        )}
      </div>

      {/* Did You Know? Card */}
      <div className="bg-[#9187e6] rounded-[30px] p-6 text-white shadow-lg flex items-center gap-5">
        <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 animate-pulse">
          <Lightbulb className="w-8 h-8 text-white fill-white/20" />
        </div>
        <div className="space-y-1">
          <p className="text-[16px] font-bold tracking-tight uppercase">
            Did You Know?
          </p>
          <p className="text-[14px] font-medium text-white/90 leading-snug">
            {randomFact}
          </p>
        </div>
      </div>

      {/* Feature List Section */}
      <GPTAds />
      <QuizContestCard />

      {/* Mini Footer */}
      <div className="pt-10 text-center space-y-4 pb-10">
        <div className="flex justify-center gap-6 text-white/60 text-[11px] font-bold uppercase tracking-widest">
          <button className="hover:text-white transition-colors">
            Terms & Conditions
          </button>
          <button className="hover:text-white transition-colors">
            Privacy policy
          </button>
        </div>
      </div>
    </div>
  );
}
