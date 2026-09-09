import React from 'react';
import { Clock, Calendar, Users, ShieldCheck, Car, Star } from 'lucide-react';
import { Ride } from '../../types';

interface RideCardProps {
  ride: Ride;
  onJoinClick: (ride: Ride) => void;
}

export const RideCard: React.FC<RideCardProps> = ({ ride, onJoinClick }) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4 hover:border-emerald-400 dark:hover:border-emerald-600 transition-colors">
      {/* Route */}
      <div className="space-y-2">
        <div className="flex items-start gap-2 text-xs">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-1 shrink-0" />
          <div className="min-w-0">
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Pickup</span>
            <p className="font-semibold text-slate-900 dark:text-white truncate">{ride.from}</p>
          </div>
        </div>
        <div className="flex items-start gap-2 text-xs">
          <div className="w-2.5 h-2.5 rounded-full bg-teal-600 mt-1 shrink-0" />
          <div className="min-w-0">
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Drop-off</span>
            <p className="font-semibold text-slate-900 dark:text-white truncate">{ride.to}</p>
          </div>
        </div>
      </div>

      {/* Date & Time */}
      <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-600 dark:text-slate-300">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-emerald-600" />
          <span className="truncate">{ride.date}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-emerald-600" />
          <span>{ride.departureTime}</span>
        </div>
      </div>

      {/* Vehicle & notes */}
      <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
        <div className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
          <Car className="w-3.5 h-3.5 text-slate-400" />
          <span className="truncate">{ride.vehicleInfo}</span>
        </div>
        {ride.notes && <p className="italic text-[11px] line-clamp-2">"{ride.notes}"</p>}
      </div>

      {/* Driver + action */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <img
            src={ride.driverAvatar}
            alt={ride.driverName}
            className="w-8 h-8 rounded-full object-cover ring-1 ring-emerald-500"
          />
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-900 dark:text-white truncate flex items-center gap-1">
              {ride.driverName}
              {ride.driverVerified && (
                <ShieldCheck className="w-3 h-3 text-emerald-600 inline shrink-0" />
              )}
            </p>
            <div className="flex items-center gap-1 text-[11px]">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {ride.driverRating.toFixed(1)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-base font-bold text-slate-900 dark:text-white">
              ₹{ride.price}
            </span>
            <div className="flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400 justify-end">
              <Users className="w-3 h-3 text-emerald-600" />
              <span>{ride.availableSeats}/{ride.totalSeats} seats</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onJoinClick(ride)}
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-colors shrink-0"
          >
            Join Ride
          </button>
        </div>
      </div>
    </div>
  );
};
