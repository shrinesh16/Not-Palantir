import React, { useState } from 'react';
import * as Icons from 'lucide-react';

interface LayerPanelProps {
  activeLayers: Record<string, boolean>;
  onToggleLayer: (layerKey: string) => void;
  onToggleGroup: (keys: string[], targetState: boolean) => void;
  counts: Record<string, number>;
}

interface LayerItem {
  key: string;
  label: string;
  icon: keyof typeof Icons;
  isGold?: boolean;
}

interface LayerGroup {
  title: string;
  icon: keyof typeof Icons;
  items: LayerItem[];
}

export const LayerPanel = React.memo<LayerPanelProps>(({ 
  activeLayers, 
  onToggleLayer, 
  onToggleGroup, 
  counts
}) => {
  const layerGroups: LayerGroup[] = [
    {
      title: 'Aero Intelligence',
      icon: 'Plane',
      items: [
        { key: 'airports', label: 'Strategic Airports', icon: 'Plane' },
        { key: 'flights_commercial', label: 'Commercial Flights', icon: 'Plane' },
        { key: 'flights_private', label: 'Private Flights', icon: 'Plane' },
        { key: 'flights_jet', label: 'Private Jets', icon: 'Plane' },
        { key: 'flights_military', label: 'Military Flights', icon: 'Plane', isGold: true }
      ]
    },
    {
      title: 'Seaborne Intelligence',
      icon: 'Ship',
      items: [
        { key: 'ships', label: 'Active Vessels', icon: 'Ship' },
        { key: 'ships_tanker', label: 'Live Tankers', icon: 'Ship' },
        { key: 'ports', label: 'Strategic Ports', icon: 'Anchor' },
        { key: 'tradeRoutes', label: 'Maritime Lines', icon: 'GitFork', isGold: true },
        { key: 'waterways', label: 'Strategic Waterways', icon: 'Anchor' }
      ]
    },
    {
      title: 'Orbital Surveillance',
      icon: 'Globe',
      items: [
        { key: 'satellites', label: 'Orbital Satellites', icon: 'Orbit' },
        { key: 'spaceports', label: 'Spaceports', icon: 'Globe' }
      ]
    },
    {
      title: 'Strategic Infrastructure',
      icon: 'Shield',
      items: [
        { key: 'militaryBases', label: 'Military Outposts', icon: 'ShieldAlert' },
        { key: 'datacenters', label: 'AI Compute Clusters', icon: 'Cpu' },
        { key: 'nuclear', label: 'Nuclear Stations', icon: 'Zap', isGold: true },
        { key: 'cables', label: 'Subsea Data Cables', icon: 'Workflow' },
        { key: 'pipelines', label: 'Energy Pipelines', icon: 'GitMerge' },
        { key: 'storage_facilities', label: 'Storage Facilities', icon: 'Database' },
        { key: 'minerals', label: 'Critical Minerals', icon: 'Layers' },
        { key: 'internet_disruptions', label: 'Internet Disruptions', icon: 'WifiOff' }
      ]
    },
    {
      title: 'Geopolitical & Threat',
      icon: 'AlertOctagon',
      items: [
        { key: 'conflicts', label: 'Conflict Corridors', icon: 'AlertTriangle' },
        { key: 'cctvs', label: 'Operational CCTVs', icon: 'Video' },
        { key: 'webcams', label: 'Live Webcams', icon: 'Video' },
        { key: 'gps_jamming', label: 'GPS Jamming', icon: 'Radio' },
        { key: 'protests', label: 'Civil Unrest/Protests', icon: 'Users' },
        { key: 'cyber_threats', label: 'Cyber Threat Indicators', icon: 'Skull', isGold: true },
        { key: 'sanctioned_zones', label: 'Sanctioned Zones', icon: 'Slash' },
        { key: 'live_news', label: 'Live News Feeds', icon: 'Globe' }
      ]
    },
    {
      title: 'Geological & Watch',
      icon: 'Eye',
      items: [
        { key: 'earthquakes', label: 'Seismic Activity', icon: 'Activity' },
        { key: 'fires', label: 'Wildfire FIRMS', icon: 'Flame' },
        { key: 'weather_alerts', label: 'Severe Weather Alerts', icon: 'CloudLightning' },
        { key: 'disease_outbreaks', label: 'Disease Outbreaks', icon: 'Biohazard' },
        { key: 'dayNight', label: 'Day / Night Cycle', icon: 'Moon' }
      ]
    }
  ];

  // Track collapsed state of each group. Default to false (meaning all expanded)
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  const toggleExpand = (title: string) => {
    setCollapsedGroups(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  // Header statistics calculation
  const totalLayers = 33;
  const activeCount = Object.values(activeLayers).filter(Boolean).length;
  
  // Sum of counts of all active layers
  const totalEntities = Object.entries(activeLayers)
    .filter(([_, isActive]) => isActive)
    .reduce((sum, [key, _]) => sum + (counts[key] || 0), 0);

  return (
    <div className="layers-sidebar styled-scrollbar">
      {/* Osiris-style Header */}
      <div className="layers-header">
        <div className="layers-header-left">
          <Icons.Layers size={14} className="layers-header-icon" />
          <span className="layers-header-title">Data Layers</span>
        </div>
        <div className="layers-header-stats">
          <span className="layers-header-badge">{activeCount}/{totalLayers}</span>
          {totalEntities > 0 && (
            <span className="layers-header-badge ent">{totalEntities.toLocaleString()} ENT</span>
          )}
        </div>
      </div>

      {/* Layer Groups List */}
      <div className="layers-list">
        {layerGroups.map((group, gIdx) => {
          const GroupIcon = Icons[group.icon] as React.ComponentType<any>;
          const isCollapsed = collapsedGroups[group.title] || false;
          
          // Calculate group active count
          const groupActiveCount = group.items.filter(item => activeLayers[item.key]).length;
          const isGroupActive = groupActiveCount > 0;

          // Group-level master toggle handler
          const handleGroupToggle = () => {
            const keys = group.items.map(item => item.key);
            // If group is active, toggle all OFF. Otherwise toggle all ON.
            onToggleGroup(keys, !isGroupActive);
          };

          return (
            <div key={gIdx} className="layer-group-container">
              {/* Group Header */}
              <div 
                className="layer-group-header" 
                onClick={() => toggleExpand(group.title)}
              >
                <div className="layer-group-left">
                  <span className="layer-group-icon">
                    {GroupIcon && <GroupIcon size={12} />}
                  </span>
                  <span className="layer-group-title">{group.title}</span>
                </div>
                
                <div className="layer-group-right" onClick={(e) => e.stopPropagation()}>
                  <span className={`layer-group-ratio ${isGroupActive ? 'active' : ''}`}>
                    {groupActiveCount}/{group.items.length}
                  </span>
                  
                  {/* Master Toggle Switch */}
                  <label className="mythrion-toggle">
                    <input
                      type="checkbox"
                      checked={isGroupActive}
                      onChange={handleGroupToggle}
                    />
                    <span className="mythrion-slider"></span>
                  </label>

                  {/* Expand/Collapse Chevron */}
                  <span 
                    className="layer-group-chevron"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleExpand(group.title);
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    {isCollapsed ? <Icons.ChevronRight size={14} /> : <Icons.ChevronDown size={14} />}
                  </span>
                </div>
              </div>

              {/* Group Child Items */}
              {!isCollapsed && (
                <div className="layer-group-content">
                  {/* Group Items */}

                  {group.items.map((item) => {
                    const ItemIcon = Icons[item.icon] as React.ComponentType<any>;
                    const isActive = activeLayers[item.key];
                    const count = counts[item.key] || 0;

                    return (
                      <div 
                        key={item.key} 
                        className={`layer-sub-item ${isActive ? (item.isGold ? 'active-gold' : 'active') : ''}`}
                      >
                        <div className="layer-sub-left">
                          <span className="layer-sub-bullet" />
                          <span className="layer-sub-icon">
                            {ItemIcon && <ItemIcon size={11} />}
                          </span>
                          <span className="layer-sub-text">{item.label}</span>
                        </div>
                        
                        <div className="layer-sub-right">
                          {count > 0 && (
                            <span className="layer-sub-count">
                              {count.toLocaleString()}
                            </span>
                          )}
                          
                          {/* Individual Layer Toggle Switch */}
                          <label className={`mythrion-toggle ${item.isGold ? 'gold-toggle' : ''}`}>
                            <input
                              type="checkbox"
                              checked={isActive || false}
                              onChange={() => onToggleLayer(item.key)}
                            />
                            <span className="mythrion-slider"></span>
                          </label>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
});
