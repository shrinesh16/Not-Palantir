/**
 * Parse the OurAirports CSV and produce a compact JSON for the map.
 * Filters out closed airports and strips unnecessary fields.
 * Output: src/data/airports-global.json
 */
import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Read the raw CSV content
const raw = readFileSync(
  '/Users/shrinesh/.gemini/antigravity/brain/de59df02-e142-4eda-9e6d-ad880b3e41cd/.system_generated/steps/740/content.md',
  'utf-8'
);

// Skip the first few metadata lines (Source:, ---)
const lines = raw.split('\n');
let headerIndex = lines.findIndex(l => l.startsWith('"id"'));
if (headerIndex === -1) {
  console.error('Could not find CSV header');
  process.exit(1);
}

const header = parseCSVRow(lines[headerIndex]);
console.log('Header columns:', header);

const airports = [];
for (let i = headerIndex + 1; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line || line.startsWith('\n')) continue;
  
  const fields = parseCSVRow(line);
  if (fields.length < 6) continue;
  
  const type = fields[header.indexOf('type')];
  const lat = parseFloat(fields[header.indexOf('latitude_deg')]);
  const lng = parseFloat(fields[header.indexOf('longitude_deg')]);
  const name = fields[header.indexOf('name')];
  const iata = fields[header.indexOf('iata_code')] || '';
  const icao = fields[header.indexOf('icao_code')] || '';
  const country = fields[header.indexOf('iso_country')] || '';
  const municipality = fields[header.indexOf('municipality')] || '';
  const continent = fields[header.indexOf('continent')] || '';
  
  // Skip closed airports and entries with invalid coordinates
  if (type === 'closed') continue;
  if (isNaN(lat) || isNaN(lng)) continue;
  
  // Map type to a compact number for size rendering:
  // 0 = heliport, 1 = small_airport, 2 = medium_airport, 3 = large_airport, 4 = seaplane_base
  let t = 1;
  if (type === 'heliport') t = 0;
  else if (type === 'small_airport') t = 1;
  else if (type === 'medium_airport') t = 2;
  else if (type === 'large_airport') t = 3;
  else if (type === 'seaplane_base') t = 4;
  
  airports.push({
    n: name,
    la: Math.round(lat * 10000) / 10000,
    ln: Math.round(lng * 10000) / 10000,
    t,
    c: country,
    m: municipality,
    ia: iata,
    ic: icao,
    ct: continent
  });
}

console.log(`Parsed ${airports.length} airports (excluding closed)`);

// Write compact JSON
const outPath = resolve(__dirname, '../src/data/airports-global.json');
writeFileSync(outPath, JSON.stringify(airports));
console.log(`Written to ${outPath} (${(JSON.stringify(airports).length / 1024 / 1024).toFixed(2)} MB)`);


function parseCSVRow(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  result.push(current);
  return result;
}
