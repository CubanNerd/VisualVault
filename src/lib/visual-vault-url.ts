export function toVisualVaultUrl(absolutePath: string): string {
  const normalized = absolutePath.replace(/\\/g, '/');
  if (/^[A-Za-z]:\//.test(normalized)) {
    return `visual-vault:///${normalized}`;
  }
  if (normalized.startsWith('/')) {
    return `visual-vault://${normalized}`;
  }
  return `visual-vault:///${normalized}`;
}
