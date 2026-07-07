/**
 * Creates dynamic SVG vector elements with aesthetic grids, glows, wireframes 
 * conforming to active color palettes to represent world building visuals.
 */
export function generateProceduralSVG(filename: string, colors: string[]): string {
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
