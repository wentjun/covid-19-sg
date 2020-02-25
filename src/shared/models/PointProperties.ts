export interface PointProperties {
  id: string;
  title: string;
  confirmed: string;
  discharged: string;
  hospital: string;
  source: string;
  isDateEndRange?: boolean; // used to determine which point to highlight
}
