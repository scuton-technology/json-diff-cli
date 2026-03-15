export interface DiffEntry {
  path: string;
  type: 'added' | 'removed' | 'changed';
  oldValue?: any;
  newValue?: any;
}

export interface DiffResult {
  added: DiffEntry[];
  removed: DiffEntry[];
  changed: DiffEntry[];
  identical: boolean;
}

function isObject(val: any): val is Record<string, any> {
  return val !== null && typeof val === 'object' && !Array.isArray(val);
}

function formatValue(val: any): string {
  if (val === null) return 'null';
  if (val === undefined) return 'undefined';
  if (typeof val === 'string') return `"${val}"`;
  if (Array.isArray(val)) return JSON.stringify(val);
  if (isObject(val)) return JSON.stringify(val);
  return String(val);
}

function deepDiff(a: any, b: any, path: string, entries: DiffEntry[]): void {
  if (a === b) return;

  // Both are objects
  if (isObject(a) && isObject(b)) {
    const allKeys = new Set([...Object.keys(a), ...Object.keys(b)]);
    for (const key of allKeys) {
      const currentPath = path ? `${path}.${key}` : key;
      if (!(key in a)) {
        entries.push({ path: currentPath, type: 'added', newValue: b[key] });
      } else if (!(key in b)) {
        entries.push({ path: currentPath, type: 'removed', oldValue: a[key] });
      } else {
        deepDiff(a[key], b[key], currentPath, entries);
      }
    }
    return;
  }

  // Both are arrays
  if (Array.isArray(a) && Array.isArray(b)) {
    const maxLen = Math.max(a.length, b.length);
    for (let i = 0; i < maxLen; i++) {
      const currentPath = `${path}[${i}]`;
      if (i >= a.length) {
        entries.push({ path: currentPath, type: 'added', newValue: b[i] });
      } else if (i >= b.length) {
        entries.push({ path: currentPath, type: 'removed', oldValue: a[i] });
      } else {
        deepDiff(a[i], b[i], currentPath, entries);
      }
    }
    return;
  }

  // Values differ (including type changes)
  entries.push({
    path: path || '(root)',
    type: 'changed',
    oldValue: a,
    newValue: b,
  });
}

export function diffJson(a: any, b: any): DiffResult {
  const entries: DiffEntry[] = [];
  deepDiff(a, b, '', entries);

  return {
    added: entries.filter(e => e.type === 'added'),
    removed: entries.filter(e => e.type === 'removed'),
    changed: entries.filter(e => e.type === 'changed'),
    identical: entries.length === 0,
  };
}

export { formatValue };
