<div align="center">

# json-diff

**Compare two JSON files and show differences. Color-coded terminal output.**

[![npm](https://img.shields.io/npm/v/@scuton/json-diff?style=flat-square)](https://www.npmjs.com/package/@scuton/json-diff)
[![License: MIT](https://img.shields.io/badge/license-MIT-green?style=flat-square)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6?style=flat-square)](https://www.typescriptlang.org/)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-0-brightgreen?style=flat-square)](package.json)

</div>

---

## Install

```bash
npm install @scuton/json-diff
```

## CLI Usage

```bash
npx @scuton/json-diff old.json new.json
```

```
  + added:    database.pool = 10
  - removed:  debug
  ~ changed:  server.port: 3000 → 8080

  Summary: 1 added, 1 removed, 1 changed
```

## Programmatic API

```typescript
import { diffJson } from '@scuton/json-diff';

const result = diffJson(
  { server: { port: 3000 }, debug: true },
  { server: { port: 8080 }, database: { pool: 10 } }
);

result.identical  // false
result.added      // [{ path: 'database', type: 'added', newValue: { pool: 10 } }]
result.removed    // [{ path: 'debug', type: 'removed', oldValue: true }]
result.changed    // [{ path: 'server.port', type: 'changed', oldValue: 3000, newValue: 8080 }]
```

## API

| Function | Signature | Description |
|----------|-----------|-------------|
| `diffJson` | `(a: any, b: any) => DiffResult` | Deep recursive JSON comparison |

`DiffResult` contains `added`, `removed`, `changed` arrays and an `identical` boolean.

## License

MIT — [Scuton Technology](https://scuton.com)
