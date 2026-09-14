import { Ride } from '../types';
import { mockRides } from '../data/mockData';

/**
 * Frontend Campus Rides Service (STATIC / DEMO ONLY)
 * 
 * NOTE: Campus Rides is an informational prototype/demo feature.
 * No real ride booking, seat reservation, mutation, GPS tracking, or backend
 * ride infrastructure is implemented.
 */
class RideService {
  // TODO: [Backend Integration] In future versions, backend teammates can connect this to a real carpool API
  public async getRides(): Promise<Ride[]> {
    // Return static dummy ride dataset
    return [...mockRides];
  }
}

export const rideService = new RideService();
