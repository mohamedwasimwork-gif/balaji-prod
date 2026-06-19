export interface Stat {
  state: string;
  mw: number;
  color: string;
}

export const STATS: Stat[] = [
  { state: 'Tamil Nadu', mw: 1302, color: 'rgb(40, 54, 24)' },
  { state: 'Karnataka', mw: 454, color: 'rgb(96, 108, 56)' },
  { state: 'Maharashtra', mw: 150, color: 'rgb(221, 161, 94)' },
  { state: 'Andhra Pradesh', mw: 112, color: 'rgb(188, 108, 37)' },
  { state: 'Madhya Pradesh', mw: 32, color: 'rgb(173, 193, 120)' },
];

export const TOTAL_MW = STATS.reduce((sum, s) => sum + s.mw, 0);
