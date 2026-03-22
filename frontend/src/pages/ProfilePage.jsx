import { useState, useEffect } from "react";
import {
  User,
  Coins,
  History,
  LogOut,
  RefreshCw,
  ChevronRight,
  ShieldCheck,
  Trophy,
  Activity,
  UserCheck,
} from "lucide-react";
import {
  getMe,
  getCoinHistory,
  logoutUser,
  loginWithGoogle,
} from "../utils/api";
import { auth, provider } from "../utils/firebase";
import { signInWithPopup, signInWithRedirect } from "firebase/auth";

export default function ProfilePage() {
  const [userData, setUserData] = useState(null);
  const [coinHistory, setCoinHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [me, history] = await Promise.all([getMe(), getCoinHistory()]);
      setUserData(me);
      setCoinHistory(history);
    } catch (error) {
      console.error("Failed to load profile data", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to logout?")) {
      await logoutUser();
      window.location.href = "/";
    }
  };

  const handleGoogleSync = async () => {
    try {
      // Use popup consistently (preferred for modern mobile/desktop apps)
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
      await loginWithGoogle(idToken);
      fetchData();
    } catch (err) {
      console.error("Google sync failed:", err);
      // Show alert on mobile for better debugging
      alert("Login failed: " + (err.message || "Unknown error"));
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-pulse">
        <div className="w-20 h-20 bg-white/20 rounded-3xl mb-4" />
        <div className="h-4 w-32 bg-white/20 rounded-full mb-2" />
        <div className="h-3 w-48 bg-white/20 rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 animate-slide-up max-w-2xl mx-auto">
      {/* Profile Header Card */}
      <div className="bg-white rounded-[32px] p-8 shadow-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-40 h-40 bg-purple-50 rounded-full -mr-20 -mt-20 group-hover:scale-110 transition-transform duration-700 opacity-60" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-50/30 rounded-full -ml-12 -mb-12 opacity-50" />

        <div className="flex flex-col items-center relative z-10 text-center">
          <div className="relative mb-4">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-[32px] bg-gradient-to-br from-purple-100 via-white to-blue-50 p-1.5 border-2 border-white shadow-xl overflow-hidden flex items-center justify-center transform group-hover:rotate-3 transition-transform duration-500">
              {userData?.avatar ? (
                <img
                  src={userData.avatar}
                  alt="Avatar"
                  className="w-full h-full object-cover rounded-[26px]"
                />
              ) : (
                <User className="w-12 h-12 text-purple-300" />
              )}
            </div>
            {!userData?.isGuest && (
              <div className="absolute -bottom-2 -right-2 bg-white p-1 rounded-xl shadow-lg border border-green-50 animate-bounce-suble">
                <ShieldCheck className="w-6 h-6 text-green-500 fill-green-50" />
              </div>
            )}
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black text-[#1e1a3d] tracking-tight">
              {userData?.name || "Guest Player"}
            </h1>

            <div className="flex items-center justify-center gap-3 pt-2">
              {userData?.isGuest ? (
                <span className="bg-white/50 backdrop-blur-sm text-slate-400 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.15em] border border-gray-100 shadow-sm transition-all hover:bg-white hover:text-slate-500">
                  Guest Participant
                </span>
              ) : (
                <div className="flex items-center gap-2.5 bg-gradient-to-r from-green-50 to-emerald-50 backdrop-blur-md px-4 py-1.5 rounded-full border border-green-100/50 shadow-sm group/badge hover:scale-105 transition-transform duration-300 cursor-default">
                  <div className="relative flex items-center justify-center">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    <span className="absolute w-1.5 h-1.5 bg-green-400 rounded-full animate-ping opacity-60" />
                  </div>
                  <span className="text-[10px] font-black text-green-700 uppercase tracking-[0.2em]">
                    Verified Pro
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 gap-4">
        <div className="bg-gradient-to-br from-[#4e44e7] to-[#6a5ae0] rounded-[32px] p-6 shadow-xl shadow-indigo-100/30 flex items-center justify-between text-white group cursor-default relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700" />

          <div className="space-y-1 relative z-10">
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-indigo-100/80">
              Total Balance
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black tracking-tight">
                {userData?.coins || 0}
              </span>
              <span className="text-sm font-black text-indigo-200 uppercase tracking-widest">
                Coins
              </span>
            </div>
          </div>

          <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/10 group-hover:rotate-12 transition-all duration-500 relative z-10 shadow-inner">
            <Coins className="w-8 h-8 text-white drop-shadow-lg" />
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-sm font-black text-white/90 uppercase tracking-[0.15em] flex items-center gap-2">
            <History className="w-4 h-4" />
            Recent History
          </h2>
        </div>

        <div className="bg-white rounded-[32px] p-2 shadow-xl">
          <div className="max-h-[300px] overflow-y-auto no-scrollbar space-y-1 p-1">
            {coinHistory.length === 0 ? (
              <div className="py-12 text-center">
                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Trophy className="w-6 h-6 text-gray-200" />
                </div>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-wider px-6">
                  No transactions recorded yet.
                  <br />
                  Start playing to earn coins!
                </p>
              </div>
            ) : (
              coinHistory.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 group"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        item.type === "earn"
                          ? "bg-green-50 text-green-500"
                          : "bg-red-50 text-red-400"
                      }`}
                    >
                      {item.type === "earn" ? (
                        <Trophy className="w-5 h-5" />
                      ) : (
                        <Activity className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <p className="text-[14px] font-black text-[#1e1a3d] leading-none mb-1 capitalize">
                        {item.category}
                      </p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                        {new Date(item.date).toLocaleDateString([], {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`text-sm font-black py-1 px-3 rounded-lg shadow-sm ${
                      item.type === "earn"
                        ? "text-green-600 bg-white border border-green-50"
                        : "text-red-500 bg-white border border-red-50"
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
      </div>

      {/* Account Actions */}
      <div className="space-y-4">
        {userData?.isGuest && (
          <button
            onClick={handleGoogleSync}
            className="w-full bg-white border border-gray-200 text-gray-700 py-4 px-4 rounded-2xl font-black text-sm flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:bg-gray-50 transition-all active:scale-95 group"
          >
            <div className="w-6 h-6 flex-shrink-0">
              <svg viewBox="0 0 24 24" className="w-full h-full">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            </div>
            <span className="group-hover:text-blue-600 transition-colors uppercase tracking-widest text-xs">
              Continue with Google
            </span>
          </button>
        )}
      </div>

      <div className="text-center">
        <p className="text-[10px] text-white/40 font-black uppercase tracking-widest flex items-center justify-center gap-1.5 pt-4">
          Powered by QuizNova v1.0
        </p>
      </div>
    </div>
  );
}
