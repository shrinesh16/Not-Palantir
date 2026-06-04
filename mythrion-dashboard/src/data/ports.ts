import portsRaw from './ports-global.json';

export interface GlobalPort {
  n: string;   // name
  la: number;  // latitude
  ln: number;  // longitude
  c: string;   // country (ISO2)
  s: string;   // size: V=Very Small, S=Small, M=Medium, L=Large, U=Unknown
  id: string;  // port ID
  vc: number;  // vessel count (from IMF)
  source: 'nga' | 'imf' | 'both' | 'procedural';
  ft: string;  // facility type
}

export const GLOBAL_PORTS: GlobalPort[] = portsRaw as GlobalPort[];

/**
 * Convert the compact ports array into a GeoJSON FeatureCollection.
 */
export function portsToGeoJSON(): GeoJSON.FeatureCollection {
  return {
    type: 'FeatureCollection',
    features: GLOBAL_PORTS.map((p, i) => ({
      type: 'Feature' as const,
      geometry: {
        type: 'Point' as const,
        coordinates: [p.ln, p.la]
      },
      properties: {
        id: p.id || `pt-${i}`,
        name: p.n,
        lat: p.la,
        lng: p.ln,
        country: p.c,
        size: p.s,
        vesselCount: p.vc,
        source: p.source,
        facilityType: p.ft || 'Major Seaport',
        layerType: 'port'
      }
    }))
  };
}

// Size labels for display
export const PORT_SIZE_LABELS: Record<string, string> = {
  V: 'VERY SMALL',
  S: 'SMALL',
  M: 'MEDIUM',
  L: 'LARGE',
  U: 'UNKNOWN'
};
