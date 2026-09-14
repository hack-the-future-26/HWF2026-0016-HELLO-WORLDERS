import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  ShoppingBag, 
  Car, 
  PlusCircle, 
  MessageSquare, 
  Bell, 
  User as UserIcon, 
  LogIn, 
  LogOut, 
  ChevronDown,
  Sparkles,
  Bookmark
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSavedProducts } from '../../context/SavedProductsContext';
import { notificationService } from '../../services/notificationService';
import { ThemeToggle } from './ThemeToggle';

export const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { savedCount } = useSavedProducts();
  const [unreadNotifs, setUnreadNotifs] = useState<number>(0);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user) {
      notificationService.getUnreadCount(user.id).then(setUnreadNotifs);
    } else {
      setUnreadNotifs(0);
    }
  }, [user, location.pathname]);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-8">
          <Link 
            to="/" 
            className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-lg"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                Campus-Thrift
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  STUDENT
                </span>
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium -mt-1 hidden sm:block">
                Campus Marketplace
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                location.pathname === '/'
                  ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Marketplace
            </Link>

            <Link
              to="/rides"
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                location.pathname === '/rides'
                  ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Car className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Campus Rides</span>
              <span className="text-[10px] px-1 py-0.2 rounded font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                Demo
              </span>
            </Link>

            <Link
              to="/sell"
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                location.pathname === '/sell'
                  ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <PlusCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Sell Item</span>
            </Link>
          </nav>
        </div>

        {/* Right: Actions, Theme, Auth */}
        <div className="flex items-center gap-2.5">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Saved Items Counter (if any) */}
          {savedCount > 0 && (
            <Link
              to="/profile"
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg relative transition-colors hidden sm:flex"
              title={`${savedCount} saved items`}
            >
              <Bookmark className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center">
                {savedCount}
              </span>
            </Link>
          )}

          {isAuthenticated && user ? (
            <>
              {/* Notifications */}
              <Link
                to="/notifications"
                className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg relative transition-colors"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifs > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
                )}
              </Link>

              {/* Chat */}
              <Link
                to="/chat"
                className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg relative transition-colors"
                title="Campus-Thrift Chat"
              >
                <MessageSquare className="w-5 h-5" />
              </Link>

              {/* User Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none"
                  aria-expanded={userMenuOpen}
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-lg object-cover ring-1 ring-emerald-500"
                  />
                  <span className="text-sm font-medium text-slate-900 dark:text-white hidden lg:inline">
                    {user.name}
                  </span>
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                </button>

                {userMenuOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl py-2 z-50 animate-fadeIn"
                    onMouseLeave={() => setUserMenuOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-xs text-slate-500 dark:text-slate-400">Signed in as</p>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                        {user.name}
                      </p>
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5">
                        <Sparkles className="w-3 h-3" />
                        {user.dorm}
                      </span>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <UserIcon className="w-4 h-4" />
                      <span>Student Profile</span>
                    </Link>

                    <Link
                      to="/my-listings"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>My Listings</span>
                    </Link>

                    <Link
                      to="/auth"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span>Switch Demo Student</span>
                    </Link>

                    <div className="border-t border-slate-100 dark:border-slate-800 my-1" />

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Link
              to="/auth"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors"
            >
              <LogIn className="w-4 h-4" />
              <span>Student Sign In</span>
            </Link>
          )}
        </div>

      </div>
    </header>
  );
};
