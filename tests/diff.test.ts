import { describe, it, expect } from 'vitest';
import { diffJson } from '../src/lib/diff';

describe('diffJson', () => {
  it('should detect identical objects', () => {
    const result = diffJson({ a: 1 }, { a: 1 });
    expect(result.identical).toBe(true);
    expect(result.added).toHaveLength(0);
    expect(result.removed).toHaveLength(0);
    expect(result.changed).toHaveLength(0);
  });

  it('should detect added keys', () => {
    const result = diffJson({}, { a: 1 });
    expect(result.added).toHaveLength(1);
    expect(result.added[0].path).toBe('a');
    expect(result.added[0].newValue).toBe(1);
  });

  it('should detect removed keys', () => {
    const result = diffJson({ a: 1 }, {});
    expect(result.removed).toHaveLength(1);
    expect(result.removed[0].path).toBe('a');
  });

  it('should detect changed values', () => {
    const result = diffJson({ port: 3000 }, { port: 8080 });
    expect(result.changed).toHaveLength(1);
    expect(result.changed[0].oldValue).toBe(3000);
    expect(result.changed[0].newValue).toBe(8080);
  });

  it('should handle nested objects', () => {
    const a = { server: { port: 3000, host: 'localhost' } };
    const b = { server: { port: 8080, host: 'localhost' } };
    const result = diffJson(a, b);
    expect(result.changed).toHaveLength(1);
    expect(result.changed[0].path).toBe('server.port');
  });

  it('should handle array differences', () => {
    const a = { items: [1, 2, 3] };
    const b = { items: [1, 2, 4] };
    const result = diffJson(a, b);
    expect(result.changed).toHaveLength(1);
    expect(result.changed[0].path).toBe('items[2]');
  });

  it('should handle type changes', () => {
    const result = diffJson({ val: '1' }, { val: 1 });
    expect(result.changed).toHaveLength(1);
  });

  it('should handle null values', () => {
    const result = diffJson({ a: null }, { a: 'hello' });
    expect(result.changed).toHaveLength(1);
  });

  it('should handle deeply nested changes', () => {
    const a = { level1: { level2: { level3: { value: 'old' } } } };
    const b = { level1: { level2: { level3: { value: 'new' } } } };
    const result = diffJson(a, b);
    expect(result.changed).toHaveLength(1);
    expect(result.changed[0].path).toBe('level1.level2.level3.value');
  });

  it('should handle mixed additions, removals, and changes', () => {
    const a = { keep: 1, remove: 2, change: 'old' };
    const b = { keep: 1, add: 3, change: 'new' };
    const result = diffJson(a, b);
    expect(result.added).toHaveLength(1);
    expect(result.removed).toHaveLength(1);
    expect(result.changed).toHaveLength(1);
    expect(result.identical).toBe(false);
  });
});
