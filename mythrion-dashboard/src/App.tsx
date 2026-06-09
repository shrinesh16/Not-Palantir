import { useEffect, useState, useRef, useCallback } from 'react';
import { MythrionMap } from './components/MythrionMap';
import { fetchLiveFlights, fetchFlightRoute, fetchAircraftMetadata, type AircraftMetadata, fetchAircraftTelemetry, type AircraftTelemetry } from './data/flightApi';
import { 
  LiveDataSimulator, 
  type Flight, 
  type Satellite,
  STATIC_MILITARY_BASES,
  STATIC_DATACENTERS,
  STATIC_NUCLEAR,
  STATIC_CONFLICTS,
  STATIC_CABLES,
  STATIC_CCTVS,
  STATIC_EARTHQUAKES,
  STATIC_FIRES,
  STATIC_WEBCAMS,
  STATIC_GPS_JAMMING,
  STATIC_PROTESTS,
  STATIC_CYBER_THREATS,
  STATIC_SANCTIONED_ZONES,
  STATIC_LIVE_NEWS,
  STATIC_WEATHER_ALERTS,
  STATIC_DISEASE_OUTBREAKS,
  STATIC_INTERNET_DISRUPTIONS,
  STATIC_STORAGE_FACILITIES
} from './data/mockData';
import { fetchLiveShips, type Ship } from './data/shipApi';
import { GLOBAL_AIRPORTS, AIRPORT_TYPE_LABELS, lookupAirportName } from './data/airports';
import { GLOBAL_PORTS, PORT_SIZE_LABELS } from './data/ports';
import { PIPELINES } from './data/worldmonitor/pipelines';
import { STRATEGIC_WATERWAYS, SPACEPORTS, CRITICAL_MINERALS } from './data/worldmonitor/geo';
import * as Icons from 'lucide-react';
import { LayerPanel } from './components/LayerPanel';
import { BASE_MARITIME_PATHS } from './data/maritimeLines';

// Initialize the simulator
const simulator = new LiveDataSimulator();

// Default layer state configuration for all 33 layers
const defaultLayers: Record<string, boolean> = {
  airports: true,
  flights_commercial: false,
  flights_private: false,
  flights_jet: false,
  flights_military: false,
  ships: false,
  ships_tanker: false,
  ports: false,
  tradeRoutes: false,
  waterways: false,
  satellites: false,
  spaceports: false,
  militaryBases: false,
  datacenters: false,
  nuclear: false,
  cables: false,
  pipelines: false,
  storage_facilities: false,
  minerals: false,
  internet_disruptions: false,
  conflicts: false,
  cctvs: false,
  webcams: false,
  gps_jamming: false,
  protests: false,
  cyber_threats: false,
  sanctioned_zones: false,
  live_news: false,
  earthquakes: false,
  fires: false,
  weather_alerts: false,
  disease_outbreaks: false,
  dayNight: false
};

export default function App() {
  const [projection, setProjection] = useState<'globe' | 'mercator'>('globe');
  const [mapStyle, setMapStyle] = useState<'dark' | 'satellite'>('dark');
  const [selectedEntity, setSelectedEntity] = useState<any>(null);
  const [zuluTime, setZuluTime] = useState<string>(() => new Date().toISOString().substring(11, 19) + 'Z');
  const [uptime, setUptime] = useState<string>('00:00:00');
  const [zoom, setZoom] = useState<number>(1.5);
  const [center, setCenter] = useState<[number, number]>([0, 20]);
  const [netSpeed, setNetSpeed] = useState<string>('45.2 Mbps');
  const [activeLayers, setActiveLayers] = useState<Record<string, boolean>>(defaultLayers);

  const [debouncedViewport, setDebouncedViewport] = useState({ center: [0, 20] as [number, number], zoom: 1.5 });

  // Debounce center/zoom updates for flight data fetching to prevent spamming the API on every frame of dragging/zooming
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedViewport({ center, zoom });
    }, 400);

    return () => {
      clearTimeout(handler);
    };
  }, [center, zoom]);

  const toggleLayer = useCallback((layerKey: string) => {
    setActiveLayers(prev => ({
      ...prev,
      [layerKey]: !prev[layerKey]
    }));
  }, []);

  const toggleGroup = useCallback((keys: string[], targetState: boolean) => {
    setActiveLayers(prev => {
      const next = { ...prev };
      keys.forEach(key => {
        next[key] = targetState;
      });
      return next;
    });
  }, []);

  const handleMapViewportChange = useCallback((vp: { zoom: number; center: [number, number] }) => {
    setZoom(vp.zoom);
    setCenter(vp.center);
  }, []);

  // Real-time HUD stats timer (Zulu time, Uptime, and Network Speed)
  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const now = new Date();
      setZuluTime(now.toISOString().substring(11, 19) + 'Z');

      const elapsedMs = Date.now() - startTime;
      const totalSecs = Math.floor(elapsedMs / 1000);
      const hours = Math.floor(totalSecs / 3600).toString().padStart(2, '0');
      const mins = Math.floor((totalSecs % 3600) / 60).toString().padStart(2, '0');
      const secs = (totalSecs % 60).toString().padStart(2, '0');
      setUptime(`${hours}:${mins}:${secs}`);

      // Simulate real-time network speed variations (around 45 Mbps)
      const baseSpeed = 45.0;
      const variation = (Math.random() * 4 - 2); // -2 to +2
      const speedValue = (baseSpeed + variation).toFixed(1);
      setNetSpeed(`${speedValue} Mbps`);
    }, 1000);

    return () => clearInterval(interval);
  }, []);
  
  // Real-time dynamic state
  const [flights, setFlights] = useState<Flight[]>([]);
  const [ships, setShips] = useState<Ship[]>([]);
  const [satellites, setSatellites] = useState<Satellite[]>([]);
  const selectedEntityRef = useRef(selectedEntity);
  selectedEntityRef.current = selectedEntity;

  const counts = {
    airports: GLOBAL_AIRPORTS.length,
    flights_commercial: flights.filter(f => f.type === 'commercial').length,
    flights_private: flights.filter(f => f.type === 'private').length,
    flights_jet: flights.filter(f => f.type === 'jet').length,
    flights_military: flights.filter(f => f.type === 'military').length,
    ships: ships.filter(s => s.type === 'cargo' || s.type === 'military').length,
    ships_tanker: ships.filter(s => s.type === 'tanker').length,
    ports: GLOBAL_PORTS.length,
    tradeRoutes: BASE_MARITIME_PATHS.length,
    waterways: STRATEGIC_WATERWAYS.length,
    satellites: satellites.length,
    spaceports: SPACEPORTS.length,
    militaryBases: STATIC_MILITARY_BASES.length,
    datacenters: STATIC_DATACENTERS.length,
    nuclear: STATIC_NUCLEAR.length,
    cables: STATIC_CABLES.length,
    pipelines: PIPELINES.length,
    storage_facilities: STATIC_STORAGE_FACILITIES.length,
    minerals: CRITICAL_MINERALS.length,
    internet_disruptions: STATIC_INTERNET_DISRUPTIONS.length,
    conflicts: STATIC_CONFLICTS.length,
    cctvs: STATIC_CCTVS.length,
    webcams: STATIC_WEBCAMS.length,
    gps_jamming: STATIC_GPS_JAMMING.length,
    protests: STATIC_PROTESTS.length,
    cyber_threats: STATIC_CYBER_THREATS.length,
    sanctioned_zones: STATIC_SANCTIONED_ZONES.length,
    live_news: STATIC_LIVE_NEWS.length,
    earthquakes: STATIC_EARTHQUAKES.length,
    fires: STATIC_FIRES.length,
    weather_alerts: STATIC_WEATHER_ALERTS.length,
    disease_outbreaks: STATIC_DISEASE_OUTBREAKS.length,
    dayNight: 0
  };

  // ── Live Flight Data from airplanes.live API ──────────────────────────
  const loadFlights = useCallback(async () => {
    try {
      const liveFlights = await fetchLiveFlights({
        lat: debouncedViewport.center[1],
        lng: debouncedViewport.center[0],
        zoom: debouncedViewport.zoom
      });
      if (liveFlights.length > 0) {
        setFlights(liveFlights);
      }
    } catch {
      // Ignore
    }
  }, [debouncedViewport]);

  useEffect(() => {
    // Initial fetch
    loadFlights();

    // Poll every 15 seconds
    const flightInterval = setInterval(loadFlights, 15000);

    return () => clearInterval(flightInterval);
  }, [loadFlights]);

  // ── Live Ship Data from Digitraffic API (30s poll) ────────────────────
  const [liveShips, setLiveShips] = useState<Ship[]>([]);

  const loadShips = useCallback(async () => {
    try {
      const data = await fetchLiveShips();
      if (data.length > 0) {
        setLiveShips(data);
      }
    } catch (err) {
      console.warn('Failed to load live ships:', err);
    }
  }, []);

  useEffect(() => {
    // Initial fetch
    loadShips();

    // Poll every 30 seconds
    const shipInterval = setInterval(loadShips, 30000);

    return () => clearInterval(shipInterval);
  }, [loadShips]);

  // ── Combine Live & Simulated Ships ─────────────────────────────────────
  useEffect(() => {
    const combined = [...liveShips];
    
    // Merge simulated ships for global trade routes (avoid duplicates)
    simulator.ships.forEach(simShip => {
      if (!combined.some(s => s.id === simShip.id)) {
        combined.push(simShip);
      }
    });

    setShips(combined);

    // Keep coordinates/telemetry updated for selected ship
    const entity = selectedEntityRef.current;
    if (entity && (entity.type === 'ship' || entity.properties?.layerType === 'ship')) {
      const updated = combined.find(s => s.id === entity.id);
      if (updated) {
        setSelectedEntity((prev: any) => ({ ...prev, properties: updated }));
      }
    }
  }, [liveShips, simulator.ships]);

  // ── Satellite Simulation Loop (1s tick) ───────────────────────────────
  useEffect(() => {
    setSatellites([...simulator.satellites]);

    const interval = setInterval(() => {
      simulator.update();
      setSatellites([...simulator.satellites]);

      // Keep coordinates updated for selected satellite
      const entity = selectedEntityRef.current;
      if (entity && entity.type === 'satellite') {
        const updated = simulator.satellites.find(s => s.id === entity.id);
        if (updated) {
          setSelectedEntity((prev: any) => ({ ...prev, properties: updated }));
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Fetch flight route and metadata when selected entity is a flight
  const [selectedFlightRoute, setSelectedFlightRoute] = useState<{ origin: string | null; destination: string | null } | null>(null);
  const [selectedFlightMetadata, setSelectedFlightMetadata] = useState<AircraftMetadata | null>(null);
  const [selectedFlightTelemetry, setSelectedFlightTelemetry] = useState<AircraftTelemetry | null>(null);
  const [isLoadingRoute, setIsLoadingRoute] = useState<boolean>(false);
  const [isLoadingMetadata, setIsLoadingMetadata] = useState<boolean>(false);
  const [, setIsLoadingTelemetry] = useState<boolean>(false);

  useEffect(() => {
    const isFlight = selectedEntity && (
      selectedEntity.type === 'flight' ||
      selectedEntity.type === 'commercial' ||
      selectedEntity.type === 'private' ||
      selectedEntity.type === 'jet' ||
      selectedEntity.type === 'military'
    );
    if (isFlight && selectedEntity.properties.icao24) {
      setSelectedFlightRoute(null);
      setSelectedFlightMetadata(null);
      setSelectedFlightTelemetry(null);
      setIsLoadingRoute(true);
      setIsLoadingMetadata(true);
      setIsLoadingTelemetry(true);

      const callsign = selectedEntity.properties.callsign;
      const icao24 = selectedEntity.properties.icao24;

      if (callsign) {
        fetchFlightRoute(callsign).then(route => {
          setSelectedFlightRoute(route);
          setIsLoadingRoute(false);
        }).catch(() => {
          setSelectedFlightRoute(null);
          setIsLoadingRoute(false);
        });
      } else {
        setIsLoadingRoute(false);
      }

      fetchAircraftMetadata(icao24).then(meta => {
        setSelectedFlightMetadata(meta);
        setIsLoadingMetadata(false);
      }).catch(() => {
        setSelectedFlightMetadata(null);
        setIsLoadingMetadata(false);
      });

      fetchAircraftTelemetry(icao24).then(telemetry => {
        setSelectedFlightTelemetry(telemetry);
        setIsLoadingTelemetry(false);
      }).catch(() => {
        setSelectedFlightTelemetry(null);
        setIsLoadingTelemetry(false);
      });
    } else {
      setSelectedFlightRoute(null);
      setSelectedFlightMetadata(null);
      setSelectedFlightTelemetry(null);
      setIsLoadingRoute(false);
      setIsLoadingMetadata(false);
      setIsLoadingTelemetry(false);
    }
  }, [selectedEntity]);

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {/* Floating HUD Transparent Topbar */}
      <header className="topbar">
        <div className="topbar-left">
          <div className="topbar-logo">
            <svg width="34" height="34" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Crosshair target lines */}
              <line x1="20" y1="4" x2="20" y2="36" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1.5"/>
              <line x1="4" y1="20" x2="36" y2="20" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1.5"/>
              {/* Outer rounded square */}
              <rect x="8" y="8" width="24" height="24" rx="5" stroke="#ffffff" strokeWidth="2.5" fill="none"/>
              {/* Shaded center square */}
              <rect x="17" y="17" width="6" height="6" fill="rgba(255, 255, 255, 0.85)" className="logo-pulse-dot"/>
            </svg>
          </div>
          <div className="topbar-brand">
            <div className="topbar-title-row">
              <span className="topbar-title">MYTHRION</span>
              <div className="topbar-badge">
                <Icons.Globe size={11} className="topbar-badge-icon" />
                <span className="topbar-badge-text">OPEN SOURCE</span>
              </div>
            </div>
            <div className="topbar-subtitle">GLOBAL INTELLIGENCE PLATFORM</div>
          </div>
        </div>

        <div className="topbar-right">
          <div className="topbar-zulu-pill">
            ZULU {zuluTime}
          </div>
          <span className="topbar-divider">|</span>
          <div className="topbar-stat-item">
            <span className="topbar-stat-label">SYS:</span>
            <span className="topbar-stat-value-green">CONNECTED</span>
          </div>
          <div className="topbar-stat-item">
            <span className="topbar-stat-label">NET:</span>
            <span className="topbar-stat-value-cyan">{netSpeed}</span>
          </div>
          <div className="topbar-stat-item">
            <span className="topbar-stat-label">UPTIME:</span>
            <span className="topbar-stat-value-gold">{uptime}</span>
          </div>
          <span className="topbar-divider">|</span>
          <div className="topbar-stat-item">
            <span className="topbar-stat-label">ZOOM</span>
            <span className="topbar-stat-value-gold">{zoom.toFixed(1)}</span>
          </div>
          <span className="topbar-divider">|</span>
          <div className="topbar-stat-item">
            <span className="topbar-stat-label">ACTIVE LAYERS</span>
            <Icons.Layers size={12} className="topbar-stat-icon-gold" />
            <span className="topbar-stat-value-gold">{Object.values(activeLayers).filter(Boolean).length}</span>
          </div>
          <span className="topbar-divider">|</span>
          <div className="topbar-stat-item">
            <span className="topbar-stat-label">COORDINATES</span>
            <span className="topbar-stat-value-gold">
              {center[1].toFixed(4)}, {center[0].toFixed(4)}
            </span>
          </div>
        </div>
      </header>

      {/* Background Interactive Map */}
      <MythrionMap
        projection={projection}
        activeLayers={activeLayers}
        onSelectEntity={setSelectedEntity}
        flights={flights}
        ships={ships}
        satellites={satellites}
        mapStyle={mapStyle}
        onMapViewportChange={handleMapViewportChange}
      />

      {/* Floating HUD Viewport Switcher */}
      <div className="map-view-controls">
        <button
          onClick={() => setProjection(prev => prev === 'globe' ? 'mercator' : 'globe')}
          className="map-control-btn active"
          title={projection === 'globe' ? "Switch to 2D Map (Mercator)" : "Switch to 3D Map (Globe)"}
        >
          {projection === 'globe' ? <Icons.Grid size={18} /> : <Icons.Globe size={18} />}
        </button>
        <button
          onClick={() => setMapStyle(prev => prev === 'dark' ? 'satellite' : 'dark')}
          className="map-control-btn active"
          title={mapStyle === 'dark' ? "Switch to Satellite Imagery" : "Switch to Night Vector Map"}
        >
          {mapStyle === 'dark' ? <Icons.Satellite size={18} /> : <Icons.Moon size={18} />}
        </button>
      </div>

      <LayerPanel 
        activeLayers={activeLayers} 
        onToggleLayer={toggleLayer} 
        onToggleGroup={toggleGroup}
        counts={counts}
      />

      {/* Entity Inspector Panel (Details Card) */}
      {selectedEntity && (
        <div className="entity-inspector">
          <div className="inspector-header">
            <div className="inspector-title-row">
              <span className="inspector-category">
                {selectedEntity.type === 'airport' ? '✈️ AIRPORT' : selectedEntity.type === 'port' ? `⚓ ${String(selectedEntity.properties.facilityType || 'PORT').toUpperCase()}` : selectedEntity.type.toUpperCase()}
              </span>
              <button className="inspector-close-btn" onClick={() => setSelectedEntity(null)} title="Close Inspector">
                <Icons.X size={14} />
              </button>
            </div>
            <div className="inspector-title">
              {(() => {
                const isFlight = selectedEntity && (
                  selectedEntity.type === 'flight' ||
                  selectedEntity.type === 'commercial' ||
                  selectedEntity.type === 'private' ||
                  selectedEntity.type === 'jet' ||
                  selectedEntity.type === 'military'
                );
                if (isFlight && selectedFlightMetadata?.ownOp) {
                  return `${selectedFlightMetadata.ownOp} (${selectedEntity.properties.callsign})`;
                }
                return selectedEntity.name;
              })()}
            </div>
          </div>
          <div className="inspector-content">
            {selectedEntity.type === 'airport' ? (
              <div className="inspector-fields">
                <div className="inspector-field">
                  <span className="field-label">TYPE</span>
                  <span className="field-value">{AIRPORT_TYPE_LABELS[selectedEntity.properties.airportType] || 'AIRPORT'}</span>
                </div>
                {(selectedEntity.properties.iata || selectedEntity.properties.icao) && (
                  <div className="inspector-field">
                    <span className="field-label">IATA / ICAO</span>
                    <span className="field-value">{selectedEntity.properties.iata || '—'} / {selectedEntity.properties.icao || '—'}</span>
                  </div>
                )}
                <div className="inspector-field">
                  <span className="field-label">LOCATION</span>
                  <span className="field-value">{selectedEntity.properties.city ? selectedEntity.properties.city + ', ' : ''}{selectedEntity.properties.country}</span>
                </div>
                <div className="inspector-field">
                  <span className="field-label">CONTINENT</span>
                  <span className="field-value">{selectedEntity.properties.continent}</span>
                </div>
                <div className="inspector-field">
                  <span className="field-label">LATITUDE</span>
                  <span className="field-value">{Number(selectedEntity.properties.lat).toFixed(4)}°</span>
                </div>
                <div className="inspector-field">
                  <span className="field-label">LONGITUDE</span>
                  <span className="field-value">{Number(selectedEntity.properties.lng).toFixed(4)}°</span>
                </div>
              </div>
            ) : selectedEntity.type === 'port' ? (
              <div className="inspector-fields">
                <div className="inspector-field">
                  <span className="field-label">FACILITY TYPE</span>
                  <span className="field-value">{selectedEntity.properties.facilityType || 'Major Seaport'}</span>
                </div>
                <div className="inspector-field">
                  <span className="field-label">SIZE</span>
                  <span className="field-value">{PORT_SIZE_LABELS[selectedEntity.properties.size] || 'UNKNOWN'}</span>
                </div>
                <div className="inspector-field">
                  <span className="field-label">COUNTRY</span>
                  <span className="field-value">{selectedEntity.properties.country || '—'}</span>
                </div>
                {selectedEntity.properties.vesselCount > 0 && (
                  <div className="inspector-field">
                    <span className="field-label">ANNUAL VESSELS</span>
                    <span className="field-value">{Number(selectedEntity.properties.vesselCount).toLocaleString()}</span>
                  </div>
                )}
                <div className="inspector-field">
                  <span className="field-label">LATITUDE</span>
                  <span className="field-value">{Number(selectedEntity.properties.lat).toFixed(4)}°</span>
                </div>
                <div className="inspector-field">
                  <span className="field-label">LONGITUDE</span>
                  <span className="field-value">{Number(selectedEntity.properties.lng).toFixed(4)}°</span>
                </div>
                <div className="inspector-field">
                  <span className="field-label">SOURCE DATA</span>
                  <span className="field-value">{String(selectedEntity.properties.source).toUpperCase()}</span>
                </div>
              </div>
            ) : selectedEntity.type === 'flight' || selectedEntity.type === 'commercial' || selectedEntity.type === 'private' || selectedEntity.type === 'jet' || selectedEntity.type === 'military' ? (() => {
              const rawP = selectedEntity.properties;
              const p = selectedFlightTelemetry ? { ...rawP, ...selectedFlightTelemetry } : rawP;
              const isMil = p.type === 'military' || !!(p.dbFlags & 1);
              const vRate = Number(p.baro_rate || 0);
              const vRateColor = vRate > 100 ? '#00e676' : vRate < -100 ? '#ff3d3d' : 'inherit';
              const vRateSign = vRate > 100 ? '\u2191' : vRate < -100 ? '\u2193' : '\u2192';
              const srcLabel = p.source === 'mlat' ? 'MLAT' : p.source === 'tisb_icao' ? 'TIS-B' : 'ADS-B';
              return (
                <div className="inspector-fields">
                  <div className="inspector-section-label">IDENTIFICATION</div>
                  <div className="inspector-field">
                    <span className="field-label">CALLSIGN</span>
                    <span className="field-value" style={{ color: 'var(--cyan-primary)', fontFamily: 'var(--font-mono)', fontSize: '15px', fontWeight: 700 }}>{p.callsign || '\u2014'}</span>
                  </div>
                  <div className="inspector-field">
                    <span className="field-label">ICAO HEX</span>
                    <span className="field-value" style={{ fontFamily: 'var(--font-mono)' }}>{p.icao24 || '\u2014'}</span>
                  </div>
                  <div className="inspector-field">
                    <span className="field-label">REGISTRATION</span>
                    <span className="field-value">{isLoadingMetadata ? '...' : (selectedFlightMetadata?.registration || p.registration || '\u2014')}</span>
                  </div>
                  <div className="inspector-field">
                    <span className="field-label">TYPE CODE</span>
                    <span className="field-value">{isLoadingMetadata ? '...' : (selectedFlightMetadata?.model || p.model || '\u2014')}</span>
                  </div>
                  <div className="inspector-field">
                    <span className="field-label">AIRCRAFT</span>
                    <span className="field-value">{isLoadingMetadata ? '...' : (selectedFlightMetadata?.desc || p.desc || '\u2014')}</span>
                  </div>
                  <div className="inspector-field">
                    <span className="field-label">OPERATOR</span>
                    <span className="field-value">{isLoadingMetadata ? '...' : (selectedFlightMetadata?.ownOp || p.airline || p.ownOp || '\u2014')}</span>
                  </div>
                  {p.category && (
                    <div className="inspector-field">
                      <span className="field-label">CATEGORY</span>
                      <span className="field-value">{p.category}</span>
                    </div>
                  )}
                  <div className="inspector-field">
                    <span className="field-label">SOURCE</span>
                    <span className="field-value" style={{ color: isMil ? '#ff9500' : p.source === 'mlat' ? '#ffd600' : '#00e676' }}>
                      {srcLabel}{isMil ? ' \u2022 MILITARY' : ''}
                    </span>
                  </div>

                  <div className="inspector-section-label" style={{ marginTop: '8px' }}>ROUTE</div>
                  <div className="inspector-field">
                    <span className="field-label">ORIGIN</span>
                    <span className="field-value" style={{ color: 'var(--cyan-primary)' }}>
                      {isLoadingRoute ? '...' : (selectedFlightRoute?.origin ? lookupAirportName(selectedFlightRoute.origin) : '\u2014')}
                    </span>
                  </div>
                  <div className="inspector-field">
                    <span className="field-label">DESTINATION</span>
                    <span className="field-value" style={{ color: 'var(--cyan-primary)' }}>
                      {isLoadingRoute ? '...' : (selectedFlightRoute?.destination ? lookupAirportName(selectedFlightRoute.destination) : '\u2014')}
                    </span>
                  </div>

                  <div className="inspector-section-label" style={{ marginTop: '8px' }}>SPEED</div>
                  <div className="inspector-field">
                    <span className="field-label">GROUND SPEED</span>
                    <span className="field-value">{p.speed_knots || '\u2014'} kt</span>
                  </div>
                  {p.ias != null && (
                    <div className="inspector-field">
                      <span className="field-label">INDICATED (IAS)</span>
                      <span className="field-value">{Math.round(Number(p.ias))} kt</span>
                    </div>
                  )}
                  {p.tas != null && (
                    <div className="inspector-field">
                      <span className="field-label">TRUE (TAS)</span>
                      <span className="field-value">{Math.round(Number(p.tas))} kt</span>
                    </div>
                  )}
                  {p.mach != null && (
                    <div className="inspector-field">
                      <span className="field-label">MACH</span>
                      <span className="field-value" style={{ color: 'var(--cyan-primary)' }}>M{Number(p.mach).toFixed(3)}</span>
                    </div>
                  )}

                  <div className="inspector-section-label" style={{ marginTop: '8px' }}>ALTITUDE</div>
                  <div className="inspector-field">
                    <span className="field-label">BARO. ALT</span>
                    <span className="field-value" style={{ color: '#ffd600', fontWeight: 700 }}>
                      {p.alt != null ? (Number(p.alt) > 0 ? '\u25b2 ' : '') + Number(p.alt).toLocaleString() + ' ft' : '\u2014'}
                    </span>
                  </div>
                  {p.alt_geom != null && (
                    <div className="inspector-field">
                      <span className="field-label">GEOM. ALT (WGS84)</span>
                      <span className="field-value">{Number(p.alt_geom) > 0 ? '\u25b2 ' : ''}{Number(p.alt_geom).toLocaleString()} ft</span>
                    </div>
                  )}
                  <div className="inspector-field">
                    <span className="field-label">BARO. RATE (V/S)</span>
                    <span className="field-value" style={{ color: vRateColor }}>{vRateSign} {vRate !== 0 ? Math.abs(vRate).toLocaleString() + ' fpm' : '0 fpm'}</span>
                  </div>
                  {p.geom_rate != null && (
                    <div className="inspector-field">
                      <span className="field-label">GEOM. RATE</span>
                      <span className="field-value">{(Number(p.geom_rate) > 0 ? '+' : '')}{Number(p.geom_rate).toLocaleString()} fpm</span>
                    </div>
                  )}
                  {p.nav_altitude_mcp != null && (
                    <div className="inspector-field">
                      <span className="field-label">SEL. ALT (MCP/FCU)</span>
                      <span className="field-value">{Number(p.nav_altitude_mcp).toLocaleString()} ft</span>
                    </div>
                  )}

                  <div className="inspector-section-label" style={{ marginTop: '8px' }}>DIRECTION</div>
                  <div className="inspector-field">
                    <span className="field-label">GROUND TRACK</span>
                    <span className="field-value">{p.heading != null ? Number(p.heading).toFixed(1) + '\u00b0' : '\u2014'}</span>
                  </div>
                  {p.true_heading != null && (
                    <div className="inspector-field">
                      <span className="field-label">TRUE HEADING</span>
                      <span className="field-value">{Number(p.true_heading).toFixed(1)}\u00b0</span>
                    </div>
                  )}
                  {p.mag_heading != null && (
                    <div className="inspector-field">
                      <span className="field-label">MAG. HEADING</span>
                      <span className="field-value">{Number(p.mag_heading).toFixed(1)}\u00b0</span>
                    </div>
                  )}
                  {p.roll != null && (
                    <div className="inspector-field">
                      <span className="field-label">ROLL</span>
                      <span className="field-value">{Number(p.roll).toFixed(1)}\u00b0</span>
                    </div>
                  )}
                  <div className="inspector-field">
                    <span className="field-label">LATITUDE</span>
                    <span className="field-value" style={{ fontFamily: 'var(--font-mono)' }}>{Number(p.lat).toFixed(5)}\u00b0</span>
                  </div>
                  <div className="inspector-field">
                    <span className="field-label">LONGITUDE</span>
                    <span className="field-value" style={{ fontFamily: 'var(--font-mono)' }}>{Number(p.lng).toFixed(5)}\u00b0</span>
                  </div>

                  {(p.wd != null || p.oat != null || p.nav_qnh != null) && (
                    <>
                      <div className="inspector-section-label" style={{ marginTop: '8px' }}>ATMOSPHERE</div>
                      {p.wd != null && (
                        <div className="inspector-field">
                          <span className="field-label">WIND DIR / SPD</span>
                          <span className="field-value">{p.wd}\u00b0 / {p.ws || 0} kt</span>
                        </div>
                      )}
                      {p.oat != null && (
                        <div className="inspector-field">
                          <span className="field-label">OAT</span>
                          <span className="field-value">{p.oat}\u00b0C</span>
                        </div>
                      )}
                      {p.tat != null && (
                        <div className="inspector-field">
                          <span className="field-label">TAT</span>
                          <span className="field-value">{p.tat}\u00b0C</span>
                        </div>
                      )}
                      {p.nav_qnh != null && (
                        <div className="inspector-field">
                          <span className="field-label">QNH</span>
                          <span className="field-value">{Number(p.nav_qnh).toFixed(1)} mb</span>
                        </div>
                      )}
                    </>
                  )}

                  <div className="inspector-section-label" style={{ marginTop: '8px' }}>TRANSPONDER</div>
                  <div className="inspector-field">
                    <span className="field-label">SQUAWK</span>
                    <span className="field-value" style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', fontWeight: 700 }}>{p.squawk || '\u2014'}</span>
                  </div>
                  {p.emergency && p.emergency !== 'none' && (
                    <div className="inspector-field">
                      <span className="field-label">EMERGENCY</span>
                      <span className="field-value" style={{ color: '#ff3d3d', fontWeight: 700 }}>\u26a0\ufe0f {String(p.emergency).toUpperCase()}</span>
                    </div>
                  )}
                  {p.version != null && (
                    <div className="inspector-field">
                      <span className="field-label">ADS-B VERSION</span>
                      <span className="field-value">v{p.version} (DO-260{p.version === 2 ? 'B' : p.version === 1 ? 'A' : ''})</span>
                    </div>
                  )}

                  <div className="inspector-section-label" style={{ marginTop: '8px' }}>SIGNAL</div>
                  {p.rssi != null && (
                    <div className="inspector-field">
                      <span className="field-label">RSSI</span>
                      <span className="field-value">{Number(p.rssi).toFixed(1)} dBFS</span>
                    </div>
                  )}
                  {p.messages != null && (
                    <div className="inspector-field">
                      <span className="field-label">MESSAGES</span>
                      <span className="field-value">{Number(p.messages).toLocaleString()}</span>
                    </div>
                  )}
                  {p.seen != null && (
                    <div className="inspector-field">
                      <span className="field-label">LAST MSG</span>
                      <span className="field-value">{Number(p.seen).toFixed(1)}s ago</span>
                    </div>
                  )}
                  {p.seen_pos != null && (
                    <div className="inspector-field">
                      <span className="field-label">LAST POS.</span>
                      <span className="field-value">{Number(p.seen_pos).toFixed(1)}s ago</span>
                    </div>
                  )}

                  {(p.nac_p != null || p.sil != null || p.rc != null) && (
                    <>
                      <div className="inspector-section-label" style={{ marginTop: '8px' }}>ACCURACY</div>
                      {p.nac_p != null && (
                        <div className="inspector-field">
                          <span className="field-label">NACp</span>
                          <span className="field-value">EPU &lt; {([30000,10000,3000,1000,300,30,10,3,1])[Math.max(0,Math.min(8,Number(p.nac_p)))] || '?'}m</span>
                        </div>
                      )}
                      {p.nac_v != null && (
                        <div className="inspector-field">
                          <span className="field-label">NACv</span>
                          <span className="field-value">\u2264 {([10,3,1,0.3])[Math.max(0,Math.min(3,Number(p.nac_v)))] || '?'} m/s</span>
                        </div>
                      )}
                      {p.sil != null && (
                        <div className="inspector-field">
                          <span className="field-label">SIL</span>
                          <span className="field-value">{p.sil_type === 'perhour' ? '\u2264 1\u00d710\u207b\u2075/hr' : `SIL ${p.sil}`}</span>
                        </div>
                      )}
                      {p.nic_baro != null && (
                        <div className="inspector-field">
                          <span className="field-label">NIC BARO</span>
                          <span className="field-value">{p.nic_baro ? 'cross-checked' : 'not cross-checked'}</span>
                        </div>
                      )}
                      {p.rc != null && (
                        <div className="inspector-field">
                          <span className="field-label">RC</span>
                          <span className="field-value">{p.rc}m</span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })() : (selectedEntity.type === 'ship' || selectedEntity.properties?.layerType === 'ship') ? (() => {
              const p = selectedEntity.properties;
              return (
                <div className="inspector-fields">
                  <div className="inspector-section-label">IDENTIFICATION</div>
                  <div className="inspector-field">
                    <span className="field-label">VESSEL NAME</span>
                    <span className="field-value" style={{ color: 'var(--cyan-primary)', fontWeight: 700, textTransform: 'uppercase' }}>{p.name || 'UNKNOWN'}</span>
                  </div>
                  <div className="inspector-field">
                    <span className="field-label">MMSI</span>
                    <span className="field-value" style={{ fontFamily: 'var(--font-mono)' }}>{p.mmsi || '—'}</span>
                  </div>
                  {p.imo && (
                    <div className="inspector-field">
                      <span className="field-label">IMO</span>
                      <span className="field-value" style={{ fontFamily: 'var(--font-mono)' }}>{p.imo}</span>
                    </div>
                  )}
                  {p.callsign && (
                    <div className="inspector-field">
                      <span className="field-label">CALLSIGN</span>
                      <span className="field-value" style={{ fontFamily: 'var(--font-mono)' }}>{p.callsign}</span>
                    </div>
                  )}
                  <div className="inspector-field">
                    <span className="field-label">CLASSIFICATION</span>
                    <span className="field-value" style={{ textTransform: 'uppercase', fontWeight: 600 }}>{p.type}</span>
                  </div>
                  {p.shipType != null && (
                    <div className="inspector-field">
                      <span className="field-label">AIS TYPE CODE</span>
                      <span className="field-value">{p.shipType}</span>
                    </div>
                  )}

                  <div className="inspector-section-label" style={{ marginTop: '8px' }}>VOYAGE</div>
                  <div className="inspector-field">
                    <span className="field-label">DESTINATION</span>
                    <span className="field-value" style={{ color: '#ffd600', fontWeight: 600, textTransform: 'uppercase' }}>{p.destination || 'UNKNOWN'}</span>
                  </div>
                  <div className="inspector-field">
                    <span className="field-label">FLAG / COUNTRY</span>
                    <span className="field-value">{p.flag || 'Unknown'}</span>
                  </div>
                  {p.draught != null && (
                    <div className="inspector-field">
                      <span className="field-label">MAX DRAUGHT</span>
                      <span className="field-value">{Number(p.draught).toFixed(1)} m</span>
                    </div>
                  )}

                  <div className="inspector-section-label" style={{ marginTop: '8px' }}>TELEMETRY</div>
                  <div className="inspector-field">
                    <span className="field-label">LATITUDE</span>
                    <span className="field-value" style={{ fontFamily: 'var(--font-mono)' }}>{Number(p.lat).toFixed(5)}°</span>
                  </div>
                  <div className="inspector-field">
                    <span className="field-label">LONGITUDE</span>
                    <span className="field-value" style={{ fontFamily: 'var(--font-mono)' }}>{Number(p.lng).toFixed(5)}°</span>
                  </div>
                  <div className="inspector-field">
                    <span className="field-label">SPEED OVER GROUND</span>
                    <span className="field-value">{Number(p.speed).toFixed(1)} knots</span>
                  </div>
                  <div className="inspector-field">
                    <span className="field-label">HEADING</span>
                    <span className="field-value">{Number(p.heading).toFixed(1)}°</span>
                  </div>

                  <div className="inspector-section-label" style={{ marginTop: '8px' }}>SYSTEM</div>
                  <div className="inspector-field">
                    <span className="field-label">DATA SOURCE</span>
                    <span className="field-value" style={{ color: p.mmsi ? '#00e676' : 'var(--orange-primary)', fontWeight: 600 }}>
                      {p.mmsi ? 'Real-time AIS (Fintraffic)' : 'Estimated Position'}
                    </span>
                  </div>
                  {p.lastUpdated && (
                    <div className="inspector-field">
                      <span className="field-label">LAST UPDATED</span>
                      <span className="field-value">{new Date(p.lastUpdated).toLocaleTimeString()}</span>
                    </div>
                  )}
                </div>
              );
            })() : (
              <div className="inspector-fields">
                {Object.entries(selectedEntity.properties || {})
                  .filter(([key]) => key !== 'layerType' && key !== 'id')
                  .map(([key, value]) => (
                    <div className="inspector-field" key={key}>
                      <span className="field-label">{key.toUpperCase().replace('_', ' ')}</span>
                      <span className="field-value">{String(value)}</span>
                    </div>
                  ))
                }
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
