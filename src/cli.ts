import { readFileSync } from 'fs';
import { diffJson, formatValue } from './lib/diff';
import { green, red, yellow, bold, dim, cyan } from './lib/colors';

const args = process.argv.slice(2);

if (args.length < 2 || args.includes('--help') || args.includes('-h')) {
  console.log(`
${bold('json-diff')} — Compare two JSON files

${cyan('Usage:')}
  json-diff <file1.json> <file2.json>

${cyan('Options:')}
  -h, --help     Show help
  --no-color     Disable color output

${cyan('Example:')}
  json-diff config.old.json config.new.json
`);
  process.exit(args.includes('--help') || args.includes('-h') ? 0 : 1);
}

const [file1, file2] = args;

try {
  const a = JSON.parse(readFileSync(file1, 'utf-8'));
  const b = JSON.parse(readFileSync(file2, 'utf-8'));
  const result = diffJson(a, b);

  if (result.identical) {
    console.log(green('Files are identical.'));
    process.exit(0);
  }

  console.log('');
  for (const entry of result.added) {
    console.log(green(`  + added:    ${entry.path} = ${formatValue(entry.newValue)}`));
  }
  for (const entry of result.removed) {
    console.log(red(`  - removed:  ${entry.path}`));
  }
  for (const entry of result.changed) {
    console.log(yellow(`  ~ changed:  ${entry.path}: ${formatValue(entry.oldValue)} → ${formatValue(entry.newValue)}`));
  }
  console.log('');
  console.log(dim(`  Summary: ${result.added.length} added, ${result.removed.length} removed, ${result.changed.length} changed`));
  console.log('');
} catch (err: any) {
  console.error(red(`Error: ${err.message}`));
  process.exit(1);
}
