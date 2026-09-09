import React from 'react';
import { ShieldCheck, Clock, MapPin, GraduationCap, Calendar } from 'lucide-react';
import { User } from '../../types';
import { Rating } from '../common/Rating';

interface SellerCardProps {
  seller: User;
}

export const SellerCard: React.FC<SellerCardProps> = ({ seller }) => {
  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <img
            src={seller.avatar}
            alt={seller.name}
            className="w-14 h-14 rounded-2xl object-cover ring-2 ring-emerald-500/30"
          />
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              {seller.name}
              {seller.verifiedStudent && (
                <span title="Verified Student with .edu email">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 inline" />
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
              {seller.department} • {seller.graduationYear}
            </p>
          </div>
        </div>

        <Rating rating={seller.rating} reviewCount={seller.reviewCount} size="sm" />
      </div>

      {seller.bio && (
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl">
          "{seller.bio}"
        </p>
      )}

      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
        <div className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-emerald-600" />
          <span className="truncate">{seller.dorm}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-emerald-600" />
          <span>Replies: {seller.responseTime}</span>
        </div>
        <div className="flex items-center gap-1.5 col-span-2 text-[11px] text-slate-400">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>Campus-Thrift member since {seller.joinedDate}</span>
        </div>
      </div>
    </div>
  );
};
