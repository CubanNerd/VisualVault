/**
 * Converts a hex color string to its corresponding HSL color object.
 */
export function hexToHsl(hex: string): { h: number; s: number; l: number } {
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

/**
 * Computes the average HSL color of a list of hex color codes, correctly handling circular hue.
 */
export function getAverageHsl(colors: string[]): { h: number; s: number; l: number } {
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

/**
 * Calculates the absolute angular distance between two hue angles on a 360-degree circle.
 */
export function getHueDistance(h1: number, h2: number): number {
  const diff = Math.abs(h1 - h2) % 360;
  return diff > 180 ? 360 - diff : diff;
}

/**
 * Samples a grid across a dynamically loaded image to extract a representative 5-color palette.
 */
export function extractColorsFromImage(imgUrl: string): Promise<string[]> {
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
