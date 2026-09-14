import React, { useState, useEffect } from 'react';
import { PlusCircle, Info, ShieldCheck, Car, X } from 'lucide-react';
import { Ride } from '../types';
import { rideService } from '../services/rideService';
import { RideCard } from '../components/rides/RideCard';
import { useAuth } from '../context/AuthContext';

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
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const [form, setForm] = useState({
    from_location: '', to_location: '', date: '', departure_time: '',
    price: '', total_seats: '1', vehicle_info: '', notes: '',
  });

  useEffect(() => { rideService.getRides().then(setRides); }, []);

  const updateForm = (field: keyof typeof form, value: string) => {
    setForm(current => ({ ...current, [field]: value }));
  };

  const handleCreateRide = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) return;
    setIsSubmitting(true);
    try {
      const ride = await rideService.createRide({
        driver_id: Number(user.id),
        from_location: form.from_location,
        to_location: form.to_location,
        date: form.date,
        departure_time: form.departure_time,
        price: Number(form.price),
        total_seats: Number(form.total_seats),
        vehicle_info: form.vehicle_info,
        notes: form.notes || undefined,
      });
      setRides(current => [ride, ...current]);
      setShowOfferForm(false);
      setForm({ from_location: '', to_location: '', date: '', departure_time: '', price: '', total_seats: '1', vehicle_info: '', notes: '' });
      setNotice('Your carpool ride is live. Other students can now request a seat.');
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not create the ride.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleJoinRide = async (ride: Ride) => {
    if (!user) return;
    try {
      await rideService.requestRide(ride.id, user.id);
      setRides(current => current.map(item => item.id === ride.id ? { ...item, availableSeats: item.availableSeats - 1 } : item));
      setNotice(`${ride.driverName} has been notified of your request. Please wait for their confirmation.`);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not request this ride.');
    }
  };

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
              onClick={() => setShowOfferForm(current => !current)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-emerald-900 font-bold text-xs hover:bg-emerald-50 transition-colors shadow"
            >
              <PlusCircle className="w-4 h-4 text-emerald-600" />
              <span>Offer Ride</span>
            </button>
          </div>
        </div>
        <div className="absolute right-0 bottom-0 translate-x-8 translate-y-8 w-60 h-60 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />
      </div>

      {showOfferForm && (
        <form onSubmit={handleCreateRide} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800 shadow-sm space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Offer a carpool ride</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Add the trip details students need before requesting a seat.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {([
              ['from_location', 'Pickup location', 'text'],
              ['to_location', 'Drop-off location', 'text'],
              ['date', 'Travel date', 'date'],
              ['departure_time', 'Departure time', 'time'],
              ['price', 'Price per seat (₹)', 'number'],
              ['total_seats', 'Available seats', 'number'],
              ['vehicle_info', 'Vehicle details', 'text'],
            ] as const).map(([field, label, type]) => (
              <label key={field} className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {label}
                <input
                  required
                  type={type}
                  min={type === 'number' ? 1 : undefined}
                  value={form[field]}
                  onChange={event => updateForm(field, event.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm font-normal text-slate-900 dark:text-white outline-none focus:border-emerald-500"
                />
              </label>
            ))}
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 sm:col-span-2">
              Notes (optional)
              <textarea value={form.notes} onChange={event => updateForm('notes', event.target.value)} rows={2} className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm font-normal text-slate-900 dark:text-white outline-none focus:border-emerald-500" />
            </label>
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setShowOfferForm(false)} className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300">Cancel</button>
            <button disabled={isSubmitting} type="submit" className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold disabled:opacity-50">{isSubmitting ? 'Posting...' : 'Post ride'}</button>
          </div>
        </form>
      )}

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
              onJoinClick={handleJoinRide}
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
