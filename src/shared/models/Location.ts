export interface LocationProperties {
  location: ClusterLocation;
  cases: number[];
  type: 'cluster' | 'hospital' | 'other';
}

export type ClusterLocation = 'Grace Assembly of God Church (Tanglin)' |
'Grace Assembly of God Church (Bukit Batok)' |
'Yong Thai Hang Medical Products Shop' |
'The Life Church and Missions Singapore' |
'Grand Hyatt Singapore' |
'Seletar Aerospace Heights' |
'Safra Jurong';
