import './index.css';

// ----------------------------------------------------
// Type Definitions
// ----------------------------------------------------
interface AssetMetadata {
  tags: string[];
  artist: string;
  rating: string; // "1" to "5"
  status: string; // e.g. "completed", "in-progress", "review", etc.
  title?: string;
  notes?: string;
}

interface Asset {
  id: string;
  name: string;
  board: string; // folder path, e.g. "/ Environment_Ref/Neo_Tokyo"
  resolution: string;
  size: string;
  colors: string[]; // 5 Hex color strings
  tags: string[]; // system categories
  metadata: AssetMetadata;
  imageUrl: string; // Data URL or object URL
  lastModified: string; // string timestamp
  vaultPath?: string; // Originating folder vault path
}

// ----------------------------------------------------
// Customizable Schema & Status Interfaces
// ----------------------------------------------------
interface PropertyConfig {
  label: string;
  placeholder?: string;
}

interface CustomSchemaConfig {
  statuses: { value: string; label: string }[];
  properties: {
    title: PropertyConfig;
    notes: PropertyConfig;
    artist: PropertyConfig;
    rating: PropertyConfig;
    status: PropertyConfig;
  };
}

const defaultSchemaConfig: CustomSchemaConfig = {
  statuses: [
    { value: 'completed', label: 'Completed Reference' },
    { value: 'in-progress', label: 'Work-in-Progress (WIP)' },
    { value: 'review', label: 'Awaiting Design Review' },
    { value: 'draft', label: 'Draft Sketch studies' }
  ],
  properties: {
    title: { label: 'Pin Name / Title', placeholder: 'E.g., Neo Tokyo Temple Alleyway Sunset...' },
    notes: { label: 'Pin notes / Description', placeholder: 'Add custom notes, design prompts, research observations...' },
    artist: { label: 'Artist / Creator', placeholder: 'Chen-K design team...' },
    rating: { label: 'Visual Vault Grade' },
    status: { label: 'Asset Status' }
  }
};


// ----------------------------------------------------
// Default Visual Assets Mock DB
// ----------------------------------------------------
const defaultColors = {
  neoTokyo: ['#0D1117', '#1A2B3C', '#FF5500', '#E1E4E8', '#0969DA'],
  cyberSkyline: ['#0A0915', '#1E1B4B', '#312E81', '#A21CAF', '#F0ABFC'],
  cyberProps: ['#1C1917', '#44403C', '#78716C', '#D6D3D1', '#F5F5F4'],
  foggyAlley: ['#0F172A', '#1E293B', '#334155', '#E2E8F0', '#F1F5F9'],
  interiorConcept: ['#0C0A09', '#292524', '#57534E', '#F59E0B', '#78350F'],
  lightingStudy: ['#020617', '#0F172A', '#EF4444', '#F59E0B', '#10B981'],
  cyberspace: ['#030712', '#111827', '#06B6D4', '#0891B2', '#0E7490'],
  neonRain: ['#090514', '#1D0B38', '#9D174D', '#DB2777', '#F472B6'],
  mechSkel: ['#111827', '#374151', '#F59E0B', '#EF4444', '#9CA3AF'],
  thruster: ['#0E1726', '#F97316', '#FACC15', '#1E293B', '#64748B'],
  samurai: ['#0F172A', '#DC2626', '#F1F5F9', '#1E293B', '#7F1D1D'],
  exosuit: ['#1E1F22', '#2B2D31', '#808080', '#4ADE80', '#14532D']
};

/**
 * Creates dynamic SVG vector elements with aesthetic grids, glows, wireframes 
 * conforming to active color palettes to represent world building visuals.
 */
function generateProceduralSVG(filename: string, colors: string[]): string {
  const c1 = colors[0] || '#0A0A0B';
  const c2 = colors[1] || '#1E1B4B';
  const c3 = colors[2] || '#312E81';
  const c4 = colors[3] || '#A21CAF';
  const c5 = colors[4] || '#F0ABFC';
  
  let pattern = '';
  if (filename.includes('temple') || filename.includes('alley')) {
    pattern = `
      <rect width="100%" height="100%" fill="url(#bg-grad)"/>
      <g opacity="0.15">
        <line x1="0" y1="20" x2="400" y2="20" stroke="white" stroke-width="0.5"/>
        <line x1="0" y1="50" x2="400" y2="50" stroke="white" stroke-width="0.5"/>
        <line x1="0" y1="100" x2="400" y2="100" stroke="white" stroke-width="0.5"/>
        <line x1="0" y1="200" x2="400" y2="200" stroke="white" stroke-width="0.5"/>
        <line x1="40" y1="0" x2="40" y2="300" stroke="white" stroke-width="0.5"/>
        <line x1="100" y1="0" x2="100" y2="300" stroke="white" stroke-width="0.5"/>
        <line x1="200" y1="0" x2="200" y2="300" stroke="white" stroke-width="0.5"/>
        <line x1="300" y1="0" x2="300" y2="300" stroke="white" stroke-width="0.5"/>
      </g>
      <circle cx="200" cy="110" r="45" fill="none" stroke="${c4}" stroke-width="2" filter="blur(1px)"/>
      <circle cx="200" cy="110" r="35" fill="none" stroke="${c5}" stroke-width="1.5"/>
      <path d="M 50,300 L 150,180 L 170,180 L 200,120 L 230,120 L 250,180 L 350,300 Z" fill="${c1}" stroke="${c3}" stroke-width="1.5" opacity="0.95" />
      <path d="M 0,300 L 120,220 L 130,220 L 160,180 L 190,180 L 280,300 Z" fill="${c2}" stroke="${c4}" stroke-width="1" opacity="0.6"/>
      <circle cx="200" cy="110" r="3" fill="${c5}"/>
    `;
  } else if (filename.includes('character') || filename.includes('exo') || filename.includes('samurai')) {
    pattern = `
      <rect width="100%" height="100%" fill="url(#bg-grad)"/>
      <g opacity="0.1">
        <circle cx="200" cy="150" r="140" fill="none" stroke="white" stroke-width="0.5"/>
        <circle cx="200" cy="150" r="100" fill="none" stroke="white" stroke-width="0.5"/>
        <line x1="0" y1="150" x2="400" y2="150" stroke="white" stroke-width="0.5"/>
        <line x1="200" y1="0" x2="200" y2="300" stroke="white" stroke-width="0.5"/>
      </g>
      <path d="M 200,60 L 250,105 L 235,185 L 200,230 L 165,185 L 150,105 Z" fill="${c1}" stroke="${c3}" stroke-width="2"/>
      <path d="M 200,85 L 240,115 L 230,175 L 200,210 L 170,175 L 160,115 Z" fill="${c2}" stroke="${c4}" stroke-width="1"/>
      <path d="M 175,120 L 225,120 L 220,132 L 180,132 Z" fill="${c5}" />
      <circle cx="200" cy="165" r="8" fill="none" stroke="${c4}" stroke-width="1.5"/>
      <circle cx="200" cy="165" r="4" fill="${c5}"/>
      <path d="M 150,105 L 120,90 M 250,105 L 280,90 M 200,230 L 200,270" stroke="${c4}" stroke-width="1.5" stroke-dasharray="2,2"/>
    `;
  } else if (filename.includes('mech') || filename.includes('diagram') || filename.includes('thruster')) {
    pattern = `
      <rect width="100%" height="100%" fill="url(#bg-grad)"/>
      <g stroke="${c3}" stroke-width="0.5" opacity="0.25">
        <pattern id="grid_ptn" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none"/>
        </pattern>
        <rect width="100%" height="100%" fill="url(#grid_ptn)" />
      </g>
      <circle cx="200" cy="150" r="90" fill="none" stroke="${c3}" stroke-dasharray="5,5" stroke-width="1"/>
      <circle cx="200" cy="150" r="10" fill="none" stroke="${c4}"/>
      <line x1="50" y1="150" x2="350" y2="150" stroke="${c4}" stroke-width="0.75" stroke-dasharray="10,5"/>
      <line x1="200" y1="30" x2="200" y2="270" stroke="${c4}" stroke-width="0.75" stroke-dasharray="10,5"/>
      <path d="M 120,100 L 150,100 L 190,140 L 280,140" fill="none" stroke="${c5}" stroke-width="2"/>
      <path d="M 130,200 L 160,200 L 210,150 L 270,150" fill="none" stroke="${c4}" stroke-width="1"/>
      <rect x="230" y="80" width="55" height="32" fill="none" stroke="${c4}" stroke-width="1" />
      <text x="235" y="93" fill="${c5}" font-family="monospace" font-size="6">SYS_ON</text>
      <text x="235" y="104" fill="${c3}" font-family="monospace" font-size="5">REV v2.04</text>
    `;
  } else {
    pattern = `
      <rect width="100%" height="100%" fill="url(#bg-grad)"/>
      <path d="M 0,150 Q 100,100 200,180 T 400,150 L 400,300 L 0,300 Z" fill="${c2}" stroke="${c3}" stroke-width="1.5" opacity="0.4"/>
      <path d="M 0,200 Q 120,250 250,180 T 400,240 L 400,300 L 0,300 Z" fill="${c1}" stroke="${c4}" stroke-width="1.5" opacity="0.8"/>
      <g transform="translate(200, 100) rotate(45)">
        <rect x="-15" y="-15" width="25" height="25" fill="${c1}" stroke="${c5}" stroke-width="1.5"/>
        <line x1="-15" y1="-15" x2="10" y2="10" stroke="${c4}" stroke-width="0.5"/>
      </g>
      <circle cx="80" cy="65" r="1.5" fill="${c5}"/>
      <circle cx="150" cy="45" r="1" fill="${c4}"/>
      <circle cx="280" cy="75" r="2" fill="${c5}"/>
    </g>
    `;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
    <defs>
      <linearGradient id="bg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${c2}"/>
        <stop offset="100%" stop-color="${c1}"/>
      </linearGradient>
    </defs>
    ${pattern}
  </svg>`;
  
  return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
}

(window as any).handleImageError = (img: HTMLImageElement, name: string, colorsCsv: string) => {
  img.onerror = null;
  const colors = colorsCsv ? colorsCsv.split(',') : [];
  img.src = generateProceduralSVG(name, colors);
};

// Prepare initial seeds
const defaultMockAssets = (): Asset[] => [
  {
    id: 'as_1',
    name: 'hero_temple_view.png',
    board: '/ Environment_Ref/Neo_Tokyo',
    resolution: '4096x2160',
    size: '2.4 MB',
    colors: defaultColors.neoTokyo,
    tags: ['Architecture', 'Cyberpunk', 'Night', 'Cinematic'],
    metadata: {
      tags: ['exterior', 'neon', 'z-axis'],
      artist: 'Chen-X',
      rating: '5',
      status: 'completed'
    },
    imageUrl: '',
    lastModified: '14 mins ago'
  },
  {
    id: 'as_2',
    name: 'city_skyline_01.png',
    board: '/ Environment_Ref/Neo_Tokyo',
    resolution: '3840x2160',
    size: '1.9 MB',
    colors: defaultColors.cyberSkyline,
    tags: ['Cityscape', 'Future', 'Atmospheric'],
    metadata: {
      tags: ['skyline', 'hologram', 'dense'],
      artist: 'Studio-K',
      rating: '4',
      status: 'in-progress'
    },
    imageUrl: '',
    lastModified: '2 hours ago'
  },
  {
    id: 'as_3',
    name: 'street_props_kit.png',
    board: '/ Environment_Ref/Neo_Tokyo',
    resolution: '2048x2048',
    size: '4.1 MB',
    colors: defaultColors.cyberProps,
    tags: ['Props', 'Industrial', 'Reference'],
    metadata: {
      tags: ['hardsurface', 'assets', 'unwrapped'],
      artist: 'Assets-Team',
      rating: '3',
      status: 'review'
    },
    imageUrl: '',
    lastModified: 'Yesterday'
  },
  {
    id: 'as_4',
    name: 'foggy_alley_ref.jpg',
    board: '/ Environment_Ref/Neo_Tokyo',
    resolution: '1920x1080',
    size: '850 KB',
    colors: defaultColors.foggyAlley,
    tags: ['Atmosphere', 'Lighting', 'Reference'],
    metadata: {
      tags: ['fog', 'alleyway', 'moody'],
      artist: 'Walker-01',
      rating: '5',
      status: 'completed'
    },
    imageUrl: '',
    lastModified: '3 days ago'
  },
  {
    id: 'as_5',
    name: 'interior_concept_B.png',
    board: '/ Environment_Ref/Neo_Tokyo',
    resolution: '3000x1800',
    size: '3.2 MB',
    colors: defaultColors.interiorConcept,
    tags: ['Interior', 'Cozy', 'Concept'],
    metadata: {
      tags: ['room', 'prop-heavy', 'warm'],
      artist: 'Chen-X',
      rating: '4',
      status: 'completed'
    },
    imageUrl: '',
    lastModified: '4 days ago'
  },
  {
    id: 'as_6',
    name: 'lighting_study.png',
    board: '/ Environment_Ref/Neo_Tokyo',
    resolution: '2560x1440',
    size: '1.4 MB',
    colors: defaultColors.lightingStudy,
    tags: ['Lighting', 'Study', 'Color-Script'],
    metadata: {
      tags: ['neon-glow', 'rain-wet', 'value-sketch'],
      artist: 'Studio-K',
      rating: '2',
      status: 'draft'
    },
    imageUrl: '',
    lastModified: '1 week ago'
  },
  {
    id: 'as_7',
    name: 'cyberspace_node.png',
    board: '/ Cyberpunk_City',
    resolution: '4096x2160',
    size: '1.2 MB',
    colors: defaultColors.cyberspace,
    tags: ['Cyber', 'UI', 'Abstract'],
    metadata: {
      tags: ['system', 'netrunner', 'grid'],
      artist: 'Matrix-Core',
      rating: '5',
      status: 'completed'
    },
    imageUrl: '',
    lastModified: '2 mins ago'
  },
  {
    id: 'as_8',
    name: 'neon_rain.jpg',
    board: '/ Cyberpunk_City',
    resolution: '1920x1200',
    size: '980 KB',
    colors: defaultColors.neonRain,
    tags: ['Atmosphere', 'Rain', 'Cinematic'],
    metadata: {
      tags: ['weather', 'reflections', 'streets'],
      artist: 'Walker-01',
      rating: '4',
      status: 'completed'
    },
    imageUrl: '',
    lastModified: '5 hours ago'
  },
  {
    id: 'as_9',
    name: 'mech_concept_v4.png',
    board: '/ Mech_Technical',
    resolution: '3500x2000',
    size: '5.2 MB',
    colors: defaultColors.mechSkel,
    tags: ['Mech', 'Hard-Surface', 'Industrial'],
    metadata: {
      tags: ['exoskeleton', 'military', 'gantry'],
      artist: 'Iron-Work',
      rating: '5',
      status: 'completed'
    },
    imageUrl: '',
    lastModified: 'Just now'
  },
  {
    id: 'as_10',
    name: 'thruster_diagram.png',
    board: '/ Mech_Technical',
    resolution: '2800x1600',
    size: '2.9 MB',
    colors: defaultColors.thruster,
    tags: ['Blueprint', 'Technical', 'Props'],
    metadata: {
      tags: ['propulsion', 'vector-wires', 'functional'],
      artist: 'Jet-Set',
      rating: '3',
      status: 'in-progress'
    },
    imageUrl: '',
    lastModified: '4 hours ago'
  },
  {
    id: 'as_11',
    name: 'cyber_samurai.jpg',
    board: '/ Character_Design',
    resolution: '2000x2500',
    size: '1.8 MB',
    colors: defaultColors.samurai,
    tags: ['Character', 'Cyberpunk', 'Armor'],
    metadata: {
      tags: ['helmet', 'cloth-tech', 'katana'],
      artist: 'Shinobi-Art',
      rating: '5',
      status: 'completed'
    },
    imageUrl: '',
    lastModified: '1 day ago'
  },
  {
    id: 'as_12',
    name: 'exo_suit_draft.png',
    board: '/ Character_Design',
    resolution: '2400x3200',
    size: '2.5 MB',
    colors: defaultColors.exosuit,
    tags: ['Character', 'Exosuit', 'Organic'],
    metadata: {
      tags: ['anatomy', 'bio-mechanical', 'underlay'],
      artist: 'Bio-Form',
      rating: '4',
      status: 'WIP'
    },
    imageUrl: '',
    lastModified: 'A week ago'
  }
].map(item => {
  item.imageUrl = generateProceduralSVG(item.name, item.colors);
  return item;
});

// ----------------------------------------------------
// Storage & Synchronization Manager (StorageService)
// ----------------------------------------------------
class StorageService {
  private key = 'visual_catalog_db_v2';
  private vaultPathKey = 'visual_catalog_vault_path_v2';
  public onAssetUpdated?: (asset: Asset) => void;

  constructor() {
    this.init();
  }

  private init() {
    if (!localStorage.getItem(this.vaultPathKey)) {
      localStorage.setItem(this.vaultPathKey, '/Users/design/Desktop/Ref_Library');
    }
    if (!localStorage.getItem(this.key)) {
      localStorage.setItem(this.key, JSON.stringify(defaultMockAssets()));
    }
    // Initialize the default vaults history if empty
    this.getVaults();
  }

  getVaultPath(): string {
    return localStorage.getItem(this.vaultPathKey) || '/Users/design/Desktop/Ref_Library';
  }

  setVaultPath(path: string) {
    localStorage.setItem(this.vaultPathKey, path);
  }

  getVaultKey(): string {
    const path = this.getVaultPath();
    return `visual_catalog_db_v3_${path.replace(/[^a-zA-Z0-9_]/g, '_')}`;
  }

  getVaults(): { name: string; path: string; lastOpened: number; mounted?: boolean }[] {
    try {
      const raw = localStorage.getItem('visual_vaults_list_v1');
      if (raw) {
        const parsed = JSON.parse(raw) as any[];
        const filtered = parsed.filter(v => {
          const p = v.path;
          return p !== '/Users/design/Desktop/Ref_Library' &&
                 p !== '/Users/design/Desktop/Neo_Tokyo' &&
                 p !== '/Users/projects/Cyberpunk_Grid' &&
                 p !== '/Users/blueprints/Mech_Grid';
        });
        if (filtered.length !== parsed.length) {
          localStorage.setItem('visual_vaults_list_v1', JSON.stringify(filtered));
        }
        return filtered;
      }
    } catch (e) {
      console.error('Failed to parse vaults list', e);
    }
    // No predefined mock vaults
    const defaults: { name: string; path: string; lastOpened: number; mounted?: boolean }[] = [];
    localStorage.setItem('visual_vaults_list_v1', JSON.stringify(defaults));
    return defaults;
  }

  saveVaults(vaults: { name: string; path: string; lastOpened: number; mounted?: boolean }[]) {
    localStorage.setItem('visual_vaults_list_v1', JSON.stringify(vaults));
  }

  getAllAssets(): Asset[] {
    try {
      const activeKey = this.getVaultKey();
      const data = localStorage.getItem(activeKey);
      let assets: Asset[] = [];

      if (data) {
        assets = JSON.parse(data);
      } else if (localStorage.getItem('visual_vaults_cleaned') === 'true') {
        assets = [];
      } else if (this.getVaultPath() === '/Users/design/Desktop/Ref_Library') {
        const oldData = localStorage.getItem(this.key);
        if (oldData) {
          localStorage.setItem(activeKey, oldData);
          assets = JSON.parse(oldData);
        }
      } else {
        // Populate companion archives automatically for high-fidelity demos
        const pathL = this.getVaultPath().toLowerCase();
        if (pathL.includes('neo_tokyo')) {
          const mock = defaultMockAssets().filter(a => a.board === '/ Environment_Ref/Neo_Tokyo');
          assets = mock.length ? mock : defaultMockAssets();
          localStorage.setItem(activeKey, JSON.stringify(assets));
        } else if (pathL.includes('cyberpunk') || pathL.includes('cybercity') || pathL.includes('cyber_grid')) {
          const mock = defaultMockAssets().filter(a => a.board === '/ UI_Elements/Cyberpunk_2077');
          assets = mock.length ? mock : defaultMockAssets();
          localStorage.setItem(activeKey, JSON.stringify(assets));
        } else if (pathL.includes('blueprint') || pathL.includes('mech_grid') || pathL.includes('mech')) {
          const mock = defaultMockAssets().filter(a => a.board.includes('Mech') || a.board.includes('Weapon'));
          assets = mock.length ? mock : defaultMockAssets();
          localStorage.setItem(activeKey, JSON.stringify(assets));
        } else {
          assets = [];
        }
      }

      const activePath = this.getVaultPath();
      return assets.map(a => ({ ...a, vaultPath: a.vaultPath || activePath }));
    } catch (e) {
      console.error('Failed to parse assets from storage', e);
    }
    return [];
  }

  saveAllAssets(assets: Asset[]) {
    try {
      // Partition assets back to their respective origin vaults
      const activePath = this.getVaultPath();
      const partitions: Record<string, Asset[]> = {};

      assets.forEach(a => {
        const p = a.vaultPath || activePath;
        if (!partitions[p]) {
          partitions[p] = [];
        }
        partitions[p].push(a);
      });

      // Save each partition to its respective localStorage key
      Object.keys(partitions).forEach(p => {
        try {
          const vk = `visual_catalog_db_v3_${p.replace(/[^a-zA-Z0-9_]/g, '_')}`;
          localStorage.setItem(vk, JSON.stringify(partitions[p]));
        } catch (storageErr) {
          console.warn(`[StorageService] LocalStorage quota exceeded while saving vault: ${p}`, storageErr);
        }
      });

      // Clear active key specifically if it's completely empty and not partition-active
      if (!partitions[activePath]) {
        try {
          localStorage.setItem(this.getVaultKey(), JSON.stringify([]));
        } catch (storageErr) {
          console.warn('[StorageService] LocalStorage quota exceeded while clearing active key', storageErr);
        }
      }
    } catch (err) {
      console.error('[StorageService] saveAllAssets failed:', err);
    }
  }

  wipeAllVaultCaches() {
    localStorage.setItem('visual_vaults_cleaned', 'true');
    this.saveAllAssets([]);
    localStorage.setItem(this.key, JSON.stringify([]));
    
    const mockPaths = [
      '/Users/design/Desktop/Ref_Library',
      '/Users/design/Desktop/Neo_Tokyo',
      '/Users/projects/Cyberpunk_Grid',
      '/Users/blueprints/Mech_Grid'
    ];
    for (const p of mockPaths) {
      const k = `visual_catalog_db_v3_${p.replace(/[^a-zA-Z0-9_]/g, '_')}`;
      localStorage.setItem(k, JSON.stringify([]));
    }

    localStorage.setItem('visual_vaults_list_v1', JSON.stringify([]));
  }

  updateAsset(id: string, updatedFields: Partial<Asset>) {
    const vaults = this.getVaults();
    const activePath = this.getVaultPath();
    let targetVaultPath = activePath;

    // Fast trace which vault hosts this asset reference
    for (const vault of vaults) {
      const vk = `visual_catalog_db_v3_${vault.path.replace(/[^a-zA-Z0-9_]/g, '_')}`;
      try {
        const raw = localStorage.getItem(vk);
        if (raw) {
          const parsed = JSON.parse(raw) as Asset[];
          if (parsed.some(a => a.id === id)) {
            targetVaultPath = vault.path;
            break;
          }
        }
      } catch (e) {
        console.error(e);
      }
    }

    const vk = `visual_catalog_db_v3_${targetVaultPath.replace(/[^a-zA-Z0-9_]/g, '_')}`;
    try {
      const raw = localStorage.getItem(vk);
      if (raw) {
        const assets = JSON.parse(raw) as Asset[];
        const idx = assets.findIndex(a => a.id === id);
        if (idx !== -1) {
          assets[idx] = { ...assets[idx], ...updatedFields };
          localStorage.setItem(vk, JSON.stringify(assets));
          if (this.onAssetUpdated) {
            this.onAssetUpdated(assets[idx]);
          }
          return assets[idx];
        }
      }
    } catch (e) {
      console.error(e);
    }
    return null;
  }

  addAsset(asset: Asset) {
    const activePath = this.getVaultPath();
    asset.vaultPath = asset.vaultPath || activePath;

    const assets = this.getAllAssets();
    assets.unshift(asset);
    this.saveAllAssets(assets);
    return assets;
  }

  deleteAsset(id: string) {
    const vaults = this.getVaults();
    
    // Purge item globally across matching registers
    for (const vault of vaults) {
      const vk = `visual_catalog_db_v3_${vault.path.replace(/[^a-zA-Z0-9_]/g, '_')}`;
      try {
        const raw = localStorage.getItem(vk);
        if (raw) {
          const assets = JSON.parse(raw) as Asset[];
          const filtered = assets.filter(a => a.id !== id);
          if (filtered.length !== assets.length) {
            localStorage.setItem(vk, JSON.stringify(filtered));
          }
        }
      } catch (e) {
        console.error(e);
      }
    }

    // Also fallback purge from the active local cache
    const activeKey = this.getVaultKey();
    try {
      const raw = localStorage.getItem(activeKey);
      if (raw) {
        const assets = JSON.parse(raw) as Asset[];
        const filtered = assets.filter(a => a.id !== id);
        if (filtered.length !== assets.length) {
          localStorage.setItem(activeKey, JSON.stringify(filtered));
        }
      }
    } catch (e) {}

    return this.getAllAssets();
  }
}

// ----------------------------------------------------
// Custom Taxonomy Definitions & Helpers
// ----------------------------------------------------
let TAXONOMY_PRESETS = {
  medium: ['illustration', 'photo', 'poster', 'signage', 'packaging', 'ad', 'film still'],
  eraStyle: ['Bauhaus', 'Swiss/International', '90s grunge', 'contemporary', 'Minimalist', 'Vaporwave', 'Cyberpunk', 'Retro-Futurism'],
  source: ['Pinterest', 'Are.na', 'Behance', 'Dribbble', 'Instagram', 'Tumblr', 'Web']
};

function loadTaxonomyFromStorage() {
  try {
    const saved = localStorage.getItem('visual_taxonomy_presets_v1');
    if (saved) {
      TAXONOMY_PRESETS = JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load taxonomy presets', e);
  }
}

function saveTaxonomyToStorage() {
  try {
    localStorage.setItem('visual_taxonomy_presets_v1', JSON.stringify(TAXONOMY_PRESETS));
  } catch (e) {
    console.error('Failed to save taxonomy presets', e);
  }
}

// Initialize dynamic taxonomy
loadTaxonomyFromStorage();

function classifyTag(tag: string): 'medium' | 'eraStyle' | 'source' | 'custom' {
  const t = tag.toLowerCase().trim();
  if (TAXONOMY_PRESETS.medium.map(v => v.toLowerCase()).includes(t)) return 'medium';
  if (TAXONOMY_PRESETS.eraStyle.map(v => v.toLowerCase()).includes(t)) return 'eraStyle';
  if (TAXONOMY_PRESETS.source.map(v => v.toLowerCase()).includes(t)) return 'source';
  return 'custom';
}

function renderPresetsHtml(tags: string[], isLightbox: boolean): string {
  const activeTags = tags.map(t => t.toLowerCase().trim());
  const classPrefix = isLightbox ? 'lb-' : '';
  
  const renderGroup = (label: string, items: string[], colorClass: string, activeColorClass: string) => {
    const buttons = items.map(item => {
      const isActive = activeTags.includes(item.toLowerCase().trim());
      const btnClass = isActive 
        ? `${activeColorClass} border-current font-semibold` 
        : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border-transparent';
      return `
        <button class="${classPrefix}preset-tag-btn px-2 py-0.5 rounded-[4px] text-[9.5px] border font-mono transition duration-200 cursor-pointer select-none ${btnClass}" data-tag="${item}">
          ${isActive ? '✓ ' : ''}${item}
        </button>
      `;
    }).join('');
    
    return `
      <div class="space-y-1 text-left">
        <span class="text-[9px] font-bold uppercase tracking-wider block ${colorClass}">${label}</span>
        <div class="flex flex-wrap gap-1">${buttons}</div>
      </div>
    `;
  };

  return `
    <div class="mt-3.5 bg-black/40 border border-white/5 rounded p-3.5 space-y-3.5">
      <div class="text-[9.5px] uppercase font-mono tracking-wider text-slate-400 font-extrabold flex justify-between select-none">
        <span>Taxonomy Quick-Pick</span>
        <span class="text-emerald-400 text-[9px] font-normal font-sans">Toggle tags</span>
      </div>
      <div class="space-y-3">
        ${renderGroup('🖼️ Medium', TAXONOMY_PRESETS.medium, 'text-blue-400', 'bg-blue-500/20 text-blue-300 border-blue-500/40')}
        ${renderGroup('🎨 Era or Style Movement', TAXONOMY_PRESETS.eraStyle, 'text-purple-400', 'bg-purple-500/20 text-purple-300 border-purple-500/40')}
        ${renderGroup('🌐 Source (Attribution)', TAXONOMY_PRESETS.source, 'text-amber-400', 'bg-amber-500/20 text-amber-300 border-amber-500/40')}
      </div>
    </div>
  `;
}

const storage = new StorageService();

// ----------------------------------------------------
// Markdown Formatter Utility (.md Obsidian)
// ----------------------------------------------------
function stringifyYAMLFrontmatter(metadata: AssetMetadata): string {
  const lines = [
    '---',
    `title: ${metadata.title || ''}`,
    `tags: [${metadata.tags.join(', ')}]`,
    `artist: ${metadata.artist || 'Unknown'}`,
    `rating: ${metadata.rating || '5'}`,
    `status: ${metadata.status || 'review'}`,
    `notes: ${metadata.notes || ''}`,
    '---'
  ];
  return lines.join('\n');
}

function parseYAMLFrontmatter(yaml: string, originalMeta: AssetMetadata): AssetMetadata {
  const meta: AssetMetadata = { ...originalMeta };
  try {
    const cleanYaml = yaml.replace(/^---/, '').replace(/---$/, '').trim();
    const rows = cleanYaml.split('\n');
    for (const row of rows) {
      const colIdx = row.indexOf(':');
      if (colIdx === -1) continue;
      const key = row.substring(0, colIdx).trim().toLowerCase();
      const val = row.substring(colIdx + 1).trim();

      if (key === 'tags') {
        const bracketMatch = val.match(/\[(.*)\]/);
        if (bracketMatch) {
          meta.tags = bracketMatch[1].split(',').map(s => s.trim()).filter(Boolean);
        } else {
          meta.tags = val.split(',').map(s => s.trim()).filter(Boolean);
        }
      } else if (key === 'artist') {
        meta.artist = val;
      } else if (key === 'rating') {
        meta.rating = val;
      } else if (key === 'status') {
         meta.status = val;
      } else if (key === 'title') {
         meta.title = val;
      } else if (key === 'notes') {
         meta.notes = val;
      }
    }
  } catch (err) {
    console.error('YAML frontmatter parsing failed. Using original', err);
  }
  return meta;
}

// ----------------------------------------------------
// Fast Canvas Color Palette Extractor
// ----------------------------------------------------
function extractColorsFromImage(imgUrl: string): Promise<string[]> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 16;
        canvas.height = 16;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(['#0F172A', '#334155', '#475569', '#64748B', '#94A3B8']);
          return;
        }
        ctx.drawImage(img, 0, 0, 16, 16);
        const data = ctx.getImageData(0, 0, 16, 16).data;
        
        // Sampling locations across the grid to extract distinct primary shades
        const pixelIndices = [10, 45, 120, 180, 240];
        const colors: string[] = [];
        
        for (const idx of pixelIndices) {
          const offset = idx * 4;
          const r = data[offset];
          const g = data[offset + 1];
          const b = data[offset + 2];
          
          const hex = '#' + [r, g, b].map(v => {
            const h = v.toString(16);
            return h.length === 1 ? '0' + h : h;
          }).join('');
          
          colors.push(hex.toUpperCase());
        }
        resolve(colors);
      } catch (e) {
        console.error('Color extraction failed, using defaults.', e);
        resolve(['#10B981', '#3B82F6', '#EF4444', '#F59E0B', '#8B5CF6']);
      }
    };
    img.onerror = () => {
      resolve(['#1E293B', '#334155', '#475569', '#64748B', '#B45309']);
    };
    img.src = imgUrl;
  });
}

// ----------------------------------------------------
// Color Palette Similarity Calculus Engine
// ----------------------------------------------------
function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const cleanHex = hex.replace(/^\s*#|\s*$/g, '');
  let expandedHex = cleanHex;
  if (cleanHex.length === 3) {
    expandedHex = cleanHex.replace(/(.)/g, '$1$1');
  }
  const r = parseInt(expandedHex.substring(0, 2), 16) / 255;
  const g = parseInt(expandedHex.substring(2, 4), 16) / 255;
  const b = parseInt(expandedHex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return {
    h: h * 360,
    s: s * 100,
    l: l * 100
  };
}

function getAverageHsl(colors: string[]): { h: number; s: number; l: number } {
  if (!colors || colors.length === 0) {
    return { h: 0, s: 0, l: 0 };
  }
  let sumSin = 0;
  let sumCos = 0;
  let sumS = 0;
  let sumL = 0;
  let count = 0;

  for (const hex of colors) {
    const hsl = hexToHsl(hex);
    const rad = (hsl.h * Math.PI) / 180;
    sumSin += Math.sin(rad);
    sumCos += Math.cos(rad);
    sumS += hsl.s;
    sumL += hsl.l;
    count++;
  }

  let avgH = Math.atan2(sumSin / count, sumCos / count) * (180 / Math.PI);
  if (avgH < 0) {
    avgH += 360;
  }

  return {
    h: avgH,
    s: sumS / count,
    l: sumL / count
  };
}

function getHueDistance(h1: number, h2: number): number {
  const diff = Math.abs(h1 - h2) % 360;
  return diff > 180 ? 360 - diff : diff;
}

// ----------------------------------------------------
// VisualVault Web Component Definition
// ----------------------------------------------------
class VaultApp extends HTMLElement {
  // Global React-like states managed transparently for high 100vh app integrity
  private assets: Asset[] = [];
  private selectedBoard = 'ALL';
  private selectedAssetId = 'as_1';
  private searchQuery = '';
  private colorPaletteSearchQuery: string[] | null = null;
  private colorPaletteTolerance = 45; // in degrees (0 - 180)
  private gridSize: 'sm' | 'md' | 'lg' = 'md';
  private activeLogs: { time: string; type: string; msg: string }[] = [];
  private cpuUsage = 1.2;
  private isLightboxOpen = false;
  private activeTheme: 'default' | 'minimalist' | 'matrix' = 'default';
  private activeAccent = 'brand';
  private customAccentHex = '';
  private activeFont = 'funnel-display';
  private isSettingsOpen = false;
  private activeSettingsTab: 'vault' | 'general' | 'taxonomy' = 'vault';
  private workspaceMode: 'unified' | 'focused' = 'unified';
  private isCreatingSection = false;
  private isSidebarClosed = localStorage.getItem('visual_vault_sidebar_closed') === 'true';

  // Modern browser File System Access API (Sandbox Directory Sync) properties
  private isSandboxedDirectory = false;
  private directoryHandle: FileSystemDirectoryHandle | null = null;
  private fileHandles: Map<string, FileSystemHandle> = new Map();
  private mdFileHandles: Map<string, FileSystemHandle> = new Map();
  private schemaConfig: CustomSchemaConfig;
  private needsDirectoryPermission = false;
  private needsFallbackRelink = false;
  private pendingPermissionVaultPath = '';
  private pendingPermissionVaultName = '';

  // Background image metadata and color extraction throttled queue
  private extractionQueue: { id: string; file: File; imageUrl: string; listContext?: Asset[] }[] = [];
  private activeExtractions = 0;
  private readonly maxConcurrentExtractions = 3;

  constructor() {
    super();
    
    // Load or initialize general schema settings
    const savedSchema = localStorage.getItem('visual_vault_schema_config_v1');
    if (savedSchema) {
      try {
        this.schemaConfig = JSON.parse(savedSchema);
      } catch (e) {
        this.schemaConfig = { ...defaultSchemaConfig };
      }
    } else {
      this.schemaConfig = { ...defaultSchemaConfig };
    }

    
    // Seed initial boards if they do not exist to support editing and custom renaming of default folders
    if (!localStorage.getItem('visual_vault_created_boards_list')) {
      const defaultBoards = [
        '/ Environment_Ref/Neo_Tokyo',
         '/ Cyberpunk_City',
         '/ Mech_Technical',
         '/ Character_Design'
      ];
      localStorage.setItem('visual_vault_created_boards_list', JSON.stringify(defaultBoards));
    }

    this.workspaceMode = (localStorage.getItem('visual_vault_workspace_mode') as 'unified' | 'focused') || 'unified';
    this.loadAssets();
    
    // Wire up storage updates tracking observer interface to sync metadata files to disk
    storage.onAssetUpdated = (asset: Asset) => {
      this.saveCompanionMDFile(asset);
    };

    this.activeTheme = (localStorage.getItem('visual_vault_active_theme') as 'default' | 'minimalist' | 'matrix') || 'default';
    this.activeAccent = localStorage.getItem('visual_vault_accent_color') || 'brand';
    this.customAccentHex = localStorage.getItem('visual_vault_custom_accent_hex') || '';
    this.activeFont = localStorage.getItem('visual_vault_system_font') || 'funnel-display';
    this.addLog('info', 'Indexed local cache successfully.');
    this.addLog('info', `Simulating database: sqlite_sync connected.`);
    this.addLog('info', `UI Theme: ${this.activeTheme.toUpperCase()} style configuration initialized.`);
    
    // Performance flutters
    setInterval(() => {
      this.cpuUsage = +(Math.random() * 2.1 + 0.6).toFixed(1);
      const cpuValSpan = this.querySelector('#cpu-val-text');
      const cpuBarNode = this.querySelector('#cpu-bar-fill') as HTMLElement;
      if (cpuValSpan) cpuValSpan.textContent = `${this.cpuUsage}%`;
      if (cpuBarNode) cpuBarNode.style.width = `${Math.min(100, this.cpuUsage * 10)}%`;
    }, 3000);
  }

  connectedCallback() {
    this.injectThemeStyles();
    this.renderShell();
    this.attachEventListeners();
    this.updateLayout();
    
    // Setup Spacebar Hotkey Listener
    window.addEventListener('keydown', this.handleGlobalKeys);

    // Check and restore browser sandbox folder connections on startup/reload
    this.checkAndRestoreLocalVaults();
  }

  disconnectedCallback() {
    window.removeEventListener('keydown', this.handleGlobalKeys);
  }

  private injectThemeStyles() {
    // Manage Matrix CRT Scanline overlay in DOM dynamically
    let matrixOverlay = this.querySelector('.matrix-overlay');
    if (this.activeTheme === 'matrix') {
      if (!matrixOverlay) {
        matrixOverlay = document.createElement('div');
        matrixOverlay.className = 'matrix-overlay';
        this.insertBefore(matrixOverlay, this.firstChild);
      }
    } else {
      if (matrixOverlay) {
        matrixOverlay.remove();
      }
    }

    let styleElement = document.getElementById('dynamic-theme-styles') as HTMLStyleElement | null;
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = 'dynamic-theme-styles';
      document.head.appendChild(styleElement);
    }

    const parseHexToRgba = (hexStr: string, alpha: number): string => {
      let c = hexStr.replace('#', '').trim();
      if (c.length === 3) {
        c = c[0] + c[0] + c[1] + c[1] + c[2] + c[2];
      }
      const r = parseInt(c.substring(0, 2), 16) || 0;
      const g = parseInt(c.substring(2, 4), 16) || 0;
      const b = parseInt(c.substring(4, 6), 16) || 0;
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    const darkenHexColor = (hexStr: string, percent: number): string => {
      let c = hexStr.replace('#', '').trim();
      if (c.length === 3) {
        c = c[0] + c[0] + c[1] + c[1] + c[2] + c[2];
      }
      let r = parseInt(c.substring(0, 2), 16) || 0;
      let g = parseInt(c.substring(2, 4), 16) || 0;
      let b = parseInt(c.substring(4, 6), 16) || 0;

      r = Math.max(0, Math.min(255, Math.floor(r * (1 - percent))));
      g = Math.max(0, Math.min(255, Math.floor(g * (1 - percent))));
      b = Math.max(0, Math.min(255, Math.floor(b * (1 - percent))));

      const toHex = (n: number) => {
        const s = n.toString(16);
        return s.length === 1 ? '0' + s : s;
      };
      return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    };

    // Determine active accent colour hex
    let accentHex = '#6B5AFF'; // Brand default
    if (this.activeAccent === 'purple') accentHex = '#7F6DF2';
    else if (this.activeAccent === 'red') accentHex = '#EF4444';
    else if (this.activeAccent === 'orange') accentHex = '#F97316';
    else if (this.activeAccent === 'amber') accentHex = '#F59E0B';
    else if (this.activeAccent === 'blue') accentHex = '#2383E2';
    else if (this.activeAccent === 'indigo') accentHex = '#6366F1';
    else if (this.activeAccent === 'pink') accentHex = '#EC4899';
    else if (this.activeAccent === 'emerald') accentHex = '#10B981';
    else if (this.activeAccent === 'brand') accentHex = '#6B5AFF';
    else if (this.activeAccent === 'custom' && this.customAccentHex) {
      accentHex = this.customAccentHex;
    }

    const accentHoverHex = darkenHexColor(accentHex, 0.15);
    const accentBg05 = parseHexToRgba(accentHex, 0.05);
    const accentBg10 = parseHexToRgba(accentHex, 0.10);
    const accentBg15 = parseHexToRgba(accentHex, 0.15);
    const accentBg20 = parseHexToRgba(accentHex, 0.20);
    const accentBg25 = parseHexToRgba(accentHex, 0.25);
    const accentBg30 = parseHexToRgba(accentHex, 0.30);
    const accentBg35 = parseHexToRgba(accentHex, 0.35);
    const accentBg40 = parseHexToRgba(accentHex, 0.40);
    const accentBg50 = parseHexToRgba(accentHex, 0.50);
    const accentBg60 = parseHexToRgba(accentHex, 0.60);

    // Determine active font family
    let fontFamilyStyle = '"Funnel Display", sans-serif';
    if (this.activeFont === 'inter') {
      fontFamilyStyle = '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    } else if (this.activeFont === 'space-grotesk') {
      fontFamilyStyle = '"Space Grotesk", sans-serif';
    } else if (this.activeFont === 'outfit') {
      fontFamilyStyle = '"Outfit", sans-serif';
    } else if (this.activeFont === 'playfair') {
      fontFamilyStyle = '"Playfair Display", Georgia, serif';
    } else if (this.activeFont === 'jetbrains') {
      fontFamilyStyle = '"JetBrains Mono", monospace';
    } else if (this.activeFont === 'system') {
      fontFamilyStyle = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
    } else if (this.activeFont === 'georgia') {
      fontFamilyStyle = 'Georgia, "Times New Roman", serif';
    } else if (this.activeFont === 'courier') {
      fontFamilyStyle = '"Courier New", Courier, monospace';
    } else if (this.activeFont === 'space-mono') {
      fontFamilyStyle = '"Space Mono", monospace';
    } else if (this.activeFont === 'lexend') {
      fontFamilyStyle = '"Lexend", sans-serif';
    } else if (this.activeFont === 'tektur') {
      fontFamilyStyle = '"Tektur", sans-serif';
    } else if (this.activeFont === 'ibm-plex-mono') {
      fontFamilyStyle = '"IBM Plex Mono", monospace';
    } else if (this.activeFont === 'funnel-display') {
      fontFamilyStyle = '"Funnel Display", sans-serif';
    }

    const universalVariables = `
      :root, .vault-app-root {
        --accent-primary: ${accentHex} !important;
        --accent-hover: ${accentHoverHex} !important;
        --accent-bg-05: ${accentBg05} !important;
        --accent-bg-10: ${accentBg10} !important;
        --accent-bg-15: ${accentBg15} !important;
        --accent-bg-20: ${accentBg20} !important;
        --accent-bg-25: ${accentBg25} !important;
        --accent-bg-30: ${accentBg30} !important;
        --accent-bg-35: ${accentBg35} !important;
        --accent-bg-40: ${accentBg40} !important;
        --accent-bg-50: ${accentBg50} !important;
        --accent-bg-60: ${accentBg60} !important;
        --accent-secondary: #6B5AFF !important;
        --accent-secondary-hover: #5A49EE !important;
        --accent-secondary-bg-10: rgba(107, 90, 255, 0.10) !important;
        --accent-secondary-bg-20: rgba(107, 90, 255, 0.20) !important;
        --accent-secondary-bg-05: rgba(107, 90, 255, 0.05) !important;
        --app-font-family: ${fontFamilyStyle} !important;
      }

      vault-app {
        display: flex !important;
        flex-direction: column !important;
        height: 100vh !important;
        width: 100vw !important;
        overflow: hidden !important;
      }

      body, .vault-app-root, .vault-app-root * {
        font-family: var(--app-font-family) !important;
      }

      /* Transition-sidebar and collapsible classes */
      aside.transition-sidebar {
        transition: width 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease, min-width 0.35s cubic-bezier(0.16, 1, 0.3, 1), border-right-width 0.3s ease !important;
      }
      
      aside.sidebar-collapsed {
        width: 0px !important;
        min-width: 0px !important;
        opacity: 0 !important;
        border-right-width: 0px !important;
        padding-left: 0px !important;
        padding-right: 0px !important;
        pointer-events: none !important;
      }

      /* Style changes on the selected element sidebar-lists */
      #sidebar-lists {
        transition: opacity 0.25s ease, transform 0.35s cubic-bezier(0.16, 1, 0.3, 1) !important;
      }
      
      .sidebar-collapsed #sidebar-lists {
        opacity: 0 !important;
        transform: translateX(-15px) !important;
        pointer-events: none !important;
      }

      /* Elements requiring strict monospace look */
      .mono, .font-mono, #sqlite-activity-logs *, #sqlite-activity-logs-modal *, #cpu-val-text, #cpu-bar-fill, .custom-scrollbar, #vault-path-input, .lb-star-rating-item, kbd, code, pre {
        font-family: "JetBrains Mono", monospace !important;
      }

      /* Dynamic Emerald Tailwind class mappings to custom Accent Colour selection */
      .text-emerald-400, .vault-accent-text, #cpu-val-text {
        color: var(--accent-primary) !important;
      }
      .text-emerald-500 {
        color: var(--accent-primary) !important;
      }
      .text-emerald-500\\/80 {
        color: var(--accent-primary) !important;
        opacity: 0.8 !important;
      }
      .bg-emerald-500, #import-trigger-btn, #empty-state-pick-btn, #modal-board-submit, #load-vault-all {
        background-color: var(--accent-primary) !important;
        color: #000000 !important;
      }
      .bg-emerald-500:hover, #import-trigger-btn:hover, #empty-state-pick-btn:hover, #modal-board-submit:hover, #load-vault-all:hover {
        background-color: var(--accent-hover) !important;
        color: #000000 !important;
      }
      .bg-emerald-400 {
        background-color: var(--accent-primary) !important;
      }
      .hover\\:bg-emerald-400:hover {
        background-color: var(--accent-hover) !important;
      }
      .bg-emerald-500\\/5 {
        background-color: var(--accent-bg-05) !important;
      }
      .bg-emerald-500\\/10 {
        background-color: var(--accent-bg-10) !important;
      }
      .bg-emerald-500\\/15 {
        background-color: var(--accent-bg-15) !important;
      }
      .bg-emerald-500\\/20 {
        background-color: var(--accent-bg-20) !important;
      }
      .bg-emerald-500\\/25 {
        background-color: var(--accent-bg-25) !important;
      }
      .bg-emerald-500\\/30 {
        background-color: var(--accent-bg-30) !important;
      }
      .bg-emerald-500\\/35 {
        background-color: var(--accent-bg-35) !important;
      }
      .bg-emerald-500\\/40 {
        background-color: var(--accent-bg-40) !important;
      }
      .bg-emerald-500\\/50 {
        background-color: var(--accent-bg-50) !important;
      }
      .bg-emerald-500\\/60 {
        background-color: var(--accent-bg-60) !important;
      }

      .hover\\:bg-emerald-500\\/10:hover {
        background-color: var(--accent-bg-10) !important;
      }
      .hover\\:bg-emerald-500\\/15:hover {
        background-color: var(--accent-bg-15) !important;
      }
      .hover\\:bg-emerald-500\\/20:hover {
        background-color: var(--accent-bg-20) !important;
      }
      .hover\\:bg-emerald-500\\/35:hover {
        background-color: var(--accent-bg-35) !important;
      }

      .border-emerald-500 {
        border-color: var(--accent-primary) !important;
      }
      .border-emerald-500\\/10 {
        border-color: var(--accent-bg-10) !important;
      }
      .border-emerald-500\\/15 {
        border-color: var(--accent-bg-15) !important;
      }
      .border-emerald-500\\/20, .hover\\:border-emerald-500\\/20:hover {
        border-color: var(--accent-bg-20) !important;
      }
      .border-emerald-500\\/25 {
        border-color: var(--accent-bg-25) !important;
      }
      .border-emerald-500\\/30, .hover\\:border-emerald-500\\/30:hover {
        border-color: var(--accent-bg-30) !important;
      }
      .border-emerald-500\\/35 {
        border-color: var(--accent-bg-35) !important;
      }
      .border-emerald-500\\/40 {
        border-color: var(--accent-bg-40) !important;
      }
      .border-emerald-500\\/50 {
        border-color: var(--accent-bg-50) !important;
      }
      .border-emerald-500\\/60 {
        border-color: var(--accent-bg-60) !important;
      }

      .ring-emerald-500, .ring-2.ring-emerald-500 {
        border-color: var(--accent-primary) !important;
        --tw-ring-color: var(--accent-primary) !important;
      }

      /* Secondary accent styles for links and buttons using #6B5AFF */
      .vault-secondary-btn,
      button.bg-white\\/5,
      #schema-export-btn,
      #settings-close-action,
      #action-obsidian,
      #lb-action-obsidian,
      .font-select-btn,
      #inline-section-cancel,
      #toggle-sidebar-btn,
      #action-move-up,
      #action-move-down {
        transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
      }

      .vault-secondary-btn:hover,
      button.bg-white\\/5:hover,
      #schema-export-btn:hover,
      #settings-close-action:hover,
      #action-obsidian:hover,
      #lb-action-obsidian:hover,
      .font-select-btn:hover,
      #inline-section-cancel:hover,
      #toggle-sidebar-btn:hover,
      #action-move-up:hover,
      #action-move-down:hover {
        color: var(--accent-secondary) !important;
        border-color: var(--accent-secondary-bg-20) !important;
        background-color: var(--accent-secondary-bg-10) !important;
      }

      /* Hover states for secondary clickable links, folder names, directory links */
      .group:hover .group-hover\\:text-emerald-400,
      .hover\\:text-emerald-400:hover,
      .hover\\:text-emerald-300:hover,
      .hover\\:text-emerald-500:hover,
      #add-tag-btn:hover,
      #lb-add-tag-btn:hover,
      a:hover,
      .vault-link:hover {
        color: var(--accent-secondary) !important;
      }
    `;

    if (this.activeTheme === 'minimalist') {
      styleElement.innerHTML = `
        ${universalVariables}

        /* Notion-inspired Off-white Theme */
        body {
          background-color: #FFFFFF !important;
          color: #37352F !important;
        }
        .vault-app-root {
          background-color: #FFFFFF !important;
          color: #37352F !important;
        }
        .vault-header-bg {
          background-color: #FFFFFF !important;
          border-bottom: 1px solid #E9E9E6 !important;
        }
        .vault-sidebar-bg {
          background-color: #F7F7F5 !important;
          border-right: 1px solid #E9E9E6 !important;
        }
        #sidebar-lists > div:nth-of-type(2) {
          background-color: #fcfcfc !important;
        }
        #inspector-sidebar {
          background-color: #F7F7F5 !important;
          border-left: 1px solid #E9E9E6 !important;
        }
        .vault-main-content {
          background-color: #FFFFFF !important;
        }
        .vault-card {
          background-color: #FFFFFF !important;
          border: 1px solid #E9E9E6 !important;
          color: #37352F !important;
          border-radius: 6px !important;
          box-shadow: rgba(15, 15, 15, 0.05) 0px 1px 2px, rgba(15, 15, 15, 0.05) 0px 0px 0px 1px !important;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }
        .vault-card:hover {
          background-color: #FBFBFB !important;
          border-color: var(--accent-primary) !important;
          transform: translateY(-2px) !important;
          box-shadow: rgba(15, 15, 15, 0.05) 0px 1px 2px, rgba(15, 15, 15, 0.03) 0px 4px 12px, rgba(15, 15, 15, 0.05) 0px 0px 0px 1px !important;
        }
        .vault-badge {
          background-color: var(--accent-bg-10) !important;
          color: var(--accent-primary) !important;
          font-family: inherit !important;
          border-radius: 3px !important;
          border: 1px solid var(--accent-bg-20) !important;
          font-size: 11px !important;
          font-weight: 500 !important;
        }
        .vault-accent-text {
          color: var(--accent-primary) !important;
        }
        .vault-accent-bg {
          background-color: var(--accent-primary) !important;
          color: #FFFFFF !important;
          border-radius: 5px !important;
          border: none !important;
        }
        .vault-btn {
          border-radius: 5px !important;
          font-family: inherit !important;
          font-weight: 500 !important;
          border: 1px solid #D3D2CE !important;
          background-color: #FFFFFF !important;
          color: #37352F !important;
          font-size: 13px !important;
          box-shadow: rgba(15, 15, 15, 0.04) 0px 1.5px 2px !important;
          transition: background 0.1s ease, border-color 0.1s ease !important;
        }
        .vault-btn:hover {
          background-color: #F1F1EF !important;
          border-color: #C1C0BC !important;
          color: #37352F !important;
        }
        .vault-border {
          border-color: #EDEDEB !important;
        }
        .vault-text-muted {
          color: #787774 !important;
        }
        .vault-tag {
          background-color: rgba(55, 53, 47, 0.05) !important;
          border: 1px solid rgba(55, 53, 47, 0.09) !important;
          color: #37352F !important;
          border-radius: 3px !important;
          font-weight: 500 !important;
          font-size: 11px !important;
        }
        .vault-input {
          background-color: #FFFFFF !important;
          border: 1px solid #E9E9E6 !important;
          color: #37352F !important;
          border-radius: 5px !important;
          box-shadow: rgba(15, 15, 15, 0.02) 0px 1px 2px inset !important;
          transition: border-color 0.1s ease, box-shadow 0.1s ease !important;
        }
        .vault-input:focus {
          border-color: var(--accent-primary) !important;
          box-shadow: rgba(35, 131, 226, 0.15) 0px 0px 0px 3px, rgba(15, 15, 15, 0.02) 0px 1px 2px inset !important;
          outline: none !important;
        }
        .vault-footer {
          background-color: #F7F7F5 !important;
          border-top: 1px solid #E9E9E6 !important;
          color: #787774 !important;
        }
        .vault-rounded {
          border-radius: 5px !important;
        }
        /* Custom scrollbar override for Notion Off-white design */
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #E1E1DE !important;
          border-radius: 4px !important;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #C1C0BC !important;
        }
        /* Overrides custom headers/labels to look like Notion */
        h1, h2, h3, h4, span, div, p, label, button, select, input, textarea {
          border-radius: 4px !important;
        }
        .text-emerald-400 {
          color: var(--accent-primary) !important;
        }
        .text-emerald-500 {
          color: var(--accent-primary) !important;
        }
        .bg-emerald-500\\/10 {
          background-color: var(--accent-bg-10) !important;
        }
        .bg-emerald-500\\/5 {
          background-color: var(--accent-bg-05) !important;
        }
        .border-emerald-500\\/20 {
          border-color: var(--accent-bg-20) !important;
        }
        .border-emerald-500 {
          border-color: var(--accent-primary) !important;
        }
        /* Fix text elements colors */
        .text-slate-400 {
          color: #787774 !important;
        }
        .text-slate-500 {
          color: #9A9996 !important;
        }
        .text-slate-200, .text-white {
          color: #37352F !important;
        }
        .text-slate-300 {
          color: #4F4E4A !important;
        }
        .text-slate-600 {
          color: #9A9996 !important;
        }
        .bg-slate-900\\/60, .bg-\\[\\#0F0F11\\], .bg-\\[\\#121215\\], .bg-black\\/30, .bg-black\\/40 {
          background-color: #F7F7F5 !important;
          border-color: #E9E9E6 !important;
        }
        /* Side navigation folder item and active list states */
        .bg-white\\/5 {
          background-color: rgba(55, 53, 47, 0.05) !important;
        }
        .hover\\:bg-white\\/5:hover {
          background-color: rgba(55, 53, 47, 0.04) !important;
        }
        .hover\\:text-white:hover {
          color: #1A1A1A !important;
        }
        .text-slate-300 {
          color: #37352F !important;
        }
        .text-slate-100 {
          color: #1A1A1A !important;
        }
        /* Search inputs and special elements top row */
        #vault-path-input {
          color: #37352F !important;
          font-family: inherit !important;
        }
        #vault-path-input:focus {
          border-bottom: 2px solid var(--accent-primary) !important;
          color: var(--accent-primary) !important;
        }
        #asset-search {
          color: #37352F !important;
        }
        #asset-search::placeholder {
          color: #9A9996 !important;
        }
        #action-reset {
          background-color: transparent !important;
          border-radius: 4px !important;
        }
        /* Dialog overrides */
        #settings-backdrop, #lightbox-backdrop, #board-create-backdrop, #vault-manager-backdrop {
          background-color: rgba(15, 15, 15, 0.3) !important;
          backdrop-filter: blur(4px) !important;
        }
        /* Modal Containers */
        #settings-backdrop > div, #board-create-backdrop > div, #vault-manager-backdrop > div {
          background-color: #FFFFFF !important;
          border: 1px solid #D3D2CE !important;
          border-radius: 8px !important;
          box-shadow: rgba(15, 15, 15, 0.1) 0px 8px 24px, rgba(15, 15, 15, 0.05) 0px 0px 0px 1px !important;
          color: #37352F !important;
        }
        /* Buttons and headers in settings/modal */
        #settings-backdrop label, #board-create-backdrop label, #vault-manager-backdrop label {
          color: #37352F !important;
        }
        #settings-backdrop h2, #board-create-backdrop h2, #vault-manager-backdrop h2 {
          color: #37352F !important;
        }
        #settings-backdrop p, #board-create-backdrop p, #vault-manager-backdrop p {
          color: #787774 !important;
        }
        #settings-close-action, #board-create-close-action, #vault-manager-close-footer {
          background-color: #FFFFFF !important;
          border: 1px solid #D3D2CE !important;
          color: #37352F !important;
        }
        #settings-close-action:hover, #board-create-close-action:hover, #vault-manager-close-footer:hover {
          background-color: #F1F1EF !important;
        }
        #lightbox-backdrop {
          background-color: rgba(15, 15, 15, 0.88) !important;
          backdrop-filter: blur(8px) !important;
        }
        #lightbox-backdrop * {
          color: #FFFFFF !important;
        }
      `;
    } else if (this.activeTheme === 'matrix') {
      styleElement.innerHTML = `
        ${universalVariables}

        /* Matrix Cyberpunk Terminal Overrides */
        body {
          background-color: #000000 !important;
          color: #00FF41 !important;
        }
        .vault-app-root {
          background-color: #000000 !important;
          color: #00FF41 !important;
          font-family: "JetBrains Mono", monospace !important;
        }
        .vault-header-bg {
          background-color: #000000 !important;
          border-bottom: 1px solid #00FF41 !important;
        }
        .vault-sidebar-bg {
          background-color: #000000 !important;
          border-right: 1px solid #00FF41 !important;
        }
        #inspector-sidebar {
          border-left: 1px solid #00FF41 !important;
        }
        .vault-main-content {
          background-color: #000000 !important;
        }
        .vault-card {
          background-color: #000000 !important;
          border: 1px solid #00FF41 !important;
          color: #00FF41 !important;
          border-radius: 0px !important;
          box-shadow: 0 0 8px rgba(0, 255, 65, 0.25) !important;
        }
        .vault-card:hover {
          background-color: #051405 !important;
          border-color: #00FF41 !important;
          box-shadow: 0 0 15px rgba(0, 255, 65, 0.6) !important;
        }
        .vault-badge {
          background-color: #00FF41 !important;
          color: #000000 !important;
          font-weight: bold !important;
          border-radius: 0px !important;
        }
        .vault-accent-text {
          color: #00FF41 !important;
          text-shadow: 0 0 5px rgba(0, 255, 65, 0.5) !important;
        }
        .vault-accent-bg {
          background-color: #00FF41 !important;
          color: #000000 !important;
          font-weight: bold !important;
          border-radius: 0px !important;
        }
        .vault-btn {
          border-radius: 0px !important;
          font-family: inherit !important;
          border: 1px solid #00FF41 !important;
          background-color: #000000 !important;
          color: #00FF41 !important;
          box-shadow: 0 0 5px rgba(0, 255, 65, 0.2) !important;
        }
        .vault-btn:hover {
          background-color: #00FF41 !important;
          color: #000000 !important;
          box-shadow: 0 0 10px rgba(0, 255, 65, 0.5) !important;
        }
        .vault-border {
          border-color: #00FF41 !important;
        }
        .vault-text-muted {
          color: rgba(0, 255, 65, 0.5) !important;
        }
        .vault-tag {
          background-color: #000000 !important;
          border: 1px solid #00FF41 !important;
          color: #00FF41 !important;
          border-radius: 0px !important;
        }
        .vault-input {
          background-color: #000000 !important;
          border: 1px solid #00FF41 !important;
          color: #00FF41 !important;
          border-radius: 0px !important;
        }
        .vault-input:focus {
          border-color: #00FF41 !important;
          box-shadow: 0 0 5px rgba(0, 255, 65, 0.5) !important;
        }
        .vault-footer {
          background-color: #000000 !important;
          border-top: 1px solid #00FF41 !important;
          color: rgba(0, 255, 65, 0.6) !important;
        }
        .vault-rounded {
          border-radius: 0px !important;
        }
        /* Custom scrollbar override for Matrix Terminal theme */
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #00FF41 !important;
          border-radius: 0px !important;
        }
        /* Matrix text & visual elements overrides */
        h1, h2, h3, h4, span, div, p, label, button, select, input, textarea {
          border-radius: 0px !important;
          font-family: "JetBrains Mono", monospace !important;
        }
        .text-emerald-400 {
          color: #00FF41 !important;
          text-shadow: 0 0 5px rgba(0, 255, 65, 0.5) !important;
        }
        .text-emerald-500 {
          color: #00FF41 !important;
        }
        .bg-emerald-500\\/10 {
          background-color: rgba(0, 255, 65, 0.1) !important;
        }
        .border-emerald-500\\/20 {
          border-color: #00FF41 !important;
        }
        /* Fix text elements colors */
        .text-slate-400, .text-slate-500 {
          color: rgba(0, 255, 65, 0.7) !important;
        }
        .text-slate-200, .text-white {
          color: #00FF41 !important;
        }
        .text-slate-600 {
          color: rgba(0, 255, 65, 0.4) !important;
        }
        .bg-slate-900\\/60, .bg-\\[\\#0F0F11\\], .bg-\\[\\#121215\\], .bg-black\\/30, .bg-black\\/40 {
          background-color: #000000 !important;
          border-color: #00FF41 !important;
        }
        /* Dialog overrides */
        #settings-backdrop, #lightbox-backdrop, #board-create-backdrop, #vault-manager-backdrop {
          background-color: rgba(0, 0, 0, 0.92) !important;
        }
        /* Matrix screen overlay (scanlines) */
        .matrix-overlay {
          pointer-events: none;
          position: fixed;
          top: 0; left: 0; width: 100%; height: 100%;
          background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.05), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.05));
          background-size: 100% 4px, 6px 100%;
          z-index: 99999;
          opacity: 0.15;
        }
      `;
    } else {
      styleElement.innerHTML = `
        ${universalVariables}
      `;
    }
  }

  private toggleBoardCreateModal(open?: boolean) {
    const backdrop = this.querySelector('#board-create-backdrop') as HTMLElement | null;
    if (!backdrop) return;

    const isCurrentlyOpen = !backdrop.classList.contains('hidden');
    const shouldOpen = open !== undefined ? open : !isCurrentlyOpen;

    if (shouldOpen) {
      backdrop.classList.remove('hidden');
      const input = this.querySelector('#modal-board-name') as HTMLInputElement | null;
      if (input) {
        input.value = '';
        setTimeout(() => input.focus(), 85);
      }
      this.addLog('info', 'Opened Board Creation Dialog.');
    } else {
      backdrop.classList.add('hidden');
    }
  }

  /**
   * Toggles the visibility of the Obsidian-Style Vault Manager modal window.
   * If the modal is opened, it triggers re-populating the UI catalog list.
   * Automatically targets and focuses the name input field to streamline user creation experience.
   * 
   * @param open Optional direct toggle override boolean state.
   */
  private toggleVaultManagerModal(open?: boolean) {
    const backdrop = this.querySelector('#vault-manager-backdrop') as HTMLElement | null;
    if (!backdrop) return;

    const isCurrentlyOpen = !backdrop.classList.contains('hidden');
    const shouldOpen = open !== undefined ? open : !isCurrentlyOpen;

    if (shouldOpen) {
      backdrop.classList.remove('hidden');
      this.populateVaultManager();
      
      // Auto-focus the primary text input for seamless keyboard-only navigation
      const input = this.querySelector('#create-vault-name') as HTMLInputElement | null;
      if (input) {
        setTimeout(() => input.focus(), 85);
      }
      this.addLog('info', 'Opened Obsidian-Style Vault Manager modal.');
    } else {
      backdrop.classList.add('hidden');
    }
  }

  /**
   * Reads, sorts, and renders the list of registered user directory vaults from LocalStorage cache.
   * Automatically updates workspace count indicators and mounts functional event handlers
   * to corresponding mount buttons and deletion buttons.
   */
  private populateVaultManager() {
    const listContainer = this.querySelector('#vault-manager-list-container');
    if (!listContainer) return;

    // Retrieve full catalog index and active path configurations from client-side state
    const vaults = storage.getVaults();
    const currentPath = storage.getVaultPath();

    // Sort registered directories descending by lastOpened timestamp to maintain recent-first order
    vaults.sort((a, b) => (b.lastOpened || 0) - (a.lastOpened || 0));

    // Update vault search count label
    const countLabel = this.querySelector('#vault-manager-count-label');
    if (countLabel) {
      countLabel.textContent = `${vaults.length} register${vaults.length === 1 ? 'y' : 'ies'} found`;
    }

    if (vaults.length === 0) {
      listContainer.innerHTML = `
        <div class="text-center py-8 bg-black/10 rounded-lg border border-white/5 p-4">
          <p class="text-xs text-slate-500">No registered visual vaults in launcher catalog.</p>
        </div>
      `;
      return;
    }

    // Dynamic HTML injection of vault elements with high-contrast active highlights, indicator dots, status badges and actions
    listContainer.innerHTML = vaults.map((vault, i) => {
      const isCurrent = vault.path === currentPath;
      const isMounted = vault.mounted !== false;
      
      const accentBorder = isCurrent 
        ? 'border-emerald-500/30 bg-emerald-500/[0.03]' 
        : (!isMounted 
          ? 'border-white/5 bg-black/10 opacity-60 hover:opacity-100 hover:border-white/10' 
          : 'border-white/5 bg-black/20 hover:border-white/10');
          
      const indicatorDot = isCurrent ? '<span class="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse shrink-0"></span>' : '';
      
      const mountStatusBadge = isMounted
        ? `<span class="text-[8px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded font-mono font-bold tracking-wide uppercase shrink-0">Mounted</span>`
        : `<span class="text-[8px] bg-amber-500/10 text-amber-500 border border-amber-500/20 px-1.5 py-0.5 rounded font-mono font-bold tracking-wide uppercase shrink-0">Unloaded</span>`;

      const actionText = isCurrent ? 'Active Vault' : 'Open Vault';
      const actionClass = isCurrent 
        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold cursor-default' 
        : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5 cursor-pointer font-medium active:scale-95 hover:text-emerald-400';

      const mountActionBtn = isMounted
        ? `<button data-idx="${i}" class="vault-toggle-mount-btn text-[10px] px-2.5 py-1 rounded transition border border-amber-500/20 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 font-medium cursor-pointer active:scale-95" title="Unload/Unmount this vault from the active catalog" data-action="unmount">Unload</button>`
        : `<button data-idx="${i}" class="vault-toggle-mount-btn text-[10px] px-2.5 py-1 rounded transition border border-emerald-500/20 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-medium cursor-pointer active:scale-95" title="Mount/Load this vault back into active catalog" data-action="mount">Mount</button>`;

      return `
        <div class="p-3 rounded-lg border ${accentBorder} flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition group">
          <div class="flex items-center gap-3 min-w-0">
            <div class="w-8 h-8 rounded-md bg-black/40 flex items-center justify-center border border-white/5 shrink-0">
              <svg class="w-4 h-4 ${isCurrent ? 'text-emerald-400' : (isMounted ? 'text-slate-400 opacity-60' : 'text-slate-500 opacity-40')}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path>
              </svg>
            </div>
            <div class="min-w-0">
              <div class="flex items-center gap-2 pb-0.5">
                <span class="text-xs font-bold text-white truncate">${vault.name}</span>
                ${indicatorDot}
                ${mountStatusBadge}
              </div>
              <span class="text-[10px] text-slate-500 font-mono block truncate" title="${vault.path}">${vault.path}</span>
            </div>
          </div>
          <div class="flex items-center gap-2 shrink-0 self-end sm:self-auto">
            ${mountActionBtn}
            <button data-idx="${i}" class="vault-open-btn text-[10px] px-2.5 py-1 rounded transition ${actionClass}" ${isCurrent ? 'disabled' : ''}>${actionText}</button>
            <button data-idx="${i}" class="vault-delete-btn text-slate-500 hover:text-red-400 p-1.5 rounded transition hover:bg-red-500/10 cursor-pointer" title="Remove vault index from history">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            </button>
          </div>
        </div>
      `;
    }).join('');

    // Wire up element-specific event listeners for mounting/activating vaults
    listContainer.querySelectorAll('.vault-open-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt((btn as HTMLElement).dataset.idx || '0');
        const clickedVault = vaults[idx];
        if (clickedVault) {
          this.switchVault(clickedVault.path);
        }
      });
    });

    // Wire up element-specific event listeners for mounting/unmounting toggles
    listContainer.querySelectorAll('.vault-toggle-mount-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt((btn as HTMLElement).dataset.idx || '0');
        const action = (btn as HTMLElement).dataset.action;
        const clickedVault = vaults[idx];
        if (clickedVault) {
          if (action === 'unmount') {
            clickedVault.mounted = false;
            this.addLog('warn', `Unmounted vault: "${clickedVault.name}" unloaded from active catalog.`);
            this.toast('Vault Unloaded', `Successfully unloaded "${clickedVault.name}" reference pool.`);
            
            // If the unmounted vault was the currently active vault, switch active to the first available mounted vault
            if (clickedVault.path === currentPath) {
              const firstMounted = vaults.find(v => v.path !== clickedVault.path && v.mounted !== false);
              if (firstMounted) {
                this.switchVault(firstMounted.path);
              } else {
                // When a vault is unloaded, don't load a default vault. Simply save vaults, clear inputs, and reload layout states
                storage.saveVaults(vaults);
                this.loadAssets();
                this.selectedAssetId = '';
                this.selectedBoard = 'ALL';
                this.updateLayout();
                this.populateVaultManager();
              }
            } else {
              storage.saveVaults(vaults);
              this.loadAssets();
              this.updateLayout();
              this.populateVaultManager();
            }
          } else {
            clickedVault.mounted = true;
            storage.saveVaults(vaults);
            this.addLog('success', `Mounted vault: "${clickedVault.name}" loaded back into active catalog.`);
            this.toast('Vault Mounted', `Successfully mounted and loaded "${clickedVault.name}".`);
            
            // Auto-switch to this vault if there isn't any active mounted vault right now
            const activeVault = vaults.find(v => v.path === currentPath);
            if (!activeVault || activeVault.mounted === false) {
              this.switchVault(clickedVault.path);
            } else {
              const mountedCount = vaults.filter(v => v.mounted !== false).length;
              if (mountedCount > 1 && this.workspaceMode === 'focused') {
                this.workspaceMode = 'unified';
                localStorage.setItem('visual_vault_workspace_mode', 'unified');
                this.addLog('success', `Perspective auto-unified to display ${mountedCount} concurrently mounted vaults.`);
                this.toast('Workspace Unified', `Automatically shifted to Unified mode to display all ${mountedCount} mounted vaults together!`);
                this.renderShell();
                this.attachEventListeners();
              }
              this.loadAssets();
              this.updateLayout();
              this.populateVaultManager();
            }
          }
        }
      });
    });

    // Wire up removal handles to let directory registrations clear cleanly without deleting background host assets
    listContainer.querySelectorAll('.vault-delete-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt((btn as HTMLElement).dataset.idx || '0');
        const clickedVault = vaults[idx];
        if (clickedVault) {
          if (confirm(`Remove "${clickedVault.name}" from your registered vaults list?\n(Note: This will NOT delete any directories or image files on disk)`)) {
            const updated = vaults.filter((_, index) => index !== idx);
            storage.saveVaults(updated);
            this.addLog('info', `Removed vault "${clickedVault.name}" registration history.`);
            
            if (clickedVault.path === currentPath) {
              const firstMounted = updated.find(v => v.mounted !== false);
              if (firstMounted) {
                this.switchVault(firstMounted.path);
              } else if (updated.length > 0) {
                this.switchVault(updated[0].path);
              } else {
                storage.setVaultPath('');
                this.selectedAssetId = '';
                this.selectedBoard = 'ALL';
                this.loadAssets();
                this.updateLayout();
                this.populateVaultManager();
              }
            } else {
              this.loadAssets();
              this.updateLayout();
              this.populateVaultManager();
            }
          }
        }
      });
    });
  }

  /**
   * Executes the structural transition to bind a new local catalog path reference.
   * Triggers file metadata caching updates, reloads distinct asset collections,
   * updates live paths inside global filters, and refreshes workspace component loops.
   * 
   * @param newPath The target directory path context parameter.
   * @param name Optional custom workspace display string name.
   */
  private switchVault(newPath: string, name?: string) {
    if (!newPath) return;

    // Direct path routing check for browser-sandboxed local directory vaults
    if (newPath.startsWith('[web-dir]')) {
      const vaultsList = storage.getVaults();
      const exists = vaultsList.some(v => v.path === newPath);
      if (!exists) {
        this.handleWebDirectoryPicker();
        return;
      }
    }

    this.isSandboxedDirectory = newPath.startsWith('[web-dir]') || !!(window as any).electronAPI;

    // 1. Fetch current vaults index history
    let vaults = storage.getVaults();
    
    // Ensure the activated vault is marked as mounted/loaded; preserve other mounted vaults!
    vaults.forEach(v => {
      if (v.path === newPath) {
        v.mounted = true;
      }
    });
    
     // 2. Locate or initialize target layout record
    let vault = vaults.find(v => v.path === newPath);
    if (!vault) {
      const actualName = name || newPath.split(/[/\\]/).pop() || 'Untitled Vault';
      vault = { name: actualName, path: newPath, lastOpened: Date.now(), mounted: true };
      vaults.push(vault);
    } else {
      vault.lastOpened = Date.now();
      vault.mounted = true; // Auto-mount upon explicit activation
      if (name) {
        vault.name = name;
      }
    }
    storage.saveVaults(vaults);

    // 3. Persist standard directory mapping configurations
    storage.setVaultPath(newPath);

    // 4. Mount database collections specifically isolated for this vault to prevent data bleeding
    this.loadAssets();

    if (this.isSandboxedDirectory) {
      this.checkAndRestoreLocalVaults();
    } else {
      this.needsDirectoryPermission = false;
      this.needsFallbackRelink = false;
      this.directoryHandle = null;
    }

    // 5. Instantly clear selected filter options to prevent mismatching indices
    this.selectedBoard = 'ALL';
    this.selectedAssetId = this.assets.length > 0 ? this.assets[0].id : '';

    // 6. Broadcast structural telemetry log states and desktop notification hooks
    this.addLog('success', `Tauri local mount: Switched active workspace vault to "${vault.name}" (${newPath}).`);
    this.toast('Vault Mounted', `Opened "${vault.name}"! Loaded ${this.assets.length} items.`);

    // 7. Auto-update active top navbar visual controls
    const pathInput = this.querySelector('#vault-path-input') as HTMLInputElement | null;
    if (pathInput) {
      if (newPath.startsWith('[web-dir]')) {
        const folderName = newPath.split('/').pop() || 'Workspace';
        pathInput.value = `[Connected Local Directory] /${folderName}`;
      } else {
        pathInput.value = newPath;
      }
    }

    // 8. Push dynamic redraw loops to layout elements and catalog lists
    this.updateLayout();
    this.populateVaultManager();

    // 9. Gracefully trigger modal dismiss animation frames
    this.toggleVaultManagerModal(false);
  }

  /**
   * Triggers inline input or dynamic folder rename operation.
   * Updates all associated asset directory locations and saves to LocalStorage.
   */
  private triggerRenameBoard() {
    if (this.selectedBoard === 'ALL') return;
    
    const heading = this.querySelector('#board-title-heading') as HTMLElement | null;
    const renameBtn = this.querySelector('#btn-rename-board') as HTMLElement | null;
    if (!heading || !renameBtn) return;

    const oldName = this.selectedBoard;
    
    // Switch heading to an interactive input field
    heading.innerHTML = `
      <input id="board-rename-inline-input" class="bg-black/80 text-white font-semibold text-xl border border-emerald-500/30 rounded px-2.5 py-0.5 outline-none focus:border-emerald-500/60 font-sans tracking-wide max-w-[280px]" value="${oldName}" spellcheck="false" />
    `;
    renameBtn.style.display = 'none';

    const input = this.querySelector('#board-rename-inline-input') as HTMLInputElement | null;
    if (input) {
      input.focus();
      input.select();

      let finished = false;

      const finishRename = (cancel: boolean) => {
        if (finished) return;
        finished = true;

        let newName = (input.value || '').trim();
        
        if (cancel || !newName || newName === oldName) {
          heading.textContent = oldName;
          if (this.selectedBoard !== 'ALL') {
            renameBtn.style.display = 'inline-flex';
          }
          return;
        }

        // Standardize folder/board slashes if desired
        if (!newName.startsWith('/')) {
          newName = '/' + newName;
        }

        // Rename logic
        this.renameBoardInCatalog(oldName, newName);
      };

      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          finishRename(false);
        } else if (e.key === 'Escape') {
          finishRename(true);
        }
      });

      input.addEventListener('blur', () => {
        // Run slightly delayed to avoid intercepting keydowns
        setTimeout(() => {
          finishRename(false);
        }, 150);
      });
    }
  }

  private renameBoardInCatalog(oldName: string, newName: string) {
    let changeCount = 0;

    // 1. Rename inside standard assets lists and save to catalog caches
    this.assets.forEach(asset => {
      if (asset.board === oldName) {
        asset.board = newName;
        changeCount++;
        // Save the update down to LocalStorage vault caches
        storage.updateAsset(asset.id, { board: newName });
        
        // If sandboxed local folder, also sync companion markdown files to match!
        this.saveCompanionMDFile(asset);
      } else if (asset.board.startsWith(oldName + '/')) {
        const remaining = asset.board.substring(oldName.length);
        const childNewName = newName + remaining;
        asset.board = childNewName;
        changeCount++;
        storage.updateAsset(asset.id, { board: childNewName });
        this.saveCompanionMDFile(asset);
      }
    });

    // 2. Rename inside custom created empty boards record list
    try {
      const vaultPath = storage.getVaultPath();
      const customKey = `visual_vault_created_boards_list_${vaultPath.replace(/[^a-zA-Z0-9_]/g, '_')}`;
      const allBoards = this.getUniqueBoards();
      const updated = allBoards.map(b => {
        if (b === oldName) {
          return newName;
        } else if (b.startsWith(oldName + '/')) {
          return newName + b.substring(oldName.length);
        }
        return b;
      });
      
      const uniqueUpdated: string[] = [];
      updated.forEach(b => {
        if (!uniqueUpdated.includes(b)) {
          uniqueUpdated.push(b);
        }
      });
      if (!uniqueUpdated.includes(newName)) {
        uniqueUpdated.push(newName);
      }
      localStorage.setItem(customKey, JSON.stringify(uniqueUpdated));
    } catch (e) {
      console.error('Failed to update serialized custom boards history', e);
    }

    // 3. Switch selected board state
    this.selectedBoard = newName;

    this.addLog('success', `Vault Schema: Renamed folder board '${oldName}' to '${newName}'. Successfully updated ${changeCount} references.`);
    this.toast('Folder Renamed', `Renamed board folder to '${newName}'!`);

    this.updateLayout();
  }

  /**
   * Browser-sandboxed local-first file writer. Serializes asset metadata (rating, notes, artist, status, tags)
   * into a standard Obsidian-compatible frontmatter companion block, and writes it directly to disk
   * inside the user's real local vault directory.
   */
  private async saveCompanionMDFile(asset: Asset) {
    if (!this.isSandboxedDirectory) return;
    const fileNameNoExt = asset.name.replace(/\.[a-zA-Z0-9]+$/, '');
    const mdFileName = `${fileNameNoExt}.md`;
    
    const electronAPI = (window as any).electronAPI;
    if (electronAPI) {
      const activePath = storage.getVaultPath();
      if (activePath) {
        try {
          const yamlContent = stringifyYAMLFrontmatter(asset.metadata);
          const res = await electronAPI.writeCompanionMD(activePath, asset.board, asset.name, yamlContent);
          if (res && res.success) {
            this.addLog('success', `Electron API: Wrote real YAML metadata file locally: ${mdFileName}`);
          } else {
            throw new Error(res ? res.error : 'Unknown error');
          }
        } catch (err: any) {
          console.error('Failed to write companion .md file natively', err);
          this.addLog('warn', `Electron API: Failed to write ${mdFileName}. Details: ${err.message}`);
        }
      }
      return;
    }

    try {
      let mdHandle = this.mdFileHandles.get(asset.id) as any;
      if (!mdHandle && this.directoryHandle) {
        mdHandle = await this.directoryHandle.getFileHandle(mdFileName, { create: true });
        this.mdFileHandles.set(asset.id, mdHandle);
      }
      
      if (mdHandle) {
        const writable = await mdHandle.createWritable();
        const yamlContent = stringifyYAMLFrontmatter(asset.metadata);
        await writable.write(yamlContent);
        await writable.close();
        this.addLog('success', `Sandbox API: Wrote real YAML metadata file locally: ${mdFileName}`);
      }
    } catch (err: any) {
      console.error('Failed to write companion .md file', err);
      this.addLog('warn', `Sandbox API: Failed to write ${mdFileName}. Details: ${err.message}`);
    }
  }

  /**
   * Safe fallback uploader for Brave/Firefox/Safari or any restricted sandbox browser environments
   * where window.showDirectoryPicker is blocked, unavailable, or throws permissions exceptions.
   * Leverages the standard HTML webkitdirectory directory input API to let users load physical design folders.
   */
  private handleWebDirectoryFallback() {
    const electronAPI = (window as any).electronAPI;
    if (electronAPI) {
      this.handleWebDirectoryPicker();
      return;
    }
    this.addLog('info', 'Web Directory Fallback: Scanning folder using standard file-system input channels.');
    this.toast('Web Fallback Active', 'Opening native system directory selection drawer...');

    // Create a hidden input element on-the-fly
    const input = document.createElement('input');
    input.type = 'file';
    input.setAttribute('webkitdirectory', '');
    input.setAttribute('directory', '');
    input.setAttribute('multiple', '');

    input.addEventListener('change', async (e: any) => {
      const files: File[] = Array.from(e.target.files || []);
      if (files.length === 0) {
        this.addLog('info', 'Web Directory Fallback: Connection cancelled by user.');
        return;
      }

      // Determine the Vault name from the top-level folder components of first item
      const firstPath = files[0].webkitRelativePath || '';
      const vaultName = firstPath.split('/')[0] || 'Local Folder Library';

      this.addLog('success', `Web Directory Fallback: Connected successfully. Analyzing ${files.length} items from folder "${vaultName}"...`);
      this.toast('Syncing Folder', `Parsing folder structured references...`);

      // Mark as integrated Local Directory mock context (read-only for disk writes)
      this.isSandboxedDirectory = false;
      this.directoryHandle = null;
      this.fileHandles.clear();
      this.mdFileHandles.clear();

      const assetsList: Asset[] = [];
      const supportedExtensions = ['png', 'jpg', 'jpeg', 'webp', 'gif', 'svg', 'bmp', 'avif', 'tiff', 'jfif', 'heic', 'heif'];

      // Pre-process markdown config logs to make index matching high performance (O(N))
      const mdFilesMap = new Map<string, File>();
      const imageFiles: File[] = [];

      files.forEach(file => {
        const path = file.webkitRelativePath || '';
        const ext = path.split('.').pop()?.toLowerCase() || '';
        if (ext === 'md') {
          mdFilesMap.set(path.toLowerCase(), file);
        } else if (supportedExtensions.includes(ext)) {
          imageFiles.push(file);
        }
      });

      for (const file of imageFiles) {
        const fullPath = file.webkitRelativePath || '';
        const parts = fullPath.split('/');

        // Extract subfolders as design boards (first part is vault name, last part is filename)
        const subDirs = parts.slice(1, -1);
        const fileName = parts[parts.length - 1];
        const boardPath = subDirs.length ? `/${subDirs.join('/')}` : '/';

        const id = `web_ref_${Date.now()}_${Math.floor(Math.random() * 1000000)}`;
        const fileNameNoExt = fileName.replace(/\.[a-zA-Z0-9]+$/, '');

        // Reconstruct companion MD path inside the same subfolder
        const mdPathParts = [parts[0], ...subDirs, `${fileNameNoExt}.md`].join('/');

        let metadata: AssetMetadata = {
          tags: ['Local-Sync', 'Imported'],
          artist: 'Local Computer',
          rating: '5',
          status: 'completed',
          title: fileNameNoExt.replace(/[-_]/g, ' '),
          notes: `Connected via Brave/Firefox Web Directory Fallback.`
        };

        const mdFile = mdFilesMap.get(mdPathParts.toLowerCase());
        if (mdFile) {
          try {
            const mdText = await mdFile.text();
            metadata = parseYAMLFrontmatter(mdText, metadata);
          } catch (e) {
            console.error('Failed to parse companion MD file', e);
          }
        }

        const imageUrl = URL.createObjectURL(file);
        const size = file.size > 1024 * 1024
          ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
          : `${(file.size / 1024).toFixed(0)} KB`;

        const colors = ['#0F0F11', '#1A2B3C', '#10B981', '#1E293B', '#111827'];

        const asset: Asset = {
          id,
          name: fileName,
          board: boardPath,
          resolution: 'Loading...',
          size,
          colors,
          tags: metadata.tags || [],
          metadata,
          imageUrl,
          lastModified: new Date(file.lastModified).toLocaleString()
        };

        assetsList.push(asset);

        // Extract exact resolutions and color palettes in background threads
        this.asynchronouslyLoadAssetDetails(id, file, imageUrl, assetsList);
      }

      if (assetsList.length === 0) {
        this.toast('Empty Folder', 'No supported visual images discovered inside selected folder.');
      } else {
        this.toast('Vault Connected', `Successfully connected vault reference! Indexed ${assetsList.length} files.`);
        this.addLog('success', `Web Directory Fallback: Mounted vault "${vaultName}" with ${assetsList.length} active assets.`);
      }

      this.assets = assetsList;
      this.selectedBoard = 'ALL';
      this.selectedAssetId = assetsList.length > 0 ? assetsList[0].id : '';

      // Update UI Vault Path input indicator
      const pathInput = this.querySelector('#vault-path-input') as HTMLInputElement | null;
      if (pathInput) pathInput.value = `[Connected Directory] /${vaultName}`;

      // Persist path reference in vaults list registry
      const mockPath = `[web-dir]/${vaultName}`;
      let vaults = storage.getVaults();
      
      // Ensure the newly connected directory is marked as mounted/loaded; preserve other mounted vaults!
      vaults.forEach(v => {
        if (v.path === mockPath) {
          v.mounted = true;
        }
      });

      let vault = vaults.find(v => v.path === mockPath);
      if (!vault) {
        vaults.push({
          name: `📁 ${vaultName} (Folder Connection)`,
          path: mockPath,
          lastOpened: Date.now(),
          mounted: true
        });
      } else {
        vault.lastOpened = Date.now();
        vault.mounted = true;
      }
      storage.saveVaults(vaults);
      storage.setVaultPath(mockPath);
      storage.saveAllAssets(assetsList);
      this.needsFallbackRelink = false;

      this.updateLayout();
      this.populateVaultManager();
      this.toggleVaultManagerModal(false);
    });

    input.click();
  }

  private async saveDirectoryHandleToIndexedDB(path: string, handle: FileSystemDirectoryHandle) {
    return new Promise<void>((resolve, reject) => {
      const request = indexedDB.open("VisualVaultDB", 1);
      request.onupgradeneeded = (e: any) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains("handles")) {
          db.createObjectStore("handles");
        }
      };
      request.onsuccess = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains("handles")) {
          db.close();
          resolve();
          return;
        }
        const tx = db.transaction("handles", "readwrite");
        const store = tx.objectStore("handles");
        store.put(handle, path);
        tx.oncomplete = () => {
          resolve();
        };
        tx.onerror = (err) => {
          reject(err);
        };
      };
      request.onerror = (err) => reject(err);
    });
  }

  private async loadDirectoryHandleFromIndexedDB(path: string): Promise<FileSystemDirectoryHandle | null> {
    return new Promise<FileSystemDirectoryHandle | null>((resolve, reject) => {
      const request = indexedDB.open("VisualVaultDB", 1);
      request.onupgradeneeded = (e: any) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains("handles")) {
          db.createObjectStore("handles");
        }
      };
      request.onsuccess = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains("handles")) {
          resolve(null);
          return;
        }
        try {
          const tx = db.transaction("handles", "readonly");
          const store = tx.objectStore("handles");
          const getReq = store.get(path);
          getReq.onsuccess = () => {
            resolve(getReq.result || null);
          };
          getReq.onerror = () => {
            resolve(null);
          };
        } catch (e) {
          resolve(null);
        }
      };
      request.onerror = () => resolve(null);
    });
  }

  private async checkAndRestoreLocalVaults() {
    const electronAPI = (window as any).electronAPI;
    const activePath = storage.getVaultPath();

    if (electronAPI) {
      if (activePath) {
        this.isSandboxedDirectory = true;
        this.addLog('info', `Electron API: Automatically restoring physical local vault at: ${activePath}`);
        try {
          const assetsList = await electronAPI.scanVault(activePath);
          this.needsDirectoryPermission = false;
          this.needsFallbackRelink = false;
          if (assetsList) {
            this.assets = assetsList;
            storage.saveAllAssets(assetsList);
            this.loadAssets(assetsList);
            this.renderShell();
            this.attachEventListeners();
            this.updateLayout();
            if (assetsList.length > 0) {
              this.addLog('success', `Electron API: Successfully auto-restored ${assetsList.length} files from local folder without user prompts.`);
            } else {
              this.addLog('info', `Electron API: Connected to empty vault folder: ${activePath}`);
            }
          }
        } catch (e: any) {
          console.warn('Error natively restoring Electron vault:', e);
          this.needsFallbackRelink = true;
          this.pendingPermissionVaultPath = activePath;
          this.pendingPermissionVaultName = activePath.split(/[/\\]/).pop() || 'Local Vault';
          this.renderShell();
          this.attachEventListeners();
          this.updateLayout();
        }
      }
      return;
    }

    if (activePath && activePath.startsWith('[web-dir]')) {
      this.isSandboxedDirectory = true;
      this.addLog('info', `Checking for stored folder permission for vault path: ${activePath}`);
      try {
        const handle = await this.loadDirectoryHandleFromIndexedDB(activePath);
        if (handle) {
          this.directoryHandle = handle;
          this.needsFallbackRelink = false;
          // Check if we already have permission
          const status = await (handle as any).queryPermission({ mode: 'readwrite' });
          if (status === 'granted') {
            this.addLog('info', `Folder permissions already granted for "${handle.name}". Re-syncing...`);
            this.needsDirectoryPermission = false;
            this.fileHandles.clear();
            this.mdFileHandles.clear();
            const assetsList: Asset[] = [];
            await this.traverseDirectoryHandle(handle, '', assetsList);
            if (assetsList.length > 0) {
              this.assets = assetsList;
              storage.saveAllAssets(assetsList);
              this.loadAssets(assetsList);
              this.renderShell();
              this.attachEventListeners();
              this.updateLayout();
              this.addLog('success', `Sandbox API: Auto-restored ${assetsList.length} files from linked folder.`);
            } else {
              this.renderShell();
              this.attachEventListeners();
              this.updateLayout();
            }
          } else {
            // Permission needed! Set state flags so UI displays the permission banner
            this.needsDirectoryPermission = true;
            this.pendingPermissionVaultPath = activePath;
            this.pendingPermissionVaultName = handle.name;
            // Clear expired blob assets to avoid broken images showing in UI before permission is granted
            this.assets = [];
            this.loadAssets([]);
            this.renderShell();
            this.attachEventListeners();
            this.updateLayout();
            this.addLog('warn', `Linked folder "${handle.name}" is locked. Please grant permission in the top banner.`);
          }
        } else {
          this.addLog('warn', `No directory handle found in IndexedDB for "${activePath}". Shifting to standard Web Directory Fallback banner...`);
          this.needsFallbackRelink = true;
          this.needsDirectoryPermission = false;
          this.pendingPermissionVaultPath = activePath;
          const vaultName = activePath.split('/').pop() || 'Linked Folder';
          this.pendingPermissionVaultName = vaultName;
          this.renderShell();
          this.attachEventListeners();
          this.updateLayout();
        }
      } catch (e: any) {
        console.warn('Error restoring directory handles from IndexedDB:', e);
        this.needsFallbackRelink = true;
        this.needsDirectoryPermission = false;
        this.pendingPermissionVaultPath = activePath;
        const vaultName = activePath.split('/').pop() || 'Linked Folder';
        this.pendingPermissionVaultName = vaultName;
        this.renderShell();
        this.attachEventListeners();
        this.updateLayout();
      }
    } else {
      this.needsDirectoryPermission = false;
      this.needsFallbackRelink = false;
    }
  }

  /**
   * Prompts the user to authorize and connect a local computer directory using the File System Access API.
   * Scans contents recursively, discovers subfolders as design boards, binds markdown YAML observers,
   * and loads native previews completely on the client-side.
   */
  private async handleWebDirectoryPicker() {
    const electronAPI = (window as any).electronAPI;

    if (electronAPI) {
      try {
        const physicalPath = await electronAPI.selectDirectory();
        if (!physicalPath) {
          this.addLog('info', 'Electron API: Folder selection cancelled by user.');
          return;
        }

        const vaultName = physicalPath.split(/[/\\]/).pop() || 'Local Vault';
        this.addLog('info', `Electron API: Selected physical directory "${vaultName}" at path "${physicalPath}"`);
        this.toast('Syncing Folder', `Reading entries inside "${vaultName}"...`);

        this.isSandboxedDirectory = true;
        this.needsDirectoryPermission = false;
        this.needsFallbackRelink = false;

        const assetsList = await electronAPI.scanVault(physicalPath);
        if (!assetsList || assetsList.length === 0) {
          this.toast('Empty Directory', 'No image assets (.png, .jpg, .webp, .svg) discovered.');
        } else {
          this.toast('Vault Synced', `Successfully indexed ${assetsList.length} local images!`);
          this.addLog('success', `Electron API: Successfully indexed ${assetsList.length} files. Obsidian YAML dual-sync active.`);
        }

        this.assets = assetsList || [];
        this.selectedBoard = 'ALL';
        this.selectedAssetId = this.assets.length > 0 ? this.assets[0].id : '';

        // Update Path Text input indicator
        const pathInput = this.querySelector('#vault-path-input') as HTMLInputElement | null;
        if (pathInput) pathInput.value = physicalPath;

        let vaults = storage.getVaults();
        // Remove or handle duplicate paths
        const exists = vaults.some(v => v.path === physicalPath);
        if (!exists) {
          vaults.push({
            name: `📁 ${vaultName} (Local Connection)`,
            path: physicalPath,
            lastOpened: Date.now(),
            mounted: true
          });
        } else {
          const vault = vaults.find(v => v.path === physicalPath);
          if (vault) {
            vault.lastOpened = Date.now();
            vault.mounted = true;
          }
        }

        storage.saveVaults(vaults);
        storage.setVaultPath(physicalPath);
        storage.saveAllAssets(this.assets);

        this.updateLayout();
        this.populateVaultManager();
        this.toggleVaultManagerModal(false);
      } catch (err: any) {
        console.error('Electron directory selection failed:', err);
        this.addLog('warn', `Electron API error: ${err.message}`);
        this.toast('Selection Failed', 'Failed to read directory.');
      }
      return;
    }

    const showPicker = (window as any).showDirectoryPicker;
    if (!showPicker) {
      this.addLog('info', 'File System Access API is not supported by this browser. Shifting to standard Web Directory Fallback...');
      this.handleWebDirectoryFallback();
      return;
    }

    try {
      const handle = await showPicker({ mode: 'readwrite' });
      
      this.addLog('info', `Sandbox API: Connected folder connection link to "${handle.name}".`);
      this.toast('Syncing Folder', `Reading entries inside "${handle.name}"...`);

      this.isSandboxedDirectory = true;
      this.directoryHandle = handle;
      this.fileHandles.clear();
      this.mdFileHandles.clear();

      const assetsList: Asset[] = [];
      await this.traverseDirectoryHandle(handle, '', assetsList);

      if (assetsList.length === 0) {
        this.toast('Empty Directory', 'No image assets (.png, .jpg, .webp, .svg) discovered.');
      } else {
        this.toast('Vault Synced', `Successfully indexed ${assetsList.length} local images!`);
        this.addLog('success', `Sandbox API: Indexed ${assetsList.length} files. Obsidian YAML dual-sync active.`);
      }

      this.assets = assetsList;
      this.selectedBoard = 'ALL';
      this.selectedAssetId = assetsList.length > 0 ? assetsList[0].id : '';

      // Update Path Text input indicator
      const pathInput = this.querySelector('#vault-path-input') as HTMLInputElement | null;
      if (pathInput) pathInput.value = `[Connected Local Directory] /${handle.name}`;

      // Persist path reference inside vaults registry list
      const mockPath = `[web-dir]/${handle.name}`;

      // Save directory handle to IndexedDB for seamless reload
      this.saveDirectoryHandleToIndexedDB(mockPath, handle).catch(err => {
        console.warn('Failed to save directory handle to IndexedDB:', err);
      });

      let vaults = storage.getVaults();
      
      // Ensure the newly connected directory is marked as mounted/loaded; preserve other mounted vaults!
      vaults.forEach(v => {
        if (v.path === mockPath) {
          v.mounted = true;
        }
      });

      let vault = vaults.find(v => v.path === mockPath);
      if (!vault) {
        vaults.push({
          name: `📁 ${handle.name} (Direct Sync)`,
          path: mockPath,
          lastOpened: Date.now(),
          mounted: true
        });
      } else {
        vault.lastOpened = Date.now();
        vault.mounted = true;
      }
      storage.saveVaults(vaults);
      storage.setVaultPath(mockPath);
      storage.saveAllAssets(assetsList);
      this.needsFallbackRelink = false;

      this.updateLayout();
      this.populateVaultManager();
      this.toggleVaultManagerModal(false);

    } catch (err: any) {
      if (err.name === 'AbortError') {
        this.addLog('info', 'Sandbox API: Connection cancelled.');
      } else {
        console.error(err);
        this.addLog('warn', `Sandbox API: Connection blocked or failed - ${err.message}. Shifting to standard Web Directory Fallback picker.`);
        this.toast('API Restrained', 'File system access is restricted. Retrying with fallback...');
        this.handleWebDirectoryFallback();
      }
    }
  }

  /**
   * Recursive directory iterator. Maps files to catalog Asset entries,
   * maps subdirectories to separate Boards categories, and binds associated metadata .md configurations.
   */
  private async traverseDirectoryHandle(dirHandle: any, currentBoard: string, assetsList: Asset[]) {
    const boardPath = currentBoard ? `/${currentBoard}` : '/';
    
    for await (const entry of dirHandle.values()) {
      // Avoid processing hidden folders/files (e.g. .git, .obsidian, .trash, .DS_Store, etc.)
      if (entry.name && entry.name.startsWith('.')) {
        continue;
      }

      if (entry.kind === 'file') {
        const file = await entry.getFile();
        const ext = file.name.split('.').pop()?.toLowerCase() || '';
        
        // Expanded suite of visual reference image extensions
        const supportedExtensions = ['png', 'jpg', 'jpeg', 'webp', 'gif', 'svg', 'bmp', 'avif', 'tiff', 'jfif', 'heic', 'heif'];
        if (supportedExtensions.includes(ext)) {
          const id = `web_ref_${Date.now()}_${Math.floor(Math.random() * 1000000)}`;
          const fileNameNoExt = file.name.replace(/\.[a-zA-Z0-9]+$/, '');
          const mdFileName = `${fileNameNoExt}.md`;
          
          let metadata: AssetMetadata = {
            tags: ['Local-Sync', 'Imported'],
            artist: 'Local Computer',
            rating: '5',
            status: 'completed',
            title: fileNameNoExt.replace(/[-_]/g, ' '),
            notes: `Natively connected local directory database sync.`
          };

          // Try and locate associated .md text file inside the active subfolder
          try {
            const mdEntry = await dirHandle.getFileHandle(mdFileName);
            const mdFile = await mdEntry.getFile();
            const mdText = await mdFile.text();
            metadata = parseYAMLFrontmatter(mdText, metadata);
            this.mdFileHandles.set(id, mdEntry);
          } catch (e) {
            // Keep fallback defaults if md doesn't exist yet
          }

          const imageUrl = URL.createObjectURL(file);
          const size = file.size > 1024 * 1024 
            ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
            : `${(file.size / 1024).toFixed(0)} KB`;

          const colors = ['#0F0F11', '#1A2B3C', '#10B981', '#1E293B', '#111827'];

          const asset: Asset = {
            id,
            name: file.name,
            board: boardPath,
            resolution: 'Loading...',
            size,
            colors,
            tags: metadata.tags || [],
            metadata,
            imageUrl,
            lastModified: new Date(file.lastModified).toLocaleString()
          };

          this.fileHandles.set(id, entry);
          assetsList.push(asset);

          // Asynchronously extract exact resolutions and color grids in background to prevent indexing lag
          // Pass the assetsList context to overcome the race condition where `this.assets` has not been assigned yet.
          this.asynchronouslyLoadAssetDetails(id, file, imageUrl, assetsList);
        }
      } else if (entry.kind === 'directory') {
        try {
          const subBoardName = currentBoard ? `${currentBoard}/${entry.name}` : entry.name;
          await this.traverseDirectoryHandle(entry, subBoardName, assetsList);
        } catch (e) {
          console.warn('Subdirectory traverse error omitted', e);
        }
      }
    }
  }

  /**
   * Background parser. Reads actual resolution specs and extracts a gorgeous 5-color
   * visual palette key, instantly updating grid cells on-the-fly.
   * Throttles operations using a controlled background queue to prevent UI freezing and server/websocket disconnects on massive directories.
   */
  private asynchronouslyLoadAssetDetails(id: string, file: File, imageUrl: string, listContext?: Asset[]) {
    this.extractionQueue.push({ id, file, imageUrl, listContext });
    this.processExtractionQueue();
  }

  private processExtractionQueue() {
    if (this.activeExtractions >= this.maxConcurrentExtractions || this.extractionQueue.length === 0) {
      return;
    }

    const task = this.extractionQueue.shift();
    if (!task) return;

    this.activeExtractions++;
    const { id, file, imageUrl, listContext } = task;

    // Fast pre-check: if the asset doesn't exist anymore in the current context, skip immediately
    const parentList = listContext || this.assets;
    const assetExists = parentList.some(a => a.id === id);
    if (!assetExists) {
      this.activeExtractions--;
      setTimeout(() => this.processExtractionQueue(), 0);
      return;
    }

    const img = new Image();
    img.onload = async () => {
      try {
        const parentListLatest = listContext || this.assets;
        const asset = parentListLatest.find(a => a.id === id);
        if (asset) {
          asset.resolution = `${img.naturalWidth}x${img.naturalHeight}`;
          
          try {
            const palette = await extractColorsFromImage(imageUrl);
            if (palette && palette.length > 0) {
              asset.colors = palette;
            }
          } catch (e) {
            console.warn('Asynchronous color extraction failed', e);
          }

          // Apply instant visual resolution updates to DOM
          const gridCardRes = this.querySelector(`#res-badge-${id}`);
          if (gridCardRes) gridCardRes.textContent = asset.resolution;

          // Apply instant visual color swatch updates to DOM
          const gridCardPalette = this.querySelector(`#palette-${id}`);
          if (gridCardPalette) {
            gridCardPalette.innerHTML = asset.colors.map(c => `
              <div class="h-1 flex-grow opacity-90" style="background-color: ${c};" title="${c}"></div>
            `).join('');
          }

          // If this is the currently selected active inspector asset, mirror color palette immediately
          if (this.selectedAssetId === id) {
            this.renderInspector();
          }
        }
      } catch (err) {
        console.error('Error processing asset from queue:', err);
      } finally {
        this.activeExtractions--;
        this.processExtractionQueue();
      }
    };

    img.onerror = () => {
      this.activeExtractions--;
      this.processExtractionQueue();
    };

    img.src = imageUrl;
  }

  private toggleSettings(forceOpen?: boolean) {
    const backdrop = this.querySelector('#settings-backdrop') as HTMLElement | null;
    if (!backdrop) return;

    if (forceOpen !== undefined) {
      this.isSettingsOpen = forceOpen;
    } else {
      this.isSettingsOpen = !this.isSettingsOpen;
    }

    if (this.isSettingsOpen) {
      backdrop.classList.remove('hidden');
      
      // Update indexed count in real-time
      const countNode = this.querySelector('#settings-files-indexed');
      if (countNode) countNode.textContent = `${this.assets.length} file configurations active`;

      // Highlight active theme button bullet indicators
      this.querySelectorAll('.theme-select-btn div').forEach(bullet => {
        bullet.classList.add('hidden');
      });
      const activeBullet = this.querySelector(`#theme-bullet-${this.activeTheme}`);
      if (activeBullet) activeBullet.classList.remove('hidden');

      // Add borders/highlights to active theme button card
      this.querySelectorAll('.theme-select-btn').forEach(card => {
        card.classList.remove('border-emerald-500/40', 'border-neutral-900', 'border-[#00FF41]');
        card.classList.add('border-white/5');
      });
      const activeCard = this.querySelector(`#theme-btn-${this.activeTheme}`) as HTMLElement;
      if (activeCard) {
        activeCard.classList.remove('border-white/5');
        if (this.activeTheme === 'minimalist') {
          activeCard.classList.add('border-neutral-900');
        } else if (this.activeTheme === 'matrix') {
          activeCard.classList.add('border-[#00FF41]');
        } else {
          activeCard.classList.add('border-emerald-500/40');
        }
      }

      this.syncSettingsHighlights();
      this.switchSettingsTab(this.activeSettingsTab);
      this.addLog('info', 'Opened VisualVault configuration control panel.');
    } else {
      backdrop.classList.add('hidden');
    }
  }

  private syncSettingsHighlights() {
    // 1. Accent highlights
    const accentColorsContainer = this.querySelector('#accent-colors-container');
    if (accentColorsContainer) {
      accentColorsContainer.querySelectorAll('.accent-select-btn').forEach(btn => {
        btn.classList.remove('border-emerald-500/40', 'border-neutral-400', 'bg-neutral-100', 'bg-white/5', 'ring-2', 'ring-emerald-500/25', 'ring-neutral-400/20');
        btn.classList.add('border-white/5', 'bg-black/30');

        const accentName = (btn as HTMLElement).dataset.accent;
        if (accentName === this.activeAccent) {
          btn.classList.remove('border-white/5', 'bg-black/30');
          if (this.activeTheme === 'minimalist') {
            btn.classList.add('border-neutral-400', 'bg-neutral-100', 'ring-2', 'ring-neutral-400/20');
          } else {
            btn.classList.add('border-emerald-500/40', 'bg-white/5', 'ring-1', 'ring-emerald-500/25');
          }
        }
      });
    }

    // Custom hex panel visibility
    const customPanel = this.querySelector('#custom-accent-extra-panel') as HTMLElement | null;
    if (customPanel) {
      if (this.activeAccent === 'custom') {
        customPanel.classList.remove('hidden');
        const picker = this.querySelector('#custom-accent-color-picker') as HTMLInputElement | null;
        const hexInput = this.querySelector('#custom-accent-hex-input') as HTMLInputElement | null;
        if (picker && hexInput) {
          picker.value = this.customAccentHex || '#10B981';
          hexInput.value = this.customAccentHex || '#10B981';
        }
      } else {
        customPanel.classList.add('hidden');
      }
    }

    // Update custom accent preview bubble
    const previewDot = this.querySelector('#custom-accent-color-preview') as HTMLElement | null;
    if (previewDot) {
      if (this.customAccentHex) {
        previewDot.style.background = this.customAccentHex;
      } else {
        previewDot.style.background = 'linear-gradient(to top right, #f43f5e, #fbbf24, #6366f1)';
      }
    }

    // 2. Font highlights
    this.querySelectorAll('.font-select-btn').forEach(btn => {
      btn.classList.remove('border-emerald-500/50', 'bg-white/5', 'ring-1', 'ring-emerald-500/25', 'border-neutral-400', 'bg-neutral-100', 'ring-2', 'ring-neutral-400/20');
      btn.classList.add('border-white/5', 'bg-black/30');

      const fontName = (btn as HTMLElement).dataset.font;
      if (fontName === this.activeFont) {
        btn.classList.remove('border-white/5', 'bg-black/30');
        if (this.activeTheme === 'minimalist') {
          btn.classList.add('border-neutral-400', 'bg-neutral-100', 'ring-2', 'ring-neutral-400/20');
        } else {
          btn.classList.add('border-emerald-500/50', 'bg-white/5', 'ring-1', 'ring-emerald-500/25');
        }
      }
    });
  }

  private loadPresetVault(type: 'neotokyo' | 'cybercity' | 'blueprint' | 'characters' | 'all') {
    localStorage.removeItem('visual_vaults_cleaned');
    const allMocks = defaultMockAssets();
    let loaded: Asset[] = [];
    let boardToSelect = 'ALL';

    if (type === 'neotokyo') {
      loaded = allMocks.filter(a => a.board === '/ Environment_Ref/Neo_Tokyo');
      boardToSelect = '/ Environment_Ref/Neo_Tokyo';
      this.addLog('success', 'Tauri local mount: Loaded Neo-Tokyo Architecture database (6 Assets indexed).');
      this.toast('Vault Mounted', 'Synced database cache to Neo-Tokyo vault folder.');
    } else if (type === 'cybercity') {
      loaded = allMocks.filter(a => a.board === '/ Cyberpunk_City');
      boardToSelect = '/ Cyberpunk_City';
      this.addLog('success', 'Tauri local mount: Mounted Cyberpunk Grid folder (2 Assets indexed).');
      this.toast('Vault Mounted', 'Synced database cache to Cyberpunk City vault folder.');
    } else if (type === 'blueprint') {
      loaded = allMocks.filter(a => a.board === '/ Mech_Technical');
      boardToSelect = '/ Mech_Technical';
      this.addLog('success', 'Tauri local mount: Mounted Mech Blueprints vault (2 Assets indexed).');
      this.toast('Vault Mounted', 'Synced database cache to Mech Technical folder.');
    } else if (type === 'characters') {
      loaded = allMocks.filter(a => a.board === '/ Character_Design');
      boardToSelect = '/ Character_Design';
      this.addLog('success', 'Tauri local mount: Mounted Character Concepts folder (2 Assets indexed).');
      this.toast('Vault Mounted', 'Synced database cache to Character Design folder.');
    } else {
      loaded = allMocks;
      boardToSelect = 'ALL';
      this.addLog('success', 'Tauri local mount: Fully synchronised all 4 companion vaults (12 Assets indexed).');
      this.toast('Database Re-synced', 'Mounted visual vaults successfully.');
    }

    this.assets = loaded;
    this.selectedBoard = boardToSelect;
    if (this.assets.length > 0) {
      this.selectedAssetId = this.assets[0].id;
    } else {
      this.selectedAssetId = '';
    }

    storage.saveAllAssets(this.assets);
    this.updateLayout();
    this.toggleSettings(false); // Close settings panel
  }

  private switchSettingsTab(tab: 'vault' | 'general' | 'taxonomy') {
    this.activeSettingsTab = tab;
    const tabVault = this.querySelector('#settings-tab-vault');
    const tabGeneral = this.querySelector('#settings-tab-general');
    const tabTaxonomy = this.querySelector('#settings-tab-taxonomy');
    const contentVault = this.querySelector('#settings-content-vault');
    const contentGeneral = this.querySelector('#settings-content-general');
    const contentTaxonomy = this.querySelector('#settings-content-taxonomy');

    if (!tabVault || !tabGeneral || !tabTaxonomy || !contentVault || !contentGeneral || !contentTaxonomy) return;

    const activeClass = "py-3 px-4 border-b-2 text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 focus:outline-none text-emerald-400 border-emerald-500 bg-white/[0.02]";
    const inactiveClass = "py-3 px-4 border-b-2 text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 focus:outline-none text-slate-500 border-transparent hover:text-slate-300";

    tabVault.className = inactiveClass;
    tabGeneral.className = inactiveClass;
    tabTaxonomy.className = inactiveClass;
    contentVault.classList.add('hidden');
    contentGeneral.classList.add('hidden');
    contentTaxonomy.classList.add('hidden');

    if (tab === 'vault') {
      tabVault.className = activeClass;
      contentVault.classList.remove('hidden');
    } else if (tab === 'general') {
      tabGeneral.className = activeClass;
      contentGeneral.classList.remove('hidden');
      this.populateSchemaSettingsInputs();
    } else if (tab === 'taxonomy') {
      tabTaxonomy.className = activeClass;
      contentTaxonomy.classList.remove('hidden');
      this.populateTaxonomySettings();
    }
  }

  private populateTaxonomySettings() {
    const editor = this.querySelector('#taxonomy-settings-editor');
    if (!editor) return;

    const renderCategoryEditor = (
      key: 'medium' | 'eraStyle' | 'source',
      label: string,
      colorClass: string,
      badgeBgClass: string,
      badgeTextClass: string
    ) => {
      const tagsList = TAXONOMY_PRESETS[key];
      const tagsHtml = tagsList.map(tag => `
        <span class="flex items-center gap-1 bg-black/40 border border-white/5 rounded pl-2.5 pr-1.5 py-1 text-xs font-mono text-slate-300 hover:border-white/10 transition select-none group">
          <span>${tag}</span>
          <button class="settings-tax-remove-btn text-slate-500 hover:text-rose-400 font-bold text-[10.5px] p-0.5 cursor-pointer" data-category="${key}" data-tag="${tag}">×</button>
        </span>
      `).join('');

      return `
        <div class="bg-[#0A0A0B]/40 border border-white/5 rounded-xl p-4 space-y-3 text-left">
          <div class="flex justify-between items-center select-none">
            <span class="text-[10px] uppercase tracking-wider font-extrabold ${colorClass}">${label}</span>
            <span class="text-[9px] text-slate-500 font-mono">${tagsList.length} tags</span>
          </div>
          <div class="flex flex-wrap gap-1.5">
            ${tagsHtml || '<span class="text-xs text-slate-600 italic font-mono pl-1">No tags configured</span>'}
          </div>
          
          <div class="flex gap-2 pt-1">
            <input type="text" id="add-tax-${key}-input" placeholder="Add new tag to ${key}..." 
              class="flex-grow bg-[#050506]/60 border border-white/5 rounded px-2.5 py-1.5 text-xs text-white outline-none focus:border-emerald-500/20 font-mono placeholder-slate-700" />
            <button class="settings-tax-add-btn bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded text-xs font-mono font-bold transition uppercase cursor-pointer" data-category="${key}">
              + Add
            </button>
          </div>
        </div>
      `;
    };

    editor.innerHTML = `
      ${renderCategoryEditor('medium', '🖼️ Mediums (Asset Format)', 'text-blue-400', 'bg-blue-500/10', 'text-blue-400')}
      ${renderCategoryEditor('eraStyle', '🎨 Era & Styles (Visual Movements)', 'text-purple-400', 'bg-purple-500/10', 'text-purple-400')}
      ${renderCategoryEditor('source', '🌐 Sources (Attribution Platforms)', 'text-amber-400', 'bg-amber-500/10', 'text-amber-400')}
    `;

    // Bind event listeners for removal
    const removeBtns = this.querySelectorAll('.settings-tax-remove-btn');
    removeBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const target = e.currentTarget as HTMLElement;
        const category = target.dataset.category as 'medium' | 'eraStyle' | 'source';
        const tag = target.dataset.tag || '';
        
        const index = TAXONOMY_PRESETS[category].indexOf(tag);
        if (index !== -1) {
          TAXONOMY_PRESETS[category].splice(index, 1);
          saveTaxonomyToStorage();
          this.populateTaxonomySettings();
          
          // Re-render other parts of the UI that rely on taxonomy
          this.renderTaxonomyNavigation();
          this.renderInspector();
          this.populateLightboxData();
          this.addLog('warn', `Removed taxonomy tag '${tag}' from '${category}'`);
          this.toast('Taxonomy Updated', `Removed '${tag}'`);
        }
      });
    });

    // Bind add triggers
    const addBtns = this.querySelectorAll('.settings-tax-add-btn');
    addBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const target = e.currentTarget as HTMLElement;
        const category = target.dataset.category as 'medium' | 'eraStyle' | 'source';
        const input = this.querySelector(`#add-tax-${category}-input`) as HTMLInputElement;
        if (!input) return;

        const val = input.value.trim();
        if (!val) return;

        // Check duplicates
        if (TAXONOMY_PRESETS[category].map(t => t.toLowerCase().trim()).includes(val.toLowerCase().trim())) {
          this.toast('Duplicate Tag', `Tag '${val}' already exists in ${category}`);
          return;
        }

        TAXONOMY_PRESETS[category].push(val);
        saveTaxonomyToStorage();
        input.value = '';
        this.populateTaxonomySettings();
        
        // Re-render UI
        this.renderTaxonomyNavigation();
        this.renderInspector();
        this.populateLightboxData();
        this.addLog('success', `Added taxonomy tag '${val}' to '${category}'`);
        this.toast('Taxonomy Updated', `Added '${val}'`);
      });
    });

    // Bind input Enter key press
    ['medium', 'eraStyle', 'source'].forEach(key => {
      const input = this.querySelector(`#add-tax-${key}-input`) as HTMLInputElement;
      if (input) {
        input.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            const addBtn = this.querySelector(`.settings-tax-add-btn[data-category="${key}"]`) as HTMLElement;
            if (addBtn) addBtn.click();
          }
        });
      }
    });

    // Bind reset trigger
    const resetBtn = this.querySelector('#settings-taxonomy-reset');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (confirm('Reset taxonomy presets to factory defaults? This will restore standard Medium, Era/Style, and Source lists.')) {
          TAXONOMY_PRESETS = {
            medium: ['illustration', 'photo', 'poster', 'signage', 'packaging', 'ad', 'film still'],
            eraStyle: ['Bauhaus', 'Swiss/International', '90s grunge', 'contemporary', 'Minimalist', 'Vaporwave', 'Cyberpunk', 'Retro-Futurism'],
            source: ['Pinterest', 'Are.na', 'Behance', 'Dribbble', 'Instagram', 'Tumblr', 'Web']
          };
          saveTaxonomyToStorage();
          this.populateTaxonomySettings();
          this.renderTaxonomyNavigation();
          this.renderInspector();
          this.populateLightboxData();
          this.addLog('success', 'Reset taxonomy presets to factory defaults.');
          this.toast('Taxonomy Reset', 'Factory default presets restored.');
        }
      });
    }
  }

  private populateSchemaSettingsInputs() {
    const statusesInput = this.querySelector('#schema-statuses-input') as HTMLInputElement | null;
    const labelTitle = this.querySelector('#schema-label-title') as HTMLInputElement | null;
    const labelNotes = this.querySelector('#schema-label-notes') as HTMLInputElement | null;
    const labelArtist = this.querySelector('#schema-label-artist') as HTMLInputElement | null;
    const labelRating = this.querySelector('#schema-label-rating') as HTMLInputElement | null;
    const jsonEditor = this.querySelector('#schema-json-editor') as HTMLTextAreaElement | null;

    if (statusesInput) {
      statusesInput.value = this.schemaConfig.statuses.map(s => `${s.value}:${s.label}`).join(', ');
    }
    if (labelTitle) {
      labelTitle.value = this.schemaConfig.properties.title?.label || '';
    }
    if (labelNotes) {
      labelNotes.value = this.schemaConfig.properties.notes?.label || '';
    }
    if (labelArtist) {
      labelArtist.value = this.schemaConfig.properties.artist?.label || '';
    }
    if (labelRating) {
      labelRating.value = this.schemaConfig.properties.rating?.label || '';
    }
    if (jsonEditor) {
      jsonEditor.value = JSON.stringify(this.schemaConfig, null, 2);
    }
  }

  private handleGlobalKeys = (e: KeyboardEvent) => {
    // If inside text inputs, don't trigger lightbox
    if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
      return;
    }

    if (e.code === 'Space') {
      e.preventDefault();
      this.toggleLightbox();
    } else if (this.isLightboxOpen) {
      if (e.key === 'Escape') {
        this.toggleLightbox();
      } else if (e.key === 'ArrowRight') {
        this.navigateLightbox(1);
      } else if (e.key === 'ArrowLeft') {
        this.navigateLightbox(-1);
      }
    }
  };

  private addLog(type: 'info' | 'success' | 'warn', msg: string) {
    const now = new Date().toLocaleTimeString();
    this.activeLogs.unshift({ time: now, type, msg });
    
    // Keep logs reasonable size
    if (this.activeLogs.length > 20) this.activeLogs.pop();
    this.renderLogs();
    
    // Update active sync count in footer
    const syncCountNode = this.querySelector('#sync-log-indicator');
    if (syncCountNode) {
      syncCountNode.textContent = `Queue: ${this.activeLogs.filter(l => l.type === 'warn').length} pending`;
    }
  }

  private isVaultPathLoaded(vaultPath: string): boolean {
    const vaults = storage.getVaults();
    const vault = vaults.find(v => v.path === vaultPath);
    return vault !== undefined && vault.mounted !== false;
  }

  private hasMountedVault(): boolean {
    if (storage.getVaultPath()) return true;
    const vaults = storage.getVaults();
    return vaults.some(v => v.mounted !== false);
  }

  private isBoardAllowed(board: string): boolean {
    const vaults = storage.getVaults();
    
    // Map board names to companion vault paths
    let requiredVaultPath = '';
    if (board.includes('Neo_Tokyo') || board.includes('Neo-Tokyo')) {
      requiredVaultPath = '/Users/design/Desktop/Neo_Tokyo';
    } else if (board.includes('Cyberpunk_City') || board.includes('Cyberpunk') || board.includes('Cyber_City')) {
      requiredVaultPath = '/Users/projects/Cyberpunk_Grid';
    } else if (board.includes('Mech_Technical') || board.includes('Mech') || board.includes('Weapon')) {
      requiredVaultPath = '/Users/blueprints/Mech_Grid';
    }
    
    if (requiredVaultPath) {
      const v = vaults.find(va => va.path === requiredVaultPath);
      if (!v || v.mounted === false) {
        return false; // This vault/board is unloaded or unmounted, do not show!
      }
    }
    return true;
  }

  private isAssetAllowed(asset: Asset): boolean {
    const assetVaultPath = asset.vaultPath || storage.getVaultPath();
    const activePath = storage.getVaultPath();

    // The currently active vault's assets are always allowed
    if (assetVaultPath === activePath) {
      return true;
    }

    // Default mock vaults are allowed if they are the active vault
    if (assetVaultPath === '/Users/design/Desktop/Ref_Library' ||
        assetVaultPath === '/Users/design/Desktop/Neo_Tokyo' ||
        assetVaultPath === '/Users/projects/Cyberpunk_Grid' ||
        assetVaultPath === '/Users/blueprints/Mech_Grid') {
      return assetVaultPath === activePath;
    }

    const vaults = storage.getVaults();
    const v = vaults.find(va => va.path === assetVaultPath);
    if (!v) {
      return false; // This vault is removed/unregistered, do not show assets!
    }
    if (v.mounted === false) {
      return false; // This vault is unloaded/unmounted, do not show assets!
    }
    if (asset.board && !this.isBoardAllowed(asset.board)) {
      return false;
    }
    return true;
  }

  private loadAssets(activeAssetsOverride?: Asset[]) {
    this.extractionQueue = [];
    this.activeExtractions = 0;
    let rawAssets: Asset[] = [];
    if (this.workspaceMode === 'unified') {
      const vaults = storage.getVaults();
      let combined: Asset[] = [];
      const seenIds = new Set<string>();

      const activePath = storage.getVaultPath();
      const activeAssets = activeAssetsOverride || storage.getAllAssets();
      activeAssets.forEach(a => {
        if (!seenIds.has(a.id)) {
          a.vaultPath = a.vaultPath || activePath;
          seenIds.add(a.id);
          combined.push(a);
        }
      });

      vaults.forEach(v => {
        if (v.path !== activePath) {
          if (v.mounted === false) {
            return; // Skip loading assets from unmounted/unloaded vaults
          }
          try {
            const pathKey = `visual_catalog_db_v3_${v.path.replace(/[^a-zA-Z0-9_]/g, '_')}`;
            const data = localStorage.getItem(pathKey);
            if (data) {
              const loaded = JSON.parse(data) as Asset[];
              loaded.forEach(a => {
                if (!seenIds.has(a.id)) {
                  a.vaultPath = a.vaultPath || v.path;
                  seenIds.add(a.id);
                  combined.push(a);
                }
              });
            }
          } catch (e) {
            console.error('Failed to parse assets for vault ' + v.name, e);
          }
        }
      });
      rawAssets = combined;
    } else {
      rawAssets = activeAssetsOverride || storage.getAllAssets();
    }

    // Filter loaded assets strictly according to the mounted/loaded vaults
    this.assets = rawAssets.filter(a => this.isAssetAllowed(a));
  }

  private getUniqueBoards(): string[] {
    const list = new Set<string>();
    const vaultsToScan = this.workspaceMode === 'unified'
      ? storage.getVaults().filter(v => v.mounted !== false).map(v => v.path)
      : [storage.getVaultPath()].filter(p => this.isVaultPathLoaded(p));

    vaultsToScan.forEach(vaultPath => {
      // Load registered board names from localStorage, scoped specifically to each scanned vault
      try {
        const customKey = `visual_vault_created_boards_list_${vaultPath.replace(/[^a-zA-Z0-9_]/g, '_')}`;
        const customRaw = localStorage.getItem(customKey);
        if (customRaw) {
          const parsed = JSON.parse(customRaw) as string[];
          parsed.forEach(b => {
            if (b && b !== 'ALL' && this.isBoardAllowed(b)) {
              list.add(b);
            }
          });
        } else {
          // Fallback: seed boards only if they contain assets in this vault, or if the vault is the main Reference Library
          const seeds = [
            '/ Environment_Ref/Neo_Tokyo',
            '/ Cyberpunk_City',
            '/ Mech_Technical',
            '/ Character_Design'
          ];
          const isRefLibrary = vaultPath === '/Users/design/Desktop/Ref_Library';
          seeds.forEach(s => {
            const hasAsset = this.assets.some(a => a.board === s);
            if ((isRefLibrary && this.isBoardAllowed(s)) || hasAsset) {
              list.add(s);
            }
          });
        }
      } catch (e) {
        console.error(e);
      }
    });

    this.assets.forEach(a => {
      if (a.board && a.board !== 'ALL' && this.isBoardAllowed(a.board)) {
        list.add(a.board);
      }
    });

    // Automatically incorporate 1st Lvl (root of vault) directories as parent boards
    const allUnique = Array.from(list);
    allUnique.forEach(b => {
      const parts = b.replace(/^\/\s*/, '').split('/').filter(Boolean);
      if (parts.length > 1) {
        const isSpace = b.startsWith('/ ');
        const parentPath = (isSpace ? '/ ' : '/') + parts[0];
        list.add(parentPath);
      }
    });

    return Array.from(list).sort();
  }

  private getFilteredAssets(): Asset[] {
    const query = this.searchQuery.toLowerCase().trim();
    let filtered = this.assets.filter(asset => {
      // Board selection filtering (Support clicking All Assets and parent/root boards matching their subfolder assets)
      if (this.selectedBoard !== 'ALL') {
        const isMatch = asset.board === this.selectedBoard;
        if (!isMatch) {
          return false;
        }
      }
      
      // Keywords full-text scanning
      if (query) {
        const matchTitle = asset.name.toLowerCase().includes(query);
        const matchArtist = (asset.metadata.artist || '').toLowerCase().includes(query);
        const matchSystemTags = asset.tags.some(t => t.toLowerCase().includes(query));
        const matchMetaTags = asset.metadata.tags.some(t => t.toLowerCase().includes(query));
        return matchTitle || matchArtist || matchSystemTags || matchMetaTags;
      }
      return true;
    });

    if (this.colorPaletteSearchQuery && this.colorPaletteSearchQuery.length > 0) {
      const queryHsl = getAverageHsl(this.colorPaletteSearchQuery);
      
      // Filter assets that are within the hue tolerance threshold
      filtered = filtered.filter(asset => {
        if (!asset.colors || asset.colors.length === 0) return false;
        const assetHsl = getAverageHsl(asset.colors);
        const dist = getHueDistance(queryHsl.h, assetHsl.h);
        return dist <= this.colorPaletteTolerance;
      });

      // Sort assets by proximity of average hue
      filtered.sort((a, b) => {
        const hslA = getAverageHsl(a.colors);
        const hslB = getAverageHsl(b.colors);
        const distA = getHueDistance(queryHsl.h, hslA.h);
        const distB = getHueDistance(queryHsl.h, hslB.h);
        return distA - distB;
      });
    }

    return filtered;
  }

  private applyTagFilter(tag: string) {
    this.searchQuery = tag;
    const searchInput = this.querySelector('#asset-search') as HTMLInputElement;
    if (searchInput) {
      searchInput.value = tag;
    }
    const clearBtn = this.querySelector('#search-clear-btn');
    if (clearBtn) {
      if (tag) {
        clearBtn.classList.remove('hidden');
      } else {
        clearBtn.classList.add('hidden');
      }
    }
    this.renderCatalog();
    this.renderTaxonomyNavigation();
    this.toast('Filter Applied', `Displaying only assets matching tag #${tag}`);
  }

  private renderTaxonomyNavigation() {
    const taxContainer = this.querySelector('#taxonomy-sidebar-container');
    if (!taxContainer) return;

    const getTagCount = (tag: string) => {
      const lower = tag.toLowerCase().trim();
      return this.assets.filter(a => a.metadata.tags.some(t => t.toLowerCase().trim() === lower)).length;
    };

    const renderCategoryLinks = (label: string, items: string[], textClass: string, bgClass: string, borderClass: string) => {
      const links = items.map(item => {
        const count = getTagCount(item);
        if (count === 0) return '';

        const isCurrentFilter = this.searchQuery.toLowerCase().trim() === item.toLowerCase().trim();
        const activeStyle = isCurrentFilter 
          ? `${textClass} ${bgClass} border-l-2 ${borderClass} font-bold scale-[1.01]`
          : 'text-slate-400 hover:text-white hover:bg-white/[0.015] border-l-2 border-transparent';

        return `
          <div data-tax-tag="${item}" class="taxonomy-link flex items-center justify-between text-[11px] py-1.5 pl-3 pr-2.5 rounded-r cursor-pointer transition-all duration-200 ${activeStyle}">
            <span class="truncate font-mono">${item}</span>
            <span class="text-[8.5px] font-mono opacity-55 bg-black/40 px-1.5 py-0.5 rounded border border-white/5">${count}</span>
          </div>
        `;
      }).join('');

      if (!links) return '';

      return `
        <div class="space-y-1">
          <span class="text-[9px] font-bold uppercase tracking-widest pl-2 block ${textClass}">${label}</span>
          <div class="space-y-0.5">${links}</div>
        </div>
      `;
    };

    const mediumsHtml = renderCategoryLinks('🖼️ Mediums', TAXONOMY_PRESETS.medium, 'text-blue-400', 'bg-blue-500/10', 'border-blue-500');
    const erasHtml = renderCategoryLinks('🎨 Style Eras', TAXONOMY_PRESETS.eraStyle, 'text-purple-400', 'bg-purple-500/10', 'border-purple-500');
    const sourcesHtml = renderCategoryLinks('🌐 Sources', TAXONOMY_PRESETS.source, 'text-amber-400', 'bg-amber-500/10', 'border-amber-500');

    if (!mediumsHtml && !erasHtml && !sourcesHtml) {
      taxContainer.innerHTML = '';
      return;
    }

    taxContainer.innerHTML = `
      <h3 class="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2 pl-2 cursor-default">Taxonomy Index</h3>
      <div class="space-y-3">
        ${mediumsHtml}
        ${erasHtml}
        ${sourcesHtml}
      </div>
    `;

    // Bind click events
    const taxLinks = this.querySelectorAll('.taxonomy-link');
    taxLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const tag = (e.currentTarget as HTMLElement).dataset.taxTag || '';
        this.applyTagFilter(tag);
        this.renderTaxonomyNavigation();
      });
    });
  }

  // ----------------------------------------------------
  // Dynamic Web Rendering Engine
  // ----------------------------------------------------
  private renderShell() {
    this.innerHTML = `
      <!-- Toast/Alert custom visual notification container -->
      <div id="toast-overlay" class="fixed top-4 right-4 z-50 pointer-events-none flex flex-col gap-2"></div>

      ${this.activeTheme === 'matrix' ? '<div class="matrix-overlay"></div>' : ''}

      <!-- App Frame -->
      <div id="theme-root" class="vault-app-root flex flex-col h-screen w-screen overflow-hidden bg-[#0A0A0B] text-slate-300">
        
        <!-- HEADER MODULE -->
        <header id="vault-header" class="vault-header-bg h-12 border-b border-white/5 bg-[#0F0F11] flex items-center px-4 justify-between shrink-0">
          <div class="flex items-center gap-6">
            <div class="flex items-center gap-2">
              <button id="toggle-sidebar-btn" class="p-1 text-slate-400 hover:text-emerald-400 hover:bg-white/5 rounded transition cursor-pointer active:scale-95 flex items-center justify-center mr-1" title="Toggle Sidebar">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div class="w-6 h-6 rounded flex items-center justify-center cursor-pointer hover:opacity-80 transition select-none" id="action-reset" title="VisualVault logo (click to reset filters)">
                <svg width="24" height="24" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 rounded">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M921.62 102.4C1058.13 238.93 1058.13 785.065 921.62 921.604C785.112 1058.13 238.985 1058.13 102.38 921.604C-34.1268 785.065 -34.1268 238.93 102.38 102.4C238.985 -34.1332 785.112 -34.1332 921.62 102.4Z" fill="var(--accent-primary)"/>
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M368.821 441.361C359.606 432.144 347.107 426.965 334.068 426.965H245.979C232.954 426.965 220.455 421.787 211.226 412.57C202.011 403.354 196.843 390.852 196.843 377.818V291.833C196.843 278.799 202.011 266.298 211.226 257.081C220.455 247.863 232.954 242.686 245.979 242.686H335.328C347.62 242.686 359.453 247.286 368.516 255.58L478.845 356.563C497.621 373.754 526.429 373.754 545.205 356.563L655.534 255.58C664.583 247.286 676.43 242.686 688.707 242.686H778.057C791.096 242.686 803.595 247.863 812.81 257.081C822.025 266.298 827.207 278.799 827.207 291.833V377.818C827.207 390.852 822.025 403.354 812.81 412.57C803.595 421.787 791.096 426.965 778.057 426.965H689.968C676.943 426.965 664.43 432.144 655.215 441.361L546.771 549.807C537.556 559.024 525.057 564.202 512.018 564.202C498.992 564.202 486.494 559.024 477.265 549.807L368.821 441.361ZM368.821 756.478C359.606 747.263 347.107 742.08 334.068 742.08H245.979C232.954 742.08 220.455 736.898 211.226 727.683C202.011 718.468 196.843 705.969 196.843 692.929V606.95C196.843 593.916 202.011 581.414 211.226 572.198C220.455 562.98 232.954 557.803 245.979 557.803H335.328C347.62 557.803 359.453 562.402 368.516 570.697L478.845 671.686C497.621 688.869 526.429 688.869 545.205 671.686L655.534 570.697C664.583 562.402 676.43 557.803 688.707 557.803H778.057C791.096 557.803 803.595 562.98 812.81 572.198C822.025 581.414 827.207 593.916 827.207 606.95V692.929C827.207 705.969 822.025 718.468 812.81 727.683C803.595 736.898 791.096 742.08 778.057 742.08H689.968C676.943 742.08 664.43 747.263 655.215 756.478L546.771 864.924C537.556 874.139 525.057 879.321 512.018 879.321C498.992 879.321 486.494 874.139 477.265 864.924L368.821 756.478ZM425.371 182.788C415.893 173.315 413.066 159.068 418.193 146.691C423.32 134.314 435.389 126.244 448.789 126.244H575.261C588.647 126.244 600.73 134.314 605.857 146.691C610.984 159.068 608.143 173.315 598.679 182.788L546.771 234.689C537.556 243.907 525.057 249.086 512.018 249.086C498.992 249.086 486.494 243.907 477.265 234.689L425.371 182.788Z" fill="#D5D5D5"/>
                </svg>
              </div>
              <span class="font-semibold text-white tracking-tight cursor-default">VisualVault</span>
            </div>
            
            <div class="flex items-center gap-2 text-[11px] text-slate-400 bg-black/40 px-3 py-1 rounded-full border border-white/5 vault-rounded hover:border-white/10 transition">
              <span class="opacity-50 font-sans">Vault Path:</span>
              <input type="text" id="vault-path-input" value="${storage.getVaultPath()}" 
                class="bg-transparent border-none text-slate-300 outline-none w-44 font-mono focus:text-emerald-400 text-[10px]" title="Click to edit absolute vault reference path" />
              <button id="open-vaults-manager-btn" class="text-[10px] bg-emerald-500/15 hover:bg-emerald-500/35 text-emerald-400 px-2.5 py-0.5 rounded-full transition font-semibold flex items-center gap-1 cursor-pointer active:scale-95 border border-emerald-500/15">
                <svg class="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                </svg>
                Load Vaults
              </button>
            </div>
          </div>

          <!-- Quick search and Sync Banner -->
          <div class="flex items-center gap-4 text-xs">
            <div class="relative flex items-center bg-black/30 border border-white/5 rounded-md px-2.5 py-1.5 w-64 focus-within:border-emerald-500/30 transition vault-rounded">
              <svg class="w-3.5 h-3.5 opacity-50 text-slate-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              <input type="text" id="asset-search" placeholder="Filter references, artists, tags..." 
                class="bg-transparent w-full text-xs text-white outline-none placeholder-slate-600" />
              <button id="search-clear-btn" class="hidden text-slate-500 hover:text-white px-1">×</button>
            </div>

            <div class="flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded border border-emerald-500/20 vault-rounded">
              <span class="relative flex h-2 w-2">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span class="font-mono text-[10px]">SQLite Sync: Active</span>
            </div>
          </div>
        </header>

        <!-- CONTAINER BODY -->
        <main class="flex-grow h-0 flex overflow-hidden">
          
          <!-- LEFT SIDEBAR -->
          <aside class="vault-sidebar-bg w-60 bg-[#0F0F11] border-r border-white/5 flex flex-col shrink-0 transition-sidebar ${this.isSidebarClosed ? 'sidebar-collapsed' : ''}">
            <div id="sidebar-lists" class="p-4 flex-1 overflow-y-auto custom-scrollbar space-y-5">
              
              <!-- Workspace Perspective Mode -->
              <div class="space-y-2 pb-3 border-b border-white/5 relative group">
                <div class="flex items-center justify-between cursor-help" title="Hover for more information">
                  <h3 class="text-[10px] uppercase tracking-widest text-emerald-400 font-extrabold font-mono">Workspace View Mode</h3>
                  <span class="text-[9px] px-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded font-bold font-mono">CORE</span>
                </div>
                <div class="grid grid-cols-2 gap-1 bg-black/40 p-0.5 rounded border border-white/5 vault-rounded">
                  <button id="view-mode-focused" class="py-1 px-1 rounded text-[10px] text-center font-bold font-mono cursor-pointer transition select-none ${this.workspaceMode === 'focused' ? 'bg-emerald-500 text-black shadow-lg font-extrabold' : 'text-slate-400 hover:text-white hover:bg-white/5 font-semibold'}" title="Focused Solitude (Profile 2): Only loads active project assets. Simple and distraction-free workspace.">
                    Focused
                  </button>
                  <button id="view-mode-unified" class="py-1 px-1 rounded text-[10px] text-center font-bold font-mono cursor-pointer transition select-none ${this.workspaceMode === 'unified' ? 'bg-emerald-500 text-black shadow-lg font-extrabold' : 'text-slate-400 hover:text-white hover:bg-white/5 font-semibold'}" title="Unified Arena (Profile 1): Combines all directories collectively. Browse and filter everything together.">
                    Unified
                  </button>
                </div>
                <p id="workspace-mode-desc" class="absolute z-50 left-0 top-full mt-2 w-full bg-slate-900 border border-white/10 text-slate-300 p-2.5 rounded shadow-xl text-[10px] italic leading-relaxed select-none font-mono tracking-tight opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all pointer-events-none">
                  ${this.workspaceMode === 'focused' 
                    ? '● Focused Solitude: Isolating project reference directories.' 
                    : '● Unified Arena: Intercepting and merging all Visual Vaults.'}
                </p>
              </div>

              <!-- System lists navigation -->
              <div class="space-y-1">
                <h3 class="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2 cursor-default">Library</h3>
                
                <div id="nav-all-assets" class="flex items-center gap-2.5 p-2 rounded text-sm cursor-pointer transition hover:bg-white/5 text-slate-400">
                  <svg class="w-4 h-4 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
                  </svg>
                  <span>All Vault References</span>
                  <span id="all-assets-count" class="ml-auto text-[10px] bg-white/5 px-1.5 py-0.5 rounded text-slate-400">0</span>
                </div>

                <div id="nav-recent" class="flex items-center gap-2.5 p-2 rounded text-sm cursor-pointer transition hover:bg-white/5 text-slate-400">
                  <svg class="w-4 h-4 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span>Recently Indexed</span>
                </div>

                <div id="sidebar-vaults-list-container" class="space-y-1 mt-1.5 pt-2 border-t border-white/5">
                  <!-- Active vaults list is dynamically injected here -->
                </div>
              </div>

              <!-- Boards collection tree navigation -->
              <div class="space-y-1">
                <div class="flex items-center justify-between mb-2 relative group">
                  <h3 class="text-[10px] uppercase tracking-widest text-slate-500 font-bold cursor-help flex items-center gap-1" title="Hover for hierarchy rule">
                    Boards Directory
                    <svg class="w-3 h-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  </h3>
                  <button id="sidebar-add-board-trigger" class="p-1 hover:bg-emerald-500/10 text-emerald-400 hover:text-emerald-300 rounded cursor-pointer transition flex items-center justify-center shrink-0" title="Create New Board">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"></path>
                    </svg>
                  </button>
                  <div id="vault-hierarchy-info-container" class="absolute z-50 left-0 top-full mt-2 w-[220px]"></div>
                </div>
                
                <div id="boards-list-container" class="space-y-1">
                  <!-- Generated board node links are injected here -->
                </div>

                <!-- Create new board section -->
                <div class="pt-3 border-t border-white/5 mt-2">
                  <div class="flex items-center gap-1.5 p-1 bg-black/20 rounded border border-white/5 vault-rounded">
                    <input type="text" id="new-board-name" placeholder="/New_Collection" 
                      class="bg-transparent text-xs text-white placeholder-slate-600 outline-none px-1.5 py-1 w-full font-mono" />
                    <button id="add-board-btn" class="p-1 hover:bg-emerald-500/20 text-emerald-400 hover:text-emerald-300 rounded transition" title="Add empty sub-board">
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"></path>
                      </svg>
                    </button>
                  </div>
                </div>
                
                <!-- Taxonomy Explorer -->
                <div id="taxonomy-sidebar-container" class="space-y-2 pt-3 border-t border-white/5 mt-3 select-none"></div>
                
              </div>



            </div>

            <!-- Load Vaults and Settings + Performance metered footer section -->
            <div class="p-4 border-t border-white/5 shrink-0 bg-[#0A0A0B]/60 space-y-4">
              <!-- Sidebar load vault and settings commands -->
              <div class="space-y-1">
                <div id="nav-load-vaults-btn" class="flex items-center gap-2.5 p-2 rounded text-xs cursor-pointer transition hover:bg-white/5 text-slate-400 font-sans select-none" title="Open the Vaults Sync/Connection Manager">
                  <svg class="w-4 h-4 opacity-70 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                  </svg>
                  <span class="font-medium">Load Vaults</span>
                  <span class="ml-auto text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 px-1.5 py-0.5 rounded font-mono font-bold">MANAGE</span>
                </div>

                <div id="nav-settings-btn" class="flex items-center gap-2.5 p-2 rounded text-xs cursor-pointer transition hover:bg-white/5 text-slate-400 font-sans select-none" title="Open theme and global preferences">
                  <svg class="w-4 h-4 opacity-70 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  <span class="font-medium">Vault Settings</span>
                </div>
              </div>
            </div>
          </aside>

          <!-- CENTRAL MASONRY DISPLAY -->
          <section class="vault-main-content flex-grow bg-[#070708] p-6 overflow-y-auto custom-scrollbar flex flex-col justify-start">
            
            <div id="vault-active-workspace-panel" class="flex flex-col flex-grow">
              
              ${this.needsDirectoryPermission ? `
                <div class="mb-4 bg-amber-500/10 border border-amber-500/20 rounded-lg p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-amber-200 shrink-0">
                  <div class="flex items-center gap-2.5 text-xs text-left">
                    <svg class="w-5 h-5 text-amber-400 shrink-0 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div>
                      <span class="font-bold">Folder Access Required:</span> 
                      The directory <span class="font-mono bg-black/40 px-1 rounded text-amber-400">/${this.pendingPermissionVaultName}</span> is locked due to an app reload. Allow permission to automatically restore full image sync.
                    </div>
                  </div>
                  <button id="btn-grant-directory-permission" class="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs rounded transition active:scale-95 cursor-pointer whitespace-nowrap shadow">
                    Grant Permission &amp; Sync
                  </button>
                </div>
              ` : ''}

              ${this.needsFallbackRelink ? `
                <div class="mb-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-emerald-200 shrink-0">
                  <div class="flex items-center gap-2.5 text-xs text-left">
                    <svg class="w-5 h-5 text-emerald-400 shrink-0 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <span class="font-bold">Restore Vault Preview:</span> 
                      Because this is a secure local connection, you need to re-link your local folder <span class="font-mono bg-black/40 px-1 rounded text-emerald-400">/${this.pendingPermissionVaultName}</span> to load the physical images. All your metadata &amp; ratings are completely safe!
                    </div>
                  </div>
                  <button id="btn-relink-fallback-directory" class="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs rounded transition active:scale-95 cursor-pointer whitespace-nowrap shadow">
                    Re-link Folder &amp; Restore
                  </button>
                </div>
              ` : ''}
              <div class="flex items-center justify-between mb-6 shrink-0 border-b border-white/[0.04] pb-4">
                <div class="space-y-1 text-left">
                  <div class="flex items-center gap-2">
                    <h2 id="board-title-heading" class="text-xl font-semibold text-white tracking-tight">/ Environment_Ref/Neo_Tokyo</h2>
                    <button id="btn-rename-board" class="p-1 px-1.5 text-slate-500 hover:text-emerald-400 rounded hover:bg-white/5 transition inline-flex items-center gap-1 cursor-pointer font-mono text-[9px] font-bold uppercase tracking-wider select-none shrink-0" title="Rename this Folder/Board">
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                      </svg>
                      <span>Rename</span>
                    </button>
                    <button id="btn-delete-active-board" class="p-1 px-1.5 text-slate-500 hover:text-rose-400 rounded hover:bg-white/5 transition inline-flex items-center gap-1 cursor-pointer font-mono text-[9px] font-bold uppercase tracking-wider select-none shrink-0" title="Delete this Folder/Board">
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                      <span>Delete</span>
                    </button>
                  </div>
                  <p id="board-desc" class="text-xs text-slate-500 font-mono">Local subdirectory scan synced inside catalog.db cache</p>
                </div>

                <!-- Core layout size modifiers & import routines -->
                <div class="flex items-center gap-3">
                  <div class="bg-black/30 p-0.5 rounded border border-white/5 flex gap-1 vault-rounded">
                    <button id="size-sm" class="p-1 px-1.5 rounded text-[10px] font-mono hover:text-white hover:bg-white/5 transition text-slate-500 cursor-pointer" title="Dense Density">Dense</button>
                    <button id="size-md" class="p-1 px-1.5 rounded text-[10px] font-mono select-none hover:text-white hover:bg-white/5 transition bg-white/5 text-emerald-400 font-semibold cursor-pointer" title="Medium Density">Standard</button>
                    <button id="size-lg" class="p-1 px-1.5 rounded text-[10px] font-mono hover:text-white hover:bg-white/5 transition text-slate-500 cursor-pointer" title="Large Preview Density">Detailed</button>
                  </div>
                  
                  <!-- Silent file picker -->
                  <input type="file" id="local-file-picker" accept="image/*" class="hidden" multiple />
                  <button id="import-trigger-btn" class="vault-btn px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded text-xs transition cursor-pointer shadow-md inline-flex items-center gap-1.5 active:scale-95">
                    <svg class="w-3.5 h-3.5 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                    </svg>
                    Import Files
                  </button>
                </div>
              </div>

              <!-- Active Color Palette Search Banner -->
              <div id="color-palette-search-banner" class="hidden mb-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3.5 flex items-center justify-between gap-4 text-emerald-200 shrink-0">
                <div class="flex items-center gap-3 text-xs text-left">
                  <div class="flex gap-1 bg-black/40 border border-white/10 p-1 rounded" id="color-palette-banner-colors">
                    <!-- Dynamic swatches -->
                  </div>
                  <div>
                    <span class="font-bold">Palette Matcher Active:</span> 
                    Showing images with an average palette color similar to the selected sample.
                  </div>
                </div>
                <div class="flex items-center gap-3">
                  <div class="flex items-center gap-1.5 bg-black/40 border border-white/5 px-2.5 py-1 rounded text-[11px] font-mono">
                    <span class="opacity-60">Tolerance:</span>
                    <input type="range" id="color-palette-tolerance-slider" min="15" max="120" step="5" value="${this.colorPaletteTolerance}" class="w-16 accent-emerald-500 cursor-pointer h-1" />
                    <span id="color-palette-tolerance-text" class="text-emerald-400 font-bold">${this.colorPaletteTolerance}°</span>
                  </div>
                  <button id="color-palette-clear-btn" class="px-3 py-1 bg-white/5 hover:bg-white/10 text-slate-300 font-semibold text-xs rounded transition active:scale-95 cursor-pointer border border-white/5">
                    Clear Filter
                  </button>
                </div>
              </div>

              <!-- Drag & Drop container area -->
              <div id="drop-zone" class="vault-card border border-dashed border-white/5 hover:border-emerald-500/20 bg-black/10 rounded-lg p-5 flex flex-col items-center justify-center text-center cursor-default shrink-0 group transition mb-4">
                <div class="pointer-events-none text-slate-500 text-xs flex items-center justify-center gap-2 group-hover:text-emerald-400 transition">
                  <svg class="w-4 h-4 stroke-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                  </svg>
                  <span>Drag and drop raw reference assets here to automatically sync metadata and extract swatches</span>
                </div>
              </div>

              <!-- Active Grid/Masonry container with robust animations -->
              <div class="flex-grow">
                <div id="active-board-sections-container" class="mb-6 hidden">
                  <!-- Pinterest-style sections rendered dynamically here -->
                </div>
                <div id="catalog-masonry" class="columns-3 gap-3">
                  <!-- Javascript maps asset elements here -->
                </div>
                <div id="catalog-empty-state" class="hidden flex-col items-center justify-center text-center p-10 py-14 bg-black/15 rounded-2xl border border-dashed border-white/5 max-w-xl mx-auto my-12 vault-card">
                  <div class="w-14 h-14 rounded-full bg-slate-900/65 border border-white/5 flex items-center justify-center mb-4 mx-auto">
                    <svg class="w-7 h-7 text-slate-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                  <div class="text-slate-200 text-sm font-semibold mb-2" id="empty-state-title">This board folder is empty</div>
                  <p class="text-xs text-slate-400 max-w-md mx-auto mb-6 leading-relaxed">
                    There are no visual references loaded in <span class="font-mono text-emerald-400 font-semibold" id="empty-state-board-name"></span>. You can load images by copying them in, dragging-and-dropping them, or using clipboard/manual sync:
                  </p>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-3.5 w-full">
                    <div class="p-3.5 bg-slate-950/40 border border-white/5 rounded-xl text-left space-y-1">
                      <span class="text-xs text-slate-300 font-semibold block">Option 1: Drag &amp; Drop</span>
                      <span class="text-[11px] text-slate-500 block leading-normal">Drag any image files straight from your file manager anywhere into this central view.</span>
                    </div>
                    <div class="p-3.5 bg-slate-950/40 border border-white/5 rounded-xl text-left space-y-1">
                      <span class="text-xs text-slate-300 font-semibold block">Option 2: Copy-Paste File</span>
                      <span class="text-[11px] text-slate-500 block leading-normal">Copy an image (or file) to clipboard and press <kbd class="px-1.5 py-0.5 bg-black rounded border border-white/10 text-[9px] font-mono">Ctrl+V</kbd> to copy it to this board folder.</span>
                    </div>
                  </div>
                  <div class="mt-7 text-center">
                    <button id="empty-state-pick-btn" class="vault-btn px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded text-xs transition cursor-pointer shadow-md inline-flex items-center gap-1.5 active:scale-95">
                      <svg class="w-4 h-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                      </svg>
                      Simulate Folder Copy (Choose Images)
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Panel for Warning Warning: No Vaults loaded -->
            <div id="vault-unloaded-workspace-panel" class="hidden flex-col items-center justify-center text-center p-8 py-16 bg-black/20 my-auto max-w-xl mx-auto border border-dashed border-white/5 rounded-2xl select-none">
              <div class="w-16 h-16 rounded-full bg-slate-900/65 border border-white/5 flex items-center justify-center mb-5 mx-auto shadow-inner">
                <svg class="w-8 h-8 text-amber-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
              </div>
              <h2 class="text-white text-lg font-bold mb-3 tracking-tight">No Vaults Loaded</h2>
              <p class="text-xs text-slate-400 max-w-md mx-auto mb-6 leading-relaxed font-sans">
                Your Obsidian-style VisualVault database is currently unloaded. There are no connected or mounted directories active in the workspace. Connect a folder or mount an existing catalog.
              </p>
              <div>
                <button id="unloaded-open-vaults-btn" class="vault-btn px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold rounded text-xs transition cursor-pointer shadow-lg active:scale-95 inline-flex items-center gap-1.5 whitespace-nowrap">
                  <svg class="w-4 h-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                  </svg>
                  <span>Open Vaults Manager</span>
                </button>
              </div>
            </div>
            
          </section>

          <!-- RIGHT DETAIL INSPECTOR SIDEBAR (Hidden in favor of the Pinterest popup detail modal) -->
          <aside id="inspector-sidebar" class="vault-sidebar-bg hidden w-72 bg-[#0F0F11] border-l border-white/5 flex flex-col shrink-0">
            <div id="inspector-container" class="p-5 overflow-y-auto custom-scrollbar flex-grow space-y-6">
              <!-- Inline populated via selected asset states -->
            </div>
          </aside>

        </main>

        <!-- FOOTER STATUS STRIP Bar -->
        <footer class="vault-footer h-7 border-t border-white/5 bg-[#0A0A0B] flex items-center px-4 justify-between shrink-0 text-[10.5px] mono text-slate-600">
          <div class="flex items-center gap-4 font-mono select-none">
            <span id="vault-total-count">Vault Index: 0 files</span>
            <span>•</span>
            <span id="sync-log-indicator" class="transition-colors">Queue: 0 pending</span>
          </div>
          <div class="flex items-center gap-2.5 font-mono">
            <span>Tauri v2.0.4-stable</span>
            <span class="text-emerald-500/80 inline-flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              System Ready
            </span>
          </div>
        </footer>

      </div>

      <!-- PINBOARD DETAIL MODAL (PINTEREST WINDOW) -->
      <div id="lightbox-backdrop" class="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-0 hidden select-none transition-all duration-300">
        
        <!-- Modal Card Container -->
        <div class="vault-card bg-[#0F0F11] w-full h-full flex flex-col md:flex-row overflow-hidden shadow-2xl animate-fade-in relative pointer-events-auto">
          
          <!-- Close Button Top Right of card (Pinterest style) -->
          <button id="lightbox-close" class="absolute top-4 right-4 z-20 text-slate-400 hover:text-white bg-black/40 hover:bg-black/80 w-8 h-8 rounded-full flex items-center justify-center transition border border-white/5 cursor-pointer" title="Close Overlay (ESC)">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>

          <!-- Left: Big Media Preview Canvas -->
          <div class="flex-1 bg-[#070708] relative flex flex-col justify-between p-6 border-b md:border-b-0 md:border-r border-white/5 h-[40vh] md:h-full">
            
            <!-- Breadcrumbs in imagery header -->
            <div class="flex items-center gap-2 select-none shrink-0 z-10 text-left">
              <span id="lightbox-badge-board" class="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded text-[10px] uppercase font-mono border border-emerald-500/10 tracking-wide">/ Environment_Ref</span>
              <span id="lightbox-heading-title" class="text-xs text-slate-400 truncate max-w-[200px]">hero_view.png</span>
            </div>

            <!-- Centralized Asset View Stage -->
            <div class="flex-grow flex items-center justify-center relative p-2 h-0 w-full group">
              <!-- Previous navigate arrow -->
              <button id="lightbox-prev" class="absolute left-2 bg-black/50 hover:bg-emerald-500 hover:text-black hover:border-emerald-500 text-slate-300 p-2 text-xs rounded-full border border-white/10 transition shadow-lg z-10 cursor-pointer">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"></path>
                </svg>
              </button>

              <img id="lightbox-img" src="" class="max-h-full max-w-full rounded border border-white/10 shadow-lg object-contain transition-transform duration-300 transform scale-100" />

              <!-- Next navigate arrow -->
              <button id="lightbox-next" class="absolute right-2 bg-black/50 hover:bg-emerald-500 hover:text-black hover:border-emerald-500 text-slate-300 p-2 text-xs rounded-full border border-white/10 transition shadow-lg z-10 cursor-pointer">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
            </div>

            <!-- Technical image parameters footer inside modal -->
            <div class="flex items-center justify-between mt-2 shrink-0 select-none border-t border-white/[0.03] pt-3">
              <div class="flex items-center gap-2 text-[10.5px] font-mono text-slate-500">
                <span id="lightbox-meta-resolution">1920x1080</span>
                <span>•</span>
                <span id="lightbox-meta-size">142 KB</span>
              </div>
              <div id="lightbox-swatches" class="flex gap-1 bg-black/40 border border-white/5 p-1 rounded">
                <!-- Swatches injected on active item change -->
              </div>
            </div>

          </div>

          <!-- Right: Interactive Metadata details sheet (The Pinterest Scroll Panel) -->
          <div class="w-full md:w-[380px] bg-[#0E0E10] flex flex-col h-[48vh] md:h-full overflow-hidden">
            <div id="lightbox-inspector-scroll" class="flex-grow overflow-y-auto custom-scrollbar p-6 space-y-5">
              <!-- Dynamic inspector inner html will be populated here! -->
            </div>
          </div>

        </div>
      </div>

      <!-- BOARD CREATION MODAL OVERLAY -->
      <div id="board-create-backdrop" class="fixed inset-0 bg-black/80 backdrop-blur-md z-[55] flex items-center justify-center p-4 hidden select-none transition-all duration-300">
        <!-- Dialog Card -->
        <div class="vault-card bg-[#0F0F11] border border-white/10 rounded-2xl max-w-sm w-full p-6 flex flex-col gap-4 shadow-2xl relative pointer-events-auto text-left">
          <button id="board-create-close" class="absolute top-4 right-4 text-slate-400 hover:text-white bg-black/40 hover:bg-black/80 w-6 h-6 rounded-full flex items-center justify-center transition border border-white/5 cursor-pointer">
            <svg class="w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
          
          <div class="space-y-1">
            <h3 class="text-sm font-semibold text-white tracking-tight flex items-center gap-1.5">
              <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
              </svg>
              <span>Create New Board</span>
            </h3>
            <p class="text-[10px] text-slate-500 font-mono">Will create an empty workspace catalog board.</p>
          </div>

          <div class="space-y-2">
            <label class="text-[9px] uppercase tracking-wider text-slate-500 font-mono">Collection Path Name</label>
            <input type="text" id="modal-board-name" placeholder="/Environment_Ref/SciFi_Outpost" 
              class="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-white outline-none focus:border-emerald-500/40 transition placeholder-slate-700" />
          </div>

          <div class="flex gap-2 justify-end pt-2">
            <button id="modal-board-cancel" class="px-3 py-1.5 hover:bg-white/5 text-slate-400 text-xs rounded transition font-medium cursor-pointer">
              Cancel
            </button>
            <button id="modal-board-submit" class="vault-btn px-4.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-semibold rounded transition active:scale-95 cursor-pointer">
              Create Board
            </button>
          </div>
        </div>
      </div>

      <!-- OBSIDIAN VAULT MANAGER OVERLAY -->
      <div id="vault-manager-backdrop" class="fixed inset-0 bg-black/80 backdrop-blur-md z-[55] flex items-center justify-center p-4 md:p-8 hidden select-none transition-all duration-300">
        <!-- Vault Manager Card -->
        <div class="vault-card bg-[#0F0F11] border border-white/10 rounded-2xl max-w-4xl w-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl relative pointer-events-auto">
          
          <!-- Close Button -->
          <button id="vault-manager-close" class="absolute top-4 right-4 z-20 text-slate-400 hover:text-white bg-black/40 hover:bg-black/80 w-8 h-8 rounded-full flex items-center justify-center transition border border-white/5 cursor-pointer">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>

          <!-- Header section -->
          <div class="p-6 pb-4 border-b border-white/[0.04] shrink-0 text-left select-none">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 bg-emerald-500 rounded flex items-center justify-center shrink-0">
                <svg class="w-5 h-5 text-black font-bold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path>
                </svg>
              </div>
              <div>
                <h2 class="text-base font-bold text-white tracking-tight leading-none">Obsidian-Style Vault Manager</h2>
                <p class="text-[10.5px] text-slate-500 mt-1 font-mono">Open, register, or create directories as secure isolated file vaults.</p>
              </div>
            </div>
          </div>

          <!-- Content: Columns -->
          <div class="flex-grow flex flex-col md:flex-row overflow-hidden min-h-0 text-left">
            <!-- Left Column: Vault List -->
            <div class="w-full md:w-3/5 p-6 border-r border-white/[0.04] flex flex-col overflow-y-auto custom-scrollbar">
              <div class="flex items-center justify-between mb-4">
                <span class="text-[10px] uppercase tracking-widest text-emerald-400 font-bold font-mono">My Registered Vaults</span>
                <span class="text-[10px] text-slate-500 font-mono" id="vault-manager-count-label">4 vaults found</span>
              </div>
              
              <div class="space-y-3" id="vault-manager-list-container">
                <!-- Dynamically populated list of vaults -->
              </div>
            </div>

            <!-- Right Column: Operations -->
            <div class="w-full md:w-2/5 p-6 bg-black/20 flex flex-col gap-6 overflow-y-auto custom-scrollbar">


              <!-- Operation 3: Modern Web Sandbox Connect -->
              <div class="space-y-3">
                <div class="flex items-center gap-1.5 text-emerald-400">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
                  </svg>
                  <span class="text-[10px] font-bold uppercase tracking-wider font-mono">🌐 Web-Safe Directory Link</span>
                </div>
                <p class="text-[11px] text-slate-500 leading-relaxed font-sans">
                  Directly synchronize a local folder utilizing secure browser APIs. Scan visual references and save companion <strong>Obsidian .md Frontmatter</strong> back to your computer in real-time!
                </p>
                <div class="pt-1 select-none space-y-2">
                  <button id="btn-web-directory-picker" class="vault-btn w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold rounded transition active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 shadow-md">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path>
                    </svg>
                    <span>Connect Local Folder</span>
                  </button>

                  <!-- Brave & Iframe Info Block -->
                  <div class="bg-amber-500/5 hover:bg-amber-500/[0.08] transition duration-200 border border-amber-500/10 rounded-lg p-2.5 mt-2 space-y-1.5 text-left">
                    <div class="flex items-center gap-1.5 text-amber-400">
                      <svg class="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                      </svg>
                      <span class="text-[9.5px] font-bold uppercase tracking-wider font-mono">Brave & Iframe Security Lock</span>
                    </div>
                    <p class="text-[10px] text-amber-500/80 leading-relaxed font-sans">
                      By default, Chromium (including <strong>Brave</strong>) blocks the File System Access API inside sandboxed cross-origin pre-rendering iframes (like this preview panel).
                    </p>
                    <div class="text-[9.5px] text-slate-400 space-y-1 pt-1.5 border-t border-white/[0.03] font-sans">
                      <div class="flex items-start gap-1">
                        <span class="text-amber-400 font-bold">•</span>
                        <span><strong>Solution 1 (Recommended):</strong> Click the <strong>"Open in New Tab"</strong> button in the very top-right of your AI Studio/IDE window. In a full, top-level browser window, local folder synchronization works instantly!</span>
                      </div>
                      <div class="flex items-start gap-1">
                        <span class="text-amber-400 font-bold">•</span>
                        <span><strong>Solution 2 (Brave Shields):</strong> If you are already in a top-level tab and Brave rejects it, click the red <strong>Lion logo (Brave Shields)</strong> in your URL bar and toggle shields <strong>"OFF"</strong> for this site, or allow File System Access in site settings.</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Modals footer -->
          <div class="p-4 bg-black/40 border-t border-white/[0.04] text-right shrink-0">
            <button id="vault-manager-close-footer" class="vault-btn px-4 py-1.5 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 text-slate-300 rounded text-xs font-semibold uppercase transition tracking-wider cursor-pointer">
              Cancel &amp; Close Workspace
            </button>
          </div>

        </div>
      </div>

      <!-- SETTINGS MODAL OVERLAY -->
      <div id="settings-backdrop" class="fixed inset-0 bg-black/80 backdrop-blur-md z-[55] flex items-center justify-center p-4 md:p-8 hidden select-none transition-all duration-300">
        <!-- Settings Card -->
        <div class="vault-card bg-[#0F0F11] border border-white/10 rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl relative pointer-events-auto">
          
          <!-- Close Button -->
          <button id="settings-close" class="absolute top-4 right-4 z-20 text-slate-400 hover:text-white bg-black/40 hover:bg-black/80 w-8 h-8 rounded-full flex items-center justify-center transition border border-white/5 cursor-pointer">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>

          <!-- Settings Header -->
          <div class="p-6 border-b border-white/5 select-none text-left">
            <h3 class="text-lg font-semibold text-white tracking-tight flex items-center gap-2">
              <svg class="w-5 h-5 text-emerald-400 vault-accent-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              <span>VisualVault Control Center</span>
            </h3>
            <p class="text-xs text-slate-500 font-mono mt-0.5">Tauri Core Engine & Database Management Interface</p>
          </div>

          <!-- Settings Tab Switchers -->
          <div class="flex border-b border-white/[0.04] px-6 select-none bg-black/10 gap-2 shrink-0">
            <button id="settings-tab-vault" class="py-3 px-4 border-b-2 text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 focus:outline-none text-emerald-400 border-emerald-500 bg-white/[0.02]">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path>
              </svg>
              <span>📁 Local selected vaults</span>
            </button>
            <button id="settings-tab-general" class="py-3 px-4 border-b-2 text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 focus:outline-none text-slate-500 border-transparent hover:text-slate-300">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
              </svg>
              <span>⚙️ General app settings</span>
            </button>
            <button id="settings-tab-taxonomy" class="py-3 px-4 border-b-2 text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 focus:outline-none text-slate-500 border-transparent hover:text-slate-300">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              <span>🏷️ Taxonomy settings</span>
            </button>
          </div>

          <!-- Settings Scrollable Body -->
          <div class="flex-grow overflow-y-auto custom-scrollbar p-6 text-left">
            
            <!-- TAB 1: LOCAL SELECTED VAULTS SETTINGS -->
            <div id="settings-content-vault" class="space-y-6">
              <!-- App Version Section -->
              <div class="space-y-4">
                <label class="text-[10px] uppercase tracking-widest text-slate-500 font-bold cursor-default font-mono">Engine System Diagnostics</label>
                <div class="grid grid-cols-2 gap-4">
                  <div class="bg-black/30 border border-white/5 p-3 rounded-lg flex flex-col font-mono text-[11px] space-y-1">
                    <span class="text-slate-500 text-[10px]">Tauri Client Version</span>
                    <span class="text-white font-semibold">v2.0.4 - stable</span>
                  </div>
                  <div class="bg-black/30 border border-white/5 p-3 rounded-lg flex flex-col font-mono text-[11px] space-y-1">
                    <span class="text-slate-500 text-[10px]">SQLite Database Sync</span>
                    <span class="text-emerald-400 font-semibold vault-accent-text">Active (catalog.db)</span>
                  </div>
                  <div class="bg-black/30 border border-white/5 p-3 rounded-lg flex flex-col font-mono text-[11px] space-y-1">
                    <span class="text-slate-500 text-[10px]">Obsidian API Companion</span>
                    <span class="text-white">Enabled (v1.5 companion)</span>
                  </div>
                  <div class="bg-black/30 border border-white/5 p-3 rounded-lg flex flex-col font-mono text-[11px] space-y-1">
                    <span class="text-slate-500 text-[10px]">Indexed Vault Memory</span>
                    <span class="text-white" id="settings-files-indexed">0 files indexed</span>
                  </div>
                </div>

                <!-- Performance metadata meter matching elegant dark theme styling -->
                <div class="bg-black/40 rounded p-3 text-[10px] font-mono text-slate-500 space-y-1.5 vault-rounded border border-white/5 mt-4">
                  <div class="flex justify-between font-mono">
                    <span>DB Indexer</span>
                    <span id="cpu-val-text" class="text-emerald-500 font-bold">1.2%</span>
                  </div>
                  <div class="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                    <div id="cpu-bar-fill" class="bg-emerald-500 h-full transition-all duration-1000 shadow-[0_0_8px_rgba(16,185,129,0.5)]" style="width: 12%"></div>
                  </div>
                  <div class="flex justify-between text-[9px] text-slate-600 pt-1 uppercase tracking-wider font-bold">
                    <span>SQLite pool: Idle</span>
                    <span>60 FPS Active</span>
                  </div>
                </div>
              </div>

              <!-- Clean / Wipe active catalog -->
              <div class="space-y-3 p-4 rounded-xl border border-rose-500/10 bg-rose-500/5 mt-6">
                <div class="flex items-center gap-1.5 text-rose-400">
                  <svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                  <span class="text-[10px] font-bold uppercase tracking-wider font-mono">Wipe Sample Databases &amp; Assets</span>
                </div>
                <p class="text-[11px] text-rose-500/80 leading-relaxed font-sans">
                  Instantly empty the simulated metadata catalog database, deleting all preset samples, boards, and thumbnail mappings. This clears local storage caches and allows your custom connected directory vaults to load cleanly without demo content.
                </p>
                <div class="pt-1.5">
                  <button id="btn-wipe-sample-vaults" class="px-4 py-2 bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white font-semibold rounded text-xs transition active:scale-95 cursor-pointer inline-flex items-center gap-1.5 shadow-md">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                    </svg>
                    <span>Clean Sample Vault Database</span>
                  </button>
                </div>
              </div>

              <!-- Activity Log Section -->
              <div class="space-y-3 pt-6 border-t border-white/[0.04]">
                <div class="flex items-center justify-between">
                  <label class="text-[10px] uppercase tracking-widest text-emerald-400 font-bold cursor-default font-mono">Activity Log</label>
                  <div class="flex items-center gap-1 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span class="text-[8px] text-emerald-400 uppercase font-mono tracking-wider font-bold">Monitor</span>
                  </div>
                </div>
                <p class="text-xs text-slate-500 leading-relaxed font-sans">
                  Real-time transaction log monitoring Tauri index tasks, Obsidian YAML dual-sync triggers, and SQLite database catalog caches.
                </p>
                <div id="sqlite-activity-logs-modal" class="bg-black/40 rounded-xl border border-white/5 p-3.5 font-mono text-[9px] text-[#A7F3D0] h-32 overflow-y-auto custom-scrollbar space-y-1.5 vault-rounded transition-all duration-300 backdrop-blur-xs shadow-inner">
                  <!-- Log entries go here dynamically -->
                </div>
              </div>
            </div>

            <!-- TAB 2: GENERAL APP SETTINGS -->
            <div id="settings-content-general" class="space-y-6 hidden">
              <!-- Visual Themes Theme-Switcher -->
              <div class="space-y-3">
                <label class="text-[10px] uppercase tracking-widest text-slate-500 font-bold cursor-default font-mono">Aesthetic UI Theme Engine</label>
                <p class="text-xs text-slate-500 leading-relaxed font-sans">Instantly skin the client architecture to match various digital workspace workflows.</p>
                
                <div class="grid grid-cols-3 gap-3 pt-1">
                  <!-- Theme Button 1: Default -->
                  <button id="theme-btn-default" class="theme-select-btn relative flex flex-col text-left p-3.5 rounded-lg border bg-[#0A0A0B] border-emerald-500/30 font-semibold cursor-pointer transition hover:scale-[1.02] overflow-hidden">
                    <div class="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-400" id="theme-bullet-default"></div>
                    <span class="text-xs text-white">Default</span>
                    <span class="text-[10px] text-slate-500 font-normal font-mono mt-1">Obsidian Dark</span>
                  </button>

                  <!-- Theme Button 2: Notion Minimalist -->
                  <button id="theme-btn-minimalist" class="theme-select-btn relative flex flex-col text-left p-3.5 rounded-lg border bg-[#F7F7F5] border-neutral-300 font-semibold cursor-pointer transition hover:scale-[1.02] overflow-hidden">
                    <div class="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#2383E2] hidden" id="theme-bullet-minimalist"></div>
                    <span class="text-xs text-[#37352F] font-sans">Minimalist</span>
                    <span class="text-[10px] text-[#787774] font-normal font-mono mt-1">Off-White</span>
                  </button>

                  <!-- Theme Button 3: Matrix CRT -->
                  <button id="theme-btn-matrix" class="theme-select-btn relative flex flex-col text-left p-3.5 rounded-lg border bg-[#000000] border-[#00FF41]/45 font-semibold cursor-pointer transition hover:scale-[1.02] overflow-hidden font-mono">
                    <div class="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#00FF41] hidden" id="theme-bullet-matrix"></div>
                    <span class="text-xs text-[#00FF41] font-bold">Matrix</span>
                    <span class="text-[10px] text-[#00FF41]/60 font-normal mt-1">Retro Terminal</span>
                  </button>
                </div>
              </div>

              <!-- Dynamic Accent Color customizer -->
              <div class="space-y-3 pt-6 border-t border-white/[0.04]">
                <label class="text-[10px] uppercase tracking-widest text-slate-500 font-bold cursor-default font-mono">Aesthetic Accent Color</label>
                <p class="text-xs text-slate-500 leading-relaxed font-sans">Pick an interface accent color for folders, active buttons, ratings, and highlights.</p>
                
                <div class="flex flex-wrap gap-2 pt-1" id="accent-colors-container">
                  <!-- Color pill 0: Brand Royal -->
                  <button data-accent="brand" class="accent-select-btn relative flex items-center gap-1.5 p-2 px-3 rounded-md border border-white/5 hover:border-white/10 text-xs text-slate-300 cursor-pointer font-semibold bg-black/30 transition">
                    <span class="w-3.5 h-3.5 rounded-full bg-[#6B5AFF] flex shrink-0"></span>
                    <span>Brand Royal</span>
                  </button>

                  <!-- Color pill 1: Emerald -->
                  <button data-accent="emerald" class="accent-select-btn relative flex items-center gap-1.5 p-2 px-3 rounded-md border border-white/5 hover:border-white/10 text-xs text-slate-300 cursor-pointer font-semibold bg-black/30 transition">
                    <span class="w-3.5 h-3.5 rounded-full bg-[#10B981] flex shrink-0"></span>
                    <span>Emerald</span>
                  </button>
                  
                  <!-- Color pill 2: Purple -->
                  <button data-accent="purple" class="accent-select-btn relative flex items-center gap-1.5 p-2 px-3 rounded-md border border-white/5 hover:border-white/10 text-xs text-slate-300 cursor-pointer font-semibold bg-black/30 transition">
                    <span class="w-3.5 h-3.5 rounded-full bg-[#7F6DF2] flex shrink-0"></span>
                    <span>Obsidian Purple</span>
                  </button>

                  <!-- Color pill 3: Blue -->
                  <button data-accent="blue" class="accent-select-btn relative flex items-center gap-1.5 p-2 px-3 rounded-md border border-white/5 hover:border-white/10 text-xs text-slate-300 cursor-pointer font-semibold bg-black/30 transition">
                    <span class="w-3.5 h-3.5 rounded-full bg-[#2383E2] flex shrink-0"></span>
                    <span>Blue</span>
                  </button>

                  <!-- Color pill 4: Orange -->
                  <button data-accent="orange" class="accent-select-btn relative flex items-center gap-1.5 p-2 px-3 rounded-md border border-white/5 hover:border-white/10 text-xs text-slate-300 cursor-pointer font-semibold bg-black/30 transition">
                    <span class="w-3.5 h-3.5 rounded-full bg-[#F97316] flex shrink-0"></span>
                    <span>Orange</span>
                  </button>

                  <!-- Color pill 5: Amber -->
                  <button data-accent="amber" class="accent-select-btn relative flex items-center gap-1.5 p-2 px-3 rounded-md border border-white/5 hover:border-white/10 text-xs text-slate-300 cursor-pointer font-semibold bg-black/30 transition">
                    <span class="w-3.5 h-3.5 rounded-full bg-[#F59E0B] flex shrink-0"></span>
                    <span>Amber</span>
                  </button>

                  <!-- Color pill 6: Indigo -->
                  <button data-accent="indigo" class="accent-select-btn relative flex items-center gap-1.5 p-2 px-3 rounded-md border border-white/5 hover:border-white/10 text-xs text-slate-300 cursor-pointer font-semibold bg-black/30 transition">
                    <span class="w-3.5 h-3.5 rounded-full bg-[#6366F1] flex shrink-0"></span>
                    <span>Indigo</span>
                  </button>

                  <!-- Color pill 7: Red -->
                  <button data-accent="red" class="accent-select-btn relative flex items-center gap-1.5 p-2 px-3 rounded-md border border-white/5 hover:border-white/10 text-xs text-slate-300 cursor-pointer font-semibold bg-black/30 transition">
                    <span class="w-3.5 h-3.5 rounded-full bg-[#EF4444] flex shrink-0"></span>
                    <span>Ruby</span>
                  </button>

                  <!-- Color pill 8: Pink -->
                  <button data-accent="pink" class="accent-select-btn relative flex items-center gap-1.5 p-2 px-3 rounded-md border border-white/5 hover:border-white/10 text-xs text-slate-300 cursor-pointer font-semibold bg-black/30 transition">
                    <span class="w-3.5 h-3.5 rounded-full bg-[#EC4899] flex shrink-0"></span>
                    <span>Pink</span>
                  </button>

                  <!-- Color pill 9: Custom Customizer Color Wheel Picker -->
                  <button data-accent="custom" id="accent-custom-trigger" class="accent-select-btn relative flex items-center gap-1.5 p-2 px-3 rounded-md border border-white/5 hover:border-white/10 text-xs text-slate-300 cursor-pointer font-semibold bg-black/30 transition">
                    <span class="w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-rose-500 via-amber-400 to-indigo-500 flex shrink-0" id="custom-accent-color-preview"></span>
                    <span>Custom Hex</span>
                  </button>
                </div>

                <!-- Custom hex color-input slider row shown conditionally -->
                <div class="flex items-center gap-3 bg-black/30 p-3 rounded-lg border border-white/5 max-w-md hidden" id="custom-accent-extra-panel">
                  <input type="color" id="custom-accent-color-picker" class="w-8 h-8 rounded border-none bg-transparent cursor-pointer" title="Choose from color spectrum wheel" />
                  <div class="flex-grow">
                    <label class="text-[10px] text-slate-500 font-semibold block font-mono">Custom Accent Hex Code</label>
                    <input type="text" id="custom-accent-hex-input" class="bg-transparent border-none text-xs text-white outline-none font-mono focus:text-[#10B981] w-full" placeholder="#FF5500" value="#FF5500" />
                  </div>
                </div>
              </div>

              <!-- Dynamic System Font Selection -->
              <div class="space-y-3 pt-6 border-t border-white/[0.04]">
                <label class="text-[10px] uppercase tracking-widest text-slate-500 font-bold cursor-default font-mono">System Typeface</label>
                <p class="text-xs text-slate-500 leading-relaxed font-sans">Synchronize Obsidian-like vault catalog using advanced Google Fonts or system typefaces.</p>
                
                <div class="grid grid-cols-2 gap-2.5 pt-1">
                  <!-- Group 1: Google Web Fonts -->
                  <div class="space-y-1.5 col-span-2">
                    <span class="text-[9px] uppercase tracking-widest text-slate-600 font-bold font-mono">Google Web Fonts</span>
                    <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      <button data-font="funnel-display" class="font-select-btn p-2 px-3 rounded border text-left text-xs bg-black/30 border-white/5 text-slate-300 cursor-pointer hover:border-white/10 flex flex-col transition" style="font-family: 'Funnel Display', sans-serif">
                        <span class="font-bold text-white font-sans">Funnel Display</span>
                        <span class="text-[9px] opacity-60">Modern & Expressive Display</span>
                      </button>
                      <button data-font="inter" class="font-select-btn p-2 px-3 rounded border text-left text-xs bg-black/30 border-white/5 text-slate-300 cursor-pointer hover:border-white/10 font-sans flex flex-col transition" style="font-family: 'Inter', sans-serif">
                        <span class="font-bold text-white">Inter Sans</span>
                        <span class="text-[9px] opacity-60">Classic Swiss/UI Sans</span>
                      </button>
                      <button data-font="space-grotesk" class="font-select-btn p-2 px-3 rounded border text-left text-xs bg-black/30 border-white/5 text-slate-300 cursor-pointer hover:border-white/10 flex flex-col transition" style="font-family: 'Space Grotesk', sans-serif">
                        <span class="font-bold text-white">Space Grotesk</span>
                        <span class="text-[9px] opacity-60">Tech/Sci-Fi Display</span>
                      </button>
                      <button data-font="outfit" class="font-select-btn p-2 px-3 rounded border text-left text-xs bg-black/30 border-white/5 text-slate-300 cursor-pointer hover:border-white/10 flex flex-col transition" style="font-family: 'Outfit', sans-serif">
                        <span class="font-bold text-white">Outfit</span>
                        <span class="text-[9px] opacity-60">Geometric / Clean</span>
                      </button>
                      <button data-font="playfair" class="font-select-btn p-2 px-3 rounded border text-left text-xs bg-black/30 border-white/5 text-slate-300 cursor-pointer hover:border-white/10 flex flex-col transition" style="font-family: 'Playfair Display', serif">
                        <span class="font-bold text-white">Playfair Display</span>
                        <span class="text-[9px] opacity-60">Editorial / Serif</span>
                      </button>
                      <button data-font="jetbrains" class="font-select-btn p-2 px-3 rounded border text-left text-xs bg-black/30 border-white/5 text-slate-300 cursor-pointer hover:border-white/10 flex flex-col transition" style="font-family: 'JetBrains Mono', monospace">
                        <span class="font-bold text-white">JetBrains Mono</span>
                        <span class="text-[9px] opacity-60">Developer / Technical</span>
                      </button>
                      <button data-font="space-mono" class="font-select-btn p-2 px-3 rounded border text-left text-xs bg-black/30 border-white/5 text-slate-300 cursor-pointer hover:border-white/10 flex flex-col transition" style="font-family: 'Space Mono', monospace">
                        <span class="font-bold text-white">Space Mono</span>
                        <span class="text-[9px] opacity-60">Retro Sci-Fi Mono</span>
                      </button>
                      <button data-font="lexend" class="font-select-btn p-2 px-3 rounded border text-left text-xs bg-black/30 border-white/5 text-slate-300 cursor-pointer hover:border-white/10 flex flex-col transition" style="font-family: 'Lexend', sans-serif">
                        <span class="font-bold text-white">Lexend Sans</span>
                        <span class="text-[9px] opacity-60">High Legibility / Clean</span>
                      </button>
                      <button data-font="tektur" class="font-select-btn p-2 px-3 rounded border text-left text-xs bg-black/30 border-white/5 text-slate-300 cursor-pointer hover:border-white/10 flex flex-col transition" style="font-family: 'Tektur', sans-serif">
                        <span class="font-bold text-white">Tektur Futuristic</span>
                        <span class="text-[9px] opacity-60">Angular Cyberpunk Sci-Fi</span>
                      </button>
                      <button data-font="ibm-plex-mono" class="font-select-btn p-2 px-3 rounded border text-left text-xs bg-black/30 border-white/5 text-slate-300 cursor-pointer hover:border-white/10 flex flex-col transition" style="font-family: 'IBM Plex Mono', monospace">
                        <span class="font-bold text-white">IBM Plex Mono</span>
                        <span class="text-[9px] opacity-60">Engineering Technical</span>
                      </button>
                    </div>
                  </div>

                  <!-- Group 2: System/Local Typefaces -->
                  <div class="space-y-1.5 col-span-2 pt-1">
                    <span class="text-[9px] uppercase tracking-widest text-slate-600 font-bold font-mono">System Typefaces</span>
                    <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      <button data-font="system" class="font-select-btn p-2 px-3 rounded border text-left text-xs bg-black/30 border-white/5 text-slate-300 cursor-pointer hover:border-white/10 flex flex-col transition" style="font-family: system-ui">
                        <span class="font-bold text-white">System UI Sans</span>
                        <span class="text-[9px] opacity-60">Native OS performance</span>
                      </button>
                      <button data-font="georgia" class="font-select-btn p-2 px-3 rounded border text-left text-xs bg-black/30 border-white/5 text-slate-300 cursor-pointer hover:border-white/10 flex flex-col transition" style="font-family: Georgia, serif">
                        <span class="font-bold text-white">Georgia Serif</span>
                        <span class="text-[9px] opacity-60">High contrast reading</span>
                      </button>
                      <button data-font="courier" class="font-select-btn p-2 px-3 rounded border text-left text-xs bg-black/30 border-white/5 text-slate-300 cursor-pointer hover:border-white/10 flex flex-col transition" style="font-family: 'Courier New', monospace">
                        <span class="font-bold text-white">Courier Classic</span>
                        <span class="text-[9px] opacity-60">Typewriter mechanical</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Dynamic Property & Status Customizer -->
              <div class="space-y-4 pt-6 border-t border-white/[0.04]">
                <label class="text-[10px] uppercase tracking-widest text-[#10B981] font-bold cursor-default font-mono">Custom Schema & Status Configurator</label>
                <p class="text-xs text-slate-500 leading-relaxed font-sans">Customize your asset's status options and metadata field properties below, or export/import them as a JSON configuration file.</p>
                
                <!-- Import/Export buttons -->
                <div class="flex flex-wrap gap-2 pt-1">
                  <!-- Import File trigger -->
                  <label class="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 text-slate-300 rounded text-[10px] font-semibold uppercase tracking-wider cursor-pointer transition flex items-center gap-1.5 select-none text-center">
                    <svg class="w-3.5 h-3.5 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
                    </svg>
                    <span>Import JSON File</span>
                    <input type="file" id="schema-import-file" accept=".json" class="hidden" />
                  </label>
                  
                  <button id="schema-export-btn" class="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 text-slate-300 rounded text-[10px] font-semibold uppercase tracking-wider cursor-pointer transition flex items-center gap-1.5 select-none">
                    <svg class="w-3.5 h-3.5 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                    </svg>
                    <span>Export JSON File</span>
                  </button>
                  
                  <button id="schema-reset-btn" class="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/30 text-red-400 rounded text-[10px] font-semibold uppercase tracking-wider cursor-pointer transition flex items-center gap-1.5 select-none">
                    <span>Reset Defaults</span>
                  </button>
                </div>

                <!-- Custom Statuses comma-separated input or list -->
                <div class="space-y-1.5 pt-1">
                  <div class="flex justify-between items-center">
                    <span class="text-[10px] text-slate-400 font-semibold uppercase tracking-wider font-mono block">Status Options Config</span>
                    <span class="text-[9px] text-slate-500 font-mono">Format: value:label, value2:label2</span>
                  </div>
                  <input type="text" id="schema-statuses-input" class="w-full bg-[#0A0A0B]/40 text-xs px-2.5 py-1.5 rounded border border-white/5 focus:border-[#10B981]/20 text-white outline-none font-mono" placeholder="completed:Completed Reference, in-progress:WIP..." />
                </div>

                <!-- Field Label customizers -->
                <div class="space-y-2 pt-2">
                  <span class="text-[10px] text-slate-400 font-semibold uppercase tracking-wider font-mono block">Modify Field Labels</span>
                  <div class="grid grid-cols-2 gap-2">
                    <div class="space-y-1">
                      <label class="text-[9px] text-slate-500 font-semibold block font-mono">Title Field Label</label>
                      <input type="text" id="schema-label-title" class="bg-[#0A0A0B]/30 w-full text-xs px-2.5 py-1 rounded border border-white/5 focus:border-[#10B981]/20 text-white outline-none" />
                    </div>
                    <div class="space-y-1">
                      <label class="text-[9px] text-slate-500 font-semibold block font-mono">Notes/Description Field Label</label>
                      <input type="text" id="schema-label-notes" class="bg-[#0A0A0B]/30 w-full text-xs px-2.5 py-1 rounded border border-white/5 focus:border-[#10B981]/20 text-white outline-none" />
                    </div>
                    <div class="space-y-1">
                      <label class="text-[9px] text-slate-500 font-semibold block font-mono">Artist Field Label</label>
                      <input type="text" id="schema-label-artist" class="bg-[#0A0A0B]/30 w-full text-xs px-2.5 py-1 rounded border border-white/5 focus:border-[#10B981]/20 text-white outline-none" />
                    </div>
                    <div class="space-y-1">
                      <label class="text-[9px] text-slate-500 font-semibold block font-mono">Rating Field Label</label>
                      <input type="text" id="schema-label-rating" class="bg-[#0A0A0B]/30 w-full text-xs px-2.5 py-1 rounded border border-white/5 focus:border-[#10B981]/20 text-white outline-none" />
                    </div>
                  </div>
                </div>

                <!-- Advanced JSON Code Editor -->
                <div class="space-y-1.5 pt-2">
                  <div class="flex justify-between items-center font-mono">
                    <span class="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Advanced Raw JSON Config</span>
                    <span id="json-val-feedback" class="text-[9px] text-slate-500">Valid Schema</span>
                  </div>
                  <textarea id="schema-json-editor" class="w-full h-36 bg-black font-mono text-[10px] leading-relaxed text-slate-400 p-2.5 rounded border border-white/5 focus:border-[#10B981]/20 focus:text-slate-300 outline-none resize-none transition-all custom-scrollbar flex" spellcheck="false" title="Directly edit the custom schema properties in raw JSON"></textarea>
                </div>
              </div>
            </div>

            <!-- TAB 3: TAXONOMY SETTINGS -->
            <div id="settings-content-taxonomy" class="space-y-6 hidden">
              <div class="space-y-3">
                <div class="flex justify-between items-center select-none">
                  <label class="text-[10px] uppercase tracking-widest text-slate-500 font-bold cursor-default font-mono">Taxonomy Configurator</label>
                  <button id="settings-taxonomy-reset" class="px-2.5 py-1 text-[9.5px] uppercase font-bold tracking-wider font-mono text-amber-500 hover:bg-amber-500/10 border border-amber-500/20 rounded transition duration-200 cursor-pointer">
                    Reset Defaults
                  </button>
                </div>
                <p class="text-xs text-slate-500 leading-relaxed font-sans">
                  Configure preset tags for each of the core taxonomies. Added preset tags will appear immediately as quick-picks in the inspector panel and will populate the side indexing catalog.
                </p>
              </div>

              <div class="grid grid-cols-1 gap-4" id="taxonomy-settings-editor">
                <!-- Dynamically populated in populateTaxonomySettings() -->
              </div>
            </div>

          </div>

          <!-- Settings Footer -->
          <div class="p-4 bg-[#0A0A0B]/60 border-t border-white/5 flex justify-between items-center shrink-0 select-none">
            <div class="text-[11px] text-slate-400 font-mono" id="settings-developer-credits">
              ${new Date().getFullYear()} Developed by <a href="https://90m.io" target="_blank" rel="noopener noreferrer" class="text-emerald-400 hover:text-emerald-300 font-semibold underline transition">90m Studio</a>
            </div>
            <button id="settings-close-action" class="vault-btn px-4 py-1.5 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 text-slate-300 rounded text-xs font-semibold uppercase transition tracking-wider cursor-pointer">
              Apply &amp; Close
            </button>
          </div>

        </div>
      </div>
    `;
  }

  private renderLogs() {
    const sidebarLogs = this.querySelector('#sqlite-activity-logs');
    if (sidebarLogs) {
      sidebarLogs.innerHTML = this.activeLogs.map(log => {
        let colorClass = 'text-slate-400';
        if (log.type === 'success') colorClass = 'text-emerald-400';
        if (log.type === 'warn') colorClass = 'text-amber-500';
        
        return `
          <div class="flex justify-between border-b border-white/[0.02] pb-1 font-mono">
            <span class="opacity-40 text-[8px]">${log.time}</span>
            <span class="${colorClass} truncate pl-2 max-w-[170px] text-[8.5px]">${log.msg}</span>
          </div>
        `;
      }).join('');
    }

    const modalLogs = this.querySelector('#sqlite-activity-logs-modal');
    if (modalLogs) {
      modalLogs.innerHTML = this.activeLogs.map(log => {
        let colorClass = 'text-slate-400';
        if (log.type === 'success') colorClass = 'text-emerald-400';
        if (log.type === 'warn') colorClass = 'text-amber-500';
        
        return `
          <div class="flex justify-between border-b border-white/[0.02] pb-1 font-mono">
            <span class="opacity-40 text-[8px]">${log.time}</span>
            <span class="${colorClass} truncate pl-4 text-[9px]">${log.msg}</span>
          </div>
        `;
      }).join('');
    }
  }

  // ----------------------------------------------------
  // Dynamic Views Synchronization
  // ----------------------------------------------------
  private updateLayout() {
    // Check if there is any mounted vault at all
    const hasVaults = this.hasMountedVault();
    const activePanel = this.querySelector('#vault-active-workspace-panel') as HTMLElement | null;
    const unloadedPanel = this.querySelector('#vault-unloaded-workspace-panel') as HTMLElement | null;

    if (activePanel && unloadedPanel) {
      if (hasVaults) {
        activePanel.classList.remove('hidden');
        activePanel.classList.add('flex');
        unloadedPanel.classList.add('hidden');
        unloadedPanel.classList.remove('flex');
      } else {
        activePanel.classList.add('hidden');
        activePanel.classList.remove('flex');
        unloadedPanel.classList.remove('hidden');
        unloadedPanel.classList.add('flex');
      }
    }

    // Sync active heading and description text centrally based on active selectedBoard
    const heading = this.querySelector('#board-title-heading');
    const desc = this.querySelector('#board-desc');
    if (heading) {
      if (this.selectedBoard === 'ALL') {
        heading.textContent = 'All Vault Reference Archives';
        if (desc) desc.textContent = 'Pinterest-style Vault Board Directories • Select any Category Board below to view and edit references';
      } else {
        heading.textContent = this.selectedBoard;
        if (desc) desc.textContent = 'Local subdirectory scan synced inside catalog.db cache';
      }
    }

    const btnRename = this.querySelector('#btn-rename-board') as HTMLElement | null;
    const btnDeleteActive = this.querySelector('#btn-delete-active-board') as HTMLElement | null;
    if (btnRename) {
      btnRename.style.display = this.selectedBoard === 'ALL' ? 'none' : 'inline-flex';
    }
    if (btnDeleteActive) {
      btnDeleteActive.style.display = this.selectedBoard === 'ALL' ? 'none' : 'inline-flex';
    }

    this.renderSidebarVaults();
    this.renderBoardNavigation();
    this.renderTaxonomyNavigation();
    this.renderSections();
    this.renderCatalog();
    this.renderInspector();
    this.updateActiveColorPaletteUI();
    
    // Update counter
    const allCount = this.querySelector('#all-assets-count');
    const footerCount = this.querySelector('#vault-total-count');
    if (allCount) allCount.textContent = `${this.assets.length}`;
    if (footerCount) footerCount.textContent = `Vault Index: ${14203 + this.assets.length - 12} files`;
  }

  private updateActiveColorPaletteUI() {
    const banner = this.querySelector('#color-palette-search-banner') as HTMLElement | null;
    if (!banner) return;

    if (this.colorPaletteSearchQuery && this.colorPaletteSearchQuery.length > 0) {
      banner.classList.remove('hidden');
      banner.classList.add('flex');

      const swatchesContainer = this.querySelector('#color-palette-banner-colors');
      if (swatchesContainer) {
        swatchesContainer.innerHTML = this.colorPaletteSearchQuery.map(c => `
          <div class="w-4 h-4 rounded-sm border border-white/10" style="background-color: ${c}" title="${c}"></div>
        `).join('');
      }

      const toleranceSlider = this.querySelector('#color-palette-tolerance-slider') as HTMLInputElement | null;
      if (toleranceSlider) {
        toleranceSlider.value = String(this.colorPaletteTolerance);
      }
      const toleranceText = this.querySelector('#color-palette-tolerance-text');
      if (toleranceText) {
        toleranceText.textContent = `${this.colorPaletteTolerance}°`;
      }
    } else {
      banner.classList.add('hidden');
      banner.classList.remove('flex');
    }
  }

  private renderSections() {
    const container = this.querySelector('#active-board-sections-container') as HTMLElement | null;
    if (!container) return;

    if (this.selectedBoard === 'ALL') {
      container.innerHTML = '';
      container.classList.add('hidden');
      return;
    }

    const rawPath = this.selectedBoard.replace(/^\/\s*/, '');
    const parts = rawPath.split('/').filter(Boolean);
    const isFirstLevelBoard = parts.length === 1;

    if (!isFirstLevelBoard) {
      container.innerHTML = '';
      container.classList.add('hidden');
      return;
    }

    container.classList.remove('hidden');

    const boards = this.getUniqueBoards();
    const parentBoard = this.selectedBoard;
    const sections = boards.filter(b => b.startsWith(parentBoard + '/'));

    const sectionsHtml = sections.map(sec => {
      const secAssets = this.assets.filter(a => a.board === sec);
      const secLabel = sec.replace(parentBoard + '/', '');

      return `
        <div data-section-board="${sec}" class="section-card flex flex-col bg-[#0F0F11]/90 border border-white/5 hover:border-emerald-500/20 hover:bg-[#121215] rounded-xl p-3 w-56 cursor-pointer transition duration-250 select-none group relative">
          
          <!-- Compact collage of assets -->
          <div class="h-24 w-full bg-black/40 rounded-lg overflow-hidden flex gap-1 mb-2.5 border border-white/[0.03] select-none p-1">
            ${secAssets.length > 0 ? `
              <div class="flex-grow h-full relative overflow-hidden bg-white/[0.01]">
                <img src="${secAssets[0].imageUrl}" onerror="window.handleImageError(this, '${secAssets[0].name.replace(/'/g, "\\'")}', '${secAssets[0].colors.join(',')}')" class="w-full h-full object-cover rounded" referrerPolicy="no-referrer" />
              </div>
              ${secAssets.length > 1 ? `
                <div class="w-1/3 flex flex-col gap-1 h-full">
                  <div class="flex-1 overflow-hidden">
                    <img src="${secAssets[1].imageUrl}" onerror="window.handleImageError(this, '${secAssets[1].name.replace(/'/g, "\\'")}', '${secAssets[1].colors.join(',')}')" class="w-full h-full object-cover rounded" referrerPolicy="no-referrer" />
                  </div>
                  ${secAssets.length > 2 ? `
                    <div class="flex-1 overflow-hidden">
                      <img src="${secAssets[2].imageUrl}" onerror="window.handleImageError(this, '${secAssets[2].name.replace(/'/g, "\\'")}', '${secAssets[2].colors.join(',')}')" class="w-full h-full object-cover rounded" referrerPolicy="no-referrer" />
                    </div>
                  ` : `
                    <div class="flex-1 border border-dashed border-white/5 rounded flex items-center justify-center text-[8px] text-slate-800 font-mono">+</div>
                  `}
                </div>
              ` : ''}
            ` : `
              <div class="w-full h-full flex flex-col items-center justify-center text-slate-700">
                <svg class="w-5 h-5 stroke-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2z"></path>
                </svg>
                <span class="text-[8px] font-mono mt-1">Empty Section</span>
              </div>
            `}
          </div>

          <div class="text-left flex items-center justify-between gap-1.5 flex-grow">
            <div class="truncate">
              <span class="block text-xs font-semibold text-slate-200 group-hover:text-emerald-400 transition truncate" title="${secLabel}">${secLabel}</span>
              <span class="block text-[10px] text-slate-500 font-mono">${secAssets.length} pin${secAssets.length === 1 ? '' : 's'}</span>
            </div>
            <!-- Delete section button -->
            <button data-delete-section="${sec}" class="delete-section-btn p-1 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded opacity-0 group-hover:opacity-100 transition cursor-pointer" title="Delete Section Folder">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            </button>
          </div>
        </div>
      `;
    }).join('');

    const addNewCardHtml = this.isCreatingSection ? `
      <div id="inline-add-section-card" class="bg-[#111113] border border-emerald-500/35 rounded-xl p-3 flex flex-col justify-between w-56 shrink-0 h-36">
        <div class="space-y-1.5 text-left">
          <label class="text-[9px] uppercase tracking-widest text-[#10B981] font-mono font-bold">New Section Name</label>
          <input id="inline-section-name-input" type="text" class="bg-black/60 text-white text-xs border border-white/5 focus:border-[#10B981] rounded-lg p-1.5 w-full outline-none font-sans" placeholder="e.g. Neo Tokyo" spellcheck="false" />
        </div>
        <div class="flex items-center justify-end gap-1.5 mt-2 shrink-0">
          <button id="inline-section-cancel" class="text-[10px] text-slate-500 hover:text-white px-2.5 py-1 rounded transition font-mono cursor-pointer font-bold">Cancel</button>
          <button id="inline-section-save" class="text-[10px] bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold px-3 py-1 rounded transition font-mono cursor-pointer">Create</button>
        </div>
      </div>
    ` : `
      <div id="card-new-section-trigger" class="border border-dashed border-white/10 hover:border-emerald-500/30 bg-black/10 hover:bg-black/20 rounded-xl p-3 flex flex-col items-center justify-center gap-2 cursor-pointer transition duration-250 select-none w-56 shrink-0 h-36 group">
        <div class="w-8 h-8 rounded-full bg-slate-900/60 border border-white/5 flex items-center justify-center group-hover:bg-emerald-500/10 group-hover:border-emerald-500/20 transition">
          <svg class="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"></path>
          </svg>
        </div>
        <span class="text-xs font-semibold text-slate-400 group-hover:text-emerald-400 transition">Create Section</span>
      </div>
    `;

    container.innerHTML = `
      <div class="space-y-3.5 mb-2 font-sans select-none">
        <div class="flex items-center justify-between border-b border-white/[0.04] pb-2">
          <div class="flex items-center gap-2 text-left">
            <span class="text-xs uppercase tracking-widest text-[#10B981] font-mono font-bold">Pinterest Board Sections</span>
            <span class="text-[10px] bg-emerald-500/10 text-emerald-400 font-mono px-2 py-0.5 rounded-full font-bold">${sections.length}</span>
          </div>
          <p class="text-[11px] text-slate-500 font-mono hidden md:block">Organize pins into structural folders inside this board</p>
        </div>
        <div class="flex items-center gap-4 overflow-x-auto pb-2 custom-scrollbar flex-nowrap scroll-smooth">
          ${sectionsHtml}
          ${addNewCardHtml}
        </div>
      </div>
    `;

    this.attachSectionEventListeners();
  }

  private attachSectionEventListeners() {
    const container = this.querySelector('#active-board-sections-container');
    if (!container) return;

    container.querySelectorAll('.section-card').forEach(card => {
      card.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        if (target.closest('.delete-section-btn')) {
          return;
        }
        const secBoard = (card as HTMLElement).dataset.sectionBoard;
        if (secBoard) {
          this.selectedBoard = secBoard;
          this.selectedAssetId = '';
          const currentBoardAssets = this.assets.filter(a => a.board === secBoard);
          if (currentBoardAssets.length > 0) {
            this.selectedAssetId = currentBoardAssets[0].id;
          }
          this.updateLayout();
          this.addLog('info', `Drilled down into board section: ${secBoard}`);
        }
      });

      // Supporting dragging reference cards/images into board sections
      card.addEventListener('dragover', (e: any) => {
        const secBoard = (card as HTMLElement).dataset.sectionBoard;
        if (secBoard) {
          e.preventDefault(); // crucial to enable drop triggers
          card.classList.add('bg-emerald-500/10', 'border-emerald-500/40', 'scale-[1.02]');
        }
      });

      card.addEventListener('dragleave', () => {
        card.classList.remove('bg-emerald-500/10', 'border-emerald-500/40', 'scale-[1.02]');
      });

      card.addEventListener('drop', (e: any) => {
        e.preventDefault();
        card.classList.remove('bg-emerald-500/10', 'border-emerald-500/40', 'scale-[1.02]');
        
        const secBoard = (card as HTMLElement).dataset.sectionBoard || '';
        
        // Support dropping external files from OS directly into this board/section card
        const files = Array.from(e.dataTransfer?.files || []) as File[];
        if (files.length > 0) {
          this.handleImportedFiles(files, secBoard);
          return;
        }

        const assetId = e.dataTransfer.getData('text/plain') || e.dataTransfer.getData('text');
        
        if (assetId && secBoard) {
          const asset = this.assets.find(a => a.id === assetId);
          if (asset && asset.board !== secBoard) {
            const oldBoard = asset.board;
            asset.board = secBoard;
            storage.saveAllAssets(this.assets);
            this.addLog('success', `Dropped pin: Moved '${asset.name}' from '${oldBoard}' board to section '${secBoard}'.`);
            this.updateLayout();
            this.toast('Asset Relocated', `Moved '${asset.metadata.title || asset.name}' to section '${secBoard.split('/').pop()}'.`);
          }
        }
      });
    });

    container.querySelectorAll('.delete-section-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const secBoard = (btn.closest('[data-section-board]') as HTMLElement)?.dataset.sectionBoard;
        if (secBoard) {
          this.deleteBoard(secBoard);
        }
      });
    });

    const trigger = this.querySelector('#card-new-section-trigger');
    if (trigger) {
      trigger.addEventListener('click', () => {
        this.isCreatingSection = true;
        this.renderSections();
      });
    }

    const cancelBtn = this.querySelector('#inline-section-cancel');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        this.isCreatingSection = false;
        this.renderSections();
      });
    }

    const saveBtn = this.querySelector('#inline-section-save');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        this.saveInlineSection();
      });
    }

    const input = this.querySelector('#inline-section-name-input') as HTMLInputElement | null;
    if (input) {
      input.focus();
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          this.saveInlineSection();
        } else if (e.key === 'Escape') {
          this.isCreatingSection = false;
          this.renderSections();
        }
      });
    }
  }

  private saveInlineSection() {
    const input = this.querySelector('#inline-section-name-input') as HTMLInputElement | null;
    if (!input) return;

    const val = input.value.trim();
    if (!val) {
      this.isCreatingSection = false;
      this.renderSections();
      return;
    }

    const parentBoard = this.selectedBoard;
    // Format appropriately: e.g., "/ Environment_Ref" + "/" + "Neo_Tokyo" -> "/ Environment_Ref/Neo_Tokyo"
    const sectionPath = `${parentBoard}/${val.replace(/[\/\\]+/g, '_')}`;

    this.createNewBoard(sectionPath);
    this.isCreatingSection = false;
    this.updateLayout();
  }

  private renderSidebarVaults() {
    const listContainer = this.querySelector('#sidebar-vaults-list-container');
    if (!listContainer) return;

    const vaults = storage.getVaults();
    const currentPath = storage.getVaultPath();
    
    // Determine which vaults to show based on workspace mode
    let vaultsToRender = [];
    if (this.workspaceMode === 'unified') {
      vaultsToRender = vaults.filter(v => v.mounted !== false);
    } else {
      vaultsToRender = vaults.filter(v => v.path === currentPath && v.mounted !== false);
    }

    if (vaultsToRender.length === 0) {
      listContainer.innerHTML = '';
      return;
    }

    // Sort by last opened or alphabetically back-first
    vaultsToRender.sort((a,b) => (b.lastOpened || 0) - (a.lastOpened || 0));

    const html = vaultsToRender.map(v => {
      const isCurrent = v.path === currentPath;
      
      // Theme-specific styles
      let itemClass = '';
      let activeIndicator = '';
      let iconColor = '';
      
      if (this.activeTheme === 'minimalist') {
        if (isCurrent) {
          itemClass = 'bg-[#E3E2E0]/50 text-[#37352F] font-bold border border-neutral-300';
          activeIndicator = '<span class="w-1.5 h-1.5 bg-[#2383E2] rounded-full shrink-0"></span>';
          iconColor = 'text-[#2383E2]';
        } else {
          itemClass = 'text-neutral-500 hover:text-[#37352F] hover:bg-[#E3E2E0]/30 border border-transparent';
          activeIndicator = '';
          iconColor = 'text-neutral-400';
        }
      } else if (this.activeTheme === 'matrix') {
        if (isCurrent) {
          itemClass = 'bg-[#00FF41]/15 text-[#00FF41] border border-[#00FF41] font-mono font-bold';
          activeIndicator = '<span class="w-1.5 h-1.5 bg-[#00FF41] rounded-full shrink-0 animate-pulse"></span>';
          iconColor = 'text-[#00FF41]';
        } else {
          itemClass = 'text-[#00FF41]/60 hover:text-[#00FF41] hover:bg-[#00FF41]/5 border border-transparent font-mono';
          activeIndicator = '';
          iconColor = 'text-[#00FF41]/40';
        }
      } else {
        // Default theme
        if (isCurrent) {
          itemClass = 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold';
          activeIndicator = '<span class="w-1.5 h-1.5 bg-emerald-400 rounded-full shrink-0 animate-pulse"></span>';
          iconColor = 'text-emerald-400';
        } else {
          itemClass = 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent';
          activeIndicator = '';
          iconColor = 'text-slate-500 group-hover:text-slate-300';
        }
      }

      const displayName = v.name || v.path.split(/[/\\]/).pop() || 'Untitled Vault';

      return `
        <div data-vault-path="${v.path}" class="sidebar-vault-item group flex items-center justify-between text-xs p-2 rounded cursor-pointer transition ${itemClass}" title="${v.path}">
          <div class="flex items-center gap-2 truncate min-w-0">
            <svg class="w-3.5 h-3.5 ${iconColor} shrink-0 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
            </svg>
            <span class="truncate">${displayName}</span>
          </div>
          ${activeIndicator}
        </div>
      `;
    }).join('');

    // Formatted header label for structural integrity
    const headerHtml = `
      <div class="flex items-center justify-between px-2 py-1 select-none">
        <span class="text-[9px] uppercase tracking-wider text-slate-500 font-bold font-mono">Mounted Vaults (${vaultsToRender.length})</span>
        <span class="text-[8px] font-mono opacity-40 uppercase bg-black/30 px-1 py-0.5 border border-white/5 rounded-full">${this.workspaceMode}</span>
      </div>
      <div class="space-y-1 mt-1.5">
        ${html}
      </div>
    `;

    listContainer.innerHTML = headerHtml;

    // Attach click events to the sidebar-vault-item
    listContainer.querySelectorAll('.sidebar-vault-item').forEach(item => {
      item.addEventListener('click', () => {
        const path = (item as HTMLElement).dataset.vaultPath;
        if (path) {
          const v = vaults.find(vault => vault.path === path);
          this.switchVault(path, v?.name);
          this.updateLayout();
          this.toast('Vault Focused', `Switched active vault target directory to "${v?.name || path}"`);
        }
      });
    });
  }

  private renderBoardNavigation() {
    const listDiv = this.querySelector('#boards-list-container');
    if (!listDiv) return;

    const boards = this.getUniqueBoards();
    let containsDeeperFolders = false;

    // Filter unique boards to only display the folders on the root of the vault (level 1 directories)
    const rootBoards = boards.filter(board => {
      const parts = board.replace(/^\/\s*/, '').split('/').filter(Boolean);
      return parts.length === 1;
    });

    let boardsHtml = rootBoards.map(board => {
      const activeFolderIcon = `<svg class="w-3.5 h-3.5 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>`;
      const idleFolderIcon = `<svg class="w-3.5 h-3.5 text-slate-500 shrink-0 opacity-40 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>`;
      const nestedFolderIcon = `<svg class="w-3.5 h-3.5 text-cyan-400 shrink-0 opacity-70 group-hover:opacity-100 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>`;

      const parts = board.replace(/^\/\s*/, '').split('/');
      const isSub = parts.length > 1;
      const isDeeper = parts.length > 2;
      
      if (isDeeper) {
        containsDeeperFolders = true;
      }

      // Deeper folders are promoted/flattened to the 2nd level list with standard subfolders
      let displayLabel = '';
      if (isDeeper) {
        displayLabel = `↳ ${parts.slice(1).join(' › ')}`;
      } else {
        displayLabel = isSub ? `${parts[parts.length - 1]}` : `${parts[0]}`;
      }

      // Check if selected board matches directly or is inside this parent board
      const isActive = this.selectedBoard === board || this.selectedBoard.startsWith(board + '/');
      const paddingClass = isDeeper ? 'pl-8' : (isSub ? 'pl-6' : 'pl-2');
      const colorClass = isActive 
        ? 'text-emerald-400 bg-emerald-500/10 font-bold border-l-2 border-emerald-500 scale-[1.01]' 
        : 'text-slate-400 hover:text-white hover:bg-white/[0.015] border-l-2 border-transparent';

      return `
        <div data-board="${board}" class="board-link flex items-center justify-between text-xs py-2 pr-2.5 rounded-r cursor-pointer transition-all duration-200 ${paddingClass} ${colorClass} group" title="Full Structure Path: ${board}">
          <div class="flex items-center gap-2 truncate">
            ${isActive ? activeFolderIcon : (isDeeper ? nestedFolderIcon : idleFolderIcon)}
            <span class="truncate ${isDeeper ? 'italic text-cyan-300/90 font-mono text-[10px]' : ''}">${displayLabel}</span>
          </div>
          <div class="flex items-center gap-1.5 shrink-0">
            <button data-delete-board="${board}" class="delete-board-btn text-rose-500 hover:text-rose-400 hover:bg-rose-500/10 p-0.5 rounded opacity-0 group-hover:opacity-100 transition duration-150 cursor-pointer" title="Delete Board Folder">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            </button>
            <span class="text-[9px] font-mono opacity-50 bg-black/40 px-1.5 py-0.5 rounded-full border border-white/5">${this.assets.filter(a => a.board === board).length}</span>
          </div>
        </div>
      `;
    }).join('');

    // Active folder structure/hierarchy guide info banner
    let structureInfoHtml = '';
    if (containsDeeperFolders) {
      structureInfoHtml = `
        <div class="text-[10px] text-slate-300 bg-slate-900 border border-cyan-500/30 rounded p-2.5 shadow-xl transition-all duration-200 space-y-1 select-none font-mono tracking-tight text-left opacity-0 invisible group-hover:opacity-100 group-hover:visible pointer-events-none">
          <div class="flex items-center gap-1 text-cyan-400 font-extrabold uppercase text-[9px]">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            Hierarchy Traversal
          </div>
          <p class="leading-relaxed">
            Folders nested inside 2nd Level [Sections] are promoted & displayed here on the 2nd level list (marked with <span class="text-cyan-300 font-medium">↳</span>) for seamless cross-board navigation.
          </p>
        </div>
      `;
    } else {
      structureInfoHtml = `
        <div class="text-[9.5px] text-slate-300 bg-slate-900 border border-white/10 rounded shadow-xl p-2.5 select-none font-mono tracking-tight text-left opacity-0 invisible group-hover:opacity-100 group-hover:visible pointer-events-none">
          <div class="text-slate-400 font-bold uppercase text-[8.5px] mb-1">
            📁 Vault Hierarchy Rule
          </div>
          <p class="leading-relaxed">
            Reflected architecture:<br/>
            <span class="text-slate-300">Vault [root]</span> ➔ 
            <span class="text-slate-300">1st Lvl [Boards]</span> ➔ 
            <span class="text-slate-300">2nd Lvl [Sections]</span> ➔ 
            <span class="text-slate-300">3rd Lvl [Images]</span>
          </p>
        </div>
      `;
    }

    listDiv.innerHTML = boardsHtml;
    const hierarchyContainer = this.querySelector('#vault-hierarchy-info-container') as HTMLElement | null;
    if (hierarchyContainer) {
      hierarchyContainer.innerHTML = structureInfoHtml;
    }

    // Highlight Library link (All references)
    const navAll = this.querySelector('#nav-all-assets');
    
    if (this.selectedBoard === 'ALL') {
      navAll?.classList.add('bg-emerald-500/5', 'text-emerald-400', 'border', 'border-emerald-500/10');
      navAll?.classList.remove('text-slate-400');
    } else {
      navAll?.classList.remove('bg-emerald-500/5', 'text-emerald-400', 'border', 'border-emerald-500/10');
      navAll?.classList.add('text-slate-400');
    }
  }

  private renderBoardCategoryCards(gridDiv: HTMLElement, emptyState: HTMLElement) {
    const boards = this.getUniqueBoards();
    const query = this.searchQuery.toLowerCase().trim();

    const rootBoards = boards.filter(board => {
      const parts = board.replace(/^\/\s*/, '').split('/').filter(Boolean);
      return parts.length === 1;
    });

    // Filter which boards match the search query or contain matching assets
    const filteredBoards = rootBoards.filter(board => {
      if (!query) return true;
      if (board.toLowerCase().includes(query)) return true;
      
      const boardAssets = this.assets.filter(a => a.board === board);
      return boardAssets.some(asset => {
        const matchTitle = asset.name.toLowerCase().includes(query);
        const matchArtist = (asset.metadata.artist || '').toLowerCase().includes(query);
        const matchSystemTags = asset.tags.some(t => t.toLowerCase().includes(query));
        const matchMetaTags = asset.metadata.tags.some(t => t.toLowerCase().includes(query));
        return matchTitle || matchArtist || matchSystemTags || matchMetaTags;
      });
    });

    if (filteredBoards.length === 0) {
      gridDiv.classList.add('hidden');
      emptyState.classList.remove('hidden');
      emptyState.classList.add('flex');
      return;
    } else {
      gridDiv.classList.remove('hidden');
      emptyState.classList.add('hidden');
      emptyState.classList.remove('flex');
    }

    // Boards grid style (clean grid is better than masonry for structured square folders!)
    gridDiv.className = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full pb-10';

    gridDiv.innerHTML = filteredBoards.map(board => {
      const boardAssets = this.assets.filter(a => a.board === board || a.board.startsWith(board + '/'));
      const matchingAssets = boardAssets.filter(asset => {
        if (!query) return true;
        const matchTitle = asset.name.toLowerCase().includes(query);
        const matchArtist = (asset.metadata.artist || '').toLowerCase().includes(query);
        const matchSystemTags = asset.tags.some(t => t.toLowerCase().includes(query));
        const matchMetaTags = asset.metadata.tags.some(t => t.toLowerCase().includes(query));
        return matchTitle || matchArtist || matchSystemTags || matchMetaTags;
      });

      const parts = board.replace(/^\/\s*/, '').split('/');
      const isDeeper = parts.length > 2;
      const displayLabel = isDeeper ? `${parts.slice(1).join(' › ')}` : (parts.length > 1 ? parts[parts.length - 1] : parts[0]);
      
      return `
        <div data-board="${board}" class="board-card-item cursor-pointer bg-[#0F0F11]/90 border border-white/5 rounded-2xl p-4 flex flex-col space-y-3 hover:border-emerald-500/20 hover:bg-[#121215] transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl group relative">
          
          <!-- Collage frame (Pinterest style) -->
          <div class="relative h-40 w-full rounded-xl overflow-hidden bg-black/40 flex gap-1.5 select-none shrink-0 border border-white/[0.03]">
            <!-- Left panel: Big Cover image -->
            <div class="w-[60%] h-full relative overflow-hidden bg-white/[0.01] flex items-center justify-center">
              ${boardAssets[0] ? `
                <img src="${boardAssets[0].imageUrl}" onerror="window.handleImageError(this, '${boardAssets[0].name.replace(/'/g, "\\'")}', '${boardAssets[0].colors.join(',')}')" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
              ` : `
                <div class="flex flex-col items-center justify-center text-slate-700">
                  <svg class="w-6 h-6 stroke-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2z"></path>
                  </svg>
                  <span class="text-[9px] font-mono mt-1">Empty Board</span>
                </div>
              `}
            </div>

            <!-- Right panel: Two stacked small thumbnails -->
            <div class="w-[40%] flex flex-col gap-1.5 h-full">
              <!-- Top thumbs -->
              <div class="flex-1 h-0 overflow-hidden bg-white/[0.01] flex items-center justify-center border-l border-white/5">
                ${boardAssets[1] ? `
                  <img src="${boardAssets[1].imageUrl}" onerror="window.handleImageError(this, '${boardAssets[1].name.replace(/'/g, "\\'")}', '${boardAssets[1].colors.join(',')}')" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                ` : `
                  <div class="w-full h-full border border-dashed border-white/5 rounded flex items-center justify-center text-[10px] text-slate-800 font-mono">+</div>
                `}
              </div>
              <!-- Bottom thumbs -->
              <div class="flex-1 h-0 overflow-hidden bg-white/[0.01] flex items-center justify-center border-l border-t border-white/5">
                ${boardAssets[2] ? `
                  <img src="${boardAssets[2].imageUrl}" onerror="window.handleImageError(this, '${boardAssets[2].name.replace(/'/g, "\\'")}', '${boardAssets[2].colors.join(',')}')" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                ` : `
                  <div class="w-full h-full border border-dashed border-white/5 rounded flex items-center justify-center text-[10px] text-slate-800 font-mono">+</div>
                `}
              </div>
            </div>

            <!-- Visual overlay open board icon button -->
            <div class="absolute top-2 right-2 bg-black/60 backdrop-blur border border-white/10 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition duration-300">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </div>
          </div>

          <!-- Board description -->
          <div class="flex flex-col text-left">
            <!-- Title and counts -->
            <div class="flex items-center justify-between gap-1.5 font-sans">
              <span class="font-semibold text-sm text-slate-100 group-hover:text-emerald-400 transition truncate flex-grow mr-1 ${isDeeper ? 'text-cyan-300/95 italic font-mono' : ''}" title="${displayLabel}">
                ${isDeeper ? '↳ ' : ''}${displayLabel}
              </span>
              <div class="flex items-center gap-1.5 shrink-0">
                <button data-delete-board="${board}" class="main-delete-board-btn text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer" title="Delete Board Folder">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                </button>
                <span class="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2 py-0.5 tracking-tight shrink-0 font-semibold shadow-inner font-mono">
                  ${query && matchingAssets.length !== boardAssets.length 
                    ? `${matchingAssets.length}/${boardAssets.length} pins` 
                    : `${boardAssets.length} files`}
                </span>
              </div>
            </div>
            
            <!-- Full virtual Board Path breadcrumb -->
            <span class="text-[10.5px] text-slate-500 font-mono mt-1 break-all truncate" title="${board}">
              ${board}
            </span>

            <!-- Status & Swatches row -->
            <div class="flex items-center justify-between border-t border-white/[0.03] pt-2.5 mt-2.5 text-[10px] text-slate-600 font-mono">
              <span class="flex items-center gap-1 text-[9.5px]">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                SQLite Sync
              </span>
              <div class="flex -space-x-1.5 overflow-hidden">
                ${boardAssets.slice(0, 4).map(asset => `
                  <div class="w-4 h-4 rounded-full border border-slate-900 bg-slate-700 flex-shrink-0 origin-center hover:scale-125 hover:z-10 transition overflow-hidden">
                    <img src="${asset.imageUrl}" onerror="window.handleImageError(this, '${asset.name.replace(/'/g, "\\'")}', '${asset.colors.join(',')}')" class="w-full h-full object-cover" />
                  </div>
                `).join('')}
              </div>
            </div>
          </div>

        </div>
      `;
    }).join('');
  }

  private renderCatalog() {
    const gridDiv = this.querySelector('#catalog-masonry') as HTMLElement | null;
    const emptyState = this.querySelector('#catalog-empty-state') as HTMLElement | null;
    if (!gridDiv || !emptyState) return;

    if (this.selectedBoard === 'ALL') {
      this.renderBoardCategoryCards(gridDiv, emptyState);
      return;
    }

    const filtered = this.getFilteredAssets();
    
    if (filtered.length === 0) {
      gridDiv.classList.add('hidden');
      emptyState.classList.remove('hidden');
      emptyState.classList.add('flex');
      
      const emptyBoardSpan = this.querySelector('#empty-state-board-name');
      if (emptyBoardSpan) emptyBoardSpan.textContent = this.selectedBoard;
      
      return;
    } else {
      gridDiv.classList.remove('hidden');
      emptyState.classList.add('hidden');
      emptyState.classList.remove('flex');
    }

    // Set columns class according to current gridSize state
    gridDiv.className = ''; // wipe current class
    if (this.gridSize === 'sm') {
      gridDiv.className = 'columns-1 sm:columns-2 md:columns-4 lg:columns-5 xl:columns-6 gap-3.5';
    } else if (this.gridSize === 'md') {
      gridDiv.className = 'columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-3.5';
    } else {
      gridDiv.className = 'columns-1 sm:columns-1 md:columns-2 lg:columns-2 xl:columns-3 gap-5';
    }

    gridDiv.innerHTML = filtered.map(asset => {
      const isSelected = asset.id === this.selectedAssetId;
      const borderClass = isSelected 
        ? 'ring-2 ring-emerald-500 border-emerald-500 bg-[#121215] shadow-lg shadow-emerald-500/10 scale-[1.01]' 
        : 'border-white/10 bg-slate-900/60 hover:border-white/20 hover:bg-[#121214]';
      
      // Determine appropriate height ratio card
      let heightClass = 'h-48';
      if (asset.name.includes('temple') || asset.name.includes('exosuit') || asset.imageUrl.startsWith('blob:')) {
        heightClass = 'h-64';
      } else if (asset.name.includes('Study') || asset.name.includes('alley') || asset.name.includes('suit')) {
        heightClass = 'h-40';
      } else if (asset.name.includes('mech') || asset.name.includes('node')) {
        heightClass = 'h-52';
      }

      const swatches = asset.colors.map(c => `
        <div class="w-2.5 h-2.5 rounded-full border border-white/10" style="background-color: ${c}" title="${c}"></div>
      `).join('');

      return `
        <div data-id="${asset.id}" draggable="true" class="asset-card break-inside-avoid mb-4 border rounded-lg overflow-hidden cursor-pointer group transition-all duration-300 relative ${borderClass}">
          
          <!-- Image canvas wrapper -->
          <div class="${heightClass} relative w-full overflow-hidden bg-black/40 flex items-center justify-center">
            <img src="${asset.imageUrl}" draggable="false" onerror="window.handleImageError(this, '${asset.name.replace(/'/g, "\\'")}', '${asset.colors.join(',')}')" class="w-full h-full object-cover group-hover:scale-[1.03] transition duration-500" loading="lazy" />
            
            <!-- Technical Overlay parameters -->
            <div class="absolute top-2 left-2 bg-black/70 backdrop-blur px-2 py-1 rounded text-[8.5px] mono tracking-tight text-slate-400 opacity-60 group-hover:opacity-100 transition whitespace-nowrap">
              ${asset.resolution}
            </div>

            <!-- Sync confirmation beacon -->
            <div class="absolute top-3 right-3 bg-emerald-500 text-black p-0.5 rounded-full flex items-center justify-center ${isSelected ? 'opacity-100 ring-2 ring-white/15 scale-105' : 'opacity-0 group-hover:opacity-100'} transition self-center">
              <svg class="w-3.5 h-3.5" stroke="currentColor" fill="currentColor" stroke-width="0.5" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
            </div>

            <!-- Palette quick indicators -->
            <div class="absolute bottom-2 left-2 flex gap-1 bg-black/50 backdrop-blur border border-white/5 p-1 rounded">
              ${swatches}
            </div>
          </div>

          <!-- Caption footer -->
          <div id="footer-${asset.id}" class="hidden p-3 text-[11.5px] border-t border-white/[0.04] flex items-center justify-between transition-colors">
            <span class="truncate font-medium text-slate-200 group-hover:text-emerald-400 transition pr-2">${asset.metadata.title || asset.name}</span>
            <span class="shrink-0 text-[10px] bg-white/5 opacity-50 px-1 py-0.5 rounded font-mono">${asset.size}</span>
          </div>

        </div>
      `;
    }).join('');
  }

  private renderInspector() {
    const ispcDiv = this.querySelector('#inspector-container');
    if (!ispcDiv) return;

    const asset = this.assets.find(a => a.id === this.selectedAssetId);
    if (!asset) {
      ispcDiv.innerHTML = `
        <div class="flex flex-col items-center justify-center text-center p-10 text-slate-500 h-96">
          <svg class="w-8 h-8 opacity-20 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"></path>
          </svg>
          <p class="text-xs">No active selection</p>
          <p class="text-[10px] text-slate-600 mt-1">Select any reference asset in the grid list to edit metadata coordinates and color parameters.</p>
        </div>
      `;
      return;
    }

    // Markdown file companion block
    const rawYaml = stringifyYAMLFrontmatter(asset.metadata);
    const mdName = asset.name.replace(/\.[a-zA-Z0-9]+$/, '.md');

    // Generating stars rating selector markup
    let starsInHtml = '';
    for (let i = 1; i <= 5; i++) {
      const active = i <= parseInt(asset.metadata.rating);
      starsInHtml += `
        <span class="star-rating-item text-lg cursor-pointer transition ${active ? 'text-amber-500' : 'text-slate-600 hover:text-amber-400/50'}" data-rate="${i}">★</span>
      `;
    }

    // Interactive custom tags
    const tagsInHtml = asset.metadata.tags.map(tag => {
      const category = classifyTag(tag);
      let badgeClass = '';
      let categoryPrefix = '';
      if (category === 'medium') {
        badgeClass = 'bg-blue-500/10 border-blue-500/20 text-blue-400 hover:bg-blue-500/20';
        categoryPrefix = '🖼️ ';
      } else if (category === 'eraStyle') {
        badgeClass = 'bg-purple-500/10 border-purple-500/20 text-purple-400 hover:bg-purple-500/20';
        categoryPrefix = '🎨 ';
      } else if (category === 'source') {
        badgeClass = 'bg-amber-500/10 border-amber-500/20 text-amber-400 hover:bg-amber-500/20';
        categoryPrefix = '🌐 ';
      } else {
        badgeClass = 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20';
        categoryPrefix = '🏷️ ';
      }
      return `
        <span class="meta-tag-badge ${badgeClass} border rounded px-2 py-0.5 text-[10.5px] tracking-tight inline-flex items-center gap-1 cursor-pointer transition select-none" data-tag="${tag}" title="Click to filter catalog by this tag">
          <span>${categoryPrefix}${tag}</span>
          <span class="meta-tag-remove cursor-pointer hover:text-white transition font-bold" data-tag="${tag}">×</span>
        </span>
      `;
    }).join('');

    // Swatches HEX
    const paletteInHtml = asset.colors.map(color => `
      <div class="palette-swatch flex flex-col gap-1 flex-1 cursor-pointer group/sw" data-hex="${color}">
        <div class="h-8 rounded border border-white/10 transition group-hover/sw:border-emerald-500/30" style="background-color: ${color}"></div>
        <span class="mono text-[8.5px] text-center text-slate-500 group-hover/sw:text-emerald-400 transition mt-0.5">${color}</span>
      </div>
    `).join('');

    const uniqueBoards = this.getUniqueBoards();
    const boardOptionsHtml = uniqueBoards.filter(b => b !== 'ALL').map(b => `
      <option value="${b}" ${asset.board === b ? 'selected' : ''}>${b}</option>
    `).join('');

    ispcDiv.innerHTML = `
      <div class="space-y-5 animate-fade-in">
        
        <!-- Asset ID context header -->
        <div class="space-y-1 pb-4 border-b border-white/[0.04]">
          <label class="text-[10px] uppercase tracking-widest text-slate-500 font-bold cursor-default">Asset Identification</label>
          <h4 class="text-white font-semibold text-sm truncate flex items-center justify-between" title="${asset.name}">
            <span>${asset.name}</span>
            <button id="asset-delete-btn" class="p-1.5 hover:bg-red-500/10 text-red-400 hover:text-red-300 rounded-full transition ml-2 flex items-center justify-center shrink-0 border border-transparent hover:border-red-500/20 shadow-md cursor-pointer" title="Delete index asset companion">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            </button>
          </h4>
          <div class="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>Disk updated: ${asset.lastModified}</span>
            <span class="text-emerald-500">.png Sync ok</span>
          </div>
        </div>

        <!-- Markdown frontmatter companion YAML edits -->
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <label class="text-[10px] uppercase tracking-widest text-slate-500 font-bold cursor-default">Companion Obsidian MD</label>
            <span class="text-[10px] text-emerald-500/60 font-mono flex items-center gap-1">
              <span class="w-1 h-1 rounded-full bg-emerald-500"></span>
              ${mdName}
            </span>
          </div>

          <div class="relative group">
            <textarea id="markdown-yaml-editor" class="w-full h-34 bg-black font-mono text-[10.5px] leading-relaxed text-slate-400 p-2.5 rounded border border-white/5 focus:border-emerald-500/20 focus:text-slate-300 outline-none resize-none transition-all custom-scrollbar flex" spellcheck="false" title="Directly edit plaintext YAML frontmatter metadata — edits immediately mirror into form variables!">${rawYaml}</textarea>
            <div class="absolute bottom-1 right-2 text-[8px] mono text-slate-600 group-focus-within:text-emerald-400 pointer-events-none transition-colors">Obsidian Link</div>
          </div>

          <button id="action-obsidian" class="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 active:scale-95 text-slate-300 text-[10px] font-bold uppercase rounded transition font-mono tracking-wider">
            Open Companion in Obsidian
          </button>
        </div>

        <!-- Board Operations (Rearrange Indexing & Relocation) -->
        <div class="space-y-3.5 pt-4 border-t border-white/[0.04]">
          <label class="text-[10px] uppercase tracking-widest text-slate-500 font-bold cursor-default">Board Settings &amp; Rearranging</label>
          
          <div class="grid grid-cols-2 gap-2">
            <button id="action-move-up" class="py-2 bg-white/5 hover:bg-emerald-500/10 hover:border-emerald-500/20 border border-white/5 active:scale-95 text-slate-300 hover:text-emerald-400 text-[10px] font-bold uppercase rounded transition flex items-center justify-center gap-1.5 cursor-pointer font-mono tracking-wider" title="Move this pin earlier in layout order">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 15l7-7 7 7"></path>
              </svg>
              <span>Move Up</span>
            </button>
            <button id="action-move-down" class="py-2 bg-white/5 hover:bg-emerald-500/10 hover:border-emerald-500/20 border border-white/5 active:scale-95 text-slate-300 hover:text-emerald-400 text-[10px] font-bold uppercase rounded transition flex items-center justify-center gap-1.5 cursor-pointer font-mono tracking-wider" title="Move this pin later in layout order">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"></path>
              </svg>
              <span>Move Down</span>
            </button>
          </div>

          <div class="space-y-1 pt-1.5">
            <span class="text-[10px] text-slate-400 font-medium">Change Board / Relocate Pin:</span>
            <select id="action-move-board-select" class="w-full bg-black text-xs px-2 py-2 rounded border border-white/10 focus:border-emerald-500/30 text-slate-200 outline-none cursor-pointer">
              ${boardOptionsHtml}
            </select>
          </div>
        </div>

        <!-- Forms metadata config parameters -->
        <div class="space-y-3.5 pt-4 border-t border-white/[0.04]">
          <label class="text-[10px] uppercase tracking-widest text-[#10B981] font-mono font-bold cursor-default">Database Sync Parameters</label>
          
          <div class="space-y-1">
            <span class="text-[10px] text-slate-500 font-semibold">${this.schemaConfig.properties.title?.label || 'Pin Name / Title'}:</span>
            <input type="text" id="meta-title-input" value="${asset.metadata.title || ''}" 
              class="w-full bg-black/40 text-xs px-2 py-1.5 rounded border border-white/5 focus:border-emerald-500/20 text-white outline-none" placeholder="${this.schemaConfig.properties.title?.placeholder || 'E.g., Neo Tokyo Temple Alleyway Sunset...'}" />
          </div>

          <div class="space-y-1">
            <span class="text-[10px] text-slate-500 font-semibold">${this.schemaConfig.properties.notes?.label || 'Pin notes / Description'}:</span>
            <textarea id="meta-notes-input" class="w-full h-22 bg-black/40 text-xs px-2.5 py-2 rounded border border-white/5 focus:border-emerald-500/20 text-white outline-none resize-none custom-scrollbar" placeholder="${this.schemaConfig.properties.notes?.placeholder || 'Add custom notes, design prompts, research observations...'}">${asset.metadata.notes || ''}</textarea>
          </div>

          <div class="space-y-1">
            <span class="text-[10px] text-slate-500 font-semibold">${this.schemaConfig.properties.artist?.label || 'Artist / Creator'}:</span>
            <input type="text" id="meta-artist-input" value="${asset.metadata.artist || ''}" 
              class="w-full bg-[#0A0A0B]/40 text-xs px-2 py-1.5 rounded border border-white/5 focus:border-emerald-500/20 text-white outline-none w-full" placeholder="${this.schemaConfig.properties.artist?.placeholder || 'Chen-K design team...'}" />
          </div>

          <div class="space-y-1">
            <span class="text-[10px] text-slate-500 font-semibold">${this.schemaConfig.properties.status?.label || 'Asset Status'}: </span>
            <select id="meta-status-select" class="w-full bg-black text-xs px-2 py-1.5 rounded border border-white/5 focus:border-emerald-500/20 text-white outline-none">
              ${(() => {
                const schemaHasVal = this.schemaConfig.statuses.some(s => s.value === asset.metadata.status);
                let options = this.schemaConfig.statuses.map(s => `
                  <option value="${s.value}" ${asset.metadata.status === s.value ? 'selected' : ''}>${s.label}</option>
                `).join('');
                if (asset.metadata.status && !schemaHasVal) {
                  options += `<option value="${asset.metadata.status}" selected>${asset.metadata.status}</option>`;
                }
                return options;
              })()}
            </select>
          </div>

          <div class="space-y-1.5">
            <span class="text-[10px] text-slate-500 font-semibold">${this.schemaConfig.properties.rating?.label || 'Visual Vault Grade'}:</span>
            <div class="flex items-center gap-1 bg-black/20 p-1.5 rounded border border-white/5 w-fit">
              ${starsInHtml}
            </div>
          </div>
        </div>

        <!-- Extract color palette swatches -->
        <div class="space-y-2 pt-4 border-t border-white/[0.04]">
          <div class="flex justify-between items-center">
            <label class="text-[10px] uppercase tracking-widest text-slate-500 font-bold cursor-default">Color Palette Extract</label>
            <span class="text-[9px] text-slate-500 font-mono">Click to Copy</span>
          </div>
          <div class="flex gap-2">
            ${paletteInHtml}
          </div>
          <button id="search-similar-palette-btn" class="w-full py-2 bg-emerald-500/10 hover:bg-emerald-500/20 hover:text-emerald-300 border border-emerald-500/15 active:scale-95 text-emerald-400 text-[10px] font-bold uppercase rounded transition font-mono tracking-wider flex items-center justify-center gap-1.5 mt-1 cursor-pointer" title="Find reference images with matching average color palettes">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"></path>
            </svg>
            <span>Search Similar Palettes</span>
          </button>
        </div>

        <!-- Custom tags parameters -->
        <div class="space-y-2 pt-4 border-t border-white/[0.04]">
          <label class="text-[10px] uppercase tracking-widest text-slate-500 font-bold cursor-default">Obsidian Companion Tags</label>
          <div class="flex flex-wrap gap-1.5 leading-relaxed">
            ${tagsInHtml}
          </div>
          <div class="flex items-center gap-1.5 bg-black/40 border border-white/5 rounded pl-2.5 py-1 pr-1 w-full mt-2 focus-within:border-emerald-500/20">
            <span class="text-[10px] text-slate-600 font-mono font-semibold">#</span>
            <input type="text" id="add-tag-input" placeholder="add_new_tag..." 
              class="bg-transparent text-xs text-white placeholder-slate-600 outline-none w-full" />
            <button id="add-tag-btn" class="p-1 hover:bg-emerald-500/20 text-emerald-400 hover:text-emerald-300 rounded font-bold uppercase text-[9px] transition shrink-0 hidden">add</button>
          </div>
          ${renderPresetsHtml(asset.metadata.tags, false)}
        </div>

      </div>
    `;

    this.attachInspectorEvents();
  }

  // ----------------------------------------------------
  // Interactions & Events Binding
  // ----------------------------------------------------
  private attachEventListeners() {
    // Directory Permission Banner button
    const btnGrantPermission = this.querySelector('#btn-grant-directory-permission');
    if (btnGrantPermission) {
      btnGrantPermission.addEventListener('click', async () => {
        if (this.directoryHandle) {
          try {
            const opts = { mode: 'readwrite' };
            const permission = await (this.directoryHandle as any).requestPermission(opts);
            if (permission === 'granted') {
              this.needsDirectoryPermission = false;
              this.toast('Permission Granted', 'Re-synchronizing images from your linked folder...');
              
              this.fileHandles.clear();
              this.mdFileHandles.clear();
              const assetsList: Asset[] = [];
              await this.traverseDirectoryHandle(this.directoryHandle, '', assetsList);
              
              if (assetsList.length > 0) {
                this.assets = assetsList;
                storage.saveAllAssets(assetsList);
                this.loadAssets(assetsList);
                this.addLog('success', `Sandbox API: Successfully loaded and synced ${assetsList.length} files from linked folder.`);
              }
              this.updateLayout();
            } else {
              this.toast('Permission Denied', 'Access remains restricted.');
            }
          } catch (e: any) {
            console.error(e);
            this.addLog('warn', `Failed to request directory permissions: ${e.message}`);
            this.toast('Sync Failed', 'Failed to restore folder link.');
          }
        }
      });
    }

    // Web directory fallback re-link button
    const btnRelinkFallback = this.querySelector('#btn-relink-fallback-directory');
    if (btnRelinkFallback) {
      btnRelinkFallback.addEventListener('click', () => {
        this.handleWebDirectoryFallback();
      });
    }

    // Color Palette Search Banner elements
    const colorPaletteClearBtn = this.querySelector('#color-palette-clear-btn');
    if (colorPaletteClearBtn) {
      colorPaletteClearBtn.addEventListener('click', () => {
        this.colorPaletteSearchQuery = null;
        this.addLog('info', `Active Filter: Cleared color similarity query.`);
        this.renderCatalog();
        this.updateActiveColorPaletteUI();
      });
    }

    const colorPaletteToleranceSlider = this.querySelector('#color-palette-tolerance-slider') as HTMLInputElement | null;
    if (colorPaletteToleranceSlider) {
      colorPaletteToleranceSlider.addEventListener('input', () => {
        const val = parseInt(colorPaletteToleranceSlider.value, 10);
        this.colorPaletteTolerance = val;
        const textNode = this.querySelector('#color-palette-tolerance-text');
        if (textNode) {
          textNode.textContent = `${val}°`;
        }
        this.renderCatalog();
      });
    }

    // Unloaded Warning panel action button
    const unloadedBtn = this.querySelector('#unloaded-open-vaults-btn');
    if (unloadedBtn) {
      unloadedBtn.addEventListener('click', () => {
        this.toggleVaultManagerModal(true);
      });
    }

    // Left sidebar slide close/slide open toggle
    const toggleSidebarBtn = this.querySelector('#toggle-sidebar-btn');
    if (toggleSidebarBtn) {
      toggleSidebarBtn.addEventListener('click', () => {
        this.isSidebarClosed = !this.isSidebarClosed;
        localStorage.setItem('visual_vault_sidebar_closed', this.isSidebarClosed ? 'true' : 'false');
        
        const aside = this.querySelector('aside');
        if (aside) {
          if (this.isSidebarClosed) {
            aside.classList.add('sidebar-collapsed');
            this.addLog('info', 'Aesthetic UI: Slide-closed Left Sidebar (lists hidden).');
          } else {
            aside.classList.remove('sidebar-collapsed');
            this.addLog('success', 'Aesthetic UI: Slide-opened Left Sidebar (lists visible).');
          }
        }
      });
    }

    // Global board folder rename trigger listener
    const btnRename = this.querySelector('#btn-rename-board');
    if (btnRename) {
      btnRename.addEventListener('click', () => {
        this.triggerRenameBoard();
      });
    }

    const btnDeleteActive = this.querySelector('#btn-delete-active-board');
    if (btnDeleteActive) {
      btnDeleteActive.addEventListener('click', () => {
        if (this.selectedBoard && this.selectedBoard !== 'ALL') {
          this.deleteBoard(this.selectedBoard);
        }
      });
    }

    // Board creation input trigger
    const addBoardBtn = this.querySelector('#add-board-btn');
    const newBoardIn = this.querySelector('#new-board-name') as HTMLInputElement;
    if (addBoardBtn && newBoardIn) {
      addBoardBtn.addEventListener('click', () => {
        const val = newBoardIn.value.trim();
        if (val) {
          this.createNewBoard(val);
          newBoardIn.value = '';
        }
      });
      newBoardIn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const val = newBoardIn.value.trim();
          if (val) {
            this.createNewBoard(val);
            newBoardIn.value = '';
          }
        }
      });
    }

    // Static click handler for reset/demo reloader
    const actionReset = this.querySelector('#action-reset');
    if (actionReset) {
      actionReset.addEventListener('click', () => {
        if (confirm('Rebuild database? This will clear active catalog index configurations and reboot local database cache.')) {
          localStorage.removeItem('visual_catalog_db_v2');
          this.assets = defaultMockAssets();
          this.selectedBoard = '/ Environment_Ref/Neo_Tokyo';
          this.selectedAssetId = 'as_1';
          storage.saveAllAssets(this.assets);
          this.addLog('success', 'Local SQL cache cleared. Re-indexing reference database...');
          this.updateLayout();
          this.toast('Database Cleared', 'Simulated visual catalog metadata recompiled successfully.');
        }
      });
    }

    // Workspace Perspective switcher bindings
    const btnModeFocused = this.querySelector('#view-mode-focused');
    const btnModeUnified = this.querySelector('#view-mode-unified');

    if (btnModeFocused) {
      btnModeFocused.addEventListener('click', () => {
        if (this.workspaceMode === 'focused') return;
        this.workspaceMode = 'focused';
        localStorage.setItem('visual_vault_workspace_mode', 'focused');
        this.loadAssets();
        this.selectedBoard = 'ALL';
        
        // Redraw/Repopulate
        this.renderShell();
        this.attachEventListeners();
        this.updateLayout();
        
        this.addLog('info', 'Workspace view mode: Focused Solitude active (distractions hidden).');
        this.toast('Perspective Isolated', 'Vault view mode isolated strictly to current project.');
      });
    }

    if (btnModeUnified) {
      btnModeUnified.addEventListener('click', () => {
        if (this.workspaceMode === 'unified') return;
        this.workspaceMode = 'unified';
        localStorage.setItem('visual_vault_workspace_mode', 'unified');
        this.loadAssets();
        this.selectedBoard = 'ALL';

        // Redraw/Repopulate
        this.renderShell();
        this.attachEventListeners();
        this.updateLayout();

        this.addLog('success', 'Workspace view mode: Unified Arena active (merged all vaults).');
        this.toast('Perspective Unified', 'Combined reference libraries across all registered vaults!');
      });
    }

    // Library category clicks
    const navAll = this.querySelector('#nav-all-assets');
    if (navAll) {
      navAll.addEventListener('click', () => {
        this.selectedBoard = 'ALL';
        const heading = this.querySelector('#board-title-heading');
        if (heading) heading.textContent = 'All Vault Reference Archives';
        this.updateLayout();
      });
    }

    const navRecent = this.querySelector('#nav-recent');
    if (navRecent) {
      navRecent.addEventListener('click', () => {
        // Toggle sort / filter to items modified inside last session
        this.selectedBoard = 'ALL';
        // Sort items by ID descending to show simulated latest
        this.assets.sort((a,b) => b.id.localeCompare(a.id));
        const heading = this.querySelector('#board-title-heading');
        if (heading) heading.textContent = 'All Vault References Sorted By Creation Date';
        this.updateLayout();
        this.addLog('info', 'Reordered database references by sqlite indexing order.');
      });
    }

    // Event Delegation: Select Board list click triggers
    const listsDiv = this.querySelector('#sidebar-lists');
    if (listsDiv) {
      listsDiv.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        
        // Intercept delete board button clicks
        const deleteBtn = target.closest('[data-delete-board]');
        if (deleteBtn) {
          e.stopPropagation();
          const boardToDelete = (deleteBtn as HTMLElement).dataset.deleteBoard || '';
          this.deleteBoard(boardToDelete);
          return;
        }

        const link = target.closest('.board-link') as HTMLElement;
        if (link) {
          const targetBoard = link.dataset.board || '';
          this.selectedBoard = targetBoard;
          
          // Switch selected asset to first asset contained in this board
          const currentBoardAssets = this.assets.filter(a => a.board === targetBoard);
          if (currentBoardAssets.length > 0) {
            this.selectedAssetId = currentBoardAssets[0].id;
          }

          // Force text updates heading title
          const heading = this.querySelector('#board-title-heading');
          if (heading) heading.textContent = targetBoard;

          this.updateLayout();
          this.addLog('info', `Read metadata records for board: ${targetBoard}`);
        }
      });

      // Supporting dragging reference cards into sidebar category folders (boards)
      listsDiv.addEventListener('dragover', (e: any) => {
        e.preventDefault(); // crucial to enable drop triggers in all browsers including Firefox
        const link = e.target.closest('.board-link') as HTMLElement;
        if (link) {
          link.classList.add('bg-emerald-500/10', 'text-emerald-400');
        }
      });

      listsDiv.addEventListener('dragleave', (e: any) => {
        // Clear highlights on leave to prevent sticky formatting in Firefox
        listsDiv.querySelectorAll('.board-link').forEach(link => {
          link.classList.remove('bg-emerald-500/10', 'text-emerald-400');
        });
      });

      listsDiv.addEventListener('drop', (e: any) => {
        e.preventDefault();
        listsDiv.querySelectorAll('.board-link').forEach(link => {
          link.classList.remove('bg-emerald-500/10', 'text-emerald-400');
        });

        const link = e.target.closest('.board-link') as HTMLElement;
        if (link) {
          const boardName = link.dataset.board || '';
          
          // Support dropping external files from OS directly onto this sidebar board link
          const files = Array.from(e.dataTransfer?.files || []) as File[];
          if (files.length > 0) {
            this.handleImportedFiles(files, boardName);
            return;
          }

          const assetId = e.dataTransfer.getData('text/plain') || e.dataTransfer.getData('text');
          
          if (assetId && boardName) {
            const asset = this.assets.find(a => a.id === assetId);
            if (asset && asset.board !== boardName) {
              const oldBoard = asset.board;
              asset.board = boardName;
              storage.saveAllAssets(this.assets);
              this.addLog('success', `Dropped pin: Moved '${asset.name}' from '${oldBoard}' board to '${boardName}'.`);
              this.updateLayout();
              this.toast('Asset Relocated', `Moved '${asset.metadata.title || asset.name}' to board '${boardName}'.`);
            }
          }
        }
      });
    }

    // Grid selection triggers
    const masonryDiv = this.querySelector('#catalog-masonry');
    if (masonryDiv) {
      masonryDiv.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;

        // Intercept board card delete button clicks
        const deleteBtn = target.closest('[data-delete-board]');
        if (deleteBtn) {
          e.stopPropagation();
          const boardToDelete = (deleteBtn as HTMLElement).dataset.deleteBoard || '';
          this.deleteBoard(boardToDelete);
          return;
        }

        // If currently in visual Boards list mode, intercept Board clicks to drill down!
        if (this.selectedBoard === 'ALL') {
          const boardCard = target.closest('.board-card-item') as HTMLElement;
          if (boardCard) {
            const targetBoard = boardCard.dataset.board || '';
            this.selectedBoard = targetBoard;

            const currentBoardAssets = this.assets.filter(a => a.board === targetBoard);
            if (currentBoardAssets.length > 0) {
              this.selectedAssetId = currentBoardAssets[0].id;
            }

            this.updateLayout();
            this.addLog('info', `Navigated into Category Board: ${targetBoard}`);
            return;
          }
        }

        const card = target.closest('.asset-card') as HTMLElement;
        if (card) {
          const id = card.dataset.id || '';
          this.selectedAssetId = id;
          this.renderInspector();
          
          // Re-highlight cards selectively
          this.querySelectorAll('.asset-card').forEach(n => {
            const nodeId = (n as HTMLElement).dataset.id;
            if (nodeId === id) {
              n.classList.add('ring-2', 'ring-emerald-500', 'border-emerald-500', 'bg-[#121215]');
              n.classList.remove('border-white/10', 'bg-slate-900/60');
            } else {
              n.classList.add('border-white/10', 'bg-slate-900/60');
              n.classList.remove('ring-2', 'ring-emerald-500', 'border-emerald-500', 'bg-[#121215]');
            }
          });

          // Automatically pop up Pinterest-style comprehensive view modal!
          this.isLightboxOpen = false;
          this.toggleLightbox();
        }
      });

      // HTML5 Drag & Drop start on cards
      masonryDiv.addEventListener('dragstart', (e: any) => {
        const card = e.target.closest('.asset-card') as HTMLElement;
        if (card) {
          const id = card.dataset.id || '';
          e.dataTransfer.setData('text/plain', id);
          e.dataTransfer.setData('text', id);
          e.dataTransfer.effectAllowed = 'move';
          card.classList.add('opacity-40');
        }
      });

      // HTML5 Drag & Drop end on cards
      masonryDiv.addEventListener('dragend', (e: any) => {
        const card = e.target.closest('.asset-card') as HTMLElement;
        if (card) {
          card.classList.remove('opacity-40');
        }
      });
    }

    // Grid Size triggers
    const sizeSm = this.querySelector('#size-sm') as HTMLElement;
    const sizeMd = this.querySelector('#size-md') as HTMLElement;
    const sizeLg = this.querySelector('#size-lg') as HTMLElement;
    const sizeButtons = [sizeSm, sizeMd, sizeLg];

    if (sizeSm) {
      sizeSm.addEventListener('click', () => {
        this.gridSize = 'sm';
        this.updateSizeButtonHighlights(sizeSm, sizeButtons);
        this.renderCatalog();
      });
    }
    if (sizeMd) {
      sizeMd.addEventListener('click', () => {
        this.gridSize = 'md';
        this.updateSizeButtonHighlights(sizeMd, sizeButtons);
        this.renderCatalog();
      });
    }
    if (sizeLg) {
      sizeLg.addEventListener('click', () => {
        this.gridSize = 'lg';
        this.updateSizeButtonHighlights(sizeLg, sizeButtons);
        this.renderCatalog();
      });
    }

    // Vault Path Input trigger edits
    const pathInput = this.querySelector('#vault-path-input') as HTMLInputElement;
    if (pathInput) {
      pathInput.addEventListener('change', () => {
        const newPath = pathInput.value.trim();
        storage.setVaultPath(newPath);
        this.addLog('success', `Vault directory changed: ${newPath}. Hot reloading notify crates.`);
        this.toast('Vault Re-assigned', `Watching subdirectory sequence in ${newPath} for active modifications.`);
      });
      pathInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          pathInput.blur();
        }
      });
    }

    // Keyword Search Dynamic Filter input triggers
    const searchInput = this.querySelector('#asset-search') as HTMLInputElement;
    const clearBtn = this.querySelector('#search-clear-btn');
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        this.searchQuery = searchInput.value;
        if (clearBtn) {
          if (this.searchQuery) {
            clearBtn.classList.remove('hidden');
          } else {
            clearBtn.classList.add('hidden');
          }
        }
        this.renderCatalog();
        this.renderTaxonomyNavigation();
      });
    }

    if (clearBtn && searchInput) {
      clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        this.searchQuery = '';
        clearBtn.classList.add('hidden');
        this.renderCatalog();
        this.renderTaxonomyNavigation();
      });
    }

    // Simulated / Interactive Dropzones
    const dropzone = this.querySelector('#drop-zone');
    if (dropzone) {
      dropzone.addEventListener('dragover', (e: any) => {
        e.preventDefault();
        dropzone.classList.remove('border-white/5', 'bg-black/10');
        dropzone.classList.add('border-emerald-500/40', 'bg-emerald-500/5');
      });

      dropzone.addEventListener('dragleave', () => {
        dropzone.classList.remove('border-emerald-500/40', 'bg-emerald-500/5');
        dropzone.classList.add('border-white/5', 'bg-black/10');
      });

      dropzone.addEventListener('drop', (e: any) => {
        e.preventDefault();
        dropzone.classList.remove('border-emerald-500/40', 'bg-emerald-500/5');
        dropzone.classList.add('border-white/5', 'bg-black/10');

        const files = Array.from(e.dataTransfer?.files || []) as File[];
        if (files.length > 0) {
          this.handleImportedFiles(files);
        }
      });
    }

    // Trigger File Pickers click
    const importBtn = this.querySelector('#import-trigger-btn');
    const filePicker = this.querySelector('#local-file-picker') as HTMLInputElement;
    if (importBtn && filePicker) {
      importBtn.addEventListener('click', () => {
        filePicker.click();
      });
      
      filePicker.addEventListener('change', () => {
        const files = Array.from(filePicker.files || []) as File[];
        if (files.length > 0) {
          this.handleImportedFiles(files);
        }
        filePicker.value = ''; // wipe out selection
      });
    }

    // Lightbox modal buttons control
    const lightboxClose = this.querySelector('#lightbox-close');
    const lightboxBackdrop = this.querySelector('#lightbox-backdrop');
    const lightboxPrev = this.querySelector('#lightbox-prev');
    const lightboxNext = this.querySelector('#lightbox-next');

    if (lightboxClose) {
      lightboxClose.addEventListener('click', () => this.toggleLightbox());
    }
    if (lightboxBackdrop) {
      lightboxBackdrop.addEventListener('click', (e) => {
        if (e.target === lightboxBackdrop) {
          this.toggleLightbox();
        }
      });
    }
    if (lightboxPrev) {
      lightboxPrev.addEventListener('click', () => this.navigateLightbox(-1));
    }
    if (lightboxNext) {
      lightboxNext.addEventListener('click', () => this.navigateLightbox(1));
    }

    // Obsidian Vault Manager events
    // 1. Header / Top Bar button action
    const openVaultsBtn = this.querySelector('#open-vaults-manager-btn');
    if (openVaultsBtn) {
      openVaultsBtn.addEventListener('click', () => {
        this.toggleVaultManagerModal();
      });
    }

    // 2. Sidebar load vaults action button
    const navLoadVaultsBtn = this.querySelector('#nav-load-vaults-btn');
    if (navLoadVaultsBtn) {
      navLoadVaultsBtn.addEventListener('click', () => {
        this.toggleVaultManagerModal();
      });
    }

    // 3. Vault manager close icon button
    const vaultManagerClose = this.querySelector('#vault-manager-close');
    if (vaultManagerClose) {
      vaultManagerClose.addEventListener('click', () => {
        this.toggleVaultManagerModal(false);
      });
    }

    // 4. Vault manager close footer button
    const vaultManagerCloseFooter = this.querySelector('#vault-manager-close-footer');
    if (vaultManagerCloseFooter) {
      vaultManagerCloseFooter.addEventListener('click', () => {
        this.toggleVaultManagerModal(false);
      });
    }

    // 5. Vault manager backdrop click dismisser
    const vaultManagerBackdrop = this.querySelector('#vault-manager-backdrop');
    if (vaultManagerBackdrop) {
      vaultManagerBackdrop.addEventListener('click', (e) => {
        if (e.target === vaultManagerBackdrop) {
          this.toggleVaultManagerModal(false);
        }
      });
    }

    // 6. Create New Vault Form Submit Handler
    const btnCreateVaultSubmit = this.querySelector('#btn-create-vault-submit');
    if (btnCreateVaultSubmit) {
      btnCreateVaultSubmit.addEventListener('click', () => {
        const nameInput = this.querySelector('#create-vault-name') as HTMLInputElement | null;
        const pathInput = this.querySelector('#create-vault-path') as HTMLInputElement | null;
        if (nameInput && pathInput) {
          const nameValue = nameInput.value.trim();
          const pathValue = pathInput.value.trim();
          if (!nameValue || !pathValue) {
            alert('Please specify both a Vault Name and an absolute folder reference path.');
            return;
          }
          this.switchVault(pathValue, nameValue);
          nameInput.value = '';
          pathInput.value = '';
        }
      });
    }

    // 7.5 Modern Web-Safe Directory Picker Button Click Handler
    const btnWebDirectoryPicker = this.querySelector('#btn-web-directory-picker');
    if (btnWebDirectoryPicker) {
      btnWebDirectoryPicker.addEventListener('click', () => {
        this.handleWebDirectoryPicker();
      });
    }

    // Interactive Settings Control Center Bindings
    const settingsBtn = this.querySelector('#nav-settings-btn');
    if (settingsBtn) {
      settingsBtn.addEventListener('click', () => {
        this.toggleSettings();
      });
    }

    const settingsClose = this.querySelector('#settings-close');
    if (settingsClose) {
      settingsClose.addEventListener('click', () => {
        this.toggleSettings(false);
      });
    }

    const settingsCloseAction = this.querySelector('#settings-close-action');
    if (settingsCloseAction) {
      settingsCloseAction.addEventListener('click', () => {
        this.toggleSettings(false);
      });
    }

    const settingsBackdrop = this.querySelector('#settings-backdrop');
    if (settingsBackdrop) {
      settingsBackdrop.addEventListener('click', (e) => {
        if (e.target === settingsBackdrop) {
          this.toggleSettings(false);
        }
      });
    }

    // Settings Tab Switchers
    const tabVault = this.querySelector('#settings-tab-vault');
    if (tabVault) {
      tabVault.addEventListener('click', () => {
        this.switchSettingsTab('vault');
      });
    }

    const tabGeneral = this.querySelector('#settings-tab-general');
    if (tabGeneral) {
      tabGeneral.addEventListener('click', () => {
        this.switchSettingsTab('general');
      });
    }

    const tabTaxonomy = this.querySelector('#settings-tab-taxonomy');
    if (tabTaxonomy) {
      tabTaxonomy.addEventListener('click', () => {
        this.switchSettingsTab('taxonomy');
      });
    }

    // Wipe / Clean Sample Vaults Database Action
    const btnWipeSampleVaults = this.querySelector('#btn-wipe-sample-vaults');
    if (btnWipeSampleVaults) {
      btnWipeSampleVaults.addEventListener('click', () => {
        if (confirm('Wipe and clean all sample assets/vaults? This will empty the active asset inventory and clear local storage caches.')) {
          storage.wipeAllVaultCaches();
          this.assets = [];
          this.selectedAssetId = '';
          this.selectedBoard = 'ALL';
          this.addLog('success', 'Wiped catalog database cache. Visual vault is now empty and ready for synchronization!');
          this.updateLayout();
          this.toggleSettings(false); // Close settings panel
          this.toast('Vault Cleared', 'All sample references removed!');
        }
      });
    }

    // Aesthetic Theme Switcher events
    const themeBtnDefault = this.querySelector('#theme-btn-default');
    if (themeBtnDefault) {
      themeBtnDefault.addEventListener('click', () => {
        this.activeTheme = 'default';
        this.injectThemeStyles();
        localStorage.setItem('visual_vault_active_theme', 'default');
        this.toggleSettings(true); // refresh highlighting
        this.addLog('success', 'Aesthetic UI: Switched layout skinning to default Obsidian Dark.');
        this.toast('Theme Switched', 'Default theme applied successfully.');
      });
    }

    const themeBtnMinimalist = this.querySelector('#theme-btn-minimalist');
    if (themeBtnMinimalist) {
      themeBtnMinimalist.addEventListener('click', () => {
        this.activeTheme = 'minimalist';
        this.injectThemeStyles();
        localStorage.setItem('visual_vault_active_theme', 'minimalist');
        this.toggleSettings(true); // refresh highlighting
        this.addLog('success', 'Aesthetic UI: Switched layout skinning to Notion-inspired Off-white (Minimalist).');
        this.toast('Theme Switched', 'Minimalist (Notion Off-White) theme applied successfully.');
      });
    }

    const themeBtnMatrix = this.querySelector('#theme-btn-matrix');
    if (themeBtnMatrix) {
      themeBtnMatrix.addEventListener('click', () => {
        this.activeTheme = 'matrix';
        this.injectThemeStyles();
        localStorage.setItem('visual_vault_active_theme', 'matrix');
        this.toggleSettings(true); // refresh highlighting
        this.addLog('success', 'Aesthetic UI: Switched layout skinning to Y2K CRT matrix.');
        this.toast('Theme Switched', 'Matrix CRT terminal theme applied successfully.');
      });
    }

    // Dynamic accent color-select attachments
    this.querySelectorAll('.accent-select-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const accent = (btn as HTMLElement).dataset.accent || 'emerald';
        this.activeAccent = accent;
        localStorage.setItem('visual_vault_accent_color', accent);
        
        let label = accent;
        if (accent === 'brand') label = 'Brand Royal';
        else if (accent === 'purple') label = 'Obsidian Purple';
        else if (accent === 'blue') label = 'Notion Blue';
        else if (accent === 'red') label = 'Ruby Red';
        else if (accent === 'orange') label = 'Orange';
        else if (accent === 'amber') label = 'Amber';
        else if (accent === 'indigo') label = 'Indigo';
        else if (accent === 'pink') label = 'Pink';
        else if (accent === 'emerald') label = 'Emerald';
        else if (accent === 'custom') label = 'Custom Hex';

        this.injectThemeStyles();
        this.syncSettingsHighlights();
        this.addLog('success', `Aesthetic UI: Customised accent color to ${label}.`);
        this.toast('Accent Modified', `Accent color changed to ${label}!`);
      });
    });

    const colorPicker = this.querySelector('#custom-accent-color-picker') as HTMLInputElement | null;
    const hexInput = this.querySelector('#custom-accent-hex-input') as HTMLInputElement | null;

    if (colorPicker && hexInput) {
      colorPicker.addEventListener('input', () => {
        const value = colorPicker.value.toUpperCase();
        this.customAccentHex = value;
        localStorage.setItem('visual_vault_custom_accent_hex', value);
        hexInput.value = value;
        this.injectThemeStyles();
        
        const previewDot = this.querySelector('#custom-accent-color-preview') as HTMLElement | null;
        if (previewDot) previewDot.style.background = value;
      });

      colorPicker.addEventListener('change', () => {
        const value = colorPicker.value.toUpperCase();
        this.addLog('success', `Aesthetic UI: Customised accent to ${value} (Custom Hex).`);
      });

      hexInput.addEventListener('change', () => {
        let val = hexInput.value.trim().toUpperCase();
        if (!val.startsWith('#')) val = '#' + val;
        if (/^#[0-9A-F]{6}$/i.test(val)) {
          this.customAccentHex = val;
          localStorage.setItem('visual_vault_custom_accent_hex', val);
          colorPicker.value = val;
          this.injectThemeStyles();
          
          const previewDot = this.querySelector('#custom-accent-color-preview') as HTMLElement | null;
          if (previewDot) previewDot.style.background = val;
          this.addLog('success', `Aesthetic UI: Customised accent to ${val} (Custom Hex).`);
          this.toast('Accent Modified', `Custom hex set to ${val}`);
        } else {
          this.toast('Invalid Hex', 'Please enter a valid hex color code (e.g., #FF5500).');
          hexInput.value = this.customAccentHex || '#10B981';
        }
      });
    }

    // Dynamic system font-select attachments
    this.querySelectorAll('.font-select-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const font = (btn as HTMLElement).dataset.font || 'inter';
        this.activeFont = font;
        localStorage.setItem('visual_vault_system_font', font);
        
        let label = font;
        if (font === 'inter') label = 'Inter Sans';
        else if (font === 'space-grotesk') label = 'Space Grotesk';
        else if (font === 'outfit') label = 'Outfit';
        else if (font === 'playfair') label = 'Playfair Display';
        else if (font === 'jetbrains') label = 'JetBrains Mono';
        else if (font === 'system') label = 'System UI';
        else if (font === 'georgia') label = 'Georgia Serif';
        else if (font === 'courier') label = 'Courier Classic';
        else if (font === 'space-mono') label = 'Space Mono';
        else if (font === 'lexend') label = 'Lexend';
        else if (font === 'tektur') label = 'Tektur';
        else if (font === 'ibm-plex-mono') label = 'IBM Plex Mono';

        this.injectThemeStyles();
        this.syncSettingsHighlights();
        this.addLog('success', `Aesthetic UI: Switched system typeface to ${label}.`);
        this.toast('Font Synced', `Typeface changed to ${label}!`);
      });
    });

    // Predefined visual image vaults loader actions
    const btnNeoTokyo = this.querySelector('#load-vault-neotokyo');
    if (btnNeoTokyo) {
      btnNeoTokyo.addEventListener('click', () => this.loadPresetVault('neotokyo'));
    }

    const btnCybercity = this.querySelector('#load-vault-cybercity');
    if (btnCybercity) {
      btnCybercity.addEventListener('click', () => this.loadPresetVault('cybercity'));
    }

    const btnBlueprint = this.querySelector('#load-vault-blueprint');
    if (btnBlueprint) {
      btnBlueprint.addEventListener('click', () => this.loadPresetVault('blueprint'));
    }

    const btnCharacters = this.querySelector('#load-vault-characters');
    if (btnCharacters) {
      btnCharacters.addEventListener('click', () => this.loadPresetVault('characters'));
    }

    const btnAllVaults = this.querySelector('#load-vault-all');
    if (btnAllVaults) {
      btnAllVaults.addEventListener('click', () => {
        this.loadPresetVault('all');
      });
    }

    // ----------------------------------------------------
    // Custom Schema & Status Configurator Event Handlers
    // ----------------------------------------------------
    const parseStatusesInput = (text: string) => {
      return text.split(',').map(item => {
        const parts = item.split(':');
        const value = parts[0]?.trim() || '';
        const label = parts[1]?.trim() || value;
        return { value, label };
      }).filter(s => s.value);
    };

    const saveSchemaConfig = (config: CustomSchemaConfig) => {
      this.schemaConfig = config;
      localStorage.setItem('visual_vault_schema_config_v1', JSON.stringify(config));
      
      const jsonEditor = this.querySelector('#schema-json-editor') as HTMLTextAreaElement | null;
      if (jsonEditor && document.activeElement !== jsonEditor) {
        jsonEditor.value = JSON.stringify(config, null, 2);
      }
      
      this.renderInspector();
      this.populateLightboxData();
    };

    const schemaLabelTitle = this.querySelector('#schema-label-title') as HTMLInputElement | null;
    const schemaLabelNotes = this.querySelector('#schema-label-notes') as HTMLInputElement | null;
    const schemaLabelArtist = this.querySelector('#schema-label-artist') as HTMLInputElement | null;
    const schemaLabelRating = this.querySelector('#schema-label-rating') as HTMLInputElement | null;
    const schemaStatusesInput = this.querySelector('#schema-statuses-input') as HTMLInputElement | null;
    const schemaJsonEditor = this.querySelector('#schema-json-editor') as HTMLTextAreaElement | null;
    const feedbackSpan = this.querySelector('#json-val-feedback') as HTMLElement | null;

    if (schemaLabelTitle) {
      schemaLabelTitle.addEventListener('input', () => {
        const value = schemaLabelTitle.value.trim() || 'Pin Name / Title';
        const updated = { ...this.schemaConfig };
        updated.properties.title.label = value;
        saveSchemaConfig(updated);
      });
    }

    if (schemaLabelNotes) {
      schemaLabelNotes.addEventListener('input', () => {
        const value = schemaLabelNotes.value.trim() || 'Pin Notes / Description';
        const updated = { ...this.schemaConfig };
        updated.properties.notes.label = value;
        saveSchemaConfig(updated);
      });
    }

    if (schemaLabelArtist) {
      schemaLabelArtist.addEventListener('input', () => {
        const value = schemaLabelArtist.value.trim() || 'Artist / Creator';
        const updated = { ...this.schemaConfig };
        updated.properties.artist.label = value;
        saveSchemaConfig(updated);
      });
    }

    if (schemaLabelRating) {
      schemaLabelRating.addEventListener('input', () => {
        const value = schemaLabelRating.value.trim() || 'Visual Vault Grade';
        const updated = { ...this.schemaConfig };
        updated.properties.rating.label = value;
        saveSchemaConfig(updated);
      });
    }

    if (schemaStatusesInput) {
      schemaStatusesInput.addEventListener('input', () => {
        const statuses = parseStatusesInput(schemaStatusesInput.value);
        if (statuses.length > 0) {
          const updated = { ...this.schemaConfig };
          updated.statuses = statuses;
          saveSchemaConfig(updated);
        }
      });
    }

    if (schemaJsonEditor) {
      schemaJsonEditor.addEventListener('input', () => {
        try {
          const parsed = JSON.parse(schemaJsonEditor.value);
          if (parsed && Array.isArray(parsed.statuses) && parsed.properties) {
            if (feedbackSpan) {
              feedbackSpan.textContent = '✓ Valid Schema';
              feedbackSpan.className = 'text-[9px] text-emerald-400 font-mono';
            }
            if (schemaStatusesInput && document.activeElement !== schemaStatusesInput) {
              schemaStatusesInput.value = parsed.statuses.map((s: any) => `${s.value}:${s.label}`).join(', ');
            }
            if (schemaLabelTitle && document.activeElement !== schemaLabelTitle) {
              schemaLabelTitle.value = parsed.properties.title?.label || '';
            }
            if (schemaLabelNotes && document.activeElement !== schemaLabelNotes) {
              schemaLabelNotes.value = parsed.properties.notes?.label || '';
            }
            if (schemaLabelArtist && document.activeElement !== schemaLabelArtist) {
              schemaLabelArtist.value = parsed.properties.artist?.label || '';
            }
            if (schemaLabelRating && document.activeElement !== schemaLabelRating) {
              schemaLabelRating.value = parsed.properties.rating?.label || '';
            }
            
            this.schemaConfig = parsed;
            localStorage.setItem('visual_vault_schema_config_v1', JSON.stringify(parsed));
            this.renderInspector();
            this.populateLightboxData();
          } else {
            if (feedbackSpan) {
              feedbackSpan.textContent = '✗ Invalid structure';
              feedbackSpan.className = 'text-[9px] text-red-400 font-mono';
            }
          }
        } catch (e: any) {
          if (feedbackSpan) {
            feedbackSpan.textContent = `✗ Parse error: ${e.message.substring(0, 20)}`;
            feedbackSpan.className = 'text-[9px] text-red-400 font-mono';
          }
        }
      });
    }

    const schemaResetBtn = this.querySelector('#schema-reset-btn');
    if (schemaResetBtn) {
      schemaResetBtn.addEventListener('click', () => {
        if (confirm('Reset custom metadata schema and statuses back to defaults?')) {
          saveSchemaConfig({ ...defaultSchemaConfig });
          this.populateSchemaSettingsInputs();
          if (feedbackSpan) {
            feedbackSpan.textContent = '✓ Valid Schema';
            feedbackSpan.className = 'text-[9px] text-emerald-400 font-mono';
          }
          this.toast('Schema Reset', 'Default schema database parameters applied.');
          this.addLog('success', 'Reset schema metadata models to factory default parameters.');
        }
      });
    }

    const schemaExportBtn = this.querySelector('#schema-export-btn');
    if (schemaExportBtn) {
      schemaExportBtn.addEventListener('click', () => {
        const blob = new Blob([JSON.stringify(this.schemaConfig, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'visual_vault_config.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.addLog('success', 'Exported customizable schema configuration file: visual_vault_config.json');
        this.toast('Exported Successfully', 'Schema config downloaded as visual_vault_config.json');
      });
    }

    const schemaImportFile = this.querySelector('#schema-import-file') as HTMLInputElement | null;
    if (schemaImportFile) {
      schemaImportFile.addEventListener('change', () => {
        const file = schemaImportFile.files?.[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const parsed = JSON.parse(e.target?.result as string);
            if (parsed && Array.isArray(parsed.statuses) && parsed.properties) {
              saveSchemaConfig(parsed);
              this.populateSchemaSettingsInputs();
              if (feedbackSpan) {
                feedbackSpan.textContent = '✓ Valid Schema';
                feedbackSpan.className = 'text-[9px] text-emerald-400 font-mono';
              }
              this.toast('Imported Successfully', 'Custom JSON schema configuration loaded.');
              this.addLog('success', 'Successfully synchronized external schema metadata properties.');
            } else {
              this.toast('Import Failed', 'Invalid JSON config structure. Must contain "statuses" and "properties".');
            }
          } catch (err) {
            this.toast('Import Failed', 'Failed to parse JSON file.');
          }
          schemaImportFile.value = ''; // Reset file input
        };
        reader.readAsText(file);
      });
    }

    // Modal Board Creation Events
    const sidebarAddTrigger = this.querySelector('#sidebar-add-board-trigger');
    if (sidebarAddTrigger) {
      sidebarAddTrigger.addEventListener('click', () => {
        this.toggleBoardCreateModal(true);
      });
    }

    const modalBoardClose = this.querySelector('#board-create-close');
    if (modalBoardClose) {
      modalBoardClose.addEventListener('click', () => {
        this.toggleBoardCreateModal(false);
      });
    }

    const modalBoardCancelBtn = this.querySelector('#modal-board-cancel');
    if (modalBoardCancelBtn) {
      modalBoardCancelBtn.addEventListener('click', () => {
        this.toggleBoardCreateModal(false);
      });
    }

    const boardCreateBackdrop = this.querySelector('#board-create-backdrop');
    if (boardCreateBackdrop) {
      boardCreateBackdrop.addEventListener('click', (e) => {
        if (e.target === boardCreateBackdrop) {
          this.toggleBoardCreateModal(false);
        }
      });
    }

    const modalBoardNameIn = this.querySelector('#modal-board-name') as HTMLInputElement | null;
    const modalBoardSubmitBtn = this.querySelector('#modal-board-submit');
    if (modalBoardSubmitBtn && modalBoardNameIn) {
      const submitAction = () => {
        const val = modalBoardNameIn.value.trim();
        if (val) {
          this.createNewBoard(val);
          this.toggleBoardCreateModal(false);
        } else {
          this.toast('Invalid Name', 'Please enter a valid directory sub-folder path.');
        }
      };

      modalBoardSubmitBtn.addEventListener('click', submitAction);
      modalBoardNameIn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          submitAction();
        } else if (e.key === 'Escape') {
          this.toggleBoardCreateModal(false);
        }
      });
    }

    // Clipboard Paste Listener for copy/pasting files into the active board
    window.addEventListener('paste', (e: ClipboardEvent) => {
      const activeEl = document.activeElement;
      const isInput = activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA');
      
      const files = Array.from(e.clipboardData?.files || []) as File[];
      const imageFiles = files.filter(f => f.type.startsWith('image/'));
      
      if (imageFiles.length > 0) {
        if (isInput) e.preventDefault();
        this.addLog('info', `Local folder hot-sync scan: Paste action received (${imageFiles.length} file streams).`);
        this.addLog('success', `Simulating physical file placement: Copied to '${this.selectedBoard}' folder directory.`);
        this.handleImportedFiles(imageFiles);
      }
    });

    // Empty state pick file trigger
    const emptyStatePickBtn = this.querySelector('#empty-state-pick-btn');
    if (emptyStatePickBtn && filePicker) {
      emptyStatePickBtn.addEventListener('click', () => {
        filePicker.click();
      });
    }
  }

  private updateSizeButtonHighlights(activeBtn: HTMLElement, buttons: (HTMLElement | null)[]) {
    buttons.forEach(btn => {
      if (btn) {
        btn.classList.remove('bg-white/5', 'text-emerald-400', 'font-semibold');
        btn.classList.add('text-slate-500');
      }
    });
    activeBtn.classList.add('bg-white/5', 'text-emerald-400', 'font-semibold');
    activeBtn.classList.remove('text-slate-500');
  }

  /**
   * Action triggers for selecting tags, editing front-matter txt layouts, 
   * rating indices from the inspectors.
   */
  private attachInspectorEvents() {
    const asset = this.assets.find(a => a.id === this.selectedAssetId);
    if (!asset) return;

    // Title Input Change handler
    const titleIn = this.querySelector('#meta-title-input') as HTMLInputElement | null;
    if (titleIn) {
      titleIn.addEventListener('change', () => {
        const val = titleIn.value.trim();
        asset.metadata.title = val;
        storage.updateAsset(asset.id, { metadata: asset.metadata });
        this.addLog('success', `Transactional write [catalog.db]: Pin Display Title updated to "${val}".`);
        
        // Also update companion YAML editor view
        const yamlEditor = this.querySelector('#markdown-yaml-editor') as HTMLTextAreaElement | null;
        if (yamlEditor) {
          yamlEditor.value = stringifyYAMLFrontmatter(asset.metadata);
        }
        
        // Update grid visual card footer title instantly without full masonry re-render
        const gridCardFooterSpan = this.querySelector(`#footer-${asset.id} span`);
        if (gridCardFooterSpan) {
          gridCardFooterSpan.textContent = val || asset.name;
        }
        this.syncAssetInGridFooter(asset);
      });
      titleIn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') titleIn.blur();
      });
    }

    // Notes Input Change handler
    const notesIn = this.querySelector('#meta-notes-input') as HTMLTextAreaElement | null;
    if (notesIn) {
      notesIn.addEventListener('change', () => {
        const val = notesIn.value.trim();
        asset.metadata.notes = val;
        storage.updateAsset(asset.id, { metadata: asset.metadata });
        this.addLog('success', `Transactional write [catalog.db]: Inspiration Notes updated.`);
        
        // Also update companion YAML editor view
        const yamlEditor = this.querySelector('#markdown-yaml-editor') as HTMLTextAreaElement | null;
        if (yamlEditor) {
          yamlEditor.value = stringifyYAMLFrontmatter(asset.metadata);
        }
      });
    }

    // Up/Down Arrangement Click handlers
    const btnMoveUp = this.querySelector('#action-move-up');
    if (btnMoveUp) {
      btnMoveUp.addEventListener('click', () => {
        this.rearrangeAsset('up');
      });
    }

    const btnMoveDown = this.querySelector('#action-move-down');
    if (btnMoveDown) {
      btnMoveDown.addEventListener('click', () => {
        this.rearrangeAsset('down');
      });
    }

    // Board Relocation Selection handler
    const moveBoardSelect = this.querySelector('#action-move-board-select') as HTMLSelectElement | null;
    if (moveBoardSelect) {
      moveBoardSelect.addEventListener('change', () => {
        const targetBoardName = moveBoardSelect.value;
        if (targetBoardName && targetBoardName !== asset.board) {
          const prevBoard = asset.board;
          asset.board = targetBoardName;
          storage.saveAllAssets(this.assets);
          this.addLog('success', `Relocated pin: '${asset.name}' physically moved ${prevBoard} -> ${targetBoardName}`);
          
          this.toast('Asset Relocated', `Successfully moved '${asset.name}' reference to board '${targetBoardName}'.`);
          this.updateLayout();
        }
      });
    }

    // Delete asset record click
    const deleteBtn = this.querySelector('#asset-delete-btn');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', async () => {
        if (confirm(`Remove index companion configuration for '${asset.name}'? Companion .md and physical files will be unlinked and deleted.`)) {
          const electronAPI = (window as any).electronAPI;
          if (electronAPI) {
            const activePath = storage.getVaultPath();
            if (activePath) {
              await electronAPI.deleteAssetFile(activePath, asset.board, asset.name);
            }
          }
          this.assets = storage.deleteAsset(asset.id);
          this.addLog('warn', `Unlinked database entry and deleted file metadata block: ${asset.name.replace(/\.[a-z]+$/, '.md')}`);
          
          // Switch selections
          if (this.assets.length > 0) {
            this.selectedAssetId = this.assets[0].id;
          } else {
            this.selectedAssetId = '';
          }
          this.updateLayout();
          this.toast('Companion Unlinked', `Metadata file and catalog caches for ${asset.name} unlinked.`);
        }
      });
    }

    // Star Rating Click triggers
    const ratingStarts = this.querySelectorAll('.star-rating-item');
    ratingStarts.forEach(node => {
      node.addEventListener('click', (e) => {
        const element = e.currentTarget as HTMLElement;
        const rate = element.dataset.rate || '5';
        
        asset.metadata.rating = rate;
        storage.updateAsset(asset.id, { metadata: asset.metadata });
        
        this.addLog('success', `Transactional write successful [catalog.db]: Rating updated (${rate} Stars).`);
        this.renderInspector();
        this.syncAssetInGridFooter(asset);
        this.toast('SQLite Synchronized', `Obsidian meta-rating graded as ${rate} Stars.`);
      });
    });

    // Option Status selects
    const statusSelect = this.querySelector('#meta-status-select') as HTMLSelectElement;
    if (statusSelect) {
      statusSelect.addEventListener('change', () => {
        const val = statusSelect.value;
        asset.metadata.status = val;
        storage.updateAsset(asset.id, { metadata: asset.metadata });
        
        this.addLog('success', `Mirroring .md markdown state to disk for ${asset.name}: companion status='${val}'`);
        this.renderInspector();
        this.toast('Markdown Mirror ok', `YAML state mirrored down: status: '${val}'`);
      });
    }

    // String input creators Artist
    const artistInput = this.querySelector('#meta-artist-input') as HTMLInputElement;
    if (artistInput) {
      artistInput.addEventListener('change', () => {
        const val = artistInput.value.trim() || 'Unknown';
        asset.metadata.artist = val;
        storage.updateAsset(asset.id, { metadata: asset.metadata });
        
        this.addLog('success', `Obsidian front-matter write: artist='${val}'`);
        this.renderInspector();
      });
      artistInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') artistInput.blur();
      });
    }

    // Color Swatch Clipboard copies
    const swatches = this.querySelectorAll('.palette-swatch');
    swatches.forEach(sw => {
      sw.addEventListener('click', (e) => {
        const node = e.currentTarget as HTMLElement;
        const hex = node.dataset.hex || '#000000';
        
        navigator.clipboard.writeText(hex).then(() => {
          this.toast('HEX Copied', `${hex} copied to local clipboard.`);
          this.addLog('info', `Clipboard transaction read hex swatch: ${hex}`);
          
          // Temporary highlight
          const span = node.querySelector('span');
          if (span) {
            const org = span.textContent;
            span.textContent = 'COPIED!';
            span.classList.add('text-emerald-400');
            setTimeout(() => {
              span.textContent = org;
              span.classList.remove('text-emerald-400');
            }, 1000);
          }
        }).catch(err => {
          console.error('Copy failure', err);
        });
      });
    });

    // Companion Tag Removes
    const tagRemovals = this.querySelectorAll('.meta-tag-remove');
    tagRemovals.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation(); // Avoid selector bubbling
        const node = e.currentTarget as HTMLElement;
        const tag = node.dataset.tag || '';

        asset.metadata.tags = asset.metadata.tags.filter(t => t !== tag);
        storage.updateAsset(asset.id, { metadata: asset.metadata });
        
        this.addLog('warn', `Unlinked Markdown entry descriptor: unlinked tag #${tag}`);
        this.renderInspector();
        this.toast('Front-matter modified', `Metadata descriptor tag #${tag} unlinked.`);
      });
    });

    // Companion Preset Tag Toggles
    const presetBtns = this.querySelectorAll('.preset-tag-btn');
    presetBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const node = e.currentTarget as HTMLElement;
        const tag = node.dataset.tag || '';
        
        const idx = asset.metadata.tags.findIndex(t => t.toLowerCase().trim() === tag.toLowerCase().trim());
        if (idx !== -1) {
          // Remove it!
          asset.metadata.tags.splice(idx, 1);
          storage.updateAsset(asset.id, { metadata: asset.metadata });
          this.addLog('warn', `Unlinked preset tag #${tag}`);
          this.toast('Tag Removed', `#${tag} removed from asset.`);
        } else {
          // Add it!
          asset.metadata.tags.push(tag);
          storage.updateAsset(asset.id, { metadata: asset.metadata });
          this.addLog('success', `Linked preset tag #${tag}`);
          this.toast('Tag Added', `#${tag} linked to asset.`);
        }
        this.renderInspector();
      });
    });

    // Companion Tag Badges click-to-filter
    const badges = this.querySelectorAll('.meta-tag-badge');
    badges.forEach(badge => {
      badge.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        if (target.classList.contains('meta-tag-remove')) return;
        
        const tag = (e.currentTarget as HTMLElement).dataset.tag || '';
        this.applyTagFilter(tag);
      });
    });

    // Add Tag triggers
    const addTagIn = this.querySelector('#add-tag-input') as HTMLInputElement;
    const addTagBtn = this.querySelector('#add-tag-btn') as HTMLButtonElement;
    
    if (addTagIn && addTagBtn) {
      const handleAddTag = () => {
        const val = addTagIn.value.trim().toLowerCase().replace(/[^a-zA-Z0-9_-]/g, '');
        if (val) {
          if (!asset.metadata.tags.includes(val)) {
            asset.metadata.tags.push(val);
            storage.updateAsset(asset.id, { metadata: asset.metadata });
            
            this.addLog('success', `Obsidian indexing transaction: Append tag descriptor #${val}`);
            this.renderInspector();
            this.toast('Tag Appended', `#${val} appended to Obsidian companion config file.`);
          } else {
            this.toast('Duplicate Tag', `#${val} is already bound to this active asset.`);
          }
          addTagIn.value = '';
          addTagBtn.classList.add('hidden');
        }
      };

      addTagIn.addEventListener('input', () => {
        if (addTagIn.value.trim()) {
          addTagBtn.classList.remove('hidden');
        } else {
          addTagBtn.classList.add('hidden');
        }
      });

      addTagIn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') handleAddTag();
      });

      addTagBtn.addEventListener('click', handleAddTag);
    }

    // YAML direct Textarea editing (Dual Synchronization layout flow!)
    const yamlArea = this.querySelector('#markdown-yaml-editor') as HTMLTextAreaElement;
    if (yamlArea) {
      yamlArea.addEventListener('change', () => {
        const rawYamlText = yamlArea.value;
        const updatedMeta = parseYAMLFrontmatter(rawYamlText, asset.metadata);
        
        asset.metadata = updatedMeta;
        storage.updateAsset(asset.id, { metadata: asset.metadata });
        
        this.addLog('success', `Obsidian Dual-Sync Mirror: Direct client manual modifications compiled.`);
        this.renderInspector();
        this.syncAssetInGridFooter(asset);
        this.toast('Obsidian Sync Ok', `Markdown frontmatter dual interface synchronized.`);
      });
    }

    // Obsidian simulation launch routine Trigger
    const actionObsidian = this.querySelector('#action-obsidian');
    if (actionObsidian) {
      actionObsidian.addEventListener('click', () => {
        const mdPath = `${this.selectedBoard.replace(/^\//,'')}/${asset.name.replace(/\.[a-z]+$/, '.md')}`;
        const obsidianUri = `obsidian://open?vault=${encodeURIComponent(storage.getVaultPath().split('/').pop() || 'Vault')}&file=${encodeURIComponent(mdPath)}`;
        this.addLog('info', `Firing Obsidian desk command: ${obsidianUri}`);
        this.toast('Obsidian Fired', `Launching Obsidian for ${asset.name.replace(/\.[a-z]+$/,'')}...`);
        try {
          window.location.href = obsidianUri;
        } catch (err) {
          console.error('Failed to trigger Obsidian protocol handler', err);
        }
      });
    }

    // Color palette similarity search button
    const searchSimilarBtn = this.querySelector('#search-similar-palette-btn');
    if (searchSimilarBtn) {
      searchSimilarBtn.addEventListener('click', () => {
        this.colorPaletteSearchQuery = asset.colors;
        this.addLog('info', `Active Filter: Searching for images with similar average color palette.`);
        this.toast('Palette Search Active', `Searching for assets with a similar average color palette to '${asset.name}'.`);
        this.renderCatalog();
        this.updateActiveColorPaletteUI();
      });
    }
  }

  // Visual helper update card texts in masonry footer directly
  private syncAssetInGridFooter(asset: Asset) {
    const captionSpan = this.querySelector(`#footer-${asset.id} span`);
    if (captionSpan) {
      captionSpan.className = 'truncate font-semibold text-emerald-400';
      setTimeout(() => {
        captionSpan.className = 'truncate font-medium text-slate-200 group-hover:text-emerald-400 transition pr-2';
      }, 1000);
    }
  }

  private rearrangeAsset(direction: 'up' | 'down') {
    const asset = this.assets.find(a => a.id === this.selectedAssetId);
    if (!asset) return;

    // Get the exact visible list under current filters/board selection
    const filtered = this.getFilteredAssets();
    const idx = filtered.findIndex(a => a.id === asset.id);
    if (idx === -1) return;

    if (direction === 'up') {
      if (idx === 0) {
        this.toast('First Item', 'This pin is already at the top of the current board layout.');
        return;
      }
      // Target neighbor is filtered[idx - 1]
      const neighbor = filtered[idx - 1];
      // Find where they are in global this.assets array and swap them
      const globalIdxSelf = this.assets.findIndex(a => a.id === asset.id);
      const globalIdxNeighbor = this.assets.findIndex(a => a.id === neighbor.id);
      if (globalIdxSelf !== -1 && globalIdxNeighbor !== -1) {
        const temp = this.assets[globalIdxSelf];
        this.assets[globalIdxSelf] = this.assets[globalIdxNeighbor];
        this.assets[globalIdxNeighbor] = temp;
      }
    } else {
      if (idx === filtered.length - 1) {
        this.toast('Last Item', 'This pin is already at the bottom of the current board layout.');
        return;
      }
      // Target neighbor is filtered[idx + 1]
      const neighbor = filtered[idx + 1];
      // Find where they are in global this.assets array and swap them
      const globalIdxSelf = this.assets.findIndex(a => a.id === asset.id);
      const globalIdxNeighbor = this.assets.findIndex(a => a.id === neighbor.id);
      if (globalIdxSelf !== -1 && globalIdxNeighbor !== -1) {
        const temp = this.assets[globalIdxSelf];
        this.assets[globalIdxSelf] = this.assets[globalIdxNeighbor];
        this.assets[globalIdxNeighbor] = temp;
      }
    }

    // Save changes to storage and update layout
    storage.saveAllAssets(this.assets);
    this.addLog('success', `Rearranged layout coordinates: Swapped index ordering for ${asset.name}.`);
    this.updateLayout();
  }

  // ----------------------------------------------------
  // Core Business Logics Helpers
  // ----------------------------------------------------
  private createNewBoard(name: string) {
    // Sanitize path separators
    let formattedPath = name.trim();
    if (!formattedPath) return;
    
    if (!formattedPath.startsWith('/')) {
      formattedPath = '/' + formattedPath;
    }
    
    // Check duplication values
    const current = this.getUniqueBoards();
    if (current.includes(formattedPath)) {
      this.toast('Board Exists', `The collection ${formattedPath} has already been registered inside database catalog.`);
      return;
    }

    const electronAPI = (window as any).electronAPI;
    const vaultPath = storage.getVaultPath();

    if (electronAPI && vaultPath) {
      electronAPI.createBoardDirectory(vaultPath, formattedPath).then((res: any) => {
        if (res && res.success) {
          this.addLog('success', `Electron API: Created physical directory: ${formattedPath}`);
        } else {
          this.addLog('warn', `Electron API: Failed to create physical directory ${formattedPath}`);
        }
      });
    }

    // Persist path reference in custom created boards list inside localStorage, scoped specifically to the active vault
    try {
      const customKey = `visual_vault_created_boards_list_${vaultPath.replace(/[^a-zA-Z0-9_]/g, '_')}`;
      const customRaw = localStorage.getItem(customKey);
      const list = customRaw ? JSON.parse(customRaw) as string[] : [];
      if (!list.includes(formattedPath)) {
        list.push(formattedPath);
        localStorage.setItem(customKey, JSON.stringify(list));
      }
    } catch (e) {
      console.error(e);
    }

    this.selectedBoard = formattedPath;
    this.selectedAssetId = ''; // Completely empty directory state initially

    this.addLog('success', `Created empty system folder directory inside Vault filesystem: ${formattedPath}`);
    this.addLog('info', `Created markdown catalog binder companion configurations.`);
    this.updateLayout();
    
    // Update header heading title
    const heading = this.querySelector('#board-title-heading');
    if (heading) heading.textContent = formattedPath;

    this.toast('New Board Created', `Empty sub-board synced mapping to ${formattedPath}`);
  }

  private deleteBoard(boardName: string) {
    if (!boardName || boardName === 'ALL') return;

    const isSub = boardName.replace(/^\/\s*/, '').split('/').length > 1;
    const typeLabel = isSub ? 'section' : 'board';

    if (confirm(`Are you sure you want to delete the ${typeLabel} "${boardName}"?`)) {
      const deleteFiles = confirm(
        `Would you also like to delete all reference files currently inside "${boardName}"?\n\n` +
        `- Click OK (Yes) to delete both the ${typeLabel} and its files/sub-sections.\n` +
        `- Click Cancel (No) to delete the ${typeLabel} but keep the files in the vault folder.`
      );

      const vaultPath = storage.getVaultPath();
      const electronAPI = (window as any).electronAPI;

      if (electronAPI && vaultPath) {
        electronAPI.deleteBoardDirectory(vaultPath, boardName, !deleteFiles).then((res: any) => {
          if (res && res.success) {
            this.addLog('success', `Electron API: Deleted physical directory: ${boardName}`);
          } else {
            this.addLog('warn', `Electron API: Failed to delete physical directory ${boardName}`);
          }
        });
      }

      // 1. Update the custom created boards list for the current vault
      const customKey = `visual_vault_created_boards_list_${vaultPath.replace(/[^a-zA-Z0-9_]/g, '_')}`;
      const allBoards = this.getUniqueBoards();
      const updatedBoards = allBoards.filter(b => b !== boardName && !b.startsWith(boardName + '/'));
      localStorage.setItem(customKey, JSON.stringify(updatedBoards));

      // 2. Handle associated files (assets)
      if (deleteFiles) {
        // Delete both the board mapping and the physical reference files representing the assets (including nested sections/sub-boards)
        const fileCount = this.assets.filter(a => a.board === boardName || a.board.startsWith(boardName + '/')).length;
        this.assets = this.assets.filter(a => a.board !== boardName && !a.board.startsWith(boardName + '/'));
        storage.saveAllAssets(this.assets);
        this.addLog('success', `Wiped board "${boardName}" (and all its nested sub-sections) and deleted all ${fileCount} reference files from vault.`);
        this.toast('Board & Files Deleted', `Deleted board "${boardName}" and ${fileCount} files.`);
      } else {
        // Delete board only: files remain in the vault folder at the root level ("/")
        let movedCount = 0;
        this.assets.forEach(a => {
          if (a.board === boardName || a.board.startsWith(boardName + '/')) {
            a.board = '/';
            // In Electron, we moved physical files in the backend. Let's update frontend urls if they contain board folder
            if (electronAPI) {
              const fileName = a.name;
              const fullNativePath = `${vaultPath}/${fileName}`.replace(/\\/g, '/');
              a.imageUrl = `visual-vault://${fullNativePath}`;
            }
            movedCount++;
          }
        });
        storage.saveAllAssets(this.assets);
        this.addLog('success', `Wiped board "${boardName}". Kept ${movedCount} reference files at the vault root.`);
        this.toast('Board Deleted (Files Kept)', `Deleted board "${boardName}". ${movedCount} files kept at root.`);
      }

      // If the deleted board was the currently active selection, reset to 'ALL'
      if (this.selectedBoard === boardName || this.selectedBoard.startsWith(boardName + '/')) {
        this.selectedBoard = 'ALL';
      }

      this.updateLayout();
    }
  }

  /**
   * Complex files import: Handles multi-file select natively within sandbox.
   * Utilizes offscreen context mapping to read real resolution and extract 5 color arrays.
   */
  private handleImportedFiles(files: File[], targetBoard?: string) {
    this.addLog('info', `Synchronous walkdir background scanner: Triage queue size = ${files.length} items.`);
    
    let processed = 0;
    const importBoard = targetBoard || (this.selectedBoard === 'ALL' ? '/ Environment_Ref/Neo_Tokyo' : this.selectedBoard);
    
    files.forEach(file => {
      // Validate is image file (either by MIME type or file extension fallback)
      const ext = file.name.split('.').pop()?.toLowerCase() || '';
      const isImage = file.type.startsWith('image/') || 
                      ['png', 'jpg', 'jpeg', 'webp', 'gif', 'svg', 'bmp', 'avif', 'tiff', 'jfif', 'heic', 'heif'].includes(ext);
      
      if (!isImage) {
        this.addLog('warn', `Triage exception: skipped index '${file.name}', unrecognized file signature.`);
        processed++;
        return;
      }

      this.addLog('info', `Background scanner processing header payload: ${file.name}`);
      
      const fileUrl = URL.createObjectURL(file);
      const img = new Image();
      img.onload = async () => {
        const resolution = `${img.naturalWidth}x${img.naturalHeight}`;
        const approxSize = file.size > 1024 * 1024 
          ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
          : `${(file.size / 1024).toFixed(0)} KB`;

        // Extract color palettes on miniature representation
        const palette = await extractColorsFromImage(fileUrl);
        
        const importedAsset: Asset = {
          id: `as_user_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
          name: file.name,
          board: importBoard,
          resolution,
          size: approxSize,
          colors: palette,
          tags: ['User-Import', 'Raw-Reference'],
          metadata: {
            tags: ['import', 'reference', 'raw-data'],
            artist: storage.getVaultPath().split(/[/\\]/).pop() || 'Workspace',
            rating: '4',
            status: 'completed',
            title: file.name.replace(/\.[a-zA-Z0-9]+$/, '').replace(/[-_]/g, ' '),
            notes: ''
          },
          imageUrl: fileUrl,
          lastModified: 'Just now'
        };

        // If connected to a real folder, serialize the visual files and companion metadata back to disk in real-time
        const electronAPI = (window as any).electronAPI;
        if (electronAPI) {
          const activePath = storage.getVaultPath();
          if (activePath) {
            try {
              let fileData: any;
              if ((file as any).path) {
                fileData = (file as any).path;
              } else {
                const arrayBuffer = await file.arrayBuffer();
                fileData = new Uint8Array(arrayBuffer);
              }
              const imgRes = await electronAPI.writeFileBinary(activePath, importedAsset.board, file.name, fileData);
              if (imgRes && imgRes.success) {
                this.addLog('success', `Electron API: Wrote real image binary: ${file.name}`);
              } else {
                throw new Error(imgRes ? imgRes.error : 'Binary write failed');
              }

              const fileNameNoExt = file.name.replace(/\.[a-zA-Z0-9]+$/, '');
              const mdFileName = `${fileNameNoExt}.md`;
              const yamlContent = stringifyYAMLFrontmatter(importedAsset.metadata);
              const mdRes = await electronAPI.writeCompanionMD(activePath, importedAsset.board, file.name, yamlContent);
              if (mdRes && mdRes.success) {
                this.addLog('success', `Electron API: Wrote real YAML companion file: ${mdFileName}`);
              } else {
                throw new Error(mdRes ? mdRes.error : 'Metadata write failed');
              }

              // Update URL to use visual-vault:// protocol for permanent native loading
              const boardPart = importedAsset.board === '/' ? '' : importedAsset.board;
              const fullNativePath = `${activePath}${boardPart}/${file.name}`.replace(/\\/g, '/');
              importedAsset.imageUrl = `visual-vault://${fullNativePath}`;
            } catch (err: any) {
              console.error('Failed writing file inside native Electron context', err);
              this.addLog('warn', `Electron API: Failed to commit imported files: ${err.message}`);
            }
          }
        } else if (this.isSandboxedDirectory && this.directoryHandle) {
          try {
            const fileHandle = await this.directoryHandle.getFileHandle(file.name, { create: true });
            const imgWritable = await fileHandle.createWritable();
            await imgWritable.write(file);
            await imgWritable.close();
            this.fileHandles.set(importedAsset.id, fileHandle);
            this.addLog('success', `Sandbox API: Wrote real image binary: ${file.name}`);

            const fileNameNoExt = file.name.replace(/\.[a-zA-Z0-9]+$/, '');
            const mdFileName = `${fileNameNoExt}.md`;
            const mdHandle = await this.directoryHandle.getFileHandle(mdFileName, { create: true });
            const mdWritable = await mdHandle.createWritable();
            const yamlContent = stringifyYAMLFrontmatter(importedAsset.metadata);
            await mdWritable.write(yamlContent);
            await mdWritable.close();
            this.mdFileHandles.set(importedAsset.id, mdHandle);
            this.addLog('success', `Sandbox API: Wrote real YAML companion file: ${mdFileName}`);
          } catch (err: any) {
            console.error('Failed writing file inside native sandbox context', err);
            this.addLog('warn', `Sandbox API: Failed to commit imported files: ${err.message}`);
          }
        }

        this.assets = storage.addAsset(importedAsset);
        this.selectedAssetId = importedAsset.id;
        
        this.addLog('success', `SQLite synced entry for newly added file: ${file.name}`);
        this.addLog('success', `Obsidian serialized Markdown companion created: ${file.name.replace(/\.[a-zA-Z0-9]+$/, '.md')}`);
        
        processed++;
        
        if (processed === files.length) {
          this.updateLayout();
          this.toast('Vault Swarm Complete', `Successfully imported and synced ${files.length} references inside directory.`);
        }
      };
      
      img.onerror = () => {
        this.addLog('warn', `Index crash: Failed decoding binary stream of ${file.name}`);
        processed++;
      };
      
      img.src = fileUrl;
    });
  }

  // ----------------------------------------------------
  // Spacebar Lightbox Overlay Business Controls
  // ----------------------------------------------------
  private toggleLightbox() {
    const backdrop = this.querySelector('#lightbox-backdrop');
    if (!backdrop) return;

    this.isLightboxOpen = !this.isLightboxOpen;

    if (this.isLightboxOpen) {
      backdrop.classList.remove('hidden');
      this.populateLightboxData();
      this.addLog('info', `Activated Full-Immersive Lightbox view.`);
    } else {
      backdrop.classList.add('hidden');
      // Revoke any dynamic focus
      window.focus();
    }
  }

  private populateLightboxData() {
    const asset = this.assets.find(a => a.id === this.selectedAssetId);
    if (!asset) return;

    const boardNode = this.querySelector('#lightbox-badge-board');
    const titleNode = this.querySelector('#lightbox-heading-title');
    const imgNode = this.querySelector('#lightbox-img') as HTMLImageElement;
    const resNode = this.querySelector('#lightbox-meta-resolution');
    const sizeNode = this.querySelector('#lightbox-meta-size');
    const swatchesNode = this.querySelector('#lightbox-swatches');

    // Fill left textual structures
    if (boardNode) boardNode.textContent = asset.board;
    if (titleNode) titleNode.textContent = asset.name;
    if (imgNode) {
      imgNode.style.transform = 'scale(0.95)';
      imgNode.onerror = () => {
        imgNode.onerror = null;
        imgNode.src = generateProceduralSVG(asset.name, asset.colors);
      };
      imgNode.src = asset.imageUrl;
      setTimeout(() => {
        imgNode.style.transform = 'scale(1)';
      }, 55);
    }
    if (resNode) resNode.textContent = asset.resolution;
    if (sizeNode) sizeNode.textContent = asset.size;

    // Color Swatches inside lightbox footer (left panel)
    if (swatchesNode) {
      swatchesNode.innerHTML = asset.colors.map(color => `
        <div class="w-3.5 h-3.5 rounded border border-white/20" style="background-color: ${color}" title="${color}"></div>
      `).join('');
    }

    // Now populate the Right Side Inspector! (Pinterest detailed sidebar list)
    const rawYaml = stringifyYAMLFrontmatter(asset.metadata);
    const mdName = asset.name.replace(/\.[a-zA-Z0-9]+$/, '.md');

    // Stars Rating HTML
    let lbStarsInHtml = '';
    for (let i = 1; i <= 5; i++) {
      const active = i <= parseInt(asset.metadata.rating);
      lbStarsInHtml += `
        <span class="lb-star-rating-item text-lg cursor-pointer transition ${active ? 'text-amber-500' : 'text-slate-600 hover:text-amber-400/50'}" data-rate="${i}">★</span>
      `;
    }

    // Interactive custom tags List
    const lbTagsInHtml = asset.metadata.tags.map(tag => {
      const category = classifyTag(tag);
      let badgeClass = '';
      let categoryPrefix = '';
      if (category === 'medium') {
        badgeClass = 'bg-blue-500/10 border-blue-500/20 text-blue-400 hover:bg-blue-500/20';
        categoryPrefix = '🖼️ ';
      } else if (category === 'eraStyle') {
        badgeClass = 'bg-purple-500/10 border-purple-500/20 text-purple-400 hover:bg-purple-500/20';
        categoryPrefix = '🎨 ';
      } else if (category === 'source') {
        badgeClass = 'bg-amber-500/10 border-amber-500/20 text-amber-400 hover:bg-amber-500/20';
        categoryPrefix = '🌐 ';
      } else {
        badgeClass = 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20';
        categoryPrefix = '🏷️ ';
      }
      return `
        <span class="lb-meta-tag-badge ${badgeClass} border rounded px-2 py-0.5 text-[10px] tracking-tight inline-flex items-center gap-1 cursor-pointer transition select-none" data-tag="${tag}" title="Click to filter catalog by this tag">
          <span>${categoryPrefix}${tag}</span>
          <span class="lb-meta-tag-remove cursor-pointer hover:text-white transition font-bold text-[10px]" data-tag="${tag}">×</span>
        </span>
      `;
    }).join('');

    // Color palette hex labels copying swatches
    const lbPaletteInHtml = asset.colors.map(color => `
      <div class="lb-palette-swatch flex flex-col gap-1 flex-1 cursor-pointer group/sw" data-hex="${color}">
        <div class="h-8 rounded border border-white/10 transition group-hover/sw:border-emerald-500/30" style="background-color: ${color}"></div>
        <span class="mono text-[8.5px] text-center text-slate-500 group-hover/sw:text-emerald-400 transition mt-0.5">${color}</span>
      </div>
    `).join('');

    const scrollDiv = this.querySelector('#lightbox-inspector-scroll');
    if (scrollDiv) {
      scrollDiv.innerHTML = `
        <div class="space-y-5 animate-fade-in text-left">
          
          <!-- Asset ID context header -->
          <div class="space-y-1 pb-4 border-b border-white/[0.04]">
            <label class="text-[9px] uppercase tracking-widest text-slate-500 font-bold cursor-default">Asset Identification</label>
            <h4 class="text-white font-semibold text-sm truncate flex items-center justify-between" title="${asset.name}">
              <span>${asset.name}</span>
              <button id="lb-asset-delete-btn" class="p-1 hover:bg-red-500/10 text-red-400/80 hover:text-red-400 rounded transition ml-2" title="Delete index asset companion">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
              </button>
            </h4>
            <div class="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>Disk updated: ${asset.lastModified}</span>
              <span class="text-emerald-400">.png Sync ok</span>
            </div>
          </div>

          <!-- Markdown frontmatter companion YAML edits -->
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <label class="text-[9px] uppercase tracking-widest text-slate-500 font-bold cursor-default">Companion Obsidian MD</label>
              <span class="text-[10px] text-emerald-500/60 font-mono flex items-center gap-1">
                <span class="w-1 h-1 rounded-full bg-emerald-500"></span>
                ${mdName}
              </span>
            </div>

            <div class="relative group">
              <textarea id="lb-markdown-yaml-editor" class="w-full h-28 bg-black font-mono text-[10px] leading-relaxed text-slate-400 p-2.5 rounded border border-white/5 focus:border-emerald-500/20 focus:text-slate-300 outline-none resize-none transition-all custom-scrollbar flex" spellcheck="false" title="Directly edit plaintext YAML frontmatter metadata — edits immediately mirror into form variables!">${rawYaml}</textarea>
              <div class="absolute bottom-1 right-2 text-[8px] mono text-slate-600 group-focus-within:text-emerald-400 pointer-events-none transition-colors">Obsidian Link</div>
            </div>

            <button id="lb-action-obsidian" class="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 active:scale-95 text-slate-300 text-[10px] font-bold uppercase rounded transition font-mono tracking-wider">
              Open Companion in Obsidian
            </button>
          </div>

          <!-- Forms metadata config parameters -->
          <div class="space-y-3 pt-4 border-t border-white/[0.04]">
            <label class="text-[9px] uppercase tracking-widest text-[#10B981] font-mono font-bold cursor-default">Database Sync Parameters</label>
            
            <div class="space-y-1">
              <span class="text-[10px] text-slate-500 font-semibold">${this.schemaConfig.properties.title?.label || 'Pin Name / Title'}:</span>
              <input type="text" id="lb-meta-title-input" value="${asset.metadata.title || ''}" 
                class="w-full bg-black/40 text-xs px-2.5 py-1.5 rounded border border-white/5 focus:border-emerald-500/20 text-white outline-none" placeholder="${this.schemaConfig.properties.title?.placeholder || 'E.g., Neo Tokyo Temple Alleyway Sunset...'}" />
            </div>

            <div class="space-y-1">
              <span class="text-[10px] text-slate-500 font-semibold">${this.schemaConfig.properties.notes?.label || 'Pin Notes / Description'}:</span>
              <textarea id="lb-meta-notes-input" class="w-full h-22 bg-black/40 text-xs px-2.5 py-2 rounded border border-white/5 focus:border-emerald-500/20 text-white outline-none resize-none custom-scrollbar" placeholder="${this.schemaConfig.properties.notes?.placeholder || 'Add custom notes, design prompts, research observations...'}">${asset.metadata.notes || ''}</textarea>
            </div>

            <div class="space-y-1">
              <span class="text-[10px] text-slate-500 font-semibold">${this.schemaConfig.properties.artist?.label || 'Artist / Creator'}:</span>
              <input type="text" id="lb-meta-artist-input" value="${asset.metadata.artist || ''}" 
                class="w-full bg-black/40 text-xs px-2.5 py-1.5 rounded border border-white/5 focus:border-emerald-500/20 text-white outline-none" placeholder="${this.schemaConfig.properties.artist?.placeholder || 'Chen-K design team...'}" />
            </div>

            <div class="space-y-1">
              <span class="text-[10px] text-slate-500 font-semibold">${this.schemaConfig.properties.status?.label || 'Asset Status'}: </span>
              <select id="lb-meta-status-select" class="w-full bg-black text-xs px-2 py-1.5 rounded border border-white/5 focus:border-emerald-500/20 text-white outline-none">
                ${(() => {
                  const schemaHasVal = this.schemaConfig.statuses.some(s => s.value === asset.metadata.status);
                  let options = this.schemaConfig.statuses.map(s => `
                    <option value="${s.value}" ${asset.metadata.status === s.value ? 'selected' : ''}>${s.label}</option>
                  `).join('');
                  if (asset.metadata.status && !schemaHasVal) {
                    options += `<option value="${asset.metadata.status}" selected>${asset.metadata.status}</option>`;
                  }
                  return options;
                })()}
              </select>
            </div>

            <div class="space-y-1">
              <span class="text-[10px] text-slate-500 font-semibold">${this.schemaConfig.properties.rating?.label || 'Visual Vault Grade'}:</span>
              <div class="flex items-center gap-1 bg-black/20 p-1.5 rounded border border-white/5 w-fit">
                ${lbStarsInHtml}
              </div>
            </div>
          </div>

          <!-- Extract color palette swatches -->
          <div class="space-y-2 pt-4 border-t border-white/[0.04]">
            <div class="flex justify-between items-center">
              <label class="text-[9px] uppercase tracking-widest text-slate-500 font-bold cursor-default">Color Palette Extract</label>
              <span class="text-[8.5px] text-slate-500 font-mono">Click to Copy</span>
            </div>
            <div class="flex gap-2">
              ${lbPaletteInHtml}
            </div>
            <button id="lb-search-similar-palette-btn" class="w-full py-2 bg-emerald-500/10 hover:bg-emerald-500/20 hover:text-emerald-300 border border-emerald-500/15 active:scale-95 text-emerald-400 text-[10px] font-bold uppercase rounded transition font-mono tracking-wider flex items-center justify-center gap-1.5 mt-1 cursor-pointer" title="Find reference images with matching average color palettes">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"></path>
              </svg>
              <span>Search Similar Palettes</span>
            </button>
          </div>

          <!-- Custom tags parameters -->
          <div class="space-y-2 pt-4 border-t border-white/[0.04]">
            <label class="text-[9px] uppercase tracking-widest text-slate-500 font-bold cursor-default">Obsidian Companion Tags</label>
            <div class="flex flex-wrap gap-1 leading-relaxed">
              ${lbTagsInHtml}
            </div>
            <div class="flex items-center gap-1.5 bg-black/40 border border-white/5 rounded pl-2.5 py-1 pr-1 w-full mt-2 focus-within:border-emerald-500/20">
              <span class="text-[10px] text-slate-600 font-mono font-semibold">#</span>
              <input type="text" id="lb-add-tag-input" placeholder="add_new_tag..." 
                class="bg-transparent text-xs text-white placeholder-slate-600 outline-none w-full" />
              <button id="lb-add-tag-btn" class="p-1 hover:bg-emerald-500/20 text-emerald-400 hover:text-emerald-300 rounded font-bold uppercase text-[9px] transition shrink-0 hidden">add</button>
            </div>
            ${renderPresetsHtml(asset.metadata.tags, true)}
          </div>

        </div>
      `;
    }

    this.attachLightboxInspectorEvents();
  }

  private attachLightboxInspectorEvents() {
    const asset = this.assets.find(a => a.id === this.selectedAssetId);
    if (!asset) return;

    // Delete asset record click from lightbox
    const deleteBtn = this.querySelector('#lb-asset-delete-btn');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', async () => {
        if (confirm(`Remove index companion configuration for '${asset.name}'? Companion .md and physical files will be unlinked and deleted.`)) {
          const electronAPI = (window as any).electronAPI;
          if (electronAPI) {
            const activePath = storage.getVaultPath();
            if (activePath) {
              await electronAPI.deleteAssetFile(activePath, asset.board, asset.name);
            }
          }
          this.assets = storage.deleteAsset(asset.id);
          this.addLog('warn', `Unlinked database entry and deleted file metadata block: ${asset.name.replace(/\.[a-z]+$/, '.md')}`);
          
          this.toggleLightbox(); // Close modal on delete!

          // Switch selections
          if (this.assets.length > 0) {
            this.selectedAssetId = this.assets[0].id;
          } else {
            this.selectedAssetId = '';
          }
          this.updateLayout();
          this.toast('Companion Unlinked', `Metadata file and catalog caches for ${asset.name} unlinked.`);
        }
      });
    }

    // Star Rating Click triggers for lightbox
    const ratingStars = this.querySelectorAll('.lb-star-rating-item');
    ratingStars.forEach(node => {
      node.addEventListener('click', (e) => {
        const element = e.currentTarget as HTMLElement;
        const rate = element.dataset.rate || '5';
        
        asset.metadata.rating = rate;
        storage.updateAsset(asset.id, { metadata: asset.metadata });
        
        this.addLog('success', `Transactional write successful [catalog.db]: Rating updated (${rate} Stars).`);
        
        // Instant updates: update both visual panels!
        this.populateLightboxData();
        this.renderInspector();
        this.syncAssetInGridFooter(asset);
        this.toast('SQLite Synchronized', `Obsidian meta-rating graded as ${rate} Stars.`);
      });
    });

    // Option Status selects for lightbox
    const statusSelect = this.querySelector('#lb-meta-status-select') as HTMLSelectElement;
    if (statusSelect) {
      statusSelect.addEventListener('change', () => {
        const val = statusSelect.value;
        asset.metadata.status = val;
        storage.updateAsset(asset.id, { metadata: asset.metadata });
        
        this.addLog('success', `Mirroring .md markdown state to disk for ${asset.name}: companion status='${val}'`);
        this.populateLightboxData();
        this.renderInspector();
        this.toast('Markdown Mirror ok', `YAML state mirrored down: status: '${val}'`);
      });
    }

    // String input creators Artist for lightbox
    const artistInput = this.querySelector('#lb-meta-artist-input') as HTMLInputElement;
    if (artistInput) {
      artistInput.addEventListener('change', () => {
        const val = artistInput.value.trim() || 'Unknown';
        asset.metadata.artist = val;
        storage.updateAsset(asset.id, { metadata: asset.metadata });
        
        this.addLog('success', `Obsidian front-matter write: artist='${val}'`);
        this.populateLightboxData();
        this.renderInspector();
      });
      artistInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') artistInput.blur();
      });
    }

    // Display Title / Pin Name for lightbox sync
    const lbTitleInput = this.querySelector('#lb-meta-title-input') as HTMLInputElement | null;
    if (lbTitleInput) {
      lbTitleInput.addEventListener('change', () => {
        const val = lbTitleInput.value.trim();
        asset.metadata.title = val;
        storage.updateAsset(asset.id, { metadata: asset.metadata });
        
        this.addLog('success', `Transactional write [catalog.db]: Pin Display Title updated to "${val}".`);
        this.populateLightboxData();
        this.renderInspector();
        
        // Update grid visual card footer title instantly without full masonry re-render
        const gridCardFooterSpan = this.querySelector(`#footer-${asset.id} span`);
        if (gridCardFooterSpan) {
          gridCardFooterSpan.textContent = val || asset.name;
        }
        this.syncAssetInGridFooter(asset);
      });
      lbTitleInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') lbTitleInput.blur();
      });
    }

    // Inspiration Notes / Description for lightbox sync
    const lbNotesInput = this.querySelector('#lb-meta-notes-input') as HTMLTextAreaElement | null;
    if (lbNotesInput) {
      lbNotesInput.addEventListener('change', () => {
        const val = lbNotesInput.value.trim();
        asset.metadata.notes = val;
        storage.updateAsset(asset.id, { metadata: asset.metadata });
        
        this.addLog('success', `Transactional write [catalog.db]: Inspiration Notes updated.`);
        this.populateLightboxData();
        this.renderInspector();
      });
    }

    // Color Swatch Clipboard copies inside lightbox
    const swatches = this.querySelectorAll('.lb-palette-swatch');
    swatches.forEach(sw => {
      sw.addEventListener('click', (e) => {
        const node = e.currentTarget as HTMLElement;
        const hex = node.dataset.hex || '#000000';
        
        navigator.clipboard.writeText(hex).then(() => {
          this.toast('HEX Copied', `${hex} copied to local clipboard.`);
          this.addLog('info', `Clipboard transaction read hex swatch: ${hex}`);
          
          // Temporary highlight
          const span = node.querySelector('span');
          if (span) {
            const org = span.textContent;
            span.textContent = 'COPIED!';
            span.classList.add('text-emerald-400');
            setTimeout(() => {
              span.textContent = org;
              span.classList.remove('text-emerald-400');
            }, 1000);
          }
        }).catch(err => {
          console.error('Copy failure', err);
        });
      });
    });

    // Companion Tag Removes for lightbox
    const tagRemovals = this.querySelectorAll('.lb-meta-tag-remove');
    tagRemovals.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation(); // Avoid selector bubbling
        const node = e.currentTarget as HTMLElement;
        const tag = node.dataset.tag || '';

        asset.metadata.tags = asset.metadata.tags.filter(t => t !== tag);
        storage.updateAsset(asset.id, { metadata: asset.metadata });
        
        this.addLog('warn', `Unlinked Markdown entry descriptor: unlinked tag #${tag}`);
        this.populateLightboxData();
        this.renderInspector();
        this.toast('Front-matter modified', `Metadata descriptor tag #${tag} unlinked.`);
      });
    });

    // Companion Preset Tag Toggles for lightbox
    const lbPresetBtns = this.querySelectorAll('.lb-preset-tag-btn');
    lbPresetBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const node = e.currentTarget as HTMLElement;
        const tag = node.dataset.tag || '';
        
        const idx = asset.metadata.tags.findIndex(t => t.toLowerCase().trim() === tag.toLowerCase().trim());
        if (idx !== -1) {
          // Remove it!
          asset.metadata.tags.splice(idx, 1);
          storage.updateAsset(asset.id, { metadata: asset.metadata });
          this.addLog('warn', `Unlinked preset tag #${tag}`);
          this.toast('Tag Removed', `#${tag} removed from asset.`);
        } else {
          // Add it!
          asset.metadata.tags.push(tag);
          storage.updateAsset(asset.id, { metadata: asset.metadata });
          this.addLog('success', `Linked preset tag #${tag}`);
          this.toast('Tag Added', `#${tag} linked to asset.`);
        }
        this.populateLightboxData();
        this.renderInspector();
      });
    });

    // Companion Tag Badges click-to-filter for lightbox
    const lbBadges = this.querySelectorAll('.lb-meta-tag-badge');
    lbBadges.forEach(badge => {
      badge.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        if (target.classList.contains('lb-meta-tag-remove')) return;
        
        const tag = (e.currentTarget as HTMLElement).dataset.tag || '';
        
        // Close lightbox and apply filter
        const backdrop = this.querySelector('#lightbox-backdrop');
        if (backdrop) backdrop.classList.add('hidden');
        this.isLightboxOpen = false;
        
        this.applyTagFilter(tag);
      });
    });

    // Add Tag triggers for lightbox
    const lbAddTagIn = this.querySelector('#lb-add-tag-input') as HTMLInputElement;
    const lbAddTagBtn = this.querySelector('#lb-add-tag-btn') as HTMLButtonElement;
    
    if (lbAddTagIn && lbAddTagBtn) {
      const handleLbAddTag = () => {
        const val = lbAddTagIn.value.trim().toLowerCase().replace(/[^a-zA-Z0-9_-]/g, '');
        if (val) {
          if (!asset.metadata.tags.includes(val)) {
            asset.metadata.tags.push(val);
            storage.updateAsset(asset.id, { metadata: asset.metadata });
            
            this.addLog('success', `Obsidian indexing transaction: Append tag descriptor #${val}`);
            this.populateLightboxData();
            this.renderInspector();
            this.toast('Tag Appended', `#${val} appended to Obsidian companion config file.`);
          } else {
            this.toast('Duplicate Tag', `#${val} is already bound to this active asset.`);
          }
          lbAddTagIn.value = '';
          lbAddTagBtn.classList.add('hidden');
        }
      };

      lbAddTagIn.addEventListener('input', () => {
        if (lbAddTagIn.value.trim()) {
          lbAddTagBtn.classList.remove('hidden');
        } else {
          lbAddTagBtn.classList.add('hidden');
        }
      });

      lbAddTagIn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') handleLbAddTag();
      });

      lbAddTagBtn.addEventListener('click', handleLbAddTag);
    }

    // YAML direct Textarea editing for lightbox
    const lbYamlArea = this.querySelector('#lb-markdown-yaml-editor') as HTMLTextAreaElement;
    if (lbYamlArea) {
      lbYamlArea.addEventListener('change', () => {
        const rawYamlText = lbYamlArea.value;
        const updatedMeta = parseYAMLFrontmatter(rawYamlText, asset.metadata);
        
        asset.metadata = updatedMeta;
        storage.updateAsset(asset.id, { metadata: asset.metadata });
        
        this.addLog('success', `Obsidian Dual-Sync Mirror: Direct client manual modifications compiled.`);
        this.populateLightboxData();
        this.renderInspector();
        this.syncAssetInGridFooter(asset);
        this.toast('Obsidian Sync Ok', `Markdown frontmatter dual interface synchronized.`);
      });
    }

    // Obsidian simulation launch routine Trigger for lightbox
    const lbActionObsidian = this.querySelector('#lb-action-obsidian');
    if (lbActionObsidian) {
      lbActionObsidian.addEventListener('click', () => {
        const mdPath = `${this.selectedBoard.replace(/^\//,'')}/${asset.name.replace(/\.[a-z]+$/, '.md')}`;
        const obsidianUri = `obsidian://open?vault=${encodeURIComponent(storage.getVaultPath().split('/').pop() || 'Vault')}&file=${encodeURIComponent(mdPath)}`;
        this.addLog('info', `Firing Obsidian desk command: ${obsidianUri}`);
        this.toast('Obsidian Fired', `Launching Obsidian for ${asset.name.replace(/\.[a-z]+$/,'')}...`);
        try {
          window.location.href = obsidianUri;
        } catch (err) {
          console.error('Failed to trigger Obsidian protocol handler', err);
        }
      });
    }

    // Color palette similarity search button for lightbox
    const lbSearchSimilarBtn = this.querySelector('#lb-search-similar-palette-btn');
    if (lbSearchSimilarBtn) {
      lbSearchSimilarBtn.addEventListener('click', () => {
        this.colorPaletteSearchQuery = asset.colors;
        this.addLog('info', `Active Filter: Searching for images with similar average color palette.`);
        this.toast('Palette Search Active', `Searching for assets with a similar average color palette to '${asset.name}'.`);
        
        // Close lightbox so user can see search results
        const backdrop = this.querySelector('#lightbox-backdrop');
        if (backdrop) backdrop.classList.add('hidden');
        this.isLightboxOpen = false;

        this.renderCatalog();
        this.updateActiveColorPaletteUI();
      });
    }
  }

  private navigateLightbox(direction: number) {
    const filtered = this.getFilteredAssets();
    if (filtered.length <= 1) return;

    let currentIdx = filtered.findIndex(a => a.id === this.selectedAssetId);
    if (currentIdx === -1) currentIdx = 0;

    let nextIdx = currentIdx + direction;
    if (nextIdx >= filtered.length) nextIdx = 0;
    if (nextIdx < 0) nextIdx = filtered.length - 1;

    this.selectedAssetId = filtered[nextIdx].id;
    this.populateLightboxData();
    this.renderInspector();
    
    // Auto sync layout view selection highlights in behind grid
    this.querySelectorAll('.asset-card').forEach(n => {
      const nodeId = (n as HTMLElement).dataset.id;
      if (nodeId === this.selectedAssetId) {
        n.classList.add('ring-2', 'ring-emerald-500', 'border-emerald-500', 'bg-[#121215]');
        n.classList.remove('border-white/10', 'bg-slate-900/60');
        n.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      } else {
        n.classList.add('border-white/10', 'bg-slate-900/60');
        n.classList.remove('ring-2', 'ring-emerald-500', 'border-emerald-500', 'bg-[#121215]');
      }
    });
  }

  // Custom high density beautiful toast alert messages matching Dark slate themes
  private toast(title: string, msg: string) {
    const parent = this.querySelector('#toast-overlay');
    if (!parent) return;

    const t = document.createElement('div');
    t.className = 'bg-[#121215] border border-white/5 shadow-2xl p-3 rounded-lg text-xs w-64 pointer-events-auto cursor-pointer animate-slide-in flex flex-col gap-0.5 select-none hover:border-emerald-500/20';
    t.innerHTML = `
      <div class="flex justify-between items-center text-white font-semibold">
        <span class="flex items-center gap-1.5 text-emerald-400">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          ${title}
        </span>
        <span class="text-slate-600 hover:text-white transition-colors text-sm px-1 font-bold">×</span>
      </div>
      <p class="text-[10.5px] text-slate-400 pt-0.5">${msg}</p>
    `;

    // Click close
    t.addEventListener('click', () => {
      t.classList.add('opacity-0', 'scale-95');
      setTimeout(() => t.remove(), 250);
    });

    parent.appendChild(t);
    setTimeout(() => {
      if (t.parentNode) {
        t.classList.add('opacity-0', 'scale-95');
        setTimeout(() => t.remove(), 250);
      }
    }, 4000);
  }
}

// ----------------------------------------------------
// Bootstrapping the Application Module element
// ----------------------------------------------------
customElements.define('vault-app', VaultApp);

document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('root');
  if (root) {
    root.innerHTML = '';
    root.appendChild(document.createElement('vault-app'));
  }
});

// Immediately render in case of loaded scripts executing first
const directRoot = document.getElementById('root');
if (directRoot && !directRoot.hasChildNodes()) {
  directRoot.innerHTML = '';
  directRoot.appendChild(document.createElement('vault-app'));
}
