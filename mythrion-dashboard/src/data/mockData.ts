// Mock Dataset for Mythrion Dashboard
// Combines Osiris (3D) and WorldMonitor (2D) intelligence layers

export interface Flight {
  id: string;
  callsign: string;
  icao24: string;
  airline?: string;
  flightNumber?: string;
  model: string;
  desc?: string;
  registration: string;
  lat: number;
  lng: number;
  alt: number;
  speed_knots: number;
  heading: number;
  type: 'commercial' | 'military' | 'private' | 'jet';
  route: string;
  originAirport?: string | null;
  destinationAirport?: string | null;
  alt_geom?: number;
  ias?: number;
  tas?: number;
  mach?: number;
  wd?: number;
  ws?: number;
  oat?: number;
  tat?: number;
  track_rate?: number;
  roll?: number;
  mag_heading?: number;
  true_heading?: number;
  baro_rate?: number;
  geom_rate?: number;
  squawk?: string;
  emergency?: string;
  category?: string;
  nav_qnh?: number;
  nav_altitude_mcp?: number;
  nav_heading?: number;
  nav_modes?: string[];
  ownOp?: string;
  year?: string;
  rssi?: number;
  messages?: number;
  seen?: number;
  seen_pos?: number;
  dbFlags?: number;
  source?: string;
  version?: number;
  sil?: number;
  sil_type?: string;
  nac_p?: number;
  nac_v?: number;
  nic_baro?: number;
  rc?: number;
}

export interface MaritimePort {
  id: string;
  name: string;
  country: string;
  lat: number;
  lng: number;
  type: 'container' | 'energy' | 'naval';
  volume?: string;
  fleet?: string;
  rank?: number;
}

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
}

export interface Satellite {
  id: string;
  name: string;
  mission: string;
  color: string;
  lat: number;
  lng: number;
  alt: number; // km
  inclination: number; // degrees
  velocity: number; // km/s
}

export interface CCTV {
  id: string;
  name: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
  feed_url?: string;
  stream_url: string;
}

export interface Earthquake {
  id: string;
  magnitude: number;
  place: string;
  depth: number; // km
  lat: number;
  lng: number;
  time: string;
}

export interface FireHotspot {
  id: string;
  brightness: number; // Kelvin
  confidence: number; // %
  lat: number;
  lng: number;
}

export interface NuclearFacility {
  id: string;
  name: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
  status: 'Operational' | 'Active Conflict Zone' | 'Decommissioning';
  reactors: number;
  capacityMW: number;
}

export interface ConflictZone {
  id: string;
  label: string;
  severity: 'war' | 'high' | 'moderate';
  lat: number;
  lng: number;
  description: string;
}

export interface AIDatacenter {
  id: string;
  name: string;
  operator: string;
  gpuCount: number;
  lat: number;
  lng: number;
  status: 'Operational' | 'Expanding' | 'Maintenance';
}

export interface MilitaryBase {
  id: string;
  name: string;
  branch: string;
  country: string;
  lat: number;
  lng: number;
  personnel: number;
}

export interface Cable {
  id: string;
  name: string;
  status: 'Active' | 'Fault' | 'Degraded';
  path: [number, number][]; // Line coordinates
}

export interface TradeRoute {
  id: string;
  name: string;
  traffic: string;
  path: [number, number][];
}

// Static GeoJSON Data / Coordinate Anchor points
export const STATIC_MILITARY_BASES: MilitaryBase[] = [
  { id: 'MB-1', name: 'Norfolk Naval Station', branch: 'Navy', country: 'US', lat: 36.95, lng: -76.33, personnel: 75000 },
  { id: 'MB-2', name: 'Yokosuka Naval Base', branch: 'Navy', country: 'JP', lat: 35.28, lng: 139.67, personnel: 24000 },
  { id: 'MB-3', name: 'Diego Garcia Support Facility', branch: 'Navy/Air Force', country: 'UK/US', lat: -7.31, lng: 72.41, personnel: 5000 },
  { id: 'MB-4', name: 'Ramstein Air Base', branch: 'Air Force', country: 'DE', lat: 49.44, lng: 7.60, personnel: 15000 },
  { id: 'MB-5', name: 'Guam Naval Base', branch: 'Navy', country: 'US', lat: 13.44, lng: 144.70, personnel: 12000 },
  { id: 'MB-6', name: 'Okinawa Air Base', branch: 'Air Force', country: 'JP', lat: 26.35, lng: 127.77, personnel: 20000 },
  { id: 'MB-7', name: 'Severomorsk Naval Base', branch: 'Navy', country: 'RU', lat: 69.07, lng: 33.42, personnel: 18000 },
  { id: 'MB-8', name: 'Tartus Naval Facility', branch: 'Navy', country: 'SY', lat: 34.89, lng: 35.89, personnel: 4000 },
  { id: 'MB-9', name: 'Zhanjiang Base', branch: 'Navy', country: 'CN', lat: 21.20, lng: 110.39, personnel: 16000 }
];

export const STATIC_DATACENTERS: AIDatacenter[] = [
  { id: 'DC-1', name: 'Virginia AI Core (AWS)', operator: 'Amazon Web Services', gpuCount: 45000, lat: 39.04, lng: -77.48, status: 'Operational' },
  { id: 'DC-2', name: 'Frankfurt-West Cloud (Azure)', operator: 'Microsoft Azure', gpuCount: 32000, lat: 50.11, lng: 8.68, status: 'Operational' },
  { id: 'DC-3', name: 'Dublin Tech Cluster (Google)', operator: 'Google Cloud', gpuCount: 28000, lat: 53.34, lng: -6.26, status: 'Expanding' },
  { id: 'DC-4', name: 'Singapore AI Hub (Meta)', operator: 'Meta Platforms', gpuCount: 22000, lat: 1.35, lng: 103.82, status: 'Operational' },
  { id: 'DC-5', name: 'Helsinki HPC Center (LUMI)', operator: 'EuroHPC', gpuCount: 15000, lat: 60.16, lng: 24.93, status: 'Maintenance' },
  { id: 'DC-6', name: 'Tokyo Shibuya Hub (Softbank)', operator: 'Softbank Corp', gpuCount: 18000, lat: 35.67, lng: 139.65, status: 'Operational' },
  { id: 'DC-7', name: 'San Jose Silicon Valley', operator: 'NVIDIA DGX Cloud', gpuCount: 50000, lat: 37.33, lng: -121.88, status: 'Operational' }
];

export const STATIC_PORTS: MaritimePort[] = [
  { id: 'PT-1', name: 'Shanghai Port', country: 'CN', lat: 31.23, lng: 121.47, type: 'container', volume: '47.3M TEU', rank: 1 },
  { id: 'PT-2', name: 'Singapore Port', country: 'SG', lat: 1.26, lng: 103.84, type: 'container', volume: '37.2M TEU', rank: 2 },
  { id: 'PT-3', name: 'Ningbo-Zhoushan Port', country: 'CN', lat: 29.87, lng: 121.55, type: 'container', volume: '33.3M TEU', rank: 3 },
  { id: 'PT-4', name: 'Rotterdam Port', country: 'NL', lat: 51.90, lng: 4.50, type: 'container', volume: '14.5M TEU', rank: 8 },
  { id: 'PT-5', name: 'Dubai Port (Jebel Ali)', country: 'AE', lat: 25.01, lng: 55.06, type: 'container', volume: '14.0M TEU', rank: 9 },
  { id: 'PT-6', name: 'Los Angeles Port', country: 'US', lat: 33.74, lng: -118.27, type: 'container', volume: '9.9M TEU', rank: 13 },
  { id: 'PT-7', name: 'Ras Tanura Terminal', country: 'SA', lat: 26.64, lng: 50.16, type: 'energy', volume: '6.5M bpd oil' },
  { id: 'PT-8', name: 'Fujairah Fueling Station', country: 'AE', lat: 25.14, lng: 56.35, type: 'energy', volume: '3.5M bpd oil' },
  { id: 'PT-9', name: 'Novorossiysk Oil Terminal', country: 'RU', lat: 44.72, lng: 37.77, type: 'energy', volume: '2.8M bpd oil' }
];

export const STATIC_NUCLEAR: NuclearFacility[] = [
  { id: 'NF-1', name: 'Zaporizhzhia Nuclear Plant', city: 'Enerhodar', country: 'UA', lat: 47.51, lng: 34.58, status: 'Active Conflict Zone', reactors: 6, capacityMW: 5700 },
  { id: 'NF-2', name: 'Fukushima Daiichi Plant', city: 'Okuma', country: 'JP', lat: 37.42, lng: 141.03, status: 'Decommissioning', reactors: 6, capacityMW: 4696 },
  { id: 'NF-3', name: 'Gravelines Nuclear Station', city: 'Gravelines', country: 'FR', lat: 51.01, lng: 2.13, status: 'Operational', reactors: 6, capacityMW: 5460 },
  { id: 'NF-4', name: 'Kashiwazaki-Kariwa Plant', city: 'Niigata', country: 'JP', lat: 37.43, lng: 138.60, status: 'Operational', reactors: 7, capacityMW: 7965 },
  { id: 'NF-5', name: 'Palo Verde Generating Station', city: 'Tonopah', country: 'US', lat: 33.39, lng: -112.86, status: 'Operational', reactors: 3, capacityMW: 3937 },
  { id: 'NF-6', name: 'Bruce Nuclear Generating Station', city: 'Tiverton', country: 'CA', lat: 44.33, lng: -81.60, status: 'Operational', reactors: 8, capacityMW: 6430 }
];

export const STATIC_CONFLICTS: ConflictZone[] = [
  { id: 'CZ-1', label: 'Ukraine Main Frontline', severity: 'war', lat: 48.45, lng: 37.85, description: 'High-intensity mechanized warfare along the eastern front, airspace closed, GPS jamming active.' },
  { id: 'CZ-2', label: 'Gaza Corridor Tension', severity: 'war', lat: 31.45, lng: 34.42, description: 'Active conflict zone with military operations, drone patrols, and communication infrastructure disruption.' },
  { id: 'CZ-3', label: 'Yemen Coastline (Red Sea)', severity: 'high', lat: 12.58, lng: 43.33, description: 'Anti-ship missile sites threatening the Bab el-Mandeb chokepoint, coalition naval patrols present.' },
  { id: 'CZ-4', label: 'Taiwan Strait Patrols', severity: 'high', lat: 24.00, lng: 119.00, description: 'Elevated naval and air operations, regular fighter jet intercepts, and naval drills.' },
  { id: 'CZ-5', label: 'Korean DMZ Corridor', severity: 'moderate', lat: 37.90, lng: 126.80, description: 'Heavy fortification, artillery exercises, surveillance balloon activity, and radar monitoring.' }
];

export const STATIC_CABLES: Cable[] = [
  {
    id: 'CB-1',
    name: 'TAT-14 Atlantic Trunk',
    status: 'Active',
    path: [[-74.0, 40.7], [-40.0, 48.0], [-5.0, 50.0], [4.5, 51.9]]
  },
  {
    id: 'CB-2',
    name: 'Transpacific AI Link',
    status: 'Degraded',
    path: [[140.0, 35.6], [175.0, 42.0], [-150.0, 45.0], [-122.0, 37.7]]
  },
  {
    id: 'CB-3',
    name: 'SEA-ME-WE-5 Chokepoint Trunk',
    status: 'Fault',
    path: [[103.8, 1.3], [80.0, 6.0], [56.2, 26.5], [32.3, 30.4], [15.0, 38.0], [4.4, 51.3]]
  }
];

export const STATIC_TRADE_ROUTES: TradeRoute[] = [
  {
    id: 'TR-1',
    name: 'Suez Shipping Highway',
    traffic: '12% Global Trade',
    path: [[103.8, 1.3], [80.0, 6.0], [43.3, 12.6], [32.3, 30.4], [15.0, 38.0], [-1.1, 50.8]]
  },
  {
    id: 'TR-2',
    name: 'Panama Shipping Highway',
    traffic: '5% Global Trade',
    path: [[-122.0, 37.7], [-105.0, 15.0], [-79.6, 9.0], [-74.0, 40.7]]
  },
  {
    id: 'TR-3',
    name: 'Transpacific Highroad',
    traffic: '22% Global Trade',
    path: [[121.4, 31.2], [140.0, 35.6], [180.0, 40.0], [-140.0, 42.0], [-118.2, 33.7]]
  }
];

export const STATIC_CCTVS: CCTV[] = [
  { id: 'CAM-1', name: 'TfL London Bridge Cam', city: 'London', country: 'UK', lat: 51.50, lng: -0.08, stream_url: 'https://images.tfl.gov.uk/tfl/livestream.html?id=00001.02511' },
  { id: 'CAM-2', name: 'Seattle I-5 Hub', city: 'Seattle', country: 'US', lat: 47.60, lng: -122.33, stream_url: 'https://images.wsdot.wa.gov/cameras/i5-shibuya.jpg' },
  { id: 'CAM-3', name: 'NYC Times Square Center', city: 'New York', country: 'US', lat: 40.75, lng: -73.98, stream_url: 'https://video.nyc.gov/embed/ts' },
  { id: 'CAM-4', name: 'Tokyo Shibuya Crossing', city: 'Tokyo', country: 'JP', lat: 35.66, lng: 139.70, stream_url: 'https://www.youtube.com/embed/cross-shibuya' }
];

export const STATIC_EARTHQUAKES: Earthquake[] = [
  { id: 'EQ-1', magnitude: 6.2, place: 'Honshu East Coast, Japan', depth: 42, lat: 36.50, lng: 141.20, time: new Date().toISOString() },
  { id: 'EQ-2', magnitude: 4.8, place: 'Central California Fault Line', depth: 8, lat: 35.90, lng: -120.40, time: new Date().toISOString() },
  { id: 'EQ-3', magnitude: 5.5, place: 'Aegean Sea Volcanic Ring', depth: 15, lat: 37.20, lng: 25.40, time: new Date().toISOString() },
  { id: 'EQ-4', magnitude: 7.1, place: 'Banda Sea Subduction Zone', depth: 120, lat: -7.20, lng: 129.10, time: new Date().toISOString() }
];

export const STATIC_FIRES: FireHotspot[] = [
  { id: 'FR-1', brightness: 345.5, confidence: 85, lat: -15.40, lng: -55.20 }, // Amazon region
  { id: 'FR-2', brightness: 320.2, confidence: 71, lat: -32.50, lng: 116.80 }, // SW Australia
  { id: 'FR-3', brightness: 338.0, confidence: 92, lat: 34.60, lng: -118.90 }, // California foothills
  { id: 'FR-4', brightness: 312.4, confidence: 60, lat: 5.30, lng: 22.80 }   // Congo basin
];

export const STATIC_SATELLITES: Satellite[] = [
  { id: 'SAT-1', name: 'ISS (Space Station)', mission: 'Human Habitation', color: '#00e5ff', lat: 0, lng: 0, alt: 420, inclination: 51.6, velocity: 7.66 },
  { id: 'SAT-2', name: 'GPS B-IIF-8 (Navstar)', mission: 'Military Geolocation', color: '#d4af37', lat: 0, lng: 0, alt: 20200, inclination: 55.0, velocity: 3.87 },
  { id: 'SAT-3', name: 'Sentinel-2B (ESA)', mission: 'Earth Monitoring', color: '#00e676', lat: 0, lng: 0, alt: 786, inclination: 98.5, velocity: 7.46 },
  { id: 'SAT-4', name: 'USA-245 (KH-11 Keyhole)', mission: 'Surveillance / Recon', color: '#ff3d3d', lat: 0, lng: 0, alt: 390, inclination: 97.2, velocity: 7.68 }
];

// Flight data is now fetched live from the OpenSky Network API.
// See src/data/flightApi.ts for the real-time data fetch and classification logic.

export const INITIAL_SHIPS: Ship[] = [
  { id: 'SH-1', name: 'COSCO SHIPPING SCENARIO', flag: 'China', type: 'cargo', lat: 31.0, lng: 122.5, speed: 18, heading: 130, destination: 'Singapore' },
  { id: 'SH-2', name: 'MAERSK MC-KINNEY MOLLER', flag: 'Denmark', type: 'cargo', lat: 1.2, lng: 104.5, speed: 20, heading: 270, destination: 'Rotterdam' },
  { id: 'SH-3', name: 'AL KHAZNAH (LNG)', flag: 'UAE', type: 'tanker', lat: 26.5, lng: 56.5, speed: 15, heading: 220, destination: 'Port Said' },
  { id: 'SH-4', name: 'PACIFIC RAPTOR (OIL)', flag: 'Panama', type: 'tanker', lat: 34.0, lng: -121.0, speed: 14, heading: 340, destination: 'Los Angeles' },
  { id: 'SH-5', name: 'USS GERALD R. FORD (CVN-78)', flag: 'US Navy', type: 'military', lat: 36.0, lng: -72.0, speed: 28, heading: 90, destination: 'Mediterranean Sea' },
  { id: 'SH-6', name: 'HMS QUEEN ELIZABETH (R08)', flag: 'Royal Navy', type: 'military', lat: 50.2, lng: -2.5, speed: 22, heading: 240, destination: 'Portsmouth' },
  { id: 'SH-7', name: 'CNS SHANDONG (17)', flag: 'PLA Navy', type: 'military', lat: 21.0, lng: 112.5, speed: 25, heading: 200, destination: 'South China Sea' },
  { id: 'SH-8', name: 'TI EUROPE (SUPER TANKER)', flag: 'Belgium', type: 'tanker', lat: 24.5, lng: 57.5, speed: 13, heading: 180, destination: 'Chiba' },
  { id: 'SH-9', name: 'VALEMAX MINAS GERAIS', flag: 'Brazil', type: 'cargo', lat: -23.0, lng: -43.0, speed: 15, heading: 80, destination: 'Qingdao' },
  { id: 'SH-10', name: 'SUEZMAX EVER CONCORD', flag: 'Panama', type: 'cargo', lat: 29.9, lng: 32.5, speed: 16, heading: 180, destination: 'Singapore' },
  { id: 'SH-11', name: 'ENERGY FRONTIER (LNG)', flag: 'Japan', type: 'tanker', lat: 1.2, lng: 103.8, speed: 17, heading: 60, destination: 'Tokyo' },
  { id: 'SH-12', name: 'INS VIKRANT (R11)', flag: 'India', type: 'military', lat: 18.9, lng: 72.8, speed: 26, heading: 210, destination: 'Indian Ocean' }
];

// Generator to simulate live movements
export class LiveDataSimulator {
  public ships: Ship[] = [...INITIAL_SHIPS];
  public satellites: Satellite[] = [...STATIC_SATELLITES];
  private startTime = Date.now();

  constructor() {}

  public update() {
    // 1. Move ships (flights are now fetched live from OpenSky API)
    this.ships = this.ships.map(s => {
      const speedMPS = s.speed * 0.514444; // knots to m/s
      const distM = speedMPS * 1 * 50; // speed up simulation by 50x
      const R = 6378137;
      const headingRad = (s.heading * Math.PI) / 180;
      
      const latRad = (s.lat * Math.PI) / 180;
      const lngRad = (s.lng * Math.PI) / 180;
      const dR = distM / R;

      const nextLatRad = Math.asin(
        Math.sin(latRad) * Math.cos(dR) +
        Math.cos(latRad) * Math.sin(dR) * Math.cos(headingRad)
      );

      const nextLngRad = lngRad + Math.atan2(
        Math.sin(headingRad) * Math.sin(dR) * Math.cos(latRad),
        Math.cos(dR) - Math.sin(latRad) * Math.sin(nextLatRad)
      );

      let nextLat = (nextLatRad * 180) / Math.PI;
      let nextLng = (nextLngRad * 180) / Math.PI;

      if (nextLng < -180) nextLng += 360;
      if (nextLng > 180) nextLng -= 360;

      // Keep ships in ocean latitudes
      if (nextLat < -65) nextLat = -65;
      if (nextLat > 75) nextLat = 75;

      return {
        ...s,
        lat: nextLat,
        lng: nextLng
      };
    });

    // 3. Move satellites in orbital arcs
    const elapsedMinutes = ((Date.now() - this.startTime) / 1000 / 60) * 8; // accelerated orbit

    this.satellites = this.satellites.map(sat => {
      // Calculate circular orbit coordinates based on time and inclination
      const periodMins = 90; // typical LEO orbit duration
      const angle = (2 * Math.PI * elapsedMinutes) / periodMins;
      const incRad = (sat.inclination * Math.PI) / 180;

      // Simple orbital math
      const z = Math.sin(angle) * Math.sin(incRad);
      const latRad = Math.asin(z);
      const lngRad = Math.atan2(Math.sin(angle) * Math.cos(incRad), Math.cos(angle)) + (elapsedMinutes * 0.05); // add Earth rotation drift

      let lat = (latRad * 180) / Math.PI;
      let lng = (lngRad * 180) / Math.PI;

      // Wrap longitude
      lng = ((lng + 180) % 360) - 180;

      return {
        ...sat,
        lat,
        lng
      };
    });
  }
}

export interface Webcam {
  id: string;
  name: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
  url: string;
}

export interface GPSJammingZone {
  id: string;
  name: string;
  lat: number;
  lng: number;
  radiusKm: number;
  intensity: 'Severe' | 'High' | 'Moderate' | 'Low';
}

export interface ProtestEvent {
  id: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
  size: number;
  intensity: 'high' | 'medium' | 'low';
  description: string;
}

export interface CyberThreatNode {
  id: string;
  name: string;
  target: string;
  lat: number;
  lng: number;
  sourceCountry: string;
  severity: 'critical' | 'high' | 'medium';
}

export interface SanctionedZone {
  id: string;
  country: string;
  level: 'severe' | 'high' | 'moderate';
  lat: number;
  lng: number;
  description: string;
}

export interface GeolocatedNews {
  id: string;
  title: string;
  category: string;
  lat: number;
  lng: number;
  urgency: 'critical' | 'high' | 'medium';
  description: string;
}

export interface WeatherAlert {
  id: string;
  name: string;
  type: 'Typhoon' | 'Cyclone' | 'Blizzard' | 'Heatwave' | 'Wildfire' | 'Severe Storm';
  lat: number;
  lng: number;
  radiusKm: number;
  severity: 'critical' | 'high' | 'warning';
}

export interface DiseaseOutbreak {
  id: string;
  disease: string;
  location: string;
  lat: number;
  lng: number;
  cases: number;
  status: 'active' | 'contained' | 'spreading';
}

export interface InternetDisruption {
  id: string;
  region: string;
  country: string;
  lat: number;
  lng: number;
  status: 'Total Outage' | 'Partial Outage' | 'BGP Leak' | 'Fiber Cut';
  description: string;
}

export interface StorageFacility {
  id: string;
  name: string;
  operator: string;
  facilityType: 'UGS' | 'SPR' | 'LNG' | 'Tank Farm';
  country: string;
  lat: number;
  lng: number;
  capacityTwh?: number;
  capacityMb?: number;
  capacityMtpa?: number;
  workingCapacityUnit: string;
  inService: number;
  publicBadge: string;
}

export const STATIC_WEBCAMS: Webcam[] = [
  { id: 'WC-1', name: 'Times Square Live Stream', city: 'New York', country: 'USA', lat: 40.7580, lng: -73.9850, url: 'https://www.youtube.com/embed/1-iS7LArIbA' },
  { id: 'WC-2', name: 'Tokyo Shibuya Crossing Live', city: 'Tokyo', country: 'Japan', lat: 35.6595, lng: 139.7005, url: 'https://www.youtube.com/embed/dJf4wryo8GE' },
  { id: 'WC-3', name: 'London Piccadilly Circus', city: 'London', country: 'UK', lat: 51.5101, lng: -0.1349, url: 'https://www.youtube.com/embed/hO2_qfD-Y28' },
  { id: 'WC-4', name: 'Venice Grand Canal Live', city: 'Venice', country: 'Italy', lat: 45.4372, lng: 12.3333, url: 'https://www.youtube.com/embed/HpZAez2oYS0' }
];

export const STATIC_GPS_JAMMING: GPSJammingZone[] = [
  { id: 'GJ-1', name: 'Baltic Sea Jamming Sector', lat: 55.5, lng: 18.5, radiusKm: 350, intensity: 'Severe' },
  { id: 'GJ-2', name: 'Northern Levant Jamming Sector', lat: 33.5, lng: 35.2, radiusKm: 200, intensity: 'Severe' },
  { id: 'GJ-3', name: 'Black Sea Maritime Jamming', lat: 43.5, lng: 32.0, radiusKm: 300, intensity: 'Moderate' },
  { id: 'GJ-4', name: 'Suwalki Gap Border Interference', lat: 54.0, lng: 23.0, radiusKm: 150, intensity: 'High' }
];

export const STATIC_PROTESTS: ProtestEvent[] = [
  { id: 'PR-1', city: 'Paris', country: 'France', lat: 48.8566, lng: 2.3522, size: 45000, intensity: 'high', description: 'Mass demonstrations over labor reforms and economic policy near Place de la République.' },
  { id: 'PR-2', city: 'Buenos Aires', country: 'Argentina', lat: -34.6037, lng: -58.3816, size: 30000, intensity: 'medium', description: 'Public sector union march opposing inflation cuts near Plaza de Mayo.' },
  { id: 'PR-3', city: 'Seoul', country: 'South Korea', lat: 37.5665, lng: 126.9780, size: 15000, intensity: 'low', description: 'Environmental protestors demanding updates to carbon neutrality targets.' },
  { id: 'PR-4', city: 'Nairobi', country: 'Kenya', lat: -1.2921, lng: 36.8219, size: 20000, intensity: 'high', description: 'Protests calling for fuel subsidies and tax policy revisions.' }
];

export const STATIC_CYBER_THREATS: CyberThreatNode[] = [
  { id: 'CT-1', name: 'Ransomware Outbreak', target: 'Berlin Health Grid', lat: 52.5200, lng: 13.4050, sourceCountry: 'Unknown', severity: 'critical' },
  { id: 'CT-2', name: 'APT29 Spearphishing', target: 'Brussels NATO HQ', lat: 50.8503, lng: 4.3517, sourceCountry: 'Russia', severity: 'high' },
  { id: 'CT-3', name: 'DDoS Botnet Flooding', target: 'Tokyo Stock Exchange', lat: 35.6762, lng: 139.6503, sourceCountry: 'East Asia', severity: 'medium' },
  { id: 'CT-4', name: 'SCADA Malware Probe', target: 'Gulf Oil Terminals', lat: 26.5000, lng: 50.6000, sourceCountry: 'Middle East State Actor', severity: 'high' }
];

export const STATIC_SANCTIONED_ZONES: SanctionedZone[] = [
  { id: 'SZ-1', country: 'Iran', level: 'severe', lat: 32.4279, lng: 53.6880, description: 'OFAC secondary sanctions targeting petroleum, banking, and shipping sectors.' },
  { id: 'SZ-2', country: 'North Korea', level: 'severe', lat: 40.3399, lng: 127.5101, description: 'UN security council resolutions restricting minerals, seafood, and oil imports.' },
  { id: 'SZ-3', country: 'Russia', level: 'severe', lat: 61.5240, lng: 105.3188, description: 'G7 price caps on oil, asset freezes on major banks, technology export restrictions.' },
  { id: 'SZ-4', country: 'Venezuela', level: 'high', lat: 6.4238, lng: -66.5897, description: 'Sectoral sanctions restricting sovereign debt operations and state-owned oil exports.' }
];

export const STATIC_LIVE_NEWS: GeolocatedNews[] = [
  { id: 'LN-1', title: 'Maritime Border Accords Signed', category: 'Geopolitics', lat: -8.4000, lng: 115.5000, urgency: 'medium', description: 'Indonesia and Malaysia sign historic territorial agreement over the Lombok Strait.' },
  { id: 'LN-2', title: 'Severe Subsea Cable Interruption', category: 'Telecoms', lat: 34.0000, lng: 20.0000, urgency: 'critical', description: 'Seismic activity triggers cable slide, disrupting communications to Mediterranean hubs.' },
  { id: 'LN-3', title: 'Semiconductor Plant Construction', category: 'Tech Infrastructure', lat: 33.4484, lng: -112.0740, urgency: 'medium', description: 'Advanced packaging facility breaks ground in Phoenix, accelerating domestic supply chain plans.' },
  { id: 'LN-4', title: 'Carrier Strike Group Deployed', category: 'Military', lat: 15.0000, lng: 135.0000, urgency: 'high', description: 'Seventh Fleet moves carrier strike group into Western Pacific for naval readiness drills.' }
];

export const STATIC_WEATHER_ALERTS: WeatherAlert[] = [
  { id: 'WA-1', name: 'Super Typhoon Mawar', type: 'Typhoon', lat: 14.5, lng: 142.0, radiusKm: 400, severity: 'critical' },
  { id: 'WA-2', name: 'Arctic Blizzard Drift', type: 'Blizzard', lat: 55.0, lng: -90.0, radiusKm: 600, severity: 'high' },
  { id: 'WA-3', name: 'Western Australia Heatwave', type: 'Heatwave', lat: -25.0, lng: 122.0, radiusKm: 500, severity: 'warning' },
  { id: 'WA-4', name: 'Mediterranean Cyclone (Medicane)', type: 'Cyclone', lat: 36.0, lng: 18.0, radiusKm: 300, severity: 'high' }
];

export const STATIC_DISEASE_OUTBREAKS: DiseaseOutbreak[] = [
  { id: 'DO-1', disease: 'Lassa Fever', location: 'West Africa (Nigeria)', lat: 9.0820, lng: 8.6753, cases: 340, status: 'spreading' },
  { id: 'DO-2', disease: 'Dengue Outbreak', location: 'South America (Rio de Janeiro)', lat: -22.9068, lng: -43.1729, cases: 1250, status: 'active' },
  { id: 'DO-3', disease: 'Cholera Cluster', location: 'East Africa (Malawi)', lat: -13.2543, lng: 34.3015, cases: 180, status: 'contained' }
];

export const STATIC_INTERNET_DISRUPTIONS: InternetDisruption[] = [
  { id: 'ID-1', region: 'Red Sea Gateway', country: 'Egypt/Yemen', lat: 20.0, lng: 38.5, status: 'Fiber Cut', description: 'Triple subsea cable cut causing 45% latency surge between Europe and Singapore.' },
  { id: 'ID-2', region: 'Lagos Internet Center', country: 'Nigeria', lat: 6.45, lng: 3.39, status: 'BGP Leak', description: 'Autonomous system routing error misdirects West African web traffic for 4 hours.' },
  { id: 'ID-3', region: 'Kharkiv Power Grid Failure', country: 'Ukraine', lat: 50.0, lng: 36.2, status: 'Total Outage', description: 'Grid bombardment triggers massive connectivity collapse in municipal region.' }
];

export const STATIC_STORAGE_FACILITIES: StorageFacility[] = [
  { id: 'SF-1', name: 'Cushing Crude Storage Hub', operator: 'Plains All American', facilityType: 'Tank Farm', country: 'USA', lat: 35.98, lng: -96.77, capacityMb: 85.0, workingCapacityUnit: 'Mb', inService: 1982, publicBadge: 'verified' },
  { id: 'SF-2', name: 'Rotterdam LNG Gate Terminal', operator: 'Gasunie & Vopak', facilityType: 'LNG', country: 'Netherlands', lat: 51.96, lng: 4.07, capacityTwh: 12.0, workingCapacityUnit: 'TWh', inService: 2011, publicBadge: 'certified' },
  { id: 'SF-3', name: 'Rehden Underground Gas Storage', operator: 'SEFE Storage', facilityType: 'UGS', country: 'Germany', lat: 52.61, lng: 8.48, capacityTwh: 44.0, workingCapacityUnit: 'TWh', inService: 1993, publicBadge: 'monitored' },
  { id: 'SF-4', name: 'Bryan Mound SPR Site', operator: 'US Department of Energy', facilityType: 'SPR', country: 'USA', lat: 28.93, lng: -95.34, capacityMb: 247.0, workingCapacityUnit: 'Mb', inService: 1977, publicBadge: 'strategic' },
  { id: 'SF-5', name: 'Sodegaura LNG Terminal', operator: 'Tokyo Gas', facilityType: 'LNG', country: 'Japan', lat: 35.43, lng: 140.00, capacityMtpa: 20.0, workingCapacityUnit: 'Mtpa', inService: 1973, publicBadge: 'certified' },
  { id: 'SF-6', name: 'Hormuz Fuel Oil Reservoirs', operator: 'ADNOC', facilityType: 'Tank Farm', country: 'UAE', lat: 25.18, lng: 56.36, capacityMb: 18.0, workingCapacityUnit: 'Mb', inService: 2016, publicBadge: 'strategic' }
];
