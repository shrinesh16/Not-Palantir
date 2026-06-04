import { useEffect, useState } from 'react';
import { MythrionMap } from './components/MythrionMap';
import { 
  LiveDataSimulator, 
  type Flight, 
  type Ship, 
  type Satellite,
  STATIC_MILITARY_BASES,
  STATIC_DATACENTERS,
  STATIC_NUCLEAR,
  STATIC_CONFLICTS,
  STATIC_CABLES,
  STATIC_TRADE_ROUTES,
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
import { GLOBAL_AIRPORTS, AIRPORT_TYPE_LABELS } from './data/airports';
import { GLOBAL_PORTS, PORT_SIZE_LABELS } from './data/ports';
import { PIPELINES } from './data/worldmonitor/pipelines';
import { STRATEGIC_WATERWAYS, SPACEPORTS, CRITICAL_MINERALS } from './data/worldmonitor/geo';
import * as Icons from 'lucide-react';
import { LayerPanel } from './components/LayerPanel';

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

  const toggleLayer = (layerKey: string) => {
    setActiveLayers(prev => ({
      ...prev,
      [layerKey]: !prev[layerKey]
    }));
  };

  const toggleGroup = (keys: string[], targetState: boolean) => {
    setActiveLayers(prev => {
      const next = { ...prev };
      keys.forEach(key => {
        next[key] = targetState;
      });
      return next;
    });
  };

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
  
  // Real-time dynamic simulator state
  const [flights, setFlights] = useState<Flight[]>([]);
  const [ships, setShips] = useState<Ship[]>([]);
  const [satellites, setSatellites] = useState<Satellite[]>([]);

  const counts = {
    airports: GLOBAL_AIRPORTS.length,
    flights_commercial: flights.filter(f => f.type === 'commercial').length,
    flights_private: flights.filter(f => f.type === 'private').length,
    flights_jet: flights.filter(f => f.type === 'jet').length,
    flights_military: flights.filter(f => f.type === 'military').length,
    ships: ships.filter(s => s.type === 'cargo' || s.type === 'military').length,
    ships_tanker: ships.filter(s => s.type === 'tanker').length,
    ports: GLOBAL_PORTS.length,
    tradeRoutes: STATIC_TRADE_ROUTES.length,
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

  // Simulation Loop
  useEffect(() => {
    // Initial load
    setFlights([...simulator.flights]);
    setShips([...simulator.ships]);
    setSatellites([...simulator.satellites]);

    const interval = setInterval(() => {
      simulator.update();
      setFlights([...simulator.flights]);
      setShips([...simulator.ships]);
      setSatellites([...simulator.satellites]);

      // Keep coordinates updated in case they are selected (optional)
      if (selectedEntity) {
        if (selectedEntity.type === 'flight') {
          const updated = simulator.flights.find(f => f.id === selectedEntity.id);
          if (updated) {
            setSelectedEntity((prev: any) => ({ ...prev, properties: updated }));
          }
        } else if (selectedEntity.type === 'ship') {
          const updated = simulator.ships.find(s => s.id === selectedEntity.id);
          if (updated) {
            setSelectedEntity((prev: any) => ({ ...prev, properties: updated }));
          }
        } else if (selectedEntity.type === 'satellite') {
          const updated = simulator.satellites.find(s => s.id === selectedEntity.id);
          if (updated) {
            setSelectedEntity((prev: any) => ({ ...prev, properties: updated }));
          }
        }
      }
    }, 1000);

    return () => clearInterval(interval);
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
        onMapViewportChange={(vp) => {
          setZoom(vp.zoom);
          setCenter(vp.center);
        }}
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

      {/* Left Sidebar - Tactical Layers Selection */}
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
            <div className="inspector-title">{selectedEntity.name}</div>
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
            ) : (
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
