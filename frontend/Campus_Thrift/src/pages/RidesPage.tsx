import React, { useState, useEffect } from 'react';
import { PlusCircle, Info, ShieldCheck, Car, X } from 'lucide-react';
import { Ride } from '../types';
import { rideService } from '../services/rideService';
import { RideCard } from '../components/rides/RideCard';

type FilterId = 'all' | 'city' | 'intercity';

const TABS: { id: FilterId; label: string }[] = [
  { id: 'all',       label: '🚗 All Carpools' },
  { id: 'city',      label: '🏙️ City Trips' },
  { id: 'intercity', label: '🛣️ Intercity / Outstation' },
];

export const RidesPage: React.FC = () => {
  const [rides, setRides] = useState<Ride[]>([]);
  const [filter, setFilter] = useState<FilterId>('all');
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => { rideService.getRides().then(setRides); }, []);

  const filtered = rides.filter(r => {
    if (filter === 'all') return true;
    const dest = r.to.toLowerCase();
    const isIntercity =
      dest.includes('bus stand') ||
      dest.includes('bus terminus') ||
      dest.includes('outstation') ||
      r.price >= 100;
    return filter === 'intercity' ? isIntercity : !isIntercity;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-700 via-emerald-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400/20 border border-amber-300/30 rounded-full text-xs font-bold text-amber-200 uppercase tracking-wide">
            <Car className="w-3.5 h-3.5 text-amber-300" />
            <span>Student Carpool Board</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Campus Rides — Carpool &amp; Share Cab
          </h1>
          <p className="text-sm sm:text-base text-teal-100 leading-relaxed">
            Share rides with fellow students to save on fuel &amp; reduce your carbon footprint. Browse available carpools, or offer your own ride to help others commute safely and affordably.
          </p>

          <div className="pt-3">
            <button
              type="button"
              onClick={() =>
                setNotice('Ride posting feature will be available soon! Meanwhile, you can message drivers directly to join their rides.')
              }
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-emerald-900 font-bold text-xs hover:bg-emerald-50 transition-colors shadow"
            >
              <PlusCircle className="w-4 h-4 text-emerald-600" />
              <span>Offer Ride</span>
            </button>
          </div>
        </div>
        <div className="absolute right-0 bottom-0 translate-x-8 translate-y-8 w-60 h-60 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />
      </div>

      {/* Notice */}
      {notice && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 flex items-start justify-between gap-3 text-xs text-emerald-900 dark:text-emerald-200 animate-fadeIn">
          <div className="flex items-start gap-2.5">
            <Info className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">{notice}</p>
          </div>
          <button
            type="button"
            onClick={() => setNotice(null)}
            className="p-1 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900 rounded-lg shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {TABS.map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setFilter(tab.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              filter === tab.id
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Cards */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center text-slate-400 text-sm">
          No carpools found for this filter. More rides will be added soon!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(ride => (
            <RideCard
              key={ride.id}
              ride={ride}
              onJoinClick={r =>
                setNotice(
                  `${r.driverName} has been notified of your interest to join this ride. Please wait for their confirmation.`,
                )
              }
            />
          ))}
        </div>
      )}

      {/* Safety */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Carpool Safety Tips</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600 dark:text-slate-400">
          <div>
            <strong className="block text-slate-800 dark:text-slate-200">Verified Students Only</strong>
            CampusThrift allows only verified batchmates to post or join rides. Check driver profile &amp; reviews before confirming.
          </div>
          <div>
            <strong className="block text-slate-800 dark:text-slate-200">Meet at the Campus Gate</strong>
            always meet at campus gates or public areas. Avoid sharing your home address or meeting in secluded locations.
          </div>
          <div>
            <strong className="block text-slate-800 dark:text-slate-200">Fuel Split Only</strong>
            Shown amounts are for fuel cost sharing only. Avoid paying extra for tolls, parking, or other fees. Always confirm the final price before boarding.
          </div>
        </div>
      </div>
    </div>
  );
};
