import React, { useState, useEffect } from 'react';
import { PlusCircle, Info, ShieldCheck, Sparkles, X, Car } from 'lucide-react';
import { Ride } from '../types';
import { rideService } from '../services/rideService';
import { RideCard } from '../components/rides/RideCard';

type FilterType = 'all' | 'home' | 'airport' | 'intercity';

export const RidesPage: React.FC = () => {
  const [rides, setRides] = useState<Ride[]>([]);
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [infoNotice, setInfoNotice] = useState<string | null>(null);

  useEffect(() => {
    rideService.getRides().then(setRides);
  }, []);

  const filteredRides = rides.filter((r) => {
    const dest = r.to.toLowerCase();
    if (filterType === 'home') {
      // Trips to railway stations (going home)
      return (
        dest.includes('station') ||
        dest.includes('junction') ||
        dest.includes('railway') ||
        dest.includes('bus') ||
        dest.includes('terminus') ||
        dest.includes('bus stand')
      );
    }
    if (filterType === 'airport') {
      return dest.includes('airport') || dest.includes('terminal');
    }
    if (filterType === 'intercity') {
      // Everything that is not a campus→station/airport hop
      return (
        !dest.includes('station') &&
        !dest.includes('junction') &&
        !dest.includes('railway') &&
        !dest.includes('bus') &&
        !dest.includes('airport') &&
        !dest.includes('terminal')
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-700 via-emerald-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400/20 border border-amber-300/30 backdrop-blur-md rounded-full text-xs font-bold text-amber-200 uppercase tracking-wide">
            <Car className="w-3.5 h-3.5 text-amber-300" />
            <span>Student Carpool Board</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Campus Rides — Student Carpool
          </h1>
          <p className="text-sm sm:text-base text-teal-100 leading-relaxed">
            Share a cab or car with verified campus batchmates. Split fuel costs and travel safely together during semester breaks, weekends, and exam seasons.
          </p>

          <div className="pt-3 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() =>
                setInfoNotice(
                  'Carpool posting is coming soon! Once live, you will be able to post your own trips for batchmates to join.',
                )
              }
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-emerald-900 font-bold text-xs hover:bg-emerald-50 transition-colors shadow"
            >
              <PlusCircle className="w-4 h-4 text-emerald-600" />
              <span>Offer a Carpool Ride</span>
            </button>
          </div>
        </div>

        <div className="absolute right-0 bottom-0 translate-x-8 translate-y-8 w-60 h-60 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />
      </div>

      {/* Dismissible notice */}
      {infoNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 flex items-start justify-between gap-3 text-xs text-emerald-900 dark:text-emerald-200 animate-fadeIn">
          <div className="flex items-start gap-2.5">
            <Info className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">{infoNotice}</p>
          </div>
          <button
            type="button"
            onClick={() => setInfoNotice(null)}
            className="p-1 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900 rounded-lg shrink-0"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'all' as FilterType,       label: '🚗 All Carpools' },
          { id: 'home' as FilterType,      label: '🏠 Going Home (Station / Bus)' },
          { id: 'airport' as FilterType,   label: '✈️ Airport Drops' },
          { id: 'intercity' as FilterType, label: '🛣️ Intercity / Other' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setFilterType(tab.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              filterType === tab.id
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Ride Cards */}
      {filteredRides.length === 0 ? (
        <div className="py-16 text-center text-slate-400 dark:text-slate-500 text-sm">
          No carpools found for this filter. Check back soon or post your own!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredRides.map((ride) => (
            <RideCard
              key={ride.id}
              ride={ride}
              onJoinClick={(r) =>
                setInfoNotice(
                  `Ride to "${r.to}" by ${r.driverName} — Contact via Campus-Thrift chat to confirm your seat. Prices shown are per-head fuel/toll split only.`,
                )
              }
            />
          ))}
        </div>
      )}

      {/* Safety Tips */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Campus Carpool Safety Tips</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600 dark:text-slate-400">
          <div>
            <strong className="block text-slate-800 dark:text-slate-200">Only Verified Students</strong>
            Only share rides with students who have a verified .edu college ID on Campus-Thrift.
          </div>
          <div>
            <strong className="block text-slate-800 dark:text-slate-200">Meet at Campus Gate</strong>
            Always board from the official campus main gate or a well-lit, public departure point.
          </div>
          <div>
            <strong className="block text-slate-800 dark:text-slate-200">Fuel Split Only</strong>
            Price is a fair share of petrol, toll, and cab booking cost — not a commercial fare.
          </div>
        </div>
      </div>
    </div>
  );
};
