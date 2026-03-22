import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Loader2, ArrowLeft, PlayCircle, Trophy } from "lucide-react";
import { getCategories } from "../utils/api";
import GPTAds from "../components/GPTAds";
import InterstitialAd from "../components/InterstitialAd";

const categoryIcons = {
  all: "🔥",
  bollywood: "🎬",
  cricket: "🏏",
  "birds and animals": "🐯",
  "brain teasers": "🧠",
  "general knowledge": "📘",
  technology: "💻",
  science: "🔬",
  entertainment: "🎮",
  finance: "💰",
  sport: "🏆",
  "world geography": "🌍",
};

export default function SearchPage() {
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error("Error loading categories", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const filteredCategories = categories.filter((cat) =>
    cat.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in pb-10 max-w-4xl mx-auto px-2 mt-4">
      {/* Header Area */}
      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-black text-white tracking-tight">
          Explore Quizzes
        </h1>
      </div>

      {/* Search Bar */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
          <Search className="w-5 h-5 text-white/50 group-focus-within:text-white transition-colors" />
        </div>
        <input
          type="text"
          placeholder="Search for categories (e.g. Cricket, Bollywood...)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white/10 border-2 border-white/5 focus:border-[#FEB800] text-white placeholder:text-white/30 rounded-[20px] py-4 pl-14 pr-6 outline-none transition-all duration-300 font-bold shadow-xl backdrop-blur-md"
        />
      </div>

      <GPTAds />

      {/* Content Area */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
            <h2 className="text-xs font-black text-white/60 uppercase tracking-[0.2em]">
                {searchQuery ? `Search Results (${filteredCategories.length})` : "All Categories"}
            </h2>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="w-10 h-10 text-white animate-spin opacity-40" />
            <p className="text-white/40 font-black uppercase tracking-widest text-xs">
              Loading Categories...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            <InterstitialAd />
            {filteredCategories.length === 0 ? (
              <div className="bg-white/5 border-2 border-dashed border-white/10 rounded-[30px] py-16 text-center space-y-4">
                <Search className="w-12 h-12 text-white/20 mx-auto" />
                <p className="text-white/40 font-bold">No categories found matching "{searchQuery}"</p>
              </div>
            ) : (
              filteredCategories.map((category, index) => (
                <div
                  key={category}
                  onClick={() => {
                    window.googletag?.cmd.push(() => {
                      window.googletag.pubads().refresh();
                    });
                    navigate(`/quiz/${encodeURIComponent(category)}/start`);
                  }}
                  className="bg-white rounded-[24px] p-4 flex items-center justify-between group cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg hover:shadow-indigo-500/10 border border-transparent hover:border-white/20"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-indigo-50 to-white rounded-2xl flex items-center justify-center text-3xl shadow-inner border border-indigo-100">
                      {categoryIcons[category.toLowerCase()] || "❓"}
                    </div>
                    <div>
                      <h3 className="text-[17px] font-black text-[#2d2747] leading-none mb-1">
                        {category}
                      </h3>
                      <div className="flex items-center gap-1.5">
                        <Trophy className="w-3 h-3 text-yellow-500" />
                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                           Prize: {(index + 1) * 10000} 🪙
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="w-10 h-10 bg-[#6a5ae0]/10 rounded-xl flex items-center justify-center group-hover:bg-[#6a5ae0] group-hover:text-white transition-all text-[#6a5ae0]">
                    <PlayCircle className="w-6 h-6" />
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <div className="pb-10" />
    </div>
  );
}
