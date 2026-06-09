// Detailed Global Maritime Shipping Lines
// Generates bundled, detailed sea routes that fan out across the ocean and bundle at chokepoints.

export const BASE_MARITIME_PATHS: { name: string; path: [number, number, number][] }[] = [
  {
    name: "North Atlantic Highway",
    path: [
      [-74.0, 40.7, 0.1],   // New York
      [-55.0, 43.0, 1.5],
      [-30.0, 48.0, 2.5],
      [-10.0, 49.5, 1.2],
      [-5.0, 49.8, 0.4],    // Channel Entrance
      [1.5, 50.5, 0.1],     // Dover Strait
      [4.1, 51.9, 0.1]      // Rotterdam
    ]
  },
  {
    name: "US East Coast to Mediterranean",
    path: [
      [-74.0, 40.7, 0.1],   // New York
      [-55.0, 38.0, 1.8],
      [-35.0, 34.0, 2.8],
      [-15.0, 35.5, 1.5],
      [-5.6, 35.9, 0.1],    // Gibraltar
      [15.0, 34.0, 1.8],    // Mid Mediterranean
      [32.3, 30.5, 0.1]     // Suez
    ]
  },
  {
    name: "Panama to Mediterranean",
    path: [
      [-79.9, 9.1, 0.1],    // Panama
      [-75.0, 15.0, 0.8],
      [-65.0, 18.0, 1.5],   // Caribbean Exit
      [-45.0, 26.0, 2.8],
      [-25.0, 31.0, 2.5],
      [-5.6, 35.9, 0.1],    // Gibraltar
      [15.0, 34.0, 1.8],
      [32.3, 30.5, 0.1]     // Suez
    ]
  },
  {
    name: "Panama to Northern Europe",
    path: [
      [-79.9, 9.1, 0.1],    // Panama
      [-75.0, 15.0, 0.8],
      [-65.0, 22.0, 1.8],
      [-45.0, 35.0, 2.8],
      [-20.0, 45.0, 2.2],
      [-5.0, 49.8, 0.4],    // Channel Entrance
      [1.5, 50.5, 0.1],     // Dover Strait
      [4.1, 51.9, 0.1]      // Rotterdam
    ]
  },
  {
    name: "South America to Gibraltar",
    path: [
      [-46.3, -23.9, 0.1],  // Santos
      [-38.0, -15.0, 1.5],
      [-25.0, 0.0, 2.5],
      [-23.0, 16.0, 0.5],   // Cape Verde
      [-18.0, 28.0, 1.2],
      [-5.6, 35.9, 0.1]     // Gibraltar
    ]
  },
  {
    name: "South America to Northern Europe",
    path: [
      [-46.3, -23.9, 0.1],  // Santos
      [-35.0, -10.0, 2.0],
      [-23.0, 16.0, 0.5],   // Cape Verde
      [-17.0, 35.0, 2.5],
      [-8.0, 45.0, 1.8],
      [-5.0, 49.8, 0.4],    // Channel Entrance
      [1.5, 50.5, 0.1],     // Dover Strait
      [4.1, 51.9, 0.1]      // Rotterdam
    ]
  },
  {
    name: "South America to West Africa",
    path: [
      [-46.3, -23.9, 0.1],  // Santos
      [-25.0, -15.0, 2.5],
      [-10.0, -5.0, 2.0],
      [3.4, 6.4, 0.1]       // Lagos
    ]
  },
  {
    name: "West Africa to Gibraltar",
    path: [
      [3.4, 6.4, 0.1],      // Lagos
      [-8.0, 4.0, 1.2],
      [-17.0, 14.0, 0.8],   // West Africa bend
      [-23.0, 16.0, 0.5],   // Cape Verde
      [-18.0, 28.0, 1.0],
      [-5.6, 35.9, 0.1]     // Gibraltar
    ]
  },
  {
    name: "Northern Europe to South Africa",
    path: [
      [4.1, 51.9, 0.1],     // Rotterdam
      [1.5, 50.5, 0.1],     // Dover Strait
      [-5.0, 45.0, 1.5],
      [-18.0, 28.0, 1.8],
      [-23.0, 16.0, 0.5],   // Cape Verde
      [-15.0, -5.0, 2.5],
      [0.0, -20.0, 2.8],
      [10.0, -30.0, 1.5],
      [18.5, -34.4, 0.1]    // Cape of Good Hope
    ]
  },
  {
    name: "South America to South Africa",
    path: [
      [-46.3, -23.9, 0.1],  // Santos
      [-25.0, -28.0, 2.8],
      [0.0, -32.0, 2.5],
      [18.5, -34.4, 0.1]    // Cape of Good Hope
    ]
  },
  {
    name: "Suez to South Africa",
    path: [
      [32.3, 30.5, 0.1],    // Suez
      [34.0, 27.2, 0.2],
      [40.0, 20.0, 0.4],
      [43.3, 12.6, 0.1],    // Bab el-Mandeb
      [48.0, 10.0, 0.8],
      [50.0, -5.0, 2.0],
      [44.0, -15.0, 1.8],
      [38.0, -25.0, 1.2],
      [28.0, -33.0, 0.8],
      [18.5, -34.4, 0.1]    // Cape of Good Hope
    ]
  },
  {
    name: "Suez to India & Persian Gulf",
    path: [
      [32.3, 30.5, 0.1],    // Suez
      [43.3, 12.6, 0.1],    // Bab el-Mandeb
      [45.0, 12.8, 0.2],    // Aden
      [53.0, 15.0, 1.2],
      [56.3, 26.6, 0.1],    // Hormuz
      [65.0, 22.0, 1.5],
      [72.8, 18.9, 0.1]     // Mumbai
    ]
  },
  {
    name: "Persian Gulf to India",
    path: [
      [56.3, 26.6, 0.1],    // Hormuz
      [65.0, 22.0, 1.5],
      [72.8, 18.9, 0.1]     // Mumbai
    ]
  },
  {
    name: "Persian Gulf to South Africa",
    path: [
      [56.3, 26.6, 0.1],    // Hormuz
      [58.0, 15.0, 1.5],
      [52.0, -2.0, 2.2],
      [45.0, -15.0, 1.8],
      [38.0, -28.0, 1.2],
      [18.5, -34.4, 0.1]    // Cape of Good Hope
    ]
  },
  {
    name: "Persian Gulf to East Asia",
    path: [
      [56.3, 26.6, 0.1],    // Hormuz
      [62.0, 12.0, 2.0],
      [79.9, 6.9, 0.1],     // Colombo
      [90.0, 5.0, 1.8],
      [101.6, 2.6, 0.1],    // Malacca
      [103.8, 1.3, 0.1]     // Singapore
    ]
  },
  {
    name: "India to East Asia",
    path: [
      [72.8, 18.9, 0.1],    // Mumbai
      [79.9, 6.9, 0.1],     // Colombo
      [90.0, 5.0, 1.8],
      [101.6, 2.6, 0.1],    // Malacca
      [103.8, 1.3, 0.1]     // Singapore
    ]
  },
  {
    name: "Singapore to Japan",
    path: [
      [103.8, 1.3, 0.1],    // Singapore
      [110.0, 10.0, 1.8],
      [114.2, 22.3, 0.1],    // Hong Kong
      [121.5, 31.2, 0.1],    // Shanghai
      [130.0, 32.0, 1.2],
      [139.7, 35.7, 0.1]     // Tokyo
    ]
  },
  {
    name: "Singapore to Adelaide & Sydney",
    path: [
      [103.8, 1.3, 0.1],    // Singapore
      [105.7, -6.1, 0.1],    // Sunda Strait
      [110.0, -15.0, 2.0],
      [112.0, -28.0, 2.2],
      [115.1, -34.4, 0.1],   // Cape Leeuwin
      [128.0, -35.0, 1.5],
      [138.6, -34.9, 0.1],   // Adelaide
      [144.9, -37.8, 0.1],   // Melbourne
      [151.2, -33.9, 0.1]    // Sydney
    ]
  },
  {
    name: "Singapore to Sydney via East Coast",
    path: [
      [103.8, 1.3, 0.1],    // Singapore
      [115.7, -8.5, 0.1],    // Lombok Strait
      [125.0, -8.0, 1.5],
      [135.0, -10.0, 1.2],
      [142.2, -10.5, 0.1],   // Torres Strait
      [148.0, -18.0, 2.0],
      [153.0, -28.0, 1.5],
      [151.2, -33.9, 0.1]    // Sydney
    ]
  },
  {
    name: "South Africa to Australia",
    path: [
      [18.5, -34.4, 0.1],    // Cape of Good Hope
      [45.0, -38.0, 3.0],
      [75.0, -39.0, 3.2],
      [100.0, -37.0, 2.2],
      [115.1, -34.4, 0.1]    // Cape Leeuwin
    ]
  },
  {
    name: "East Asia to Seattle",
    path: [
      [121.5, 31.2, 0.1],    // Shanghai
      [139.7, 35.7, 0.1],    // Tokyo
      [160.0, 42.0, 2.5],
      [180.0, 45.0, 3.0],   // Anti-meridian crossing (continuous)
      [200.0, 45.0, 2.8],   // -160.0
      [220.0, 43.0, 2.2],   // -140.0
      [237.7, 47.6, 0.1]    // Seattle -122.3
    ]
  },
  {
    name: "East Asia to Los Angeles",
    path: [
      [139.7, 35.7, 0.1],    // Tokyo
      [170.0, 38.0, 2.8],
      [190.0, 38.0, 3.0],   // -170.0 (continuous)
      [210.0, 35.0, 2.5],   // -150.0
      [230.0, 33.0, 1.5],   // -130.0
      [241.7, 33.7, 0.1]    // Los Angeles -118.3
    ]
  },
  {
    name: "Singapore to Los Angeles via Hawaii",
    path: [
      [103.8, 1.3, 0.1],    // Singapore
      [115.0, 8.0, 1.8],
      [135.0, 12.0, 2.2],
      [144.7, 13.4, 0.1],    // Guam
      [165.0, 17.0, 2.5],
      [185.0, 20.0, 2.2],   // -175.0 (continuous)
      [202.1, 21.3, 0.1],   // Hawaii -157.9
      [225.0, 28.0, 2.0],   // -135.0
      [241.7, 33.7, 0.1]    // Los Angeles -118.3
    ]
  },
  {
    name: "Panama to East Asia via Hawaii",
    path: [
      [-79.9, 9.1, 0.1],    // Panama
      [-100.0, 14.0, 2.0],
      [-125.0, 18.0, 2.5],
      [-157.9, 21.3, 0.1],   // Hawaii
      [-180.0, 23.0, 2.5],
      [-200.0, 26.0, 2.2],  // Tokyo 160.0 -> continuous decreasing
      [-220.3, 35.7, 0.1]    // Tokyo 139.7
    ]
  },
  {
    name: "Panama to Sydney",
    path: [
      [-79.9, 9.1, 0.1],    // Panama
      [-100.0, -5.0, 2.5],
      [-130.0, -15.0, 3.0],
      [-160.0, -20.0, 2.8],
      [-180.0, -22.0, 2.0],
      [-195.0, -25.0, 1.5],  // Sydney 165.0 -> continuous decreasing
      [-208.8, -33.9, 0.1]   // Sydney 151.2
    ]
  },
  {
    name: "Australia to South America (Cape Horn)",
    path: [
      [151.2, -33.9, 0.1],   // Sydney
      [175.0, -42.0, 2.5],
      [200.0, -48.0, 3.0],   // -160.0 (continuous)
      [230.0, -52.0, 3.0],   // -130.0
      [260.0, -55.0, 2.5],   // -100.0
      [292.7, -56.0, 0.1]    // Cape Horn -67.3
    ]
  },
  {
    name: "US West Coast to South America",
    path: [
      [-118.3, 33.7, 0.1],   // Los Angeles
      [-105.0, 15.0, 1.8],
      [-90.0, 2.0, 1.5],
      [-79.9, 9.1, 0.1],     // Panama
      [-80.0, -5.0, 1.2],
      [-77.1, -12.1, 0.1],   // Lima
      [-74.0, -25.0, 1.0],
      [-71.6, -33.0, 0.1]    // Valparaiso
    ]
  },
  {
    name: "Cape Horn to US East Coast",
    path: [
      [-67.3, -56.0, 0.1],   // Cape Horn
      [-50.0, -42.0, 2.2],
      [-40.0, -25.0, 2.5],
      [-35.0, -10.0, 1.8],
      [-46.3, -23.9, 0.1],   // Santos
      [-38.0, -5.0, 1.8],
      [-50.0, 10.0, 1.5],
      [-65.0, 18.0, 0.8],    // Caribbean Exit
      [-74.0, 30.0, 1.2],
      [-74.0, 40.7, 0.1]     // New York
    ]
  }
];

export function getMaritimeLinesGeoJSON(): any {
  const features: any[] = [];

  BASE_MARITIME_PATHS.forEach((route, routeIdx) => {
    const path = route.path;
    const n = path.length;
    if (n < 2) return;

    // We bundle 5 parallel lines per route
    const numSubLines = 5;
    const subLines: [number, number][][] = Array.from({ length: numSubLines }, () => []);

    for (let i = 0; i < n; i++) {
      const [lng, lat, spread] = path[i];

      // Determine tangent vector (dx, dy)
      let dx = 0;
      let dy = 0;

      if (i === 0) {
        dx = path[1][0] - lng;
        dy = path[1][1] - lat;
      } else if (i === n - 1) {
        dx = lng - path[i - 1][0];
        dy = lat - path[i - 1][1];
      } else {
        const dx1 = lng - path[i - 1][0];
        const dy1 = lat - path[i - 1][1];
        const dx2 = path[i + 1][0] - lng;
        const dy2 = path[i + 1][1] - lat;

        // Wrap check
        const wrapDx1 = dx1 > 180 ? dx1 - 360 : (dx1 < -180 ? dx1 + 360 : dx1);
        const wrapDx2 = dx2 > 180 ? dx2 - 360 : (dx2 < -180 ? dx2 + 360 : dx2);

        dx = (wrapDx1 + wrapDx2) / 2;
        dy = (dy1 + dy2) / 2;
      }

      // Handle wrapping
      if (dx > 180) dx -= 360;
      if (dx < -180) dx += 360;

      const len = Math.sqrt(dx * dx + dy * dy);
      let nx = 0;
      let ny = 0;
      if (len > 0) {
        nx = -dy / len;
        ny = dx / len;
      }

      const mid = (numSubLines - 1) / 2;
      for (let k = 0; k < numSubLines; k++) {
        const multiplier = k - mid; // -2, -1, 0, 1, 2

        // Perpendicular offset scaled by spread
        let offsetLng = nx * multiplier * spread * 0.16;
        let offsetLat = ny * multiplier * spread * 0.16;

        // Slight wavy noise to give lines an organic sea route flow
        const waveFreq = 0.6;
        const wavePhase = (k * Math.PI) / numSubLines;
        const noise = Math.sin(i * waveFreq + wavePhase) * spread * 0.04;
        offsetLng += ny * noise;
        offsetLat -= nx * noise;

        let newLng = lng + offsetLng;
        let newLat = lat + offsetLat;

        if (newLat > 85) newLat = 85;
        if (newLat < -85) newLat = -85;

        // Keep coordinates continuous across the anti-meridian to prevent lines
        // from incorrectly wrapping the long way around the earth and crossing continents.
        subLines[k].push([newLng, newLat]);
      }
    }

    // Add each sub-line as a GeoJSON Feature
    subLines.forEach((coords, subIdx) => {
      features.push({
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: coords
        },
        properties: {
          id: `MR-${routeIdx}-${subIdx}`,
          name: `${route.name} (Sublane ${subIdx + 1})`,
          layerType: "trade-route"
        }
      });
    });
  });

  return {
    type: "FeatureCollection",
    features
  };
}
