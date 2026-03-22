import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { getMe } from "../utils/api";
import GPTAds from "../components/GPTAds";
import InterstitialAd from "../components/InterstitialAd";

export default function StartPage() {
  const { category } = useParams();
  const navigate = useNavigate();
  const decodedCategory = decodeURIComponent(category);
  // Mock data for the hero card based on category
  const categoryDetails = {
    Cricket: { icon: "🏏", prize: "200000", fee: "50", time: "60" },
    Geography: { icon: "🌍", prize: "150000", fee: "40", time: "45" },
    History: { icon: "📜", prize: "100000", fee: "30", time: "50" },
    Movies: { icon: "🎬", prize: "180000", fee: "45", time: "60" },
    Science: { icon: "🧪", prize: "250000", fee: "60", time: "45" },
    General: { icon: "💡", prize: "120000", fee: "35", time: "50" },
  };

  const details =
    categoryDetails[decodedCategory] || categoryDetails["General"];

  return (
    <div
      className="min-h-[85vh] flex flex-col items-center p-4 animate-in fade-in zoom-in duration-500 relative"
      style={{
        backgroundImage:
          "radial-gradient(circle at 50% 50%, rgba(106, 90, 224, 0.05) 0%, transparent 70%)",
      }}
    >
      <InterstitialAd />
      {/* <AnchorAd position="top" /> */}
      {/* Top Navigation */}
      <div className="w-full max-w-[450px] flex justify-start mb-4">
        <button
          onClick={() => navigate("/explore")}
          className="flex items-center gap-2 p-2 px-3 rounded-full bg-white/80 backdrop-blur-sm text-gray-500 hover:text-gray-900 border border-gray-100 shadow-sm transition-all hover:scale-105 active:scale-95 group"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
          <span className="text-xs font-black uppercase tracking-widest leading-none">
            Back
          </span>
        </button>
      </div>

      {/* Top Ad Banner */}
      <div className="w-full max-w-[450px] mb-8">
        <GPTAds />
      </div>

      {/* Hero Card Container */}
      <div className="w-full max-w-[400px] relative">
        {/* Decorative elements behind the card */}
        <div className="absolute top-[-20px] left-1/2 -translate-x-1/2 w-[90%] h-12 bg-white/40 rounded-t-[40px] z-0" />

        {/* Main Hero Card */}
        <div className="relative z-10 bg-gradient-to-b from-[#6a5ae0] to-[#5143cc] rounded-[48px] p-8 text-center text-white shadow-2xl shadow-indigo-200/50 border border-white/10 overflow-hidden">
          {/* Shine effect */}
          <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />

          {/* Category Icon */}
          <div className="relative mb-6">
            <div className="mx-auto w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
              <span className="text-5xl">{details.icon}</span>
              {/* Decorative sparkles */}
              <div className="absolute -top-2 -right-2 text-yellow-400 text-xl font-black">
                ✦
              </div>
              <div className="absolute -bottom-1 -left-1 text-blue-300 text-lg font-black">
                ✦
              </div>
            </div>
          </div>

          {/* Category Label */}
          <span className="block text-xs font-black uppercase tracking-[0.3em] opacity-80 mb-3">
            {decodedCategory}
          </span>

          {/* Main Title */}
          <h1 className="text-3xl font-black mb-4 leading-tight drop-shadow-md">
            Play and Win <br />
            <span className="text-4xl text-yellow-400">{details.prize}</span>
            <span className="ml-2 text-3xl">🪙</span>
          </h1>

          {/* Sub Details */}
          <div className="space-y-1.5 mb-8">
            <p className="text-sm font-bold opacity-90 leading-relaxed tracking-tight">
              {details.time} seconds to answer all questions.
            </p>
            <p className="text-sm font-black text-yellow-300 uppercase tracking-widest flex items-center justify-center gap-1.5">
              Entry fee {details.fee} <span className="text-lg">🪙</span>
            </p>
          </div>

          {/* Large Play Button - Inside Card */}
          <div className="pt-2">
            <button
              onClick={() => {
                window.googletag?.cmd.push(() => {
                  window.googletag.pubads().refresh();
                });
                navigate(`/quiz/${encodeURIComponent(category)}?limit=10`);
              }}
              className="w-full bg-gradient-to-b from-[#febb0c] to-[#f97316] hover:from-[#f97316] hover:to-[#febb0c] text-white py-4 rounded-3xl text-xl font-black uppercase tracking-[0.1em] shadow-xl shadow-black/20 transform transition-all hover:scale-[1.03] active:scale-95 flex items-center justify-center gap-3 border-b-4 border-orange-700/30"
            >
              Play
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Ad Banner */}
      <div className="w-full max-w-[450px] mt-8">
        <GPTAds />
      </div>

      {/* Footer Disclaimer */}
      <p className="mt-10 text-[10px] text-gray-400 font-bold uppercase tracking-[0.15em] opacity-60 max-w-[250px] text-center mb-8">
        By starting the quiz, you agree <br /> to our terms and conditions.
      </p>
    </div>
  );
}
