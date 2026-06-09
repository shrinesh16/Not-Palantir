// Live Maritime Data from Digitraffic.fi Marine API
// Provides 100% real-time AIS telemetry for cargo, tankers, and military ships.

export interface Ship {
  id: string;
  name: string;
  flag: string;
  type: 'military' | 'tanker' | 'cargo';
  lat: number;
  lng: number;
  speed: number; // knots
  heading: number;
  destination: string;
  mmsi?: string;
  imo?: number;
  callsign?: string;
  draught?: number;
  shipType?: number;
  lastUpdated?: string;
}

// Map MMSI Maritime Identification Digits (MID) to country flags
const MID_MAP: Record<string, string> = {
  '219': 'Denmark',
  '230': 'Finland',
  '244': 'Netherlands',
  '257': 'Norway',
  '258': 'Norway',
  '259': 'Norway',
  '265': 'Sweden',
  '266': 'Sweden',
  '273': 'Russia',
  '276': 'Estonia',
  '275': 'Latvia',
  '277': 'Lithuania',
  '261': 'Poland',
  '211': 'Germany',
  '218': 'Germany',
  '232': 'United Kingdom',
  '235': 'United Kingdom',
  '226': 'France',
  '227': 'France',
  '228': 'France',
  '247': 'Italy',
  '304': 'Bahamas',
  '311': 'Bahamas',
  '351': 'Panama',
  '352': 'Panama',
  '353': 'Panama',
  '354': 'Panama',
  '355': 'Panama',
  '356': 'Panama',
  '357': 'Panama',
  '370': 'Panama',
  '371': 'Panama',
  '372': 'Panama',
  '373': 'Panama',
  '374': 'Panama',
  '538': 'Marshall Islands',
  '636': 'Liberia',
  '229': 'Malta',
  '210': 'Cyprus',
  '212': 'Cyprus',
  '209': 'Cyprus',
  '256': 'Gibraltar',
  '412': 'China',
  '413': 'China',
  '414': 'China',
  '419': 'India',
  '366': 'United States',
  '367': 'United States',
  '368': 'United States',
  '369': 'United States',
};

export function getCountryFromMMSI(mmsi: string): string {
  if (!mmsi || mmsi.length < 3) return 'Unknown';
  const mid = mmsi.substring(0, 3);
  return MID_MAP[mid] || 'International';
}

// Map ITU AIS ship types to our categories: 'military' | 'tanker' | 'cargo'
export function mapShipType(typeCode: number, name: string): 'military' | 'tanker' | 'cargo' {
  const normalizedName = (name || '').toUpperCase();
  if (typeCode === 35 || normalizedName.startsWith('USS ') || normalizedName.startsWith('HMS ') || normalizedName.startsWith('CNS ') || normalizedName.startsWith('INS ')) {
    return 'military';
  }
  // Tankers are 80-89
  if (typeCode >= 80 && typeCode <= 89) {
    return 'tanker';
  }
  // Default to cargo for 70-79, 50-59, 90-99 and others
  return 'cargo';
}



const BASE_DEV = '/api/digitraffic';
const BASE_PROD = 'https://meri.digitraffic.fi';

// In-memory cache for vessel metadata to avoid fetching 1MB on every poll
let vesselMetadataCache: Map<number, any> = new Map();
let lastMetadataFetch = 0;
const METADATA_CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

async function fetchMetadata(): Promise<Map<number, any>> {
  const now = Date.now();
  if (vesselMetadataCache.size > 0 && (now - lastMetadataFetch < METADATA_CACHE_DURATION)) {
    return vesselMetadataCache;
  }

  const isDev = import.meta.env.DEV;
  const url = isDev ? `${BASE_DEV}/api/ais/v1/vessels` : `${BASE_PROD}/api/ais/v1/vessels`;

  const headers: HeadersInit = {
    'Digitraffic-User': 'MythrionDashboard/1.0',
    'Accept-Encoding': 'gzip'
  };

  try {
    const res = await fetch(url, { headers, signal: AbortSignal.timeout(12000) });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    
    const metaMap = new Map<number, any>();
    if (Array.isArray(data)) {
      data.forEach((item: any) => {
        if (item.mmsi) {
          metaMap.set(item.mmsi, item);
        }
      });
    }
    
    vesselMetadataCache = metaMap;
    lastMetadataFetch = now;
    return metaMap;
  } catch (err) {
    console.warn('Failed to fetch vessel metadata, using cached/empty:', err);
    return vesselMetadataCache;
  }
}

export async function fetchLiveShips(): Promise<Ship[]> {
  const isDev = import.meta.env.DEV;
  const url = isDev ? `${BASE_DEV}/api/ais/v1/locations` : `${BASE_PROD}/api/ais/v1/locations`;

  const headers: HeadersInit = {
    'Digitraffic-User': 'MythrionDashboard/1.0',
    'Accept-Encoding': 'gzip'
  };

  try {
    // 1. Fetch metadata and locations in parallel
    const [metaMap, locRes] = await Promise.all([
      fetchMetadata(),
      fetch(url, { headers, signal: AbortSignal.timeout(10000) })
    ]);

    if (!locRes.ok) throw new Error(`HTTP error ${locRes.status}`);
    const locData = await locRes.json();

    if (!locData || !Array.isArray(locData.features)) {
      return [];
    }

    const parsedShips: Ship[] = [];

    locData.features.forEach((feat: any) => {
      const mmsiNum = feat.mmsi;
      if (!mmsiNum) return;

      const mmsiStr = String(mmsiNum);
      const coords = feat.geometry?.coordinates;
      if (!coords || coords.length < 2) return;

      const props = feat.properties || {};
      const meta = metaMap.get(mmsiNum) || {};

      const name = meta.name ? meta.name.trim() : `VESSEL_${mmsiStr}`;
      const shipTypeVal = meta.shipType || 70;
      const type = mapShipType(shipTypeVal, name);

      parsedShips.push({
        id: `SH-${mmsiStr}`,
        name,
        flag: getCountryFromMMSI(mmsiStr),
        type,
        lat: coords[1],
        lng: coords[0],
        speed: props.sog != null ? props.sog : 0,
        heading: props.heading != null && props.heading !== 511 ? props.heading : (props.cog || 0),
        destination: meta.destination ? meta.destination.trim() : 'Unknown',
        mmsi: mmsiStr,
        imo: meta.imo || undefined,
        callsign: meta.callSign || undefined,
        draught: meta.draught != null ? meta.draught / 10 : undefined, // draught is returned in 1/10 meters (e.g. 118 = 11.8m)
        shipType: shipTypeVal,
        lastUpdated: props.timestampExternal ? new Date(props.timestampExternal).toISOString() : new Date().toISOString()
      });
    });

    return parsedShips;
  } catch (err) {
    console.error('Failed to fetch live ship locations:', err);
    throw err;
  }
}
