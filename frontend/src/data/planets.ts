// Celestial-body names used to name system trainings. The key is stored in the
// DB (planetKey); the label is shown localized. Only keys not already used by an
// existing system plan are offered when naming a new training.
export interface Planet {
  key: string;
  de: string;
  en: string;
}

export const PLANETS: Planet[] = [
  // Planets
  { key: 'mercury', de: 'Merkur', en: 'Mercury' },
  { key: 'venus', de: 'Venus', en: 'Venus' },
  { key: 'earth', de: 'Erde', en: 'Earth' },
  { key: 'mars', de: 'Mars', en: 'Mars' },
  { key: 'jupiter', de: 'Jupiter', en: 'Jupiter' },
  { key: 'saturn', de: 'Saturn', en: 'Saturn' },
  { key: 'uranus', de: 'Uranus', en: 'Uranus' },
  { key: 'neptune', de: 'Neptun', en: 'Neptune' },
  // Dwarf planets
  { key: 'pluto', de: 'Pluto', en: 'Pluto' },
  { key: 'ceres', de: 'Ceres', en: 'Ceres' },
  { key: 'eris', de: 'Eris', en: 'Eris' },
  { key: 'haumea', de: 'Haumea', en: 'Haumea' },
  { key: 'makemake', de: 'Makemake', en: 'Makemake' },
  // Sun & Moon
  { key: 'sun', de: 'Sonne', en: 'Sun' },
  { key: 'luna', de: 'Mond', en: 'Moon' },
  // Moons
  { key: 'phobos', de: 'Phobos', en: 'Phobos' },
  { key: 'deimos', de: 'Deimos', en: 'Deimos' },
  { key: 'io', de: 'Io', en: 'Io' },
  { key: 'europa', de: 'Europa', en: 'Europa' },
  { key: 'ganymede', de: 'Ganymed', en: 'Ganymede' },
  { key: 'callisto', de: 'Kallisto', en: 'Callisto' },
  { key: 'titan', de: 'Titan', en: 'Titan' },
  { key: 'enceladus', de: 'Enceladus', en: 'Enceladus' },
  { key: 'triton', de: 'Triton', en: 'Triton' },
  { key: 'charon', de: 'Charon', en: 'Charon' },
  { key: 'titania', de: 'Titania', en: 'Titania' },
  { key: 'oberon', de: 'Oberon', en: 'Oberon' },
  { key: 'miranda', de: 'Miranda', en: 'Miranda' },
  { key: 'rhea', de: 'Rhea', en: 'Rhea' },
  { key: 'iapetus', de: 'Iapetus', en: 'Iapetus' },
  { key: 'dione', de: 'Dione', en: 'Dione' },
  { key: 'tethys', de: 'Tethys', en: 'Tethys' },
  { key: 'mimas', de: 'Mimas', en: 'Mimas' },
  // Stars & constellations
  { key: 'sirius', de: 'Sirius', en: 'Sirius' },
  { key: 'vega', de: 'Vega', en: 'Vega' },
  { key: 'rigel', de: 'Rigel', en: 'Rigel' },
  { key: 'betelgeuse', de: 'Beteigeuze', en: 'Betelgeuse' },
  { key: 'polaris', de: 'Polarstern', en: 'Polaris' },
  { key: 'antares', de: 'Antares', en: 'Antares' },
  { key: 'arcturus', de: 'Arktur', en: 'Arcturus' },
  { key: 'proxima', de: 'Proxima', en: 'Proxima' },
  { key: 'andromeda', de: 'Andromeda', en: 'Andromeda' },
  { key: 'orion', de: 'Orion', en: 'Orion' },
  { key: 'lyra', de: 'Leier', en: 'Lyra' },
  { key: 'aquila', de: 'Adler', en: 'Aquila' },
];

const PLANET_MAP: Record<string, Planet> = Object.fromEntries(PLANETS.map(p => [p.key, p]));

/** Localized planet label. Falls back to the raw key if unknown. */
export function planetLabel(key: string, lang: 'de' | 'en'): string {
  const p = PLANET_MAP[key];
  if (!p) return key;
  return lang === 'de' ? p.de : p.en;
}

/** Bilingual label pair for a planet key — used to build WorkoutPlan.name. */
export function planetName(key: string): { de: string; en: string } {
  const p = PLANET_MAP[key];
  if (!p) return { de: key, en: key };
  return { de: p.de, en: p.en };
}
