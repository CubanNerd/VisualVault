export let TAXONOMY_PRESETS = {
  medium: ['illustration', 'photo', 'poster', 'signage', 'packaging', 'ad', 'film still'],
  eraStyle: ['Bauhaus', 'Swiss/International', '90s grunge', 'contemporary', 'Minimalist', 'Vaporwave', 'Cyberpunk', 'Retro-Futurism'],
  source: ['Pinterest', 'Are.na', 'Behance', 'Dribbble', 'Instagram', 'Tumblr', 'Web'],
  companion: ['reference', 'design', 'inspiration', 'import', 'raw-data', 'local-sync', 'user-import']
};

export function setTaxonomyPresets(presets: typeof TAXONOMY_PRESETS) {
  TAXONOMY_PRESETS = presets;
}

export function loadTaxonomyFromStorage() {
  try {
    const saved = localStorage.getItem('visual_taxonomy_presets_v1');
    if (saved) {
      TAXONOMY_PRESETS = JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load taxonomy presets', e);
  }
}

export function saveTaxonomyToStorage() {
  try {
    localStorage.setItem('visual_taxonomy_presets_v1', JSON.stringify(TAXONOMY_PRESETS));
  } catch (e) {
    console.error('Failed to save taxonomy presets', e);
  }
}

// Initialize dynamic taxonomy
loadTaxonomyFromStorage();

export function classifyTag(tag: string): 'medium' | 'eraStyle' | 'source' | 'companion' | 'custom' {
  const t = tag.toLowerCase().trim();
  if (TAXONOMY_PRESETS.medium.map(v => v.toLowerCase()).includes(t)) return 'medium';
  if (TAXONOMY_PRESETS.eraStyle.map(v => v.toLowerCase()).includes(t)) return 'eraStyle';
  if (TAXONOMY_PRESETS.source.map(v => v.toLowerCase()).includes(t)) return 'source';
  if (TAXONOMY_PRESETS.companion && TAXONOMY_PRESETS.companion.map(v => v.toLowerCase()).includes(t)) return 'companion';
  return 'custom';
}

export function renderPresetsHtml(tags: string[], isLightbox: boolean): string {
  const activeTags = tags.map(t => t.toLowerCase().trim());
  const classPrefix = isLightbox ? 'lb-' : '';
  
  const renderGroup = (label: string, items: string[], colorClass: string, activeColorClass: string) => {
    const buttons = (items || []).map(item => {
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
        ${renderGroup('🏷️ Companion Tags', TAXONOMY_PRESETS.companion, 'text-emerald-400', 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40')}
        ${renderGroup('🖼️ Medium', TAXONOMY_PRESETS.medium, 'text-blue-400', 'bg-blue-500/20 text-blue-300 border-blue-500/40')}
        ${renderGroup('🎨 Era or Style Movement', TAXONOMY_PRESETS.eraStyle, 'text-purple-400', 'bg-purple-500/20 text-purple-300 border-purple-500/40')}
        ${renderGroup('🌐 Source (Attribution)', TAXONOMY_PRESETS.source, 'text-amber-400', 'bg-amber-500/20 text-amber-300 border-amber-500/40')}
      </div>
    </div>
  `;
}
