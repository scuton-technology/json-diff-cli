# @scuton/json-diff

Compare two JSON files and show differences with color-coded terminal output.

Works as both a **CLI tool** and a **programmatic library**.

## Installation

```bash
# Global CLI
npm install -g @scuton/json-diff

# Project dependency
npm install @scuton/json-diff
```

## CLI Usage

```bash
json-diff <file1.json> <file2.json>
```

### Example

```bash
$ json-diff old-config.json new-config.json

  + added:    database.pool = 10
  - removed:  debug
  ~ changed:  server.port: 3000 → 8080

  Summary: 1 added, 1 removed, 1 changed
```

### Options

| Flag           | Description          |
| -------------- | -------------------- |
| `-h`, `--help` | Show help            |
| `--no-color`   | Disable color output |

Set the `NO_COLOR` environment variable to disable colors globally.

## Programmatic API

```typescript
import { diffJson } from '@scuton/json-diff';

const result = diffJson(
  { server: { port: 3000 }, debug: true },
  { server: { port: 8080 }, database: { pool: 10 } }
);

console.log(result.identical); // false
console.log(result.added);     // [{ path: 'database', type: 'added', newValue: { pool: 10 } }]
console.log(result.removed);   // [{ path: 'debug', type: 'removed', oldValue: true }]
console.log(result.changed);   // [{ path: 'server.port', type: 'changed', oldValue: 3000, newValue: 8080 }]
```

## API Types

```typescript
interface DiffEntry {
  path: string;
  type: 'added' | 'removed' | 'changed';
  oldValue?: any;
  newValue?: any;
}

interface DiffResult {
  added: DiffEntry[];
  removed: DiffEntry[];
  changed: DiffEntry[];
  identical: boolean;
}

function diffJson(a: any, b: any): DiffResult;
function formatValue(val: any): string;
```

## Features

- Deep recursive comparison of nested objects and arrays
- Dot-notation paths for easy identification (`server.port`, `items[2]`)
- Color-coded output: green (added), red (removed), yellow (changed)
- Zero dependencies at runtime
- Dual CJS/ESM output with TypeScript declarations

## License

MIT - Scuton Technology
