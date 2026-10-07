// Harita izdüşümü: public/images/map-land.svg ile aynı (scratchpad map.py ile üretildi).
// Eşdikdörtgen, standart paralel 40°K; boylam -15.0..80.0, enlem 14.0..62.0.
export const MAP_W = 1000;
export const MAP_H = 660;
const LON0 = -15.0;
const LAT1 = 62.0;
const K = 10.526316;
const S = 13.741129;
export const project = (lon: number, lat: number): [number, number] => [(lon - LON0) * K, (LAT1 - lat) * S];
