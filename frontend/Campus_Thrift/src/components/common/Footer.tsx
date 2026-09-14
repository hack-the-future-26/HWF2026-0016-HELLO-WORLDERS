import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors pb-20 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-3">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-sm">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-slate-900 dark:text-white">
                Campus-Thrift
              </span>
            </Link>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
              The student-focused campus marketplace for verified students. Buy, sell, and reuse textbooks, electronics, dorm essentials, and campus transit.
            </p>
            <div className="inline-flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-md border border-emerald-200 dark:border-emerald-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Built exclusively for university campus communities</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Explore
            </h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <Link to="/" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Marketplace
                </Link>
              </li>
              <li>
                <Link to="/rides" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Campus Rides (Demo)
                </Link>
              </li>
              <li>
                <Link to="/sell" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Sell a Product
                </Link>
              </li>
              <li>
                <Link to="/chat" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Student Messages
                </Link>
              </li>
            </ul>
          </div>

          {/* Safety & Demo */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Safety & Demo
            </h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <span className="text-slate-500">Student Union Safe Zone</span>
              </li>
              <li>
                <span className="text-slate-500">Daylight Exchange Recommended</span>
              </li>
              <li>
                <Link to="/auth" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Switch Demo Account
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <p>© {new Date().getFullYear()} Campus-Thrift. All rights reserved.</p>
          <p className="flex items-center gap-1 text-center">
            College Hackathon Frontend Prototype — Ready for backend API integration
          </p>
        </div>
      </div>
    </footer>
  );
};
