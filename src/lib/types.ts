/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface AssetMetadata {
  tags: string[];
  artist: string;
  rating: string; // "1" to "5"
  status: string; // e.g. "completed", "in-progress", "review", etc.
  title?: string;
  notes?: string;
}

export interface Asset {
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

export interface SmartFolderRule {
  type: 'tag';
  operator: 'includes';
  value: string;
}

export interface SmartFolder {
  id: string;
  name: string;
  icon: string;
  color: string;
  rules: SmartFolderRule[];
  assetIds: string[];
}

export interface PropertyConfig {
  label: string;
  placeholder?: string;
}

export interface CustomSchemaConfig {
  statuses: { value: string; label: string }[];
  properties: {
    title: PropertyConfig;
    notes: PropertyConfig;
    artist: PropertyConfig;
    rating: PropertyConfig;
    status: PropertyConfig;
  };
}

export const defaultSchemaConfig: CustomSchemaConfig = {
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

