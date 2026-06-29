import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext.js";
import { Link, useNavigate } from "react-router-dom";
import { User, LogIn, Heart, LogOut, MapPin, Search, History, ShoppingCart, UserCheck, AlertCircle, KeyRound, Sparkles } from "lucide-react";

export const UserPortal: React.FC = () => {
  const {
    user,
    token,
    wishlist,
    products,
    searchHistory,
    clearSearchHistory,
    login,
    logout,
    updateProfile,
    addToast
  } = useApp();

  const navigate = useNavigate();

  // Auth screen toggle: "login" | "register" | "forgot"
  const [authView, setAuthView] = useState<"login" | "register" | "forgot">("login");
  
  // Login states
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  
  // Register states
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");

  // Forgot Password state
  const [forgotEmail, setForgotEmail] = useState("");

  // Profile Edit states
  const [editName, setEditName] = useState("");
  const [editAddress, setEditAddress] = useState("");

  // Purchase requests historical log (user-specific)
  const [purchaseHistory, setPurchaseHistory] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Sync profile details on load
  useEffect(() => {
    if (user) {
      setEditName(user.name);
      setEditAddress(user.savedAddress || "");
      
      // Load their WhatsApp purchase logs if they are admin or just query all logs and filter
      if (token) {
        setHistoryLoading(true);
        fetch("/api/purchase-requests", {
          headers: { Authorization: `Bearer ${token}` }
        })
          .then(res => {
            if (res.ok) return res.json();
            return [];
          })
          .then(data => {
            // Filter logs triggered by this user's email
            const userLogs = data.filter((item: any) => item.userEmail.toLowerCase() === user.email.toLowerCase());
            setPurchaseHistory(userLogs);
          })
          .catch(err => console.error(err))
          .finally(() => setHistoryLoading(false));
      }
    }
  }, [user, token]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) return;

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });

      if (res.ok) {
        const data = await res.json();
        login(data.user, data.token);
      } else {
        const err = await res.json();
        addToast(err.error || "Login failed. Verify your email and password.", "error");
      }
    } catch (err) {
      addToast("Server connection error during login.", "error");
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regEmail || !regPassword) return;

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: regName, email: regEmail, password: regPassword })
      });

      if (res.ok) {
        const data = await res.json();
        login(data.user, data.token);
      } else {
        const err = await res.json();
        addToast(err.error || "Registration failed.", "error");
      }
    } catch (err) {
      addToast("Server connection error during registration.", "error");
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    addToast(`A password reset link has been dispatched to: ${forgotEmail}`, "success");
    setForgotEmail("");
    setAuthView("login");
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile({ name: editName, savedAddress: editAddress });
      addToast("Profile credentials updated successfully!", "success");
    } catch (err) {
      // Toast already raised in context
    }
  };

  // Grab wishlist product items from the list of all products
  const wishlistItems = products.filter((p) => wishlist.includes(p.id) && p.status === "published");

  return (
    <div id="user-portal-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {user ? (
        /* ================= AUTHENTICATED STATE ================= */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 sm:gap-16 items-start">
          
          {/* L1: Profile Information & Settings card */}
          <div className="space-y-8">
            
            <div className="glass-card border border-stone-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl backdrop-blur-xl">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-amber-100 border border-amber-200 text-amber-800 flex items-center justify-center font-bold text-lg shrink-0 shadow-inner">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="space-y-0.5 animate-fade-in">
                  <h2 className="font-serif text-lg font-bold text-stone-900">{user.name}</h2>
                  <span className="text-stone-500 text-xs truncate block max-w-[180px]">{user.email}</span>
                  {user.isAdmin && (
                    <span className="inline-block mt-1 text-[9px] uppercase font-bold tracking-widest bg-amber-800 text-white px-2 py-0.5 rounded">
                      Administrator
                    </span>
                  )}
                </div>
              </div>

              <hr className="border-stone-100" />

              {/* Edit Form */}
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <label className="text-[10px] uppercase font-bold text-stone-600 block mb-1">Display Name</label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full bg-white border border-stone-200 px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium text-stone-900"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-stone-600 block mb-1">Saved Address (for custom shipping)</label>
                  <textarea
                    rows={3}
                    placeholder="Enter your shipping address"
                    value={editAddress}
                    onChange={(e) => setEditAddress(e.target.value)}
                    className="w-full bg-white border border-stone-200 px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium text-stone-900 leading-relaxed placeholder-stone-400"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-amber-800 hover:bg-amber-950 text-white font-bold text-xs rounded-xl transition-colors shadow-md"
                >
                  Save Profile Settings
                </button>
              </form>

              <hr className="border-stone-100" />

              <button
                onClick={logout}
                className="w-full py-2.5 bg-transparent border border-stone-200 text-stone-700 hover:text-stone-900 hover:bg-stone-50 font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-600" />
                <span>Log Out Session</span>
              </button>
            </div>

            {/* Recent Searches Widget */}
            <div className="glass-card border border-stone-200 rounded-3xl p-6 space-y-4 shadow-xl backdrop-blur-xl">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5 text-xs uppercase font-bold text-stone-600 tracking-wider">
                  <History className="w-4 h-4 text-stone-500" />
                  <span>Recent Searches</span>
                </div>
                {searchHistory.length > 0 && (
                  <button onClick={clearSearchHistory} className="text-[10px] font-bold text-stone-500 hover:text-amber-800">
                    Clear
                  </button>
                )}
              </div>

              {searchHistory.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {searchHistory.map((q, idx) => (
                    <Link
                      key={idx}
                      to={`/shop?search=${encodeURIComponent(q)}`}
                      className="bg-stone-50 hover:bg-amber-50 border border-stone-200 hover:border-amber-200 text-stone-700 hover:text-amber-800 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 transition-all"
                    >
                      <span>{q}</span>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-stone-500 text-xs italic">No search history recorded.</p>
              )}
            </div>

          </div>

          {/* R2: Wishlist and Purchase Requests List */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* L2: Wishlist */}
            <div className="space-y-6">
              <div className="flex justify-between items-baseline border-b border-stone-200 pb-3">
                <h3 className="font-serif text-2xl font-bold text-stone-900 flex items-center gap-2">
                  <Heart className="w-6 h-6 text-rose-600 fill-current animate-pulse" />
                  <span>Your Saved Favorites ({wishlistItems.length})</span>
                </h3>
                <Link to="/shop" className="text-xs font-bold text-amber-800 hover:text-amber-950 uppercase tracking-wider">
                  Browse Shop
                </Link>
              </div>

              {wishlistItems.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {wishlistItems.map((p) => (
                    <div key={p.id} className="p-4 glass-card border border-stone-200 rounded-2xl flex gap-4 hover:border-stone-300 transition-all relative">
                      <div className="w-20 h-20 bg-stone-50 border border-stone-100 rounded-xl overflow-hidden shrink-0">
                        <img src={p.primaryImage} alt={p.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div>
                          <h4 className="font-serif font-bold text-sm text-stone-900 hover:text-amber-800 transition-colors">
                            <Link to={`/product/${p.id}`}>{p.name}</Link>
                          </h4>
                          <span className="text-[10px] text-stone-500 block font-mono">{p.category}</span>
                        </div>
                        <div className="flex justify-between items-baseline mt-2">
                          <span className="font-sans font-bold text-xs text-stone-900">
                            ₹{(p.discountPrice || p.price).toLocaleString()}
                          </span>
                          <Link to={`/product/${p.id}`} className="text-[10px] font-bold text-amber-800 hover:text-amber-950 flex items-center gap-1 uppercase tracking-wider">
                            <span>Details</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 bg-stone-50 border border-stone-200 rounded-2xl text-center text-stone-500 text-xs italic">
                  Your wishlist is empty. Tap the heart icons on product cards to populate this screen!
                </div>
              )}
            </div>

            {/* L3: Purchase Requests List (User specific) */}
            <div className="space-y-6">
              <div className="border-b border-stone-200 pb-3">
                <h3 className="font-serif text-2xl font-bold text-stone-900 flex items-center gap-2">
                  <ShoppingCart className="w-6 h-6 text-amber-800 animate-pulse" />
                  <span>Your Order Requests ({purchaseHistory.length})</span>
                </h3>
              </div>

              {historyLoading ? (
                <div className="text-center py-4 text-xs text-stone-500">Syncing order requests...</div>
              ) : purchaseHistory.length > 0 ? (
                <div className="space-y-4">
                  {purchaseHistory.map((req) => (
                    <div key={req.id} className="p-5 glass-card border border-stone-200 rounded-2xl space-y-3 shadow-lg">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-mono text-[10px] text-stone-500">Order ID: #{req.id}</span>
                        <span className="text-stone-500 font-semibold">{new Date(req.clickedAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between items-baseline">
                        <h4 className="font-serif font-bold text-sm text-stone-900">
                          <Link to={`/product/${req.productId}`} className="hover:text-amber-800 transition-colors">{req.productName}</Link>
                        </h4>
                        <span className="font-sans font-bold text-xs text-amber-800">₹{req.productPrice.toLocaleString()}</span>
                      </div>
                      <p className="text-[11px] text-stone-700 bg-stone-50 p-2.5 rounded-lg border border-stone-200/60 leading-relaxed max-h-16 overflow-y-auto font-mono">
                        {req.whatsAppMessage}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 bg-stone-50 border border-stone-200 rounded-2xl text-center text-stone-500 text-xs italic">
                  No active WhatsApp purchase clicks recorded yet. Clicking "Buy on WhatsApp" on any product detail page will create a tracking log here.
                </div>
              )}
            </div>

          </div>

        </div>
      ) : (
        /* ================= UNAUTHENTICATED STATE ================= */
        <div className="max-w-md mx-auto glass-card border border-stone-200 rounded-3xl p-8 sm:p-10 shadow-2xl space-y-8 relative overflow-hidden backdrop-blur-xl">
          <div className="absolute top-0 left-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl"></div>
          
          {/* Header */}
          <div className="text-center space-y-2 relative z-10 animate-fade-in">
            <div className="w-12 h-12 rounded-full bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-800 mx-auto shadow-inner">
              <UserCheck className="w-6 h-6 animate-pulse" />
            </div>
            {authView === "login" && (
              <>
                <h2 className="font-serif text-2xl font-bold text-stone-900 tracking-tight">Artisan Patron Login</h2>
                <p className="text-stone-600 text-xs max-w-xs mx-auto">Sign in to track wishlists, record order requests, and configure customized profiles.</p>
              </>
            )}
            {authView === "register" && (
              <>
                <h2 className="font-serif text-2xl font-bold text-stone-900 tracking-tight">Create Member Account</h2>
                <p className="text-stone-600 text-xs max-w-xs mx-auto">Become a patron to save your interior wall measurements and favorite items.</p>
              </>
            )}
            {authView === "forgot" && (
              <>
                <h2 className="font-serif text-2xl font-bold text-stone-900 tracking-tight">Recover Credentials</h2>
                <p className="text-stone-600 text-xs max-w-xs mx-auto">Input your email address below, and we will dispatch a password recovery link.</p>
              </>
            )}
          </div>

          {/* Views switch */}
          {authView === "login" && (
            <form onSubmit={handleLoginSubmit} className="space-y-4 relative z-10">
              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-stone-600 block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full bg-white border border-stone-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 text-stone-900 placeholder-stone-400"
                />
              </div>

              <div>
                <div className="flex justify-between items-baseline mb-1">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-stone-600">Password</label>
                  <button
                    type="button"
                    onClick={() => setAuthView("forgot")}
                    className="text-[10px] font-bold text-amber-800 hover:text-amber-900 transition-colors"
                  >
                    Forgot?
                  </button>
                </div>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full bg-white border border-stone-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 text-stone-900 placeholder-stone-400"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-amber-800 hover:bg-amber-900 text-white font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In Securely</span>
              </button>

              <p className="text-center text-xs text-stone-600 pt-3">
                New patron?{" "}
                <button
                  type="button"
                  onClick={() => setAuthView("register")}
                  className="font-bold text-amber-800 hover:text-amber-900 underline decoration-dotted"
                >
                  Create an account
                </button>
              </p>
            </form>
          )}

          {authView === "register" && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4 relative z-10">
              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-stone-600 block mb-1">Display Name</label>
                <input
                  type="text"
                  required
                  placeholder="Enter your name"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="w-full bg-white border border-stone-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 text-stone-900 placeholder-stone-400"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-stone-600 block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full bg-white border border-stone-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 text-stone-900 placeholder-stone-400"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-stone-600 block mb-1">Password</label>
                <input
                  type="password"
                  required
                  placeholder="Minimum 6 characters"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="w-full bg-white border border-stone-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 text-stone-900 placeholder-stone-400"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-amber-800 hover:bg-amber-900 text-white font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span>Register Account</span>
              </button>

              <p className="text-center text-xs text-stone-600 pt-3">
                Already registered?{" "}
                <button
                  type="button"
                  onClick={() => setAuthView("login")}
                  className="font-bold text-amber-800 hover:text-amber-900 underline decoration-dotted"
                >
                  Login instead
                </button>
              </p>
            </form>
          )}

          {authView === "forgot" && (
            <form onSubmit={handleForgotSubmit} className="space-y-4 relative z-10">
              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-stone-600 block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full bg-white border border-stone-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 text-stone-900 placeholder-stone-400"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-amber-800 hover:bg-amber-900 text-white font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
              >
                <KeyRound className="w-4 h-4" />
                <span>Send Password Reset Link</span>
              </button>

              <p className="text-center text-xs text-stone-600 pt-3">
                Remembered?{" "}
                <button
                  type="button"
                  onClick={() => setAuthView("login")}
                  className="font-bold text-amber-800 hover:text-amber-900 underline decoration-dotted"
                >
                  Return to login
                </button>
              </p>
            </form>
          )}

          

        </div>
      )}

    </div>
  );
};
