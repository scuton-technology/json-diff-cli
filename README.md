<div align="center">
  <br>
  <h1>json-diff</h1>
  <p><strong>Compare two JSON files and see what changed</strong></p>
  <br>
  <p>
    <a href="https://www.npmjs.com/package/@scuton/json-diff"><img src="https://img.shields.io/npm/v/@scuton/json-diff?color=2563eb&label=npm" alt="npm"></a>
    <a href="https://www.npmjs.com/package/@scuton/json-diff"><img src="https://img.shields.io/npm/dm/@scuton/json-diff?color=gray&label=downloads" alt="downloads"></a>
    <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-green" alt="license"></a>
    <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/types-TypeScript-3178c6" alt="typescript"></a>
  </p>
  <br>
</div>

> Compare two JSON files and see what changed. Added, removed, and modified — color-coded in your terminal.

## Highlights

- ✅ Deep comparison — nested objects and arrays
- ✅ Color-coded output — green (added), red (removed), yellow (changed)
- ✅ Dot-path notation — `server.port`, `items[2]` for easy identification
- ✅ CLI + Library — use from terminal or import in your code
- ✅ Summary — quick count of added, removed, and changed entries
- ✅ Zero dependencies

## Install

```sh
npm install @scuton/json-diff
```

## CLI

```sh
npx @scuton/json-diff config.old.json config.new.json
```

```
  + added:    database.pool_size = 10
  - removed:  cache.ttl
  ~ changed:  server.port: 3000 → 8080
  ~ changed:  api.version: "v1" → "v2"

  Summary: 1 added, 1 removed, 2 changed
```

### Real-world uses

```sh
# Compare environment configs
npx @scuton/json-diff .env.staging.json .env.production.json

# Check package.json changes
npx @scuton/json-diff package.json.bak package.json

# Diff API responses
npx @scuton/json-diff response-before.json response-after.json
```

## Programmatic Usage

```typescript
import { diffJson } from '@scuton/json-diff';

const result = diffJson(
  { server: { port: 3000 }, debug: true },
  { server: { port: 8080 }, database: { pool: 10 } }
);

console.log(result.identical); // false
console.log(result.added);
// [{ path: 'database', type: 'added', newValue: { pool: 10 } }]
console.log(result.removed);
// [{ path: 'debug', type: 'removed', oldValue: true }]
console.log(result.changed);
// [{ path: 'server.port', type: 'changed', oldValue: 3000, newValue: 8080 }]

// Use in tests
if (!result.identical) {
  console.log(`${result.changed.length} fields changed`);
}
```

## API

### diffJson(a, b)

Deep recursive comparison of two values.

Returns: `DiffResult`

#### a

Type: `any`

The original (old) value.

#### b

Type: `any`

The new value to compare against.

#### DiffResult

```typescript
interface DiffResult {
  added: DiffEntry[];     // Keys present in b but not a
  removed: DiffEntry[];   // Keys present in a but not b
  changed: DiffEntry[];   // Keys present in both but with different values
  identical: boolean;     // true if no differences found
}

interface DiffEntry {
  path: string;           // Dot-notation path: 'server.port', 'items[2]'
  type: 'added' | 'removed' | 'changed';
  oldValue?: any;
  newValue?: any;
}
```

## FAQ

### Does it handle arrays?

Yes. Arrays are compared by index — `items[0]`, `items[1]`, etc. If one array is longer, extra elements are reported as added or removed.

### Does it handle deeply nested objects?

Yes. It recursively walks the entire structure. A change at `config.database.pool.max` is reported with its full dot-path.

### What about identical files?

The CLI prints `"Files are identical."` and exits with code 0. Programmatically, `result.identical` is `true`.

## Related

- [@scuton/safe-json](https://github.com/scuton-technology/safe-json) — JSON.parse that never throws

## License

MIT © [Scuton Technology](https://scuton.com)
