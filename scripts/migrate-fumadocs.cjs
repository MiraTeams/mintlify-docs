const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { createRequire } = require('node:module');
const cliPackage = process.env.MINT_CLI_PACKAGE || path.resolve(__dirname, '../../mintlify-cli/lib/node_modules/mint/package.json');
const req = createRequire(cliPackage);
const ts = req('typescript');
if (!process.argv[2]) throw new Error('Usage: node scripts/migrate-fumadocs.cjs /path/to/mira-docs');
const source = path.resolve(process.argv[2]);
const root = path.resolve(__dirname, '..');
const languages = ['en', 'zh', 'zh-TW', 'ja'];
function write(file, content) {
  const dest = path.join(root, file);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, content);
}
function files(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? files(path.join(dir, e.name)) : [path.join(dir, e.name)]);
}
function objectConstant(file, name) {
  const text = fs.readFileSync(path.join(source, file), 'utf8');
  const ast = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  for (const stmt of ast.statements) {
    if (!ts.isVariableStatement(stmt)) continue;
    const decl = stmt.declarationList.declarations.find(d => d.name.getText(ast) === name);
    if (decl) return vm.runInNewContext('(' + decl.initializer.getText(ast) + ')', Object.create(null), { timeout: 1000 });
  }
  throw new Error(`Missing constant ${name} in ${file}`);
}
const home = objectConstant('components/docs-home.tsx', 'CONTENT');
const redirects = [];
const navigation = [];
for (const language of languages) {
  const base = path.join(source, 'content/docs', language);
  const meta = JSON.parse(fs.readFileSync(path.join(base, 'meta.json')));
  const groups = [{ group: home[language].heroTitle, pages: [`${language}/docs/index`] }];
  for (const section of meta.pages) {
    const metaPath = path.join(base, section, 'meta.json');
    if (!fs.existsSync(metaPath)) continue;
    const sectionMeta = JSON.parse(fs.readFileSync(metaPath));
    groups.push({ group: sectionMeta.title, pages: sectionMeta.pages.filter(p => typeof p === 'string' && fs.existsSync(path.join(base, section, p + '.mdx'))).map(p => `${language}/docs/${section}/${p}`) });
  }
  navigation.push({ language, tabs: [{ tab: meta.title, groups }] });
  // Blog content is managed separately in WordPress.
  for (const kind of ['docs']) {
    for (const file of files(path.join(source, 'content', kind, language)).filter(f => f.endsWith('.mdx'))) {
      const relative = path.relative(path.join(source, 'content', kind), file).replaceAll(path.sep, '/');
      let text = fs.readFileSync(file, 'utf8');
      text = text.replace(/^import .*?from ['"](?:fumadocs-ui[^'"]*|lucide-react)['"];?\s*$/gm, '');
      text = text.replace(/<Cards>/g, '<CardGroup cols={2}>').replace(/<\/Cards>/g, '</CardGroup>');
      text = text.replace(/icon=\{<([A-Za-z]+)\s*\/>\}/g, (_, icon) => 'icon="' + icon.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase() + '"');
      text = text.replace(/<Card\s+([^>]*?)description="([^"]*)"([^>]*?)\s*\/>/g, '<Card $1$3>\n$2\n</Card>');
      text = text.replace(/<Step>\s*###\s+([^\n]+)\n/g, (_, title) => `<Step title=${JSON.stringify(title.trim())}>\n`);
      text = text.replace(/<Callout(?:\s+type="([^"]+)")?>/g, (_, type) => '<' + ({ warn: 'Warning', warning: 'Warning', error: 'Warning', info: 'Note' }[type] || 'Note') + '>').replace(/<\/Callout>/g, '</Note>');
      // Existing sources currently use only untyped Callout; fail on mismatched tags.
      if (/<Warning>/.test(text)) text = text.replace(/<\/Note>/g, '</Warning>');
      if (text.includes('<Flow')) text = text.replace(/^(---[\s\S]*?---)/, '$1\n\nimport { Flow } from "/snippets/flow.jsx";');
      if (text.includes('<SearchLoop')) text = text.replace(/^(---[\s\S]*?---)/, '$1\n\nimport { SearchLoop } from "/snippets/search-loop.jsx";');
      if (kind === 'docs' && path.basename(file) === 'index.mdx' && path.dirname(file) === base) {
        const c = home[language];
        const pos = text.indexOf('\n## ');
        if (pos >= 0) text = text.slice(0, pos) + `\n\n![${c.heroImageAlt}](/docs/mira-overview.png)\n` + text.slice(pos);
      }
      write(`${language}/${kind}/${path.relative(path.join(source, 'content', kind, language), file)}`, text);
      if (path.basename(file) === 'index.mdx') redirects.push({ source: `/${language}/${kind}`, destination: `/${language}/${kind}/index` });
    }
  }
}
const config = {
  $schema: 'https://mintlify.com/docs.json', theme: 'mint', name: 'MiraDay',
  description: 'MiraDay documentation and recruiting perspectives.',
  colors: { primary: '#18181B', light: '#E4E4E7', dark: '#18181B' },
  background: { color: { light: '#FFFFFF', dark: '#262626' } },
  appearance: { default: 'system' }, icons: { library: 'lucide' },
  logo: { light: '/logo/light.svg', dark: '/logo/dark.svg', href: 'https://miraday.ai' }, favicon: '/favicon.ico',
  navigation: { languages: navigation },
  navbar: { primary: { type: 'button', label: 'Open MiraDay', href: 'https://app.miraday.ai' } },
  contextual: { options: ['copy', 'view', 'chatgpt', 'claude', 'mcp'] },
  redirects: [{ source: '/', destination: '/en/docs/index' }, { source: '/index', destination: '/en/docs/index' }, { source: '/quickstart', destination: '/en/docs/get-started/quick-start' }, ...redirects]
};
write('docs.json', JSON.stringify(config, null, 2) + '\n');
for (const name of ['docs', 'og']) fs.cpSync(path.join(source, 'public', name), path.join(root, name), { recursive: true });
fs.copyFileSync(path.join(source, 'app/favicon.ico'), path.join(root, 'favicon.ico'));
for (const component of ['flow', 'search-loop']) {
  const tsx = fs.readFileSync(path.join(source, 'components', component + '.tsx'), 'utf8');
  write(`snippets/${component}.jsx`, ts.transpileModule(tsx, { compilerOptions: { jsx: ts.JsxEmit.Preserve, module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 } }).outputText);
}
const constants = {};
for (const name of ['FRAME_PATH', 'MARK_PATH_1', 'MARK_PATH_2', 'MARK_STAR_PATH', 'WORDMARK_PATHS']) constants[name] = objectConstant('components/mira-logo.tsx', name);
for (const [mode, frame, mark, word] of [['light','#18181B','#FAFAFA','#18181B'], ['dark','#E4E4E7','#18181B','#E4E4E7']]) {
  const paths = [[constants.FRAME_PATH,frame], [constants.MARK_PATH_1,mark], [constants.MARK_PATH_2,mark], [constants.MARK_STAR_PATH,mark], ...constants.WORDMARK_PATHS.map(d => [d,word])];
  write(`logo/${mode}.svg`, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 546 150" fill="none" aria-label="MiraDay">${paths.map(([d,c])=>`<path d="${d}" fill="${c}"/>`).join('')}</svg>\n`);
}
for (const file of ['index.mdx', 'quickstart.mdx', 'favicon.svg']) fs.rmSync(path.join(root, file), { force: true });
console.log(JSON.stringify({ docs: languages.map(language => ({ language, pages: files(path.join(root, language, 'docs')).length })) }));
