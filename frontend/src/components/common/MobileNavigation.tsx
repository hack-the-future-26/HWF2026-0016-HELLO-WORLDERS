import React from 'react';
import { NavLink } from 'react-router-dom';
import { ShoppingBag, Car, PlusCircle, MessageSquare, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const MobileNavigation: React.FC = () => {
  const { isAuthenticated } = useAuth();

  const navItems = [
    { to: '/', label: 'Market', icon: <ShoppingBag className="w-5 h-5" /> },
    { to: '/rides', label: 'Rides', icon: <Car className="w-5 h-5" /> },
    { to: '/sell', label: 'Sell', icon: <PlusCircle className="w-5 h-5" />, primary: true },
    { to: '/chat', label: 'Chat', icon: <MessageSquare className="w-5 h-5" /> },
    { 
      to: isAuthenticated ? '/profile' : '/auth', 
      label: isAuthenticated ? 'Profile' : 'Sign In', 
      icon: <UserIcon className="w-5 h-5" /> 
    },
  ];

  return (
    <nav 
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-t border-slate-200 dark:border-slate-800 pb-safe transition-colors"
    >
      <div className="flex items-center justify-around h-16 px-2 max-w-md mx-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center flex-1 py-1 text-[11px] font-medium transition-colors ${
                item.primary
                  ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                  : isActive
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`p-1 rounded-lg ${item.primary ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300' : isActive ? 'bg-emerald-50 dark:bg-emerald-950/40' : ''}`}>
                  {item.icon}
                </div>
                <span className="mt-0.5">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
