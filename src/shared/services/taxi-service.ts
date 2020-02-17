import { map, mergeMap, catchError } from 'rxjs/operators';
import { from, Observable, of } from 'rxjs';
import { TaxiResponse } from '../models/taxi-response';

const getTaxiList = (longitude: number, latitude: number, taxiCount: string) => {
  const fetchTaxiListRequest = fetch(`https://qa-interview-test.qa.splytech.io/api/drivers?latitude=${latitude}&longitude=${longitude}&count=${taxiCount}`);
  return from(fetchTaxiListRequest)
    .pipe(
      mergeMap(response => response.json()),
      map(response => ({
          pickupEta: response.pickup_eta,
          drivers: response.drivers.map((driver: any) => ({
            driverId: driver.driver_id,
            location: driver.location
          }))
        })),
      catchError(() => of({ error: true, errorMessage: 'Please enable CORS on the server' }))
    ) as Observable<TaxiResponse>;
};

export {
  getTaxiList
};
