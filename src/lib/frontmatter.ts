import { AssetMetadata } from './types';

/**
 * Serializes standard companion metadata properties to YAML frontmatter lines.
 */
export function stringifyYAMLFrontmatter(metadata: AssetMetadata): string {
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

/**
 * Parses Obsidian-compatible YAML frontmatter block lines back into dynamic schema metadata properties.
 */
export function parseYAMLFrontmatter(yaml: string, originalMeta: AssetMetadata): AssetMetadata {
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
