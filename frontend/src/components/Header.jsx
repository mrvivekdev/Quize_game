import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Coins, X } from "lucide-react";
import { getMe, loginWithGoogle, getCoinHistory } from "../utils/api";
import { auth, provider } from "../utils/firebase";
import AnchorAd from "./AnchorAd";
import {
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
} from "firebase/auth";

export default function Header() {
  const navigate = useNavigate();
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [coinHistory, setCoinHistory] = useState([]);
  const [userData, setUserData] = useState({
    name: "",
    guestId: "",
    avatar: "",
    isGuest: true,
  });
  const [coins, setCoins] = useState(null);
  const [adVisible, setAdVisible] = useState(false);
  const historyRef = useRef(null);

  useEffect(() => {
    getRedirectResult(auth)
      .then(async (result) => {
        if (result) {
          const idToken = await result.user.getIdToken();
          await loginWithGoogle(idToken);
          window.location.reload();
        }
      })
      .catch((err) => {
        console.error("Google sync failed:", err);
        if (err.code !== "auth/credential-already-in-use") {
          alert("Sync error: " + err.message);
        }
      });
  }, []);

  const fetchHistory = async () => {
    try {
      const data = await getCoinHistory();
      setCoinHistory(data);
    } catch (err) {
      console.error("Failed to load history");
    }
  };

  useEffect(() => {
    if (isHistoryOpen) fetchHistory();
  }, [isHistoryOpen]);

  useEffect(() => {
    const refreshData = () => {
      getMe()
        .then((d) => {
          setUserData({
            name: localStorage.getItem("userName") || d.name,
            guestId: localStorage.getItem("guestId") || d.guestId,
            avatar: localStorage.getItem("userAvatar") || d.avatar,
            isGuest: d.isGuest,
          });
          setCoins(d.coins ?? 0);
          if (isHistoryOpen) fetchHistory();
        })
        .catch(() => {});
    };

    refreshData();
    window.addEventListener("coinsUpdated", refreshData);
    return () => window.removeEventListener("coinsUpdated", refreshData);
  }, [isHistoryOpen]);

  useEffect(() => {
    function outside(e) {
      if (historyRef.current && !historyRef.current.contains(e.target))
        setIsHistoryOpen(false);
    }
    document.addEventListener("mousedown", outside);
    return () => document.removeEventListener("mousedown", outside);
  }, []);

  // Delay showing top anchor ad slightly so the drop-down animation
  // plays AFTER the header has rendered and is visible on screen.
  useEffect(() => {
    const timer = setTimeout(() => setAdVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Top anchor ad — mounts after header is painted so drop-down is visible */}
      {/* {adVisible && <AnchorAd position="top" />} */}

      <header className="sticky top-0 z-50 bg-[#6a5ae0] px-4 py-3 shadow-sm border-b border-white/10">
        <div className="flex justify-between items-center max-w-full">
          {/* Logo */}
          <Link to="/explore" className="flex items-center gap-1 group">
            <span className="text-2xl font-black text-white italic tracking-tighter">
              Quiz<span className="text-yellow-400">Nova</span>
            </span>
          </Link>

          {/* Coins Button */}
          <div className="flex items-center gap-2">
            {coins !== null && (
              <button
                onClick={() => setIsHistoryOpen(!isHistoryOpen)}
                className="flex items-center gap-1.5 bg-[#febb0c] border border-yellow-500 text-white text-xs font-black px-3 py-1.5 rounded-full shadow-inner hover:bg-yellow-500 transition-all active:scale-95"
              >
                <div className="w-5 h-5 rounded-full bg-yellow-500/50 flex items-center justify-center p-0.5">
                  <Coins className="w-full h-full text-white" />
                </div>
                <span className="text-sm font-black">{coins}</span>
              </button>
            )}
          </div>
        </div>

        {/* Coin History Dropdown */}
        {isHistoryOpen && (
          <div
            ref={historyRef}
            className="absolute top-16 right-4 w-80 bg-white border border-gray-100 rounded-2xl shadow-2xl overflow-hidden animate-slide-up z-50 flex flex-col max-h-[400px]"
          >
            <div className="p-4 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
              <h3 className="font-black text-gray-900 uppercase tracking-widest text-[10px] flex items-center gap-2">
                <Coins className="w-3.5 h-3.5 text-yellow-500" />
                Coin History
              </h3>
              <button
                onClick={() => setIsHistoryOpen(false)}
                className="text-gray-400 hover:text-gray-900"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-y-auto p-2 space-y-1 custom-scrollbar">
              {coinHistory.length === 0 ? (
                <div className="py-8 text-center text-gray-400 text-xs font-medium leading-relaxed">
                  No transactions yet.
                  <br />
                  Play a quiz to start earning coins!
                </div>
              ) : (
                coinHistory.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3.5 rounded-xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100 group"
                  >
                    <div className="flex flex-col gap-0.5">
                      <p className="text-[13px] font-black text-gray-900 leading-tight">
                        {item.category}
                      </p>
                      <p className="text-[11px] text-gray-400 font-bold uppercase tracking-tight">
                        {new Date(item.date).toLocaleDateString([], {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <div
                      className={`px-2.5 py-1 rounded-lg text-[13px] font-black shadow-sm ${
                        item.type === "earn"
                          ? "bg-green-50 text-green-600 border border-green-100"
                          : "bg-red-50 text-red-600 border border-red-100"
                      }`}
                    >
                      {item.type === "earn" ? "+" : "-"}
                      {item.amount}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
