import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import {
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
} from '../data/mockData';
import { airportsToGeoJSON, AIRPORT_TYPE_LABELS } from '../data/airports';
import { portsToGeoJSON, PORT_SIZE_LABELS } from '../data/ports';
import { PIPELINES } from '../data/worldmonitor/pipelines';
import { STRATEGIC_WATERWAYS, SPACEPORTS, CRITICAL_MINERALS } from '../data/worldmonitor/geo';
import type { Flight, Ship, Satellite } from '../data/mockData';

interface MythrionMapProps {
  projection: 'globe' | 'mercator';
  activeLayers: Record<string, boolean>;
  onSelectEntity: (entity: any) => void;
  flights: Flight[];
  ships: Ship[];
  satellites: Satellite[];
  mapStyle?: 'dark' | 'satellite';
  onMapViewportChange?: (viewport: { zoom: number; center: [number, number] }) => void;
}

export const MythrionMap: React.FC<MythrionMapProps> = ({
  projection,
  activeLayers,
  onSelectEntity,
  flights,
  ships,
  satellites,
  mapStyle = 'dark',
  onMapViewportChange
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const onMapViewportChangeRef = useRef(onMapViewportChange);
  useEffect(() => {
    onMapViewportChangeRef.current = onMapViewportChange;
  }, [onMapViewportChange]);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
      center: [0, 20],
      zoom: projection === 'globe' ? 1.5 : 2,
      attributionControl: false
    });

    map.on('load', () => {
      mapRef.current = map;
      setMapLoaded(true);

      // Create empty sources for dynamic data layers
      map.addSource('flights', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
      map.addSource('ships', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
      map.addSource('satellites', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
      map.addSource('daynight', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });

      // Add static data sources
      map.addSource('military-bases', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: STATIC_MILITARY_BASES.map(b => ({
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [b.lng, b.lat] },
            properties: { ...b, layerType: 'military-base' }
          }))
        }
      });

      map.addSource('datacenters', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: STATIC_DATACENTERS.map(d => ({
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [d.lng, d.lat] },
            properties: { ...d, layerType: 'datacenter' }
          }))
        }
      });

      map.addSource('ports', {
        type: 'geojson',
        data: portsToGeoJSON(),
        cluster: false
      });

      map.addSource('nuclear', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: STATIC_NUCLEAR.map(n => ({
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [n.lng, n.lat] },
            properties: { ...n, layerType: 'nuclear' }
          }))
        }
      });

      map.addSource('conflicts', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: STATIC_CONFLICTS.map(c => ({
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [c.lng, c.lat] },
            properties: { ...c, layerType: 'conflict' }
          }))
        }
      });

      map.addSource('cctvs', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: STATIC_CCTVS.map(c => ({
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [c.lng, c.lat] },
            properties: { ...c, layerType: 'cctv' }
          }))
        }
      });

      map.addSource('earthquakes', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: STATIC_EARTHQUAKES.map(e => ({
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [e.lng, e.lat] },
            properties: { ...e, layerType: 'earthquake' }
          }))
        }
      });

      map.addSource('fires', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: STATIC_FIRES.map(f => ({
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [f.lng, f.lat] },
            properties: { ...f, layerType: 'fire' }
          }))
        }
      });

      map.addSource('airports', {
        type: 'geojson',
        data: airportsToGeoJSON(),
        cluster: false
      });

      map.addSource('cables', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: STATIC_CABLES.map(c => ({
            type: 'Feature',
            geometry: { type: 'LineString', coordinates: c.path },
            properties: { ...c, layerType: 'cable' }
          }))
        }
      });

      map.addSource('trade-routes', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: STATIC_TRADE_ROUTES.map(r => ({
            type: 'Feature',
            geometry: { type: 'LineString', coordinates: r.path },
            properties: { ...r, layerType: 'trade-route' }
          }))
        }
      });

      map.addSource('pipelines', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: PIPELINES.map(p => ({
            type: 'Feature',
            geometry: { type: 'LineString', coordinates: p.points },
            properties: { ...p, layerType: 'pipeline' }
          }))
        }
      });

      map.addSource('waterways', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: STRATEGIC_WATERWAYS.map(w => ({
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [w.lon, w.lat] },
            properties: { ...w, layerType: 'waterway' }
          }))
        }
      });

      map.addSource('spaceports', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: SPACEPORTS.map(s => ({
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [s.lon, s.lat] },
            properties: { ...s, layerType: 'spaceport' }
          }))
        }
      });

      map.addSource('minerals', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: CRITICAL_MINERALS.map(m => ({
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [m.lon, m.lat] },
            properties: { ...m, layerType: 'mineral' }
          }))
        }
      });

      map.addSource('storage-facilities', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: STATIC_STORAGE_FACILITIES.map(s => ({
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [s.lng, s.lat] },
            properties: { ...s, layerType: 'storage-facility' }
          }))
        }
      });

      map.addSource('internet-disruptions', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: STATIC_INTERNET_DISRUPTIONS.map(d => ({
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [d.lng, d.lat] },
            properties: { ...d, layerType: 'internet-disruption' }
          }))
        }
      });

      map.addSource('webcams', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: STATIC_WEBCAMS.map(w => ({
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [w.lng, w.lat] },
            properties: { ...w, layerType: 'webcam' }
          }))
        }
      });

      map.addSource('gps-jamming', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: STATIC_GPS_JAMMING.map(j => ({
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [j.lng, j.lat] },
            properties: { ...j, layerType: 'gps-jamming' }
          }))
        }
      });

      map.addSource('protests', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: STATIC_PROTESTS.map(p => ({
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [p.lng, p.lat] },
            properties: { ...p, layerType: 'protest' }
          }))
        }
      });

      map.addSource('cyber-threats', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: STATIC_CYBER_THREATS.map(c => ({
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [c.lng, c.lat] },
            properties: { ...c, layerType: 'cyber-threat' }
          }))
        }
      });

      map.addSource('sanctioned-zones', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: STATIC_SANCTIONED_ZONES.map(s => ({
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [s.lng, s.lat] },
            properties: { ...s, layerType: 'sanctioned-zone' }
          }))
        }
      });

      map.addSource('live-news', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: STATIC_LIVE_NEWS.map(n => ({
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [n.lng, n.lat] },
            properties: { ...n, layerType: 'live-news' }
          }))
        }
      });

      map.addSource('weather-alerts', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: STATIC_WEATHER_ALERTS.map(w => ({
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [w.lng, w.lat] },
            properties: { ...w, layerType: 'weather-alert' }
          }))
        }
      });

      map.addSource('disease-outbreaks', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: STATIC_DISEASE_OUTBREAKS.map(d => ({
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [d.lng, d.lat] },
            properties: { ...d, layerType: 'disease-outbreak' }
          }))
        }
      });

      // --- LAYERS DEFINITION ---
      
      // 1. Day / Night terminator
      map.addLayer({
        id: 'daynight-layer',
        type: 'fill',
        source: 'daynight',
        layout: { visibility: 'none' },
        paint: {
          'fill-color': '#000000',
          'fill-opacity': 0.45
        }
      });

      // 2. Subsea Cables (Lines)
      map.addLayer({
        id: 'cables-layer',
        type: 'line',
        source: 'cables',
        layout: { visibility: 'none' },
        paint: {
          'line-color': [
            'match',
            ['get', 'status'],
            'Active', '#00e5ff',
            'Degraded', '#ff9500',
            'Fault', '#ff3d3d',
            '#00e5ff'
          ],
          'line-width': 2.5,
          'line-opacity': 0.75
        }
      });

      // 3. Trade Routes (Dashed Lines)
      map.addLayer({
        id: 'trade-routes-layer',
        type: 'line',
        source: 'trade-routes',
        layout: { visibility: 'none' },
        paint: {
          'line-color': '#d4af37',
          'line-width': 1.5,
          'line-dasharray': [4, 4],
          'line-opacity': 0.6
        }
      });

      // 4. Conflict Zones (Pulsing Red Areas / Points)
      map.addLayer({
        id: 'conflicts-layer',
        type: 'circle',
        source: 'conflicts',
        layout: { visibility: 'none' },
        paint: {
          'circle-radius': [
            'match',
            ['get', 'severity'],
            'war', 22,
            'high', 16,
            'moderate', 12,
            12
          ],
          'circle-color': '#ff3d3d',
          'circle-opacity': 0.25,
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ff3d3d',
          'circle-stroke-opacity': 0.8
        }
      });

      // 5. Military Bases (Blue Triangles represent as circle with stroke-width)
      map.addLayer({
        id: 'military-bases-layer',
        type: 'circle',
        source: 'military-bases',
        layout: { visibility: 'none' },
        paint: {
          'circle-radius': 7,
          'circle-color': '#1a237e',
          'circle-stroke-width': 2.5,
          'circle-stroke-color': '#00e5ff',
          'circle-stroke-opacity': 0.9
        }
      });

      // 6. AI Datacenters (Cyan Squares/Dots)
      map.addLayer({
        id: 'datacenters-layer',
        type: 'circle',
        source: 'datacenters',
        layout: { visibility: 'none' },
        paint: {
          'circle-radius': 6,
          'circle-color': '#ff9500',
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff',
          'circle-stroke-opacity': 0.8
        }
      });

      // 7. Maritime Ports (Cargo / Energy Anchors)
      map.addLayer({
        id: 'ports-layer',
        type: 'circle',
        source: 'ports',
        layout: { visibility: 'none' },
        paint: {
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            1, [
              'match', ['get', 'size'],
              'L', 1.5,
              'M', 1.0,
              0.8 // V, S, U
            ],
            10, [
              'match', ['get', 'size'],
              'L', 5.0,
              'M', 3.5,
              2.5 // V, S, U
            ]
          ],
          'circle-color': [
            'match', ['get', 'size'],
            'L', '#444444',
            'M', '#222222',
            '#000000'
          ],
          'circle-stroke-width': [
            'interpolate',
            ['linear'],
            ['zoom'],
            1, 0.5,
            10, 1.5
          ],
          'circle-stroke-color': '#ffffff',
          'circle-opacity': 0.85
        }
      });

      // 8. Nuclear Facilities (Warning Yellow)
      map.addLayer({
        id: 'nuclear-layer',
        type: 'circle',
        source: 'nuclear',
        layout: { visibility: 'none' },
        paint: {
          'circle-radius': 8,
          'circle-color': '#ffeb3b',
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ff9500',
          'circle-stroke-opacity': 0.9
        }
      });

      // 9. CCTV Cameras
      map.addLayer({
        id: 'cctvs-layer',
        type: 'circle',
        source: 'cctvs',
        layout: { visibility: 'none' },
        paint: {
          'circle-radius': 5,
          'circle-color': '#ff4081',
          'circle-stroke-width': 1.5,
          'circle-stroke-color': '#ffffff',
          'circle-stroke-opacity': 0.8
        }
      });

      // 10. Earthquakes
      map.addLayer({
        id: 'earthquakes-layer',
        type: 'circle',
        source: 'earthquakes',
        layout: { visibility: 'none' },
        paint: {
          'circle-radius': ['*', ['get', 'magnitude'], 2.5],
          'circle-color': '#ff3d3d',
          'circle-opacity': 0.4,
          'circle-stroke-width': 1.5,
          'circle-stroke-color': '#ff8a80',
          'circle-stroke-opacity': 0.8
        }
      });

      // 11. Wildfire Satellites (FIRMS Hotspots)
      map.addLayer({
        id: 'fires-layer',
        type: 'circle',
        source: 'fires',
        layout: { visibility: 'none' },
        paint: {
          'circle-radius': 5,
          'circle-color': '#ff5722',
          'circle-opacity': 0.7,
          'circle-stroke-width': 1.5,
          'circle-stroke-color': '#ffeb3b',
          'circle-stroke-opacity': 0.9
        }
      });

      // 12. Dynamic Satellites (Space Paths)
      map.addLayer({
        id: 'satellites-layer',
        type: 'circle',
        source: 'satellites',
        layout: { visibility: 'none' },
        paint: {
          'circle-radius': 5,
          'circle-color': ['get', 'color'],
          'circle-stroke-width': 1.5,
          'circle-stroke-color': '#ffffff',
          'circle-stroke-opacity': 0.7
        }
      });

      // 13. Dynamic Ships - Active Vessels (Cargo, Cargo/Military)
      map.addLayer({
        id: 'ships-layer',
        type: 'circle',
        source: 'ships',
        filter: ['in', ['get', 'type'], ['literal', ['cargo', 'military']]],
        layout: { visibility: 'none' },
        paint: {
          'circle-radius': 5.5,
          'circle-color': [
            'match',
            ['get', 'type'],
            'military', '#ff3d3d',
            '#00e676'
          ],
          'circle-stroke-width': 1.5,
          'circle-stroke-color': '#ffffff',
          'circle-stroke-opacity': 0.8
        }
      });

      // 13b. Dynamic Ships - Live Tankers
      map.addLayer({
        id: 'ships-tanker-layer',
        type: 'circle',
        source: 'ships',
        filter: ['==', ['get', 'type'], 'tanker'],
        layout: { visibility: 'none' },
        paint: {
          'circle-radius': 6.0,
          'circle-color': '#00e5ff',
          'circle-stroke-width': 1.5,
          'circle-stroke-color': '#ffffff',
          'circle-stroke-opacity': 0.9
        }
      });

      // 14a. Dynamic Flights - Commercial
      map.addLayer({
        id: 'flights-commercial-layer',
        type: 'circle',
        source: 'flights',
        filter: ['==', ['get', 'type'], 'commercial'],
        layout: { visibility: 'none' },
        paint: {
          'circle-radius': 5.5,
          'circle-color': '#00e5ff',
          'circle-stroke-width': 1.5,
          'circle-stroke-color': '#ffffff',
          'circle-stroke-opacity': 0.85
        }
      });

      // 14b. Dynamic Flights - Private
      map.addLayer({
        id: 'flights-private-layer',
        type: 'circle',
        source: 'flights',
        filter: ['==', ['get', 'type'], 'private'],
        layout: { visibility: 'none' },
        paint: {
          'circle-radius': 5.5,
          'circle-color': '#d4af37',
          'circle-stroke-width': 1.5,
          'circle-stroke-color': '#ffffff',
          'circle-stroke-opacity': 0.85
        }
      });

      // 14c. Dynamic Flights - Jets
      map.addLayer({
        id: 'flights-jet-layer',
        type: 'circle',
        source: 'flights',
        filter: ['==', ['get', 'type'], 'jet'],
        layout: { visibility: 'none' },
        paint: {
          'circle-radius': 6.0,
          'circle-color': '#ff4081',
          'circle-stroke-width': 1.5,
          'circle-stroke-color': '#ffffff',
          'circle-stroke-opacity': 0.85
        }
      });

      // 14d. Dynamic Flights - Military
      map.addLayer({
        id: 'flights-military-layer',
        type: 'circle',
        source: 'flights',
        filter: ['==', ['get', 'type'], 'military'],
        layout: { visibility: 'none' },
        paint: {
          'circle-radius': 6.5,
          'circle-color': '#ff3d3d',
          'circle-stroke-width': 2.0,
          'circle-stroke-color': '#ffffff',
          'circle-stroke-opacity': 0.95
        }
      });

      // 15. Global Airports Layer (Monochromatic Black & White HUD theme)
      map.addLayer({
        id: 'airports-layer',
        type: 'circle',
        source: 'airports',
        layout: { visibility: 'none' },
        paint: {
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            1, [
              'match', ['get', 'airportType'],
              3, 1.2,  // Large
              2, 0.8,  // Medium
              0.5      // Others (Small, Heliports, Seaplane)
            ],
            10, [
              'match', ['get', 'airportType'],
              3, 4.0,
              2, 2.5,
              1.5
            ]
          ],
          'circle-color': [
            'match', ['get', 'airportType'],
            3, '#ffffff', // Large: bright white
            2, '#cccccc', // Medium: gray
            '#888888'     // Others: darker gray
          ],
          'circle-stroke-width': [
            'interpolate',
            ['linear'],
            ['zoom'],
            1, 0,
            6, 0.5,
            12, 1.0
          ],
          'circle-stroke-color': '#000000',
          'circle-opacity': 0.85
        }
      });

      // 16. Energy Pipelines
      map.addLayer({
        id: 'pipelines-layer',
        type: 'line',
        source: 'pipelines',
        layout: { visibility: 'none' },
        paint: {
          'line-color': '#ff7043',
          'line-width': 2.0,
          'line-opacity': 0.8
        }
      });

      // 17. Strategic Waterways
      map.addLayer({
        id: 'waterways-layer',
        type: 'circle',
        source: 'waterways',
        layout: { visibility: 'none' },
        paint: {
          'circle-radius': 6.5,
          'circle-color': '#29b6f6',
          'circle-stroke-width': 1.5,
          'circle-stroke-color': '#ffffff',
          'circle-opacity': 0.9
        }
      });

      // 18. Spaceports
      map.addLayer({
        id: 'spaceports-layer',
        type: 'circle',
        source: 'spaceports',
        layout: { visibility: 'none' },
        paint: {
          'circle-radius': 7.0,
          'circle-color': '#e040fb',
          'circle-stroke-width': 2.0,
          'circle-stroke-color': '#ffffff',
          'circle-opacity': 0.9
        }
      });

      // 19. Critical Minerals
      map.addLayer({
        id: 'minerals-layer',
        type: 'circle',
        source: 'minerals',
        layout: { visibility: 'none' },
        paint: {
          'circle-radius': 6.0,
          'circle-color': '#ffb300',
          'circle-stroke-width': 1.5,
          'circle-stroke-color': '#ffffff',
          'circle-opacity': 0.85
        }
      });

      // 20. Storage Facilities
      map.addLayer({
        id: 'storage-facilities-layer',
        type: 'circle',
        source: 'storage-facilities',
        layout: { visibility: 'none' },
        paint: {
          'circle-radius': 7.0,
          'circle-color': '#ffc107',
          'circle-stroke-width': 1.5,
          'circle-stroke-color': '#ffffff',
          'circle-opacity': 0.85
        }
      });

      // 21. Internet Disruptions
      map.addLayer({
        id: 'internet-disruptions-layer',
        type: 'circle',
        source: 'internet-disruptions',
        layout: { visibility: 'none' },
        paint: {
          'circle-radius': 8.0,
          'circle-color': '#d50000',
          'circle-stroke-width': 2.0,
          'circle-stroke-color': '#ffffff',
          'circle-opacity': 0.9
        }
      });

      // 22. Live Webcams
      map.addLayer({
        id: 'webcams-layer',
        type: 'circle',
        source: 'webcams',
        layout: { visibility: 'none' },
        paint: {
          'circle-radius': 6.0,
          'circle-color': '#ff4081',
          'circle-stroke-width': 1.5,
          'circle-stroke-color': '#ffffff',
          'circle-opacity': 0.85
        }
      });

      // 23. GPS Jamming
      map.addLayer({
        id: 'gps-jamming-layer',
        type: 'circle',
        source: 'gps-jamming',
        layout: { visibility: 'none' },
        paint: {
          'circle-radius': 22.0,
          'circle-color': '#ff3d3d',
          'circle-opacity': 0.2,
          'circle-stroke-width': 1.5,
          'circle-stroke-color': '#ff3d3d',
          'circle-stroke-opacity': 0.8
        }
      });

      // 24. Civil Unrest / Protests
      map.addLayer({
        id: 'protests-layer',
        type: 'circle',
        source: 'protests',
        layout: { visibility: 'none' },
        paint: {
          'circle-radius': 14.0,
          'circle-color': '#ff9800',
          'circle-opacity': 0.25,
          'circle-stroke-width': 1.5,
          'circle-stroke-color': '#ff9800',
          'circle-stroke-opacity': 0.8
        }
      });

      // 25. Cyber Threat Indicators
      map.addLayer({
        id: 'cyber-threats-layer',
        type: 'circle',
        source: 'cyber-threats',
        layout: { visibility: 'none' },
        paint: {
          'circle-radius': 9.0,
          'circle-color': '#00e676',
          'circle-opacity': 0.35,
          'circle-stroke-width': 1.5,
          'circle-stroke-color': '#00e676',
          'circle-stroke-opacity': 0.8
        }
      });

      // 26. Sanctioned Zones
      map.addLayer({
        id: 'sanctioned-zones-layer',
        type: 'circle',
        source: 'sanctioned-zones',
        layout: { visibility: 'none' },
        paint: {
          'circle-radius': 25.0,
          'circle-color': '#d50000',
          'circle-opacity': 0.15,
          'circle-stroke-width': 1.5,
          'circle-stroke-color': '#d50000',
          'circle-stroke-opacity': 0.7
        }
      });

      // 27. Live News Feeds
      map.addLayer({
        id: 'live-news-layer',
        type: 'circle',
        source: 'live-news',
        layout: { visibility: 'none' },
        paint: {
          'circle-radius': 8.0,
          'circle-color': '#2979ff',
          'circle-opacity': 0.4,
          'circle-stroke-width': 1.5,
          'circle-stroke-color': '#2979ff',
          'circle-stroke-opacity': 0.8
        }
      });

      // 28. Severe Weather Alerts
      map.addLayer({
        id: 'weather-alerts-layer',
        type: 'circle',
        source: 'weather-alerts',
        layout: { visibility: 'none' },
        paint: {
          'circle-radius': 35.0,
          'circle-color': '#ffd600',
          'circle-opacity': 0.15,
          'circle-stroke-width': 1.5,
          'circle-stroke-color': '#ffd600',
          'circle-stroke-opacity': 0.7
        }
      });

      // 29. Disease Outbreaks
      map.addLayer({
        id: 'disease-outbreaks-layer',
        type: 'circle',
        source: 'disease-outbreaks',
        layout: { visibility: 'none' },
        paint: {
          'circle-radius': 11.0,
          'circle-color': '#aeea00',
          'circle-opacity': 0.25,
          'circle-stroke-width': 1.5,
          'circle-stroke-color': '#aeea00',
          'circle-stroke-opacity': 0.8
        }
      });

      // Handle Map Clicks
      const layerIds = [
        'flights-commercial-layer', 'flights-private-layer', 'flights-jet-layer', 'flights-military-layer',
        'ships-layer', 'ships-tanker-layer', 'satellites-layer', 'military-bases-layer',
        'datacenters-layer', 'ports-layer', 'nuclear-layer', 'conflicts-layer',
        'cables-layer', 'trade-routes-layer', 'cctvs-layer', 'earthquakes-layer', 'fires-layer',
        'airports-layer', 'pipelines-layer', 'waterways-layer', 'spaceports-layer', 'minerals-layer',
        'storage-facilities-layer', 'internet-disruptions-layer', 'webcams-layer', 'gps-jamming-layer',
        'protests-layer', 'cyber-threats-layer', 'sanctioned-zones-layer', 'live-news-layer',
        'weather-alerts-layer', 'disease-outbreaks-layer'
      ];

      map.on('click', (e) => {
        const features = map.queryRenderedFeatures(e.point, { layers: layerIds });
        if (features && features.length > 0) {
          const feature = features[0];
          onSelectEntity({
            id: feature.properties.id || feature.properties.iata,
            name: feature.properties.name || feature.properties.callsign || feature.properties.label,
            type: feature.properties.layerType || feature.properties.type,
            properties: feature.properties
          });
        }
      });

      // Viewport change updater
      const handleViewportChange = () => {
        const center = map.getCenter();
        const zoom = map.getZoom();
        onMapViewportChangeRef.current?.({
          zoom,
          center: [center.lng, center.lat]
        });
      };

      // Call initially
      handleViewportChange();

      // Hook up movement listeners
      map.on('move', handleViewportChange);
      map.on('zoom', handleViewportChange);

      // Tooltip Popup for hover feedback
      const popup = new maplibregl.Popup({
        closeButton: false,
        closeOnClick: false,
        className: 'mythrion-map-popup'
      });

      // Cursor changes and popups on hover
      map.on('mousemove', (e) => {
        const features = map.queryRenderedFeatures(e.point, { layers: layerIds });
        if (features && features.length > 0) {
          const f = features[0];
          map.getCanvas().style.cursor = 'pointer';
          
          let html = '';
          const props = f.properties;

          if (f.layer.id === 'airports-layer') {
            const iataLabel = props.iata ? ` [${props.iata}]` : (props.icao ? ` [${props.icao}]` : '');
            const typeLabel = AIRPORT_TYPE_LABELS[props.airportType] || 'AIRPORT';
            html = `
              <div class="map-tooltip">
                <div class="tooltip-header">✈️ ${typeLabel}${iataLabel}</div>
                <div class="tooltip-name">${props.name}</div>
                <div class="tooltip-detail">${props.city ? props.city + ', ' : ''}${props.country}</div>
              </div>
            `;
          } else if (f.layer.id === 'ports-layer') {
            const sizeLabel = PORT_SIZE_LABELS[props.size] || 'UNKNOWN';
            const vesselLabel = props.vesselCount ? `<div class="tooltip-detail">Vessel Count: ${Number(props.vesselCount).toLocaleString()}</div>` : '';
            const facilityTypeLabel = (props.facilityType || 'Major Seaport').toUpperCase();
            html = `
              <div class="map-tooltip">
                <div class="tooltip-header">⚓ ${facilityTypeLabel} (${sizeLabel})</div>
                <div class="tooltip-name">${props.name}</div>
                <div class="tooltip-detail">Country: ${props.country || '—'}</div>
                ${vesselLabel}
              </div>
            `;
          } else if (f.layer.id.startsWith('flights-')) {
            html = `
              <div class="map-tooltip">
                <div class="tooltip-header">✈️ FLIGHT [${props.callsign || 'UNK'}]</div>
                <div class="tooltip-name">${props.model || 'Aircraft'}</div>
                <div class="tooltip-detail">Route: ${props.route || 'Local'}</div>
                <div class="tooltip-detail">Alt: ${Number(props.alt).toLocaleString()} ft | Speed: ${props.speed_knots} kt</div>
              </div>
            `;
          } else if (f.layer.id.startsWith('ships-')) {
            html = `
              <div class="map-tooltip">
                <div class="tooltip-header">🚢 VESSEL [${props.flag || 'UNK'}]</div>
                <div class="tooltip-name">${props.name || 'Ship'}</div>
                <div class="tooltip-detail">Type: ${String(props.type).toUpperCase()}</div>
                <div class="tooltip-detail">Dest: ${props.destination || '—'}</div>
              </div>
            `;
          } else if (f.layer.id === 'pipelines-layer') {
            html = `
              <div class="map-tooltip">
                <div class="tooltip-header">⛽ ENERGY PIPELINE</div>
                <div class="tooltip-name">${props.name}</div>
                <div class="tooltip-detail">Status: <span style="color: ${props.status === 'operating' ? '#00e676' : '#ff9500'}">${String(props.status).toUpperCase()}</span></div>
                <div class="tooltip-detail">Type: ${String(props.type).toUpperCase()}</div>
                ${props.operator ? `<div class="tooltip-detail">Operator: ${props.operator}</div>` : ''}
              </div>
            `;
          } else if (f.layer.id === 'waterways-layer') {
            html = `
              <div class="map-tooltip">
                <div class="tooltip-header">⚓ STRATEGIC WATERWAY</div>
                <div class="tooltip-name">${props.name}</div>
                <div class="tooltip-detail">${props.description || 'Global maritime chokepoint'}</div>
              </div>
            `;
          } else if (f.layer.id === 'spaceports-layer') {
            html = `
              <div class="map-tooltip">
                <div class="tooltip-header">🚀 SPACEPORT</div>
                <div class="tooltip-name">${props.name}</div>
                <div class="tooltip-detail">Operator: ${props.operator || 'National Agency'}</div>
                <div class="tooltip-detail">Country: ${props.country}</div>
              </div>
            `;
          } else if (f.layer.id === 'minerals-layer') {
            html = `
              <div class="map-tooltip">
                <div class="tooltip-header">💎 CRITICAL MINERAL SITE</div>
                <div class="tooltip-name">${props.name}</div>
                <div class="tooltip-detail">Commodity: ${props.commodity || 'Rare Earth Elements'}</div>
                <div class="tooltip-detail">Country: ${props.country}</div>
              </div>
            `;
          } else if (f.layer.id === 'storage-facilities-layer') {
            html = `
              <div class="map-tooltip">
                <div class="tooltip-header">🛢️ STORAGE FACILITY</div>
                <div class="tooltip-name">${props.name}</div>
                <div class="tooltip-detail">Type: ${props.facilityType}</div>
                <div class="tooltip-detail">Capacity: ${props.capacityTwh || props.capacityMb || props.capacityMtpa} ${props.workingCapacityUnit}</div>
                <div class="tooltip-detail">Operator: ${props.operator}</div>
              </div>
            `;
          } else if (f.layer.id === 'internet-disruptions-layer') {
            html = `
              <div class="map-tooltip">
                <div class="tooltip-header">🛜 INTERNET DISRUPTION</div>
                <div class="tooltip-name">${props.region}</div>
                <div class="tooltip-detail">Status: <span style="color: #ff3d3d">${props.status}</span></div>
                <div class="tooltip-detail">${props.description}</div>
              </div>
            `;
          } else if (f.layer.id === 'webcams-layer') {
            html = `
              <div class="map-tooltip">
                <div class="tooltip-header">📹 LIVE WEBCAM</div>
                <div class="tooltip-name">${props.name}</div>
                <div class="tooltip-detail">Location: ${props.city}, ${props.country}</div>
              </div>
            `;
          } else if (f.layer.id === 'gps-jamming-layer') {
            html = `
              <div class="map-tooltip">
                <div class="tooltip-header">📡 GPS JAMMING ZONE</div>
                <div class="tooltip-name">${props.name}</div>
                <div class="tooltip-detail">Radius: ${props.radiusKm} km</div>
                <div class="tooltip-detail">Intensity: <span style="color: #ff3d3d">${props.intensity}</span></div>
              </div>
            `;
          } else if (f.layer.id === 'protests-layer') {
            html = `
              <div class="map-tooltip">
                <div class="tooltip-header">📢 CIVIL UNREST / PROTEST</div>
                <div class="tooltip-name">${props.city}, ${props.country}</div>
                <div class="tooltip-detail">Est. Size: ${Number(props.size).toLocaleString()} people</div>
                <div class="tooltip-detail">${props.description}</div>
              </div>
            `;
          } else if (f.layer.id === 'cyber-threats-layer') {
            html = `
              <div class="map-tooltip">
                <div class="tooltip-header">💀 CYBER THREAT DETECTED</div>
                <div class="tooltip-name">${props.name}</div>
                <div class="tooltip-detail">Target: ${props.target}</div>
                <div class="tooltip-detail">Source: ${props.sourceCountry}</div>
              </div>
            `;
          } else if (f.layer.id === 'sanctioned-zones-layer') {
            html = `
              <div class="map-tooltip">
                <div class="tooltip-header">🚫 SANCTIONED ZONE</div>
                <div class="tooltip-name">${props.country}</div>
                <div class="tooltip-detail">Sanction Level: <span style="color: #ff3d3d">${String(props.level).toUpperCase()}</span></div>
                <div class="tooltip-detail">${props.description}</div>
              </div>
            `;
          } else if (f.layer.id === 'live-news-layer') {
            html = `
              <div class="map-tooltip">
                <div class="tooltip-header">📰 LIVE NEWS FEED</div>
                <div class="tooltip-name">${props.title}</div>
                <div class="tooltip-detail">Category: ${props.category}</div>
                <div class="tooltip-detail">${props.description}</div>
              </div>
            `;
          } else if (f.layer.id === 'weather-alerts-layer') {
            html = `
              <div class="map-tooltip">
                <div class="tooltip-header">⚠️ SEVERE WEATHER ALERT</div>
                <div class="tooltip-name">${props.name}</div>
                <div class="tooltip-detail">Type: ${props.type}</div>
                <div class="tooltip-detail">Severity: <span style="color: #ffb300">${String(props.severity).toUpperCase()}</span></div>
              </div>
            `;
          } else if (f.layer.id === 'disease-outbreaks-layer') {
            html = `
              <div class="map-tooltip">
                <div class="tooltip-header">☣️ DISEASE OUTBREAK</div>
                <div class="tooltip-name">${props.disease}</div>
                <div class="tooltip-detail">Location: ${props.location}</div>
                <div class="tooltip-detail">Active Cases: ${props.cases}</div>
              </div>
            `;
          } else {
            html = `
              <div class="map-tooltip">
                <div class="tooltip-header">${(props.layerType || f.layer.id).replace('-layer', '').toUpperCase()}</div>
                <div class="tooltip-name">${props.name || props.callsign || props.label || 'Selected Entity'}</div>
              </div>
            `;
          }
          
          popup.setLngLat(e.lngLat).setHTML(html).addTo(map);
        } else {
          map.getCanvas().style.cursor = '';
          popup.remove();
        }
      });

      map.on('mouseleave', layerIds, () => {
        map.getCanvas().style.cursor = '';
        popup.remove();
      });
    });

    return () => {
      map.remove();
    };
  }, []);

  // Update Map Projection (2D vs 3D)
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;
    mapRef.current.setProjection({ type: projection });
    
    // Smooth transit zoom depending on projection
    mapRef.current.easeTo({
      zoom: projection === 'globe' ? 1.5 : 2,
      duration: 1200
    });
  }, [projection, mapLoaded]);

  // Update Day/Night Shadow terminator polygon
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;

    const updateTerminator = () => {
      const terminatorGeoJSON = computeTerminator();
      const source = mapRef.current?.getSource('daynight') as maplibregl.GeoJSONSource;
      if (source) {
        source.setData(terminatorGeoJSON);
      }
    };

    updateTerminator();
    const interval = setInterval(updateTerminator, 60000); // refresh every minute

    return () => clearInterval(interval);
  }, [mapLoaded]);

  // Update Dynamic Layers data (flights, ships, satellites)
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;

    // Flights
    const flightSource = mapRef.current.getSource('flights') as maplibregl.GeoJSONSource;
    if (flightSource) {
      flightSource.setData({
        type: 'FeatureCollection',
        features: flights.map(f => ({
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [f.lng, f.lat] },
          properties: { ...f, layerType: 'flight' }
        }))
      });
    }

    // Ships
    const shipSource = mapRef.current.getSource('ships') as maplibregl.GeoJSONSource;
    if (shipSource) {
      shipSource.setData({
        type: 'FeatureCollection',
        features: ships.map(s => ({
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [s.lng, s.lat] },
          properties: { ...s, layerType: 'ship' }
        }))
      });
    }

    // Satellites
    const satSource = mapRef.current.getSource('satellites') as maplibregl.GeoJSONSource;
    if (satSource) {
      satSource.setData({
        type: 'FeatureCollection',
        features: satellites.map(s => ({
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [s.lng, s.lat] },
          properties: { ...s, layerType: 'satellite' }
        }))
      });
    }
  }, [flights, ships, satellites, mapLoaded]);

  // Toggle Map layers visibility
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;

    const layerMap: Record<string, string> = {
      flights_commercial: 'flights-commercial-layer',
      flights_private: 'flights-private-layer',
      flights_jet: 'flights-jet-layer',
      flights_military: 'flights-military-layer',
      ships: 'ships-layer',
      ships_tanker: 'ships-tanker-layer',
      satellites: 'satellites-layer',
      militaryBases: 'military-bases-layer',
      datacenters: 'datacenters-layer',
      ports: 'ports-layer',
      nuclear: 'nuclear-layer',
      conflicts: 'conflicts-layer',
      cables: 'cables-layer',
      tradeRoutes: 'trade-routes-layer',
      cctvs: 'cctvs-layer',
      earthquakes: 'earthquakes-layer',
      fires: 'fires-layer',
      dayNight: 'daynight-layer',
      airports: 'airports-layer',
      pipelines: 'pipelines-layer',
      waterways: 'waterways-layer',
      spaceports: 'spaceports-layer',
      minerals: 'minerals-layer',
      storage_facilities: 'storage-facilities-layer',
      internet_disruptions: 'internet-disruptions-layer',
      webcams: 'webcams-layer',
      gps_jamming: 'gps-jamming-layer',
      protests: 'protests-layer',
      cyber_threats: 'cyber-threats-layer',
      sanctioned_zones: 'sanctioned-zones-layer',
      live_news: 'live-news-layer',
      weather_alerts: 'weather-alerts-layer',
      disease_outbreaks: 'disease-outbreaks-layer'
    };

    Object.entries(layerMap).forEach(([layerKey, mapLayerId]) => {
      const isVisible = activeLayers[layerKey];
      if (mapRef.current) {
        mapRef.current.setLayoutProperty(
          mapLayerId,
          'visibility',
          isVisible ? 'visible' : 'none'
        );
      }
    });
  }, [activeLayers, mapLoaded]);

  // Satellite / Dark style switching
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;
    const map = mapRef.current;

    try {
      if (mapStyle !== 'dark') {
        if (!map.getSource('satellite-tiles')) {
          map.addSource('satellite-tiles', {
            type: 'raster',
            tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
            tileSize: 256,
            maxzoom: 18,
          });

          // Find first label/symbol layer to insert satellite underneath
          const layers = map.getStyle().layers;
          let labelLayerId = undefined;
          if (layers) {
            for (const layer of layers) {
              if (layer.type === 'symbol' || layer.id.includes('label')) {
                labelLayerId = layer.id;
                break;
              }
            }
          }
          map.addLayer({
            id: 'satellite-layer',
            type: 'raster',
            source: 'satellite-tiles',
            paint: { 'raster-opacity': 0.85 }
          }, labelLayerId);
        } else {
          map.setLayoutProperty('satellite-layer', 'visibility', 'visible');
        }
      } else {
        if (map.getLayer('satellite-layer')) {
          map.setLayoutProperty('satellite-layer', 'visibility', 'none');
        }
      }
    } catch (e) {
      console.warn('Style switch failed:', e);
    }
  }, [mapLoaded, mapStyle]);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <div ref={mapContainerRef} className="maplibre-container" />
    </div>
  );
};

// --- SOLAR TERMINATOR SHADOW ALGORITHM ---
// Generates the night polygon for day/night overlay
function computeTerminator(): any {
  const now = new Date();
  
  // Calculate Julian date
  const julianDate = (now.getTime() / 86400000) + 2440587.5;
  const julianCentury = (julianDate - 2451545) / 36525;
  
  // Geometric mean longitude of the sun (degrees)
  let geomMeanLongSun = 280.46646 + julianCentury * (36000.76983 + julianCentury * 0.0003032);
  geomMeanLongSun = geomMeanLongSun % 360;
  
  // Geometric mean anomaly of the sun (degrees)
  const geomMeanAnomalySun = 357.52911 + julianCentury * (35999.05029 - 0.0001537 * julianCentury);
  
  // Eccentricity of Earth's orbit
  const eccentricEarthOrbit = 0.016708634 - julianCentury * (0.000042037 + 0.0000001267 * julianCentury);
  
  // Sun Equation of the Center
  const sunEqOfCenter = Math.sin(geomMeanAnomalySun * Math.PI / 180) * (1.914602 - julianCentury * (0.004817 + 0.000014 * julianCentury)) + 
                        Math.sin(2 * geomMeanAnomalySun * Math.PI / 180) * (0.019993 - 0.000101 * julianCentury) + 
                        Math.sin(3 * geomMeanAnomalySun * Math.PI / 180) * 0.000289;
  
  // Sun true longitude
  const sunTrueLong = geomMeanLongSun + sunEqOfCenter;
  
  // Obliquity of ecliptic (degrees)
  const meanObliqEcliptic = 23 + (26 + ((21.448 - julianCentury * (46.815 + julianCentury * (0.00059 - julianCentury * 0.001813)))) / 60) / 60;
  const obliqCorrection = meanObliqEcliptic + 0.00256 * Math.cos((125.04 - 1934.136 * julianCentury) * Math.PI / 180);
  
  // Sun declination (declination is latitude where sun is directly overhead)
  const sunDeclination = Math.asin(Math.sin(obliqCorrection * Math.PI / 180) * Math.sin(sunTrueLong * Math.PI / 180)) * 180 / Math.PI;
  
  // Equation of Time (minutes)
  const y = Math.tan((obliqCorrection / 2) * Math.PI / 180) * Math.tan((obliqCorrection / 2) * Math.PI / 180);
  const eqOfTime = 4 * (y * Math.sin(2 * geomMeanLongSun * Math.PI / 180) - 
                    2 * eccentricEarthOrbit * Math.sin(geomMeanAnomalySun * Math.PI / 180) + 
                    4 * eccentricEarthOrbit * y * Math.sin(geomMeanAnomalySun * Math.PI / 180) * Math.cos(2 * geomMeanLongSun * Math.PI / 180) - 
                    0.5 * y * y * Math.sin(4 * geomMeanLongSun * Math.PI / 180) - 
                    1.25 * eccentricEarthOrbit * eccentricEarthOrbit * Math.sin(2 * geomMeanAnomalySun * Math.PI / 180)) * 180 / Math.PI;
  
  // Calculate solar sub-longitude (longitude where sun is directly overhead)
  const utcOffsetHours = now.getUTCHours() + now.getUTCMinutes() / 60 + now.getUTCSeconds() / 3600;
  const solarLongitude = 180 - (utcOffsetHours * 15) - (eqOfTime / 4);

  // Generate terminator path
  const coordinates: [number, number][] = [];
  const declinationRad = (sunDeclination * Math.PI) / 180;
  
  // Step through longitudes to calculate corresponding latitudes of terminator
  for (let lon = -180; lon <= 180; lon += 2) {
    const lonRad = ((lon - solarLongitude) * Math.PI) / 180;
    const latRad = Math.atan(-Math.cos(lonRad) / Math.tan(declinationRad));
    const lat = (latRad * 180) / Math.PI;
    coordinates.push([lon, lat]);
  }

  // Close the polygon by wrapping around the appropriate pole (night hemisphere)
  const polarPath: [number, number][] = [];
  if (sunDeclination > 0) {
    // Night is in South Pole
    polarPath.push([180, -90]);
    polarPath.push([-180, -90]);
  } else {
    // Night is in North Pole
    polarPath.push([180, 90]);
    polarPath.push([-180, 90]);
  }

  return {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [[...coordinates, ...polarPath, coordinates[0]]]
        },
        properties: {}
      }
    ]
  };
}
