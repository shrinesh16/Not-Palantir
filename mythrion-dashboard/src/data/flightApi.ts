/**
 * Real-Time Global Flight Data via adsb.lol ADS-B Network
 *
 * Strategy:
 *   1. Fetch /v2/mil  — all military aircraft globally (fast, ~100–400 ac)
 *   2. Fetch 24 global tile points at 250nm radius in parallel for full coverage
 *   3. Deduplicate by ICAO hex
 *   4. Parse every field the API returns: IAS, TAS, Mach, wind, OAT, TAT, roll,
 *      mag heading, true heading, registration, type code, squawk, RSSI, messages,
 *      seen_pos, emergency, category, nav_qnh, nav_altitude_mcp, sil, nac, etc.
 *
 * API: https://api.adsb.lol   (compatible with ADSBExchange v2 format)
 * Vite Dev Proxy: /api/adsblol → https://api.adsb.lol
 * Production fallback: https://api.allorigins.win CORS proxy
 */

import type { Flight } from './mockData';

// ── Known Airline ICAO 3-Letter Prefixes ────────────────────────────────────
const AIRLINE_PREFIXES: Record<string, string> = {
  // North America
  AAL: 'American Airlines', UAL: 'United Airlines', DAL: 'Delta Air Lines',
  SWA: 'Southwest Airlines', ASA: 'Alaska Airlines', JBU: 'JetBlue Airways',
  FFT: 'Frontier Airlines', NKS: 'Spirit Airlines', SKW: 'SkyWest Airlines',
  RPA: 'Republic Airways', ENY: 'Envoy Air', ASH: 'Mesa Airlines',
  JIA: 'PSA Airlines', PDT: 'Piedmont Airlines', ACA: 'Air Canada',
  WJA: 'WestJet', TSC: 'Air Transat', POE: 'Porter Airlines',
  // Europe
  BAW: 'British Airways', EZY: 'easyJet', RYR: 'Ryanair', DLH: 'Lufthansa',
  EWG: 'Eurowings', AFR: 'Air France', KLM: 'KLM Royal Dutch Airlines',
  SAS: 'Scandinavian Airlines', FIN: 'Finnair', IBE: 'Iberia',
  AEA: 'Air Europa', VLG: 'Vueling', TAP: 'TAP Air Portugal',
  SWR: 'Swiss International Air Lines', AUA: 'Austrian Airlines',
  LOT: 'LOT Polish Airlines', THY: 'Turkish Airlines', PGT: 'Pegasus Airlines',
  ITY: 'ITA Airways', WZZ: 'Wizz Air', NOR: 'Norwegian Air Shuttle',
  ICE: 'Icelandair', AEE: 'Aegean Airlines', BEL: 'Brussels Airlines',
  TRA: 'Transavia', VIR: 'Virgin Atlantic', TUI: 'TUI fly', VOE: 'Volotea',
  // Middle East
  UAE: 'Emirates', ETD: 'Etihad Airways', QTR: 'Qatar Airways',
  GFA: 'Gulf Air', MEA: 'Middle East Airlines', RJA: 'Royal Jordanian',
  KAC: 'Kuwait Airways', SVA: 'Saudia', OMA: 'Oman Air',
  MSR: 'EgyptAir', FLY: 'flydubai', PIA: 'Pakistan International Airlines',
  // Asia Pacific
  ANA: 'All Nippon Airways', JAL: 'Japan Airlines', SIA: 'Singapore Airlines',
  CPA: 'Cathay Pacific', MAS: 'Malaysia Airlines', THA: 'Thai Airways',
  GAR: 'Garuda Indonesia', CES: 'China Eastern Airlines',
  CSN: 'China Southern Airlines', CCA: 'Air China', AIC: 'Air India',
  SEJ: 'SpiceJet', IGO: 'IndiGo', QFA: 'Qantas', ANZ: 'Air New Zealand',
  VOZ: 'Virgin Australia', KAL: 'Korean Air', AAR: 'Asiana Airlines',
  EVA: 'EVA Air', CAL: 'China Airlines', PAL: 'Philippine Airlines',
  CEB: 'Cebu Pacific', AKJ: 'Akasa Air',
  // Africa & South America
  SAA: 'South African Airways', ETH: 'Ethiopian Airlines', KQA: 'Kenya Airways',
  LAN: 'LATAM Airlines', TAM: 'LATAM Brasil', GLO: 'Gol Linhas Aéreas',
  AVA: 'Avianca',
  // Cargo
  FDX: 'FedEx Express', UPS: 'UPS Airlines', GTI: 'Atlas Air',
  CLX: 'Cargolux', CKS: 'Kalitta Air', ABW: 'AirBridgeCargo',
};

// ── Flight classification ────────────────────────────────────────────────────

function classifyFlight(
  callsign: string,
  dbFlags: number,
  alt: number,
  speed: number
): { type: Flight['type']; airline?: string; flightNumber?: string } {
  const cs = (callsign || '').trim().toUpperCase();

  // Military flag from adsb.lol dbFlags bit 0
  if (dbFlags & 1) return { type: 'military' };

  // Check airline prefix
  if (cs.length >= 3) {
    const prefix = cs.substring(0, 3);
    if (AIRLINE_PREFIXES[prefix]) {
      return {
        type: 'commercial',
        airline: AIRLINE_PREFIXES[prefix],
        flightNumber: cs.substring(3).trim()
      };
    }
  }

  // High-altitude fast → business jet
  if (alt > 30000 && speed > 350) return { type: 'jet' };

  return { type: 'private' };
}

// ── CORS-safe fetch helper ───────────────────────────────────────────────────
const BASE_DEV = '/api/adsblol';
const BASE_PROD = 'https://api.adsb.lol';
const CORS_PROXY = 'https://api.allorigins.win/raw?url=';

async function adsbFetch(path: string): Promise<any> {
  const isDev = import.meta.env.DEV;
  const primaryUrl = isDev ? `${BASE_DEV}${path}` : `${BASE_PROD}${path}`;
  const fallbackUrl = `${CORS_PROXY}${encodeURIComponent(`${BASE_PROD}${path}`)}`;

  try {
    const res = await fetch(primaryUrl, {
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(8000)
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch {
    try {
      const res = await fetch(fallbackUrl, {
        signal: AbortSignal.timeout(10000)
      });
      if (!res.ok) throw new Error(`Fallback HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      throw err;
    }
  }
}

// ── Convert one raw adsb.lol aircraft record to our Flight type ──────────────
function parseAcRecord(ac: any, id: number): Flight | null {
  const lat = ac.lat;
  const lon = ac.lon;
  if (lat == null || lon == null) return null;

  const callsign = (ac.flight || '').trim();
  const icao24 = (ac.hex || '').trim().toLowerCase();
  const dbFlags = Number(ac.dbFlags || 0);

  // Altitude: adsb.lol gives alt_baro in feet already
  const altBaro = ac.alt_baro != null ? Number(ac.alt_baro) : 0;
  const altGeom = ac.alt_geom != null ? Number(ac.alt_geom) : undefined;

  // Speed already in knots
  const gs = ac.gs != null ? Math.round(Number(ac.gs)) : 0;
  const ias = ac.ias != null ? Math.round(Number(ac.ias)) : undefined;
  const tas = ac.tas != null ? Math.round(Number(ac.tas)) : undefined;
  const mach = ac.mach != null ? Number(ac.mach) : undefined;

  // Heading
  const track = ac.track != null ? Number(ac.track) : 0;
  const magHeading = ac.mag_heading != null ? Number(ac.mag_heading) : undefined;
  const trueHeading = ac.true_heading != null ? Number(ac.true_heading) : undefined;
  const roll = ac.roll != null ? Number(ac.roll) : undefined;
  const trackRate = ac.track_rate != null ? Number(ac.track_rate) : undefined;

  // Vertical rates
  const baroRate = ac.baro_rate != null ? Math.round(Number(ac.baro_rate)) : undefined;
  const geomRate = ac.geom_rate != null ? Math.round(Number(ac.geom_rate)) : undefined;

  // Atmosphere
  const wd = ac.wd != null ? Number(ac.wd) : undefined;      // wind direction °
  const ws = ac.ws != null ? Number(ac.ws) : undefined;      // wind speed kts
  const oat = ac.oat != null ? Number(ac.oat) : undefined;   // Outside Air Temp °C
  const tat = ac.tat != null ? Number(ac.tat) : undefined;   // Total Air Temp °C

  // Navigation
  const navQnh = ac.nav_qnh != null ? Number(ac.nav_qnh) : undefined;
  const navAltMcp = ac.nav_altitude_mcp != null ? Number(ac.nav_altitude_mcp) : undefined;

  // Transponder/signal
  const squawk = ac.squawk || undefined;
  const emergency = (ac.emergency && ac.emergency !== 'none') ? String(ac.emergency) : undefined;
  const rssi = ac.rssi != null ? Number(ac.rssi) : undefined;
  const messages = ac.messages != null ? Number(ac.messages) : undefined;
  const seen = ac.seen != null ? Number(ac.seen) : undefined;
  const seenPos = ac.seen_pos != null ? Number(ac.seen_pos) : undefined;

  // ADS-B quality
  const category = ac.category || undefined;   // e.g. "A3", "A5"
  const version = ac.version != null ? Number(ac.version) : undefined;
  const silType = ac.sil_type || undefined;
  const sil = ac.sil != null ? Number(ac.sil) : undefined;
  const nacP = ac.nac_p != null ? Number(ac.nac_p) : undefined;
  const nacV = ac.nac_v != null ? Number(ac.nac_v) : undefined;
  const nicBaro = ac.nic_baro != null ? Number(ac.nic_baro) : undefined;
  const rc = ac.rc != null ? Number(ac.rc) : undefined;

  // Source type
  const sourceType = ac.type || 'adsb_icao'; // e.g. 'adsb_icao', 'mlat', 'tisb_icao'

  // Aircraft metadata from adsb.lol (direct in data)
  const registration = ac.r || undefined;       // e.g. "VT-NCV"
  const typeCode = ac.t || undefined;           // e.g. "A21N"

  const { type, airline, flightNumber } = classifyFlight(callsign, dbFlags, altBaro, gs);

  return {
    id: `ADSB-${id}`,
    callsign: callsign || icao24.toUpperCase(),
    icao24,
    model: typeCode || '',
    desc: typeCode ? `${typeCode}${registration ? ' • ' + registration : ''}` : (registration || ''),
    registration: registration || '',
    lat,
    lng: lon,
    alt: altBaro,
    speed_knots: gs,
    heading: Math.round(track),
    type,
    airline,
    flightNumber,
    route: '',
    // Extended telemetry
    alt_geom: altGeom,
    baro_rate: baroRate,
    geom_rate: geomRate,
    squawk,
    emergency,
    ias,
    tas,
    mach,
    wd,
    ws,
    oat,
    tat,
    roll,
    mag_heading: magHeading,
    true_heading: trueHeading,
    track_rate: trackRate,
    nav_qnh: navQnh,
    nav_altitude_mcp: navAltMcp,
    rssi,
    messages,
    seen,
    seen_pos: seenPos,
    category,
    version,
    sil,
    sil_type: silType,
    nac_p: nacP,
    nac_v: nacV,
    nic_baro: nicBaro,
    rc,
    source: sourceType,
    ownOp: airline || undefined,
    dbFlags,
  } as any;
}




// ── Throttle / cache ──────────────────────────────────────────────────────────
let lastFetchTime = 0;
let cachedFlights: Flight[] = [];

function getFallbackCache(): Flight[] {
  try {
    const raw = localStorage.getItem('mythrion_flights_v2');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed.flights) && parsed.flights.length > 0) {
        console.log(`[FlightAPI] Returning ${parsed.flights.length} cached flights (${Math.round((Date.now() - parsed.ts) / 1000)}s old)`);
        return parsed.flights;
      }
    }
  } catch { /* ignore */ }
  return cachedFlights;
}

// ── Main: fetch global flights ─────────────────────────────────────────────



function parseFR24Flight(_key: string, data: any[], id: number): Flight | null {
  if (!Array.isArray(data) || data.length < 17) return null;
  const hex = (data[0] || '').trim().toLowerCase();
  const lat = data[1];
  const lon = data[2];
  const track = data[3];
  const altFeet = data[4];
  const speedKnots = data[5];
  const squawk = data[6];
  const radar = data[7];
  const model = data[8];
  const reg = data[9];
  const timestamp = data[10];
  const origin = data[11];
  const dest = data[12];
  const flightNum = data[13];
  const vSpeedFpm = data[15];
  const callsign = data[16];

  if (lat == null || lon == null) return null;

  const { type, airline } = classifyFlight(callsign || flightNum, 0, altFeet, speedKnots);

  return {
    id: `FR-${id}`,
    callsign: callsign || flightNum || hex.toUpperCase(),
    icao24: hex,
    model: model || '',
    desc: model ? `${model}${reg ? ' • ' + reg : ''}` : (reg || ''),
    registration: reg || '',
    lat,
    lng: lon,
    alt: altFeet != null ? Math.round(altFeet) : 0,
    speed_knots: speedKnots != null ? Math.round(speedKnots) : 0,
    heading: track != null ? Math.round(track) : 0,
    type,
    airline,
    flightNumber: flightNum || '',
    route: (origin && dest) ? `${origin}-${dest}` : '',
    baro_rate: vSpeedFpm != null ? Math.round(vSpeedFpm) : undefined,
    squawk: squawk || undefined,
    source: radar ? `FR24 (${radar})` : 'FR24',
    seen_pos: timestamp ? Date.now() / 1000 - timestamp : undefined,
    dbFlags: 0,
    ownOp: airline || undefined
  } as any;
}


const FR24_BOUNDS: Record<string, string> = {
  europe_west: "75,35,-25,10",
  europe_east: "75,35,10,45",
  usa_east: "50,24,-100,-65",
  usa_west: "50,24,-125,-100",
  canada_alaska: "75,50,-170,-50",
  asia_west: "75,5,45,95",
  asia_east: "75,5,95,150",
  southamerica: "15,-60,-90,-30",
  africa: "35,-35,-20,55",
  australia: "0,-50,110,180"
};

export async function fetchLiveFlights(
  _viewport?: { lat: number; lng: number; zoom: number } | null
): Promise<Flight[]> {
  const now = Date.now();

  if (now - lastFetchTime < 25000 && cachedFlights.length > 0) {
    return cachedFlights;
  }

  const seenHex = new Set<string>();
  const allFlights: Flight[] = [];
  let idCounter = 0;

  // 1. Fetch Military (adsb.lol)
  const militaryPromise = adsbFetch('/v2/mil').catch(() => null);

  // 2. Fetch Global Zones (FR24)
  const isDev = import.meta.env.DEV;
  
  const zonePromises = Object.entries(FR24_BOUNDS).map(([zoneName, bounds]) => {
    const url = isDev
      ? `/api/fr24/zones/fcgi/feed.js?bounds=${bounds}&faa=1&action=live`
      : 'https://api.allorigins.win/raw?url=' + encodeURIComponent(`https://data-cloud.flightradar24.com/zones/fcgi/feed.js?bounds=${bounds}&faa=1&action=live`);
      
    return fetch(url, {
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(12000)
    })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .catch(err => {
        console.warn(`[FlightAPI] FR24 zone ${zoneName} fetch failed:`, err.message);
        return null;
      });
  });

  let militaryData, zoneResults: (any | null)[];
  try {
    [militaryData, ...zoneResults] = await Promise.all([militaryPromise, ...zonePromises]);
  } catch (err) {
    console.error('[FlightAPI] Fatal error fetching flights:', err);
    return getFallbackCache();
  }

  // Parse military first (takes precedence for matching hexes)
  if (militaryData && Array.isArray(militaryData.ac)) {
    for (const ac of militaryData.ac) {
      const hex = (ac.hex || '').trim().toLowerCase();
      if (!hex || seenHex.has(hex)) continue;
      seenHex.add(hex);
      const flight = parseAcRecord(ac, idCounter++);
      if (flight) allFlights.push(flight);
    }
  }

  // Parse all FR24 zones
  for (const globalData of zoneResults) {
    if (!globalData) continue;
    for (const [key, value] of Object.entries(globalData)) {
      if (key === 'full_count' || key === 'version' || key === 'stats') continue;
      if (!Array.isArray(value)) continue;
      const hex = (value[0] || '').trim().toLowerCase();
      if (!hex || seenHex.has(hex)) continue;
      seenHex.add(hex);
      const flight = parseFR24Flight(key, value as any[], idCounter++);
      if (flight) allFlights.push(flight);
    }
  }

  console.log(
    `[FlightAPI] ✈ Live Data — ${allFlights.length} airborne aircraft — ` +
    `Commercial: ${allFlights.filter(f => f.type === 'commercial').length}, ` +
    `Private: ${allFlights.filter(f => f.type === 'private').length}, ` +
    `Jets: ${allFlights.filter(f => f.type === 'jet').length}, ` +
    `Military: ${allFlights.filter(f => f.type === 'military').length}`
  );

  if (allFlights.length > 0) {
    lastFetchTime = now;
    cachedFlights = allFlights;
    try {
      localStorage.setItem('mythrion_flights_v2', JSON.stringify({ ts: now, flights: allFlights }));
    } catch { /* quota */ }
  }

  return allFlights.length > 0 ? allFlights : getFallbackCache();
}

// ── Route Fetching (hexdb.io primary, allorigins fallback) ───────────────────

interface RouteData {
  origin: string | null;
  destination: string | null;
  timestamp: number;
}

const routeCache = new Map<string, RouteData>();
const pendingRoutes = new Set<string>();

export async function fetchFlightRoute(callsign: string): Promise<RouteData | null> {
  if (!callsign) return null;
  const cs = callsign.trim().toUpperCase();

  if (routeCache.has(cs)) return routeCache.get(cs) || null;
  if (pendingRoutes.has(cs)) return null;
  pendingRoutes.add(cs);

  const empty: RouteData = { origin: null, destination: null, timestamp: Date.now() };

  try {
    // 1. Try HexDB route (fast, no auth required)
    const hexRes = await fetch(`https://hexdb.io/api/v1/route/icao/${cs}`, {
      signal: AbortSignal.timeout(4000)
    });
    if (hexRes.ok) {
      const hexData = await hexRes.json();
      if (hexData?.route && hexData.route !== '') {
        const parts = hexData.route.split('-');
        if (parts.length >= 2) {
          const routeData: RouteData = {
            origin: parts[0].trim() || null,
            destination: parts[parts.length - 1].trim() || null,
            timestamp: Date.now()
          };
          routeCache.set(cs, routeData);
          pendingRoutes.delete(cs);
          return routeData;
        }
      }
    }

    // 2. Try adsb.lol route (if hexdb fails)
    const adsbRoute = await adsbFetch(`/v2/callsign/${cs}`).catch(() => null);
    if (adsbRoute?.ac?.length > 0) {
      const ac = adsbRoute.ac[0];
      if (ac.from_icao && ac.to_icao) {
        const routeData: RouteData = {
          origin: ac.from_icao,
          destination: ac.to_icao,
          timestamp: Date.now()
        };
        routeCache.set(cs, routeData);
        pendingRoutes.delete(cs);
        return routeData;
      }
    }
  } catch (err) {
    console.warn(`[FlightAPI] Route fetch failed for ${cs}:`, err);
  }

  routeCache.set(cs, empty);
  pendingRoutes.delete(cs);
  return null;
}

// ── Aircraft Metadata (hexdb.io) ─────────────────────────────────────────────

export interface AircraftMetadata {
  icao24: string;
  registration: string | null;
  model: string | null;
  desc: string | null;
  ownOp: string | null;
  manufacturer: string | null;
  timestamp: number;
}

const metadataCache = new Map<string, AircraftMetadata>();
const pendingMetadata = new Set<string>();

export async function fetchAircraftMetadata(icao24: string): Promise<AircraftMetadata | null> {
  if (!icao24) return null;
  const hex = icao24.trim().toLowerCase();

  if (metadataCache.has(hex)) return metadataCache.get(hex) || null;
  if (pendingMetadata.has(hex)) return null;
  pendingMetadata.add(hex);

  try {
    const res = await fetch(`https://hexdb.io/api/v1/aircraft/${hex}`, {
      signal: AbortSignal.timeout(4000)
    });
    if (res.ok) {
      const data = await res.json();
      if (data) {
        const meta: AircraftMetadata = {
          icao24: hex,
          registration: data.Registration || null,
          model: data.ICAOTypeCode || null,
          desc: data.Type || null,
          ownOp: data.RegisteredOwners || null,
          manufacturer: data.Manufacturer || null,
          timestamp: Date.now()
        };
        metadataCache.set(hex, meta);
        pendingMetadata.delete(hex);
        return meta;
      }
    }
  } catch (err) {
    console.warn(`[FlightAPI] Metadata fetch failed for ${hex}:`, err);
  }

  metadataCache.set(hex, {
    icao24: hex, registration: null, model: null,
    desc: null, ownOp: null, manufacturer: null, timestamp: Date.now()
  });
  pendingMetadata.delete(hex);
  return null;
}

export const FLIGHT_REGIONS = { global: 'Global' };



export interface AircraftTelemetry {
  ias?: number;
  tas?: number;
  mach?: number;
  wd?: number;
  ws?: number;
  oat?: number;
  tat?: number;
  roll?: number;
  mag_heading?: number;
  true_heading?: number;
  track_rate?: number;
  nav_qnh?: number;
  nav_altitude_mcp?: number;
  rssi?: number;
  messages?: number;
  version?: number;
  nac_p?: number;
  nac_v?: number;
  sil?: number;
  sil_type?: string;
  nic_baro?: number;
  rc?: number;
  source?: string;
  emergency?: string;
}

const telemetryCache = new Map<string, { data: AircraftTelemetry | null, ts: number }>();

export async function fetchAircraftTelemetry(icao24: string): Promise<AircraftTelemetry | null> {
  if (!icao24) return null;
  const hex = icao24.trim().toLowerCase();
  
  const cached = telemetryCache.get(hex);
  if (cached && Date.now() - cached.ts < 30000) {
    return cached.data;
  }

  try {
    const res = await adsbFetch(`/v2/icao/${hex}`);
    if (res && res.ac && res.ac.length > 0) {
      const ac = res.ac[0];
      const data: AircraftTelemetry = {
        ias: ac.ias != null ? Math.round(Number(ac.ias)) : undefined,
        tas: ac.tas != null ? Math.round(Number(ac.tas)) : undefined,
        mach: ac.mach != null ? Number(ac.mach) : undefined,
        wd: ac.wd != null ? Number(ac.wd) : undefined,
        ws: ac.ws != null ? Number(ac.ws) : undefined,
        oat: ac.oat != null ? Number(ac.oat) : undefined,
        tat: ac.tat != null ? Number(ac.tat) : undefined,
        roll: ac.roll != null ? Number(ac.roll) : undefined,
        mag_heading: ac.mag_heading != null ? Number(ac.mag_heading) : undefined,
        true_heading: ac.true_heading != null ? Number(ac.true_heading) : undefined,
        track_rate: ac.track_rate != null ? Number(ac.track_rate) : undefined,
        nav_qnh: ac.nav_qnh != null ? Number(ac.nav_qnh) : undefined,
        nav_altitude_mcp: ac.nav_altitude_mcp != null ? Number(ac.nav_altitude_mcp) : undefined,
        rssi: ac.rssi != null ? Number(ac.rssi) : undefined,
        messages: ac.messages != null ? Number(ac.messages) : undefined,
        version: ac.version != null ? Number(ac.version) : undefined,
        nac_p: ac.nac_p != null ? Number(ac.nac_p) : undefined,
        nac_v: ac.nac_v != null ? Number(ac.nac_v) : undefined,
        sil: ac.sil != null ? Number(ac.sil) : undefined,
        sil_type: ac.sil_type,
        nic_baro: ac.nic_baro != null ? Number(ac.nic_baro) : undefined,
        rc: ac.rc != null ? Number(ac.rc) : undefined,
        source: ac.type,
        emergency: (ac.emergency && ac.emergency !== 'none') ? String(ac.emergency) : undefined,
      };
      telemetryCache.set(hex, { data, ts: Date.now() });
      return data;
    }
  } catch (err) {
    console.warn(`[FlightAPI] Telemetry fetch failed for ${hex}:`, err);
  }
  telemetryCache.set(hex, { data: null, ts: Date.now() });
  return null;
}
