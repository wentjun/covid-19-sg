export interface LocationProperties {
  location: string;
  cases: number[];
  type: 'cluster' | 'hospital' | 'other';
}