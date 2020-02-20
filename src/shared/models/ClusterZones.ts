export interface TransmissionClusterProps {
  location: ClusterLocation;
  cases: number[];
}

export type ClusterLocation = 'Grace Assembly of God Church (Tanglin)' |
'Grace Assembly of God Church (Bukit Batok)' |
'Yong Thai Hang' |
'The Life Church and Missions Singapore' |
'Grand Hyatt Singapore' |
'Seletar Aerospace Heights';
