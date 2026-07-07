import { Asset } from './types';
import { generateProceduralSVG } from './procedural';


export const defaultColors = {
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

export const defaultMockAssets = (): Asset[] => [
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
    lastModified: '1 day ago'
  },
  {
    id: 'as_10',
    name: 'prop_thruster_assembly.png',
    board: '/ Mech_Technical',
    resolution: '2048x1536',
    size: '1.8 MB',
    colors: defaultColors.thruster,
    tags: ['Props', 'Mech', 'Engine', 'Reference'],
    metadata: {
      tags: ['nozzle', 'manifold', 'hydraulic'],
      artist: 'Iron-Work',
      rating: '3',
      status: 'in-progress'
    },
    imageUrl: '',
    lastModified: '2 days ago'
  },
  {
    id: 'as_11',
    name: 'character_cyber_samurai.jpg',
    board: '/ Character_Design',
    resolution: '2048x2732',
    size: '3.6 MB',
    colors: defaultColors.samurai,
    tags: ['Character', 'Cyberpunk', 'Concept', 'Anatomy'],
    metadata: {
      tags: ['cyber-ninja', 'katana', 'visor'],
      artist: 'Kensei-Core',
      rating: '5',
      status: 'completed'
    },
    imageUrl: '',
    lastModified: '14 mins ago'
  },
  {
    id: 'as_12',
    name: 'concept_exosuit_armor.png',
    board: '/ Character_Design',
    resolution: '3000x3000',
    size: '4.5 MB',
    colors: defaultColors.exosuit,
    tags: ['Character', 'Hard-Surface', 'Industrial', 'Orthographic'],
    metadata: {
      tags: ['exosuit', 'plates', 'heavy-rig'],
      artist: 'Assets-Team',
      rating: '4',
      status: 'review'
    },
    imageUrl: '',
    lastModified: 'Yesterday'
  }
].map(item => {
  item.imageUrl = generateProceduralSVG(item.name, item.colors);
  return item;
});

