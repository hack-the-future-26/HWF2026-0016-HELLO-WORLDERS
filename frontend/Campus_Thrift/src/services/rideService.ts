import { Ride } from '../types';
import { mockRides } from '../data/mockData';
import { api } from './api';

interface BackendRide {
  id: number;
  driver_id: number;
  driver_name: string;
  driver_avatar: string;
  driver_rating: number;
  driver_verified: boolean;
  from: string;
  to: string;
  date: string;
  departure_time: string;
  price: number;
  available_seats: number;
  total_seats: number;
  vehicle_info: string;
  notes: string | null;
}

const mapRide = (ride: BackendRide): Ride => ({
  id: `db-${ride.id}`,
  driverId: String(ride.driver_id),
  driverName: ride.driver_name,
  driverAvatar: ride.driver_avatar,
  driverRating: ride.driver_rating,
  driverVerified: ride.driver_verified,
  from: ride.from,
  to: ride.to,
  date: ride.date,
  departureTime: ride.departure_time,
  price: ride.price,
  availableSeats: ride.available_seats,
  totalSeats: ride.total_seats,
  vehicleInfo: ride.vehicle_info,
  notes: ride.notes ?? undefined,
});

/**
 * Frontend Campus Rides Service.
 */
class RideService {
  public async getRides(): Promise<Ride[]> {
    try {
      const rides = await api.get<BackendRide[]>('/rides');
      return [...mockRides, ...rides.map(mapRide)];
    } catch {
      return [...mockRides];
    }
  }

  public async createRide(input: {
    driver_id: number;
    from_location: string;
    to_location: string;
    date: string;
    departure_time: string;
    price: number;
    total_seats: number;
    vehicle_info: string;
    notes?: string;
  }): Promise<Ride> {
    const response = await api.post<{ success: boolean; ride: BackendRide }>('/rides', input);
    return mapRide(response.ride);
  }

  public async requestRide(rideId: string, requesterId: string): Promise<void> {
    // Mock rides remain browseable in demo mode but are not persisted rides.
    if (rideId.startsWith('ride-')) return;

    await api.post(`/rides/${rideId.replace(/^db-/, '')}/requests`, {
      requester_id: Number(requesterId),
      seats_requested: 1,
    });
  }
}

export const rideService = new RideService();
