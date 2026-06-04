import React from 'react';
import * as Icons from 'lucide-react';

interface DetailsPanelProps {
  selectedEntity: any;
  onClearSelection: () => void;
  logs: Array<{ id: string; timestamp: string; message: string; type: 'info' | 'alert' | 'warning' | 'success' }>;
}

export const DetailsPanel: React.FC<DetailsPanelProps> = ({
  selectedEntity,
  onClearSelection,
  logs
}) => {
  const getSeverityColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case 'war': return '#ff3d3d';
      case 'high': return '#ff9500';
      case 'moderate': return '#ffeb3b';
      default: return '#00e5ff';
    }
  };

  const getStatusIndicator = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'operational': return <span style={{ color: 'var(--emerald-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}><span className="pulse-indicator green" /> Operational</span>;
      case 'expanding': return <span style={{ color: 'var(--cyan-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}><span className="pulse-indicator" /> Expanding</span>;
      case 'maintenance': return <span style={{ color: 'var(--alert-orange)', display: 'flex', alignItems: 'center', gap: '4px' }}><span className="pulse-indicator red" /> Maintenance</span>;
      case 'active conflict zone': return <span style={{ color: 'var(--alert-red)', display: 'flex', alignItems: 'center', gap: '4px' }}><span className="pulse-indicator red" /> Conflict Zone</span>;
      case 'decommissioning': return <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>Decom</span>;
      default: return <span>{status}</span>;
    }
  };

  const renderEntityDetails = () => {
    if (!selectedEntity) return null;
    const { type, properties } = selectedEntity;

    switch (type) {
      case 'flight':
        return (
          <>
            <div className="hud-value-row">
              <span className="details-label">Ident / Callsign</span>
              <span className="details-value" style={{ color: 'var(--cyan-primary)' }}>{properties.callsign}</span>
            </div>
            <div className="hud-value-row">
              <span className="details-label">Model</span>
              <span className="details-value">{properties.model}</span>
            </div>
            <div className="hud-value-row">
              <span className="details-label">Registration</span>
              <span className="details-value">{properties.registration}</span>
            </div>
            <div className="hud-value-row">
              <span className="details-label">ICAO 24</span>
              <span className="details-value">{properties.icao24}</span>
            </div>
            <div className="hud-value-row">
              <span className="details-label">Altitude</span>
              <span className="details-value" style={{ color: 'var(--gold-primary)' }}>{properties.alt.toLocaleString()} m</span>
            </div>
            <div className="hud-value-row">
              <span className="details-label">Speed</span>
              <span className="details-value">{properties.speed_knots} KT</span>
            </div>
            <div className="hud-value-row">
              <span className="details-label">Heading</span>
              <span className="details-value">{properties.heading}°</span>
            </div>
            <div className="hud-value-row">
              <span className="details-label">Sector Path</span>
              <span className="details-value" style={{ fontSize: '10px' }}>{properties.route}</span>
            </div>
          </>
        );

      case 'ship':
        return (
          <>
            <div className="hud-value-row">
              <span className="details-label">Vessel Name</span>
              <span className="details-value" style={{ color: 'var(--cyan-primary)' }}>{properties.name}</span>
            </div>
            <div className="hud-value-row">
              <span className="details-label">Registry Flag</span>
              <span className="details-value">{properties.flag}</span>
            </div>
            <div className="hud-value-row">
              <span className="details-label">Type</span>
              <span className="details-value" style={{ textTransform: 'capitalize' }}>{properties.type}</span>
            </div>
            <div className="hud-value-row">
              <span className="details-label">Cruising Speed</span>
              <span className="details-value">{properties.speed} KT</span>
            </div>
            <div className="hud-value-row">
              <span className="details-label">Course</span>
              <span className="details-value">{properties.heading}°</span>
            </div>
            <div className="hud-value-row">
              <span className="details-label">Destination</span>
              <span className="details-value" style={{ color: 'var(--gold-primary)' }}>{properties.destination}</span>
            </div>
          </>
        );

      case 'satellite':
        return (
          <>
            <div className="hud-value-row">
              <span className="details-label">Satellite Name</span>
              <span className="details-value" style={{ color: 'var(--cyan-primary)' }}>{properties.name}</span>
            </div>
            <div className="hud-value-row">
              <span className="details-label">Core Mission</span>
              <span className="details-value">{properties.mission}</span>
            </div>
            <div className="hud-value-row">
              <span className="details-label">Orbit Altitude</span>
              <span className="details-value" style={{ color: 'var(--gold-primary)' }}>{properties.alt} km</span>
            </div>
            <div className="hud-value-row">
              <span className="details-label">Inclination</span>
              <span className="details-value">{properties.inclination}°</span>
            </div>
            <div className="hud-value-row">
              <span className="details-label">Velocity</span>
              <span className="details-value">{properties.velocity} km/s</span>
            </div>
          </>
        );

      case 'military-base':
        return (
          <>
            <div className="hud-value-row">
              <span className="details-label">Facility</span>
              <span className="details-value" style={{ color: 'var(--cyan-primary)' }}>{properties.name}</span>
            </div>
            <div className="hud-value-row">
              <span className="details-label">Branch</span>
              <span className="details-value">{properties.branch}</span>
            </div>
            <div className="hud-value-row">
              <span className="details-label">Hosting Nation</span>
              <span className="details-value">{properties.country}</span>
            </div>
            <div className="hud-value-row">
              <span className="details-label">Stationed Force</span>
              <span className="details-value" style={{ color: 'var(--gold-primary)' }}>{properties.personnel.toLocaleString()} Personnel</span>
            </div>
          </>
        );

      case 'datacenter':
        return (
          <>
            <div className="hud-value-row">
              <span className="details-label">DC Cluster</span>
              <span className="details-value" style={{ color: 'var(--cyan-primary)' }}>{properties.name}</span>
            </div>
            <div className="hud-value-row">
              <span className="details-label">Operator</span>
              <span className="details-value">{properties.operator}</span>
            </div>
            <div className="hud-value-row">
              <span className="details-label">HPC Status</span>
              <span className="details-value">{getStatusIndicator(properties.status)}</span>
            </div>
            <div className="hud-value-row">
              <span className="details-label">Active GPUTs</span>
              <span className="details-value" style={{ color: 'var(--gold-primary)', fontFamily: 'var(--font-mono)' }}>{properties.gpuCount.toLocaleString()} H100s</span>
            </div>
          </>
        );

      case 'nuclear':
        return (
          <>
            <div className="hud-value-row">
              <span className="details-label">Nuclear Facility</span>
              <span className="details-value" style={{ color: 'var(--gold-primary)' }}>{properties.name}</span>
            </div>
            <div className="hud-value-row">
              <span className="details-label">Location</span>
              <span className="details-value">{properties.city}, {properties.country}</span>
            </div>
            <div className="hud-value-row">
              <span className="details-label">Operational Status</span>
              <span className="details-value">{getStatusIndicator(properties.status)}</span>
            </div>
            <div className="hud-value-row">
              <span className="details-label">Reactors</span>
              <span className="details-value">{properties.reactors} Active Cores</span>
            </div>
            <div className="hud-value-row">
              <span className="details-label">Grid Output</span>
              <span className="details-value" style={{ color: 'var(--cyan-primary)' }}>{properties.capacityMW.toLocaleString()} MW</span>
            </div>
          </>
        );

      case 'conflict':
        return (
          <>
            <div className="hud-value-row" style={{ borderBottomColor: 'rgba(255, 61, 61, 0.15)' }}>
              <span className="details-label">Conflict Node</span>
              <span className="details-value" style={{ color: getSeverityColor(properties.severity), fontWeight: 700 }}>{properties.label}</span>
            </div>
            <div className="hud-value-row">
              <span className="details-label">Severity Level</span>
              <span className="details-value" style={{ color: getSeverityColor(properties.severity), textTransform: 'uppercase' }}>{properties.severity}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '6px' }}>
              <span className="details-label">Intelligence Brief</span>
              <p style={{ fontSize: '11px', color: 'var(--text-primary)', lineHeight: 1.4, fontFamily: 'var(--font-sans)' }}>{properties.description}</p>
            </div>
          </>
        );

      case 'port':
        return (
          <>
            <div className="hud-value-row">
              <span className="details-label">Maritime Port</span>
              <span className="details-value">{properties.name}</span>
            </div>
            <div className="hud-value-row">
              <span className="details-label">Territorial Code</span>
              <span className="details-value">{properties.country}</span>
            </div>
            <div className="hud-value-row">
              <span className="details-label">Operational Type</span>
              <span className="details-value" style={{ textTransform: 'capitalize' }}>{properties.type}</span>
            </div>
            {properties.volume && (
              <div className="hud-value-row">
                <span className="details-label">Annual Throughput</span>
                <span className="details-value" style={{ color: 'var(--cyan-primary)' }}>{properties.volume}</span>
              </div>
            )}
            {properties.rank && (
              <div className="hud-value-row">
                <span className="details-label">Global Rank</span>
                <span className="details-value">#{properties.rank}</span>
              </div>
            )}
          </>
        );

      case 'earthquake':
        return (
          <>
            <div className="hud-value-row">
              <span className="details-label">Magnitude</span>
              <span className="details-value" style={{ color: 'var(--alert-red)', fontWeight: 700 }}>M {properties.magnitude}</span>
            </div>
            <div className="hud-value-row">
              <span className="details-label">Epicenter Place</span>
              <span className="details-value">{properties.place}</span>
            </div>
            <div className="hud-value-row">
              <span className="details-label">Depth</span>
              <span className="details-value">{properties.depth} km</span>
            </div>
            <div className="hud-value-row">
              <span className="details-label">Seismic Logged</span>
              <span className="details-value" style={{ fontSize: '10px' }}>{new Date(properties.time).toLocaleTimeString()}</span>
            </div>
          </>
        );

      case 'fire':
        return (
          <>
            <div className="hud-value-row">
              <span className="details-label">Thermal Index</span>
              <span className="details-value" style={{ color: 'var(--alert-orange)' }}>{properties.brightness} K</span>
            </div>
            <div className="hud-value-row">
              <span className="details-label">FIRMS Confidence</span>
              <span className="details-value">{properties.confidence}%</span>
            </div>
            <div className="hud-value-row">
              <span className="details-label">Sensor Type</span>
              <span className="details-value">NASA MODIS</span>
            </div>
          </>
        );

      case 'cctv':
        return (
          <>
            <div className="hud-value-row">
              <span className="details-label">Feed Name</span>
              <span className="details-value">{properties.name}</span>
            </div>
            <div className="hud-value-row">
              <span className="details-label">Location</span>
              <span className="details-value">{properties.city}, {properties.country}</span>
            </div>
            <div style={{ marginTop: '10px', height: '140px', border: '1px solid var(--border-active)', borderRadius: '4px', overflow: 'hidden', position: 'relative', background: '#000000' }}>
              <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(0,0,0,0.6)', padding: '2px 6px', borderRadius: '2px', fontSize: '9px', fontFamily: 'var(--font-mono)' }}>
                <span className="pulse-indicator red" />
                <span>LIVE FEED</span>
              </div>
              <iframe
                title="CCTV Viewport"
                src={properties.stream_url.includes('youtube') ? properties.stream_url : 'about:blank'}
                style={{ width: '100%', height: '100%', border: 'none' }}
              />
              {!properties.stream_url.includes('youtube') && (
                <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '10px' }}>
                  <Icons.VideoOff size={24} />
                  <span>CCTV FEED STUBBED</span>
                </div>
              )}
            </div>
          </>
        );

      case 'cable':
        return (
          <>
            <div className="hud-value-row">
              <span className="details-label">Subsea Cable</span>
              <span className="details-value" style={{ color: 'var(--cyan-primary)' }}>{properties.name}</span>
            </div>
            <div className="hud-value-row">
              <span className="details-label">Trunk Status</span>
              <span className="details-value">{getStatusIndicator(properties.status)}</span>
            </div>
            <div className="hud-value-row">
              <span className="details-label">Segment Nodes</span>
              <span className="details-value">{properties.path ? JSON.parse(properties.path).length : 4} Anchor Nodes</span>
            </div>
          </>
        );

      case 'trade-route':
        return (
          <>
            <div className="hud-value-row">
              <span className="details-label">Maritime Corridor</span>
              <span className="details-value" style={{ color: 'var(--gold-primary)' }}>{properties.name}</span>
            </div>
            <div className="hud-value-row">
              <span className="details-label">Transit Volume</span>
              <span className="details-value">{properties.traffic}</span>
            </div>
            <div className="hud-value-row">
              <span className="details-label">Classification</span>
              <span className="details-value">Global Maritime Highway</span>
            </div>
          </>
        );

      default:
        return (
          <div style={{ color: 'var(--text-muted)', fontSize: '11px' }}>
            No specialized rendering available for type: {type}
          </div>
        );
    }
  };

  return (
    <div className="dashboard-sidebar-right styled-scrollbar">
      {/* Entity Inspector Panel */}
      {selectedEntity ? (
        <div className="glass-panel active" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '12px 14px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Icons.ShieldAlert size={14} className="neon-glow" style={{ color: 'var(--cyan-primary)' }} />
              <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Tactical dossier
              </span>
            </div>
            <button onClick={onClearSelection} style={{ color: 'var(--text-muted)' }} hover-target="true">
              <Icons.X size={14} />
            </button>
          </div>
          <div className="hud-panel-inner">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <div className="pulse-indicator" />
              <h3 style={{ fontSize: '15px', color: 'var(--text-heading)' }}>
                {selectedEntity.name}
              </h3>
            </div>

            {renderEntityDetails()}

            {selectedEntity.properties?.lat && (
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.03)', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', fontSize: '9px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                <span>LAT: {Number(selectedEntity.properties.lat).toFixed(4)}</span>
                <span>LNG: {Number(selectedEntity.properties.lng || selectedEntity.properties.lng).toFixed(4)}</span>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Global Telemetry Dashboard */
        <div className="glass-panel" style={{ padding: '14px' }}>
          <div className="hud-section-title">
            <Icons.Layers size={12} />
            <span>GLOBAL SYSTEM STATS</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
            <div className="hud-value-row">
              <span className="details-label">Telemetry Status</span>
              <span style={{ color: 'var(--emerald-primary)', fontFamily: 'var(--font-mono)', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span className="pulse-indicator green" /> CONNECTED
              </span>
            </div>
            <div className="hud-value-row">
              <span className="details-label">API Throughput</span>
              <span className="details-value" style={{ fontSize: '11px', color: 'var(--cyan-primary)' }}>12.4 kbps</span>
            </div>
            <div className="hud-value-row">
              <span className="details-label">Tactical Assets</span>
              <span className="details-value" style={{ fontSize: '11px' }}>128 Tracked</span>
            </div>
          </div>
        </div>
      )}

      {/* Real-time Intel Log */}
      <div className="glass-panel" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minHeight: '300px' }}>
        <div style={{ padding: '12px 14px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Icons.Activity size={14} className="neon-glow" style={{ color: 'var(--cyan-primary)' }} />
          <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Live intelligence stream
          </span>
        </div>
        <div style={{ padding: '14px', overflowY: 'auto', flexGrow: 1 }} className="log-container styled-scrollbar">
          {logs.map((log) => (
            <div key={log.id} className={`log-item ${log.type}`}>
              <div className="log-timestamp">{log.timestamp}</div>
              <div className="log-message">{log.message}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
