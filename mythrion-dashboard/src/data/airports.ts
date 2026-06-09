import airportsRaw from './airports-global.json';

export interface GlobalAirport {
  n: string;   // name
  la: number;  // latitude
  ln: number;  // longitude
  t: number;   // type: 0=heliport, 1=small, 2=medium, 3=large, 4=seaplane
  c: string;   // country ISO code
  m: string;   // municipality
  ia: string;  // IATA code
  ic: string;  // ICAO code
  ct: string;  // continent
}

export const GLOBAL_AIRPORTS: GlobalAirport[] = airportsRaw as GlobalAirport[];

/**
 * Convert the compact airport array into a GeoJSON FeatureCollection.
 * Uses deferred conversion for performance.
 */
export function airportsToGeoJSON(): GeoJSON.FeatureCollection {
  return {
    type: 'FeatureCollection',
    features: GLOBAL_AIRPORTS.map((a, i) => ({
      type: 'Feature' as const,
      geometry: {
        type: 'Point' as const,
        coordinates: [a.ln, a.la]
      },
      properties: {
        id: i,
        name: a.n,
        lat: a.la,
        lng: a.ln,
        iata: a.ia,
        icao: a.ic,
        country: a.c,
        city: a.m,
        continent: a.ct,
        airportType: a.t,
        layerType: 'airport'
      }
    }))
  };
}

// Type labels for display
export const AIRPORT_TYPE_LABELS: Record<number, string> = {
  0: 'HELIPORT',
  1: 'SMALL AIRPORT',
  2: 'MEDIUM AIRPORT',
  3: 'LARGE AIRPORT',
  4: 'SEAPLANE BASE'
};

/**
 * Lookup airport name and IATA code by ICAO/IATA code.
 */
export function lookupAirportName(code: string | null): string {
  if (!code) return '—';
  const c = code.trim().toUpperCase();
  const found = GLOBAL_AIRPORTS.find(a => a.ic === c || a.ia === c);
  if (found) {
    return found.ia ? `${found.ia} (${found.n})` : found.n;
  }
  return c;
}
