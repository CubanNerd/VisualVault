/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Vault {
  id: string;
  name: string;
  rootPath: string; // File system path, e.g. "/Users/artist/Vaults/SciFi"
  createdAt: number;
}

export interface Board {
  id: string;
  name: string;
  parentBoardId: string | null; // Supports recursive folders (sub-boards)
  path: string; // relative path within the Vault, e.g. "Characters/Factions"
}

export interface Asset {
  id: string; // e.g. unique hash or relative path
  boardId: string; // parent board id
  fileName: string; // e.g. "mech_heavy_armor.png"
  filePath: string; // relative path in vault, e.g. "Characters/Factions/mech_heavy_armor.png"
  localUrl: string; // WebObjectURL, base64 or high-fidelity placeholder URL
  width: number;
  height: number;
  aspectRatio: number;
  bytes: number;
  format: string; // e.g. "PNG", "JPEG", "WebP"
  createdAt: number;
  modifiedAt: number;

  // Metadata corresponding to YAML front-matter .md file
  rating: number; // 0 to 5 stars
  tags: string[];
  annotations: string; // plaintext notes
  colors: string[]; // hex codes extracted (e.g. ['#1e1e24', '#e29578'])
}

export interface AssetMetadata {
  rating: number;
  tags: string[];
  annotations: string;
  colors: string[];
  updatedAt: number;
}

export interface ActiveFilters {
  searchQuery: string;
  tags: string[];
  minRating: number;
  colorHex: string | null; // Filter for cards sharing a similar focal hex color
}
