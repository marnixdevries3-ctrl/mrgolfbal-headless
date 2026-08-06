// Inline styles.css into every *.html (recursief) -> ./preview/<zelfde pad> (self-contained)
import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync, statSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';

const root = new URL('.', import.meta.url).pathname.replace(/\/$/, '');
const css = readFileSync(join(root, 'assets/css/styles.css'), 'utf8');
const siteJs = readFileSync(join(root, 'assets/js/site.js'), 'utf8');

function walk(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    if (['preview', 'node_modules', 'assets', '.git', 'netlify', 'docs'].includes(name)) continue;
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, acc);
    else if (name.endsWith('.html')) acc.push(full);
  }
  return acc;
}

for (const file of walk(root)) {
  let html = readFileSync(file, 'utf8');
  html = html.replace(/<link rel="stylesheet" href="[^"]*styles\.css">/, `<style>\n${css}\n</style>`);
  html = html.replace(/<script src="[^"]*site\.js"[^>]*><\/script>/, `<script>\n${siteJs}\n</script>`);
  const rel = relative(root, file);
  const out = join(root, 'preview', rel);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, html);
  console.log('built preview/' + rel);
}
