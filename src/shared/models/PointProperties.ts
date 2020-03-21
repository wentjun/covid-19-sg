export interface PointProperties {
  id: string;
  title: string;
  confirmed: string;
  discharged: string;
  death: string;
  hospital: string;
  source: string;
  nationality: string;
  residenceAreas: string[];
  placesVisited: string[];
  age: number;

  // props which are used when adjusting date range
  isDateEndRange?: boolean; // used to determine which point to highlight
  hasRecoveredOnRangeDate?: boolean; // has the patient recovered on the selected date? (on date range)

  // point selection
  isActive?: boolean;
}
