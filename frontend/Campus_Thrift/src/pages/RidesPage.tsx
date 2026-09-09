import React, { useState, useEffect } from 'react';
import { PlusCircle, Info, ShieldCheck, Sparkles, X } from 'lucide-react';
import { Ride } from '../types';
import { rideService } from '../services/rideService';
import { RideCard } from '../components/rides/RideCard';

export const RidesPage: React.FC = () => {
  const [rides, setRides] = useState<Ride[]>([]);
  const [filterType, setFilterType] = useState<string>('all');
  const [infoNotice, setInfoNotice] = useState<string | null>(null);

  useEffect(() => {
    rideService.getRides().then(setRides);
  }, []);

  const filteredRides = rides.filter((r) => {
    if (filterType === 'airport') return r.to.toLowerCase().includes('airport');
    if (filterType === 'shopping') return r.to.toLowerCase().includes('costco') || r.to.toLowerCase().includes('mall') || r.to.toLowerCase().includes('ikea');
    if (filterType === 'transit') return r.to.toLowerCase().includes('amtrak') || r.to.toLowerCase().includes('station');
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-700 via-emerald-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400/20 border border-amber-300/30 backdrop-blur-md rounded-full text-xs font-bold text-amber-200 uppercase tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Static Prototype Demo</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Campus-Thrift Carpool & Rides
          </h1>
          <p className="text-sm sm:text-base text-teal-100 leading-relaxed">
            Split gas, reduce campus parking congestion, and ride together to airports, train stations, and grocery centers with verified classmates.
          </p>

          <div className="pt-3 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setInfoNotice("Campus Rides Prototype Demo: Ride scheduling is informational only. Carpool posting will be connected once backend teammates build the service.")}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-emerald-900 font-bold text-xs hover:bg-emerald-50 transition-colors shadow"
            >
              <PlusCircle className="w-4 h-4 text-emerald-600" />
              <span>Offer a Campus Ride</span>
            </button>
          </div>
        </div>

        <div className="absolute right-0 bottom-0 translate-x-8 translate-y-8 w-60 h-60 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />
      </div>

      {/* Dismissible Demo Action Notice */}
      {infoNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 flex items-start justify-between gap-3 text-xs text-emerald-900 dark:text-emerald-200 animate-fadeIn">
          <div className="flex items-start gap-2.5">
            <Info className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Static Demo Notice:</strong> {infoNotice}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setInfoNotice(null)}
            className="p-1 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900 rounded-lg shrink-0"
            aria-label="Dismiss notice"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Demo Advisory Disclaimer */}
      <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 flex items-start gap-3 text-xs text-amber-900 dark:text-amber-200">
        <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="font-semibold text-amber-950 dark:text-amber-100">
            Informational Prototype Feature:
          </p>
          <p className="text-amber-800 dark:text-amber-300 leading-relaxed">
            Campus Rides is a mock demonstration of how students can share trips for break travel and shopping. No real ride booking, seat reservation, or payment processing is executed.
          </p>
        </div>
      </div>

      {/* Route Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'all', label: 'All Campus Carpools' },
          { id: 'airport', label: '✈️ Airport Shuttles' },
          { id: 'shopping', label: '🛒 Grocery & Store Runs' },
          { id: 'transit', label: '🚆 Train & Transit Stations' },
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

      {/* Ride Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredRides.map((ride) => (
          <RideCard
            key={ride.id}
            ride={ride}
            onJoinClick={(r) =>
              setInfoNotice(
                `Demo Preview: Ride to "${r.to}" by ${r.driverName} is static sample data. No seats are booked or decremented.`
              )
            }
          />
        ))}
      </div>

      {/* Campus Safety Tips for Carpools */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Campus Carpool Safety Standards</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600 dark:text-slate-400">
          <div>
            <strong className="block text-slate-800 dark:text-slate-200">Verified Campus Drivers</strong>
            All drivers show student verification and graduation year for transparent rides.
          </div>
          <div>
            <strong className="block text-slate-800 dark:text-slate-200">Public Campus Pickup</strong>
            Meet in well-lit designated campus pickup points like the Student Union circle drive.
          </div>
          <div>
            <strong className="block text-slate-800 dark:text-slate-200">Shared Fuel Splits</strong>
            Cost is limited to reasonable fuel and toll contributions only.
          </div>
        </div>
      </div>
    </div>
  );
};
