import { execFileSync } from 'node:child_process';
import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const project = fileURLToPath(new URL('../', import.meta.url));
const repository = path.resolve(project, '..');
const patterns = [
  ['Private key', /-----BEGIN (?:RSA |EC |DSA |OPENSSH |ENCRYPTED )?PRIVATE KEY-----/g],
  ['AWS access key', /\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/g],
  ['GitHub token', /\b(?:gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{30,})\b/g],
  ['API token', /\bsk-(?:proj-|svcacct-)?[A-Za-z0-9_-]{20,}\b/g],
  ['Google API key', /\bAIza[A-Za-z0-9_-]{35}\b/g],
  ['Slack token', /\bxox[baprs]-[A-Za-z0-9-]{20,}\b/g],
  ['Credential in URL', /(?:postgres(?:ql)?|mysql|mongodb(?:\+srv)?|https?):\/\/[^\s/:]+:[^\s/@]+@/g],
  ['JWT', /\beyJ[A-Za-z0-9_-]{15,}\.[A-Za-z0-9_-]{15,}\.[A-Za-z0-9_-]{15,}\b/g],
  ['Literal credential', /(?:api[_-]?key|access[_-]?token|client[_-]?secret|password|secret[_-]?key|authorization)\s*[=:]\s*["']([^"'\n]{8,})["']/gi],
];
const placeholder = /example|placeholder|your[_-]|process\.env|test|dummy|bearer |missing|invalid|\\|\$|%|localhost/i;

// Never include matching content in diagnostics: a failed check must not leak a key.
export function credentialFindings(text) {
  return patterns.flatMap(([category, pattern]) => [...text.matchAll(pattern)]
    .filter(match => category !== 'Literal credential' || !placeholder.test(match[1]))
    .map(match => ({ category, line: text.slice(0, match.index).split('\n').length })));
}

export function privateArtifact(filename, deployment = false) {
  const normalized = filename.replaceAll('\\', '/');
  const basename = path.posix.basename(normalized);
  return /^\.env/i.test(basename)
    || /\.(?:pem|key|p12|pfx|pdf|sqlite|sqlite3|db)$/i.test(basename)
    || (deployment && (/\.(?:map|tsbuildinfo)$/i.test(basename)
      || /(?:^|\/)(?:\.git|\.impeccable|\.sites-runtime|design-review)(?:\/|$)/.test(normalized)
      || /^(?:package(?:-lock)?\.json|next\.config\..+|deploy-pages\.yml)$/i.test(basename)));
}

export function hasImageMetadata(data) {
  if (data.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) {
    for (let offset = 8; offset + 12 <= data.length;) {
      const kind = data.toString('ascii', offset + 4, offset + 8);
      if (['tEXt', 'zTXt', 'iTXt', 'eXIf'].includes(kind)) return true;
      offset += data.readUInt32BE(offset) + 12;
    }
  } else if (data[0] === 255 && data[1] === 216) {
    for (let offset = 2; offset + 4 <= data.length;) {
      if (data[offset] !== 255) break;
      while (data[offset] === 255) offset++;
      const marker = data[offset++];
      if (marker === 218 || marker === 217) break; // Scan data / end of image.
      if ([225, 237, 254].includes(marker)) return true; // EXIF/XMP, IPTC, comment.
      if (marker === 1 || (marker >= 208 && marker <= 215)) continue;
      if (offset + 2 > data.length) break;
      const length = data.readUInt16BE(offset);
      if (length < 2) break;
      offset += length;
    }
  }
  return false;
}

async function* files(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const filename = path.join(directory, entry.name);
    if (entry.isDirectory()) yield* files(filename);
    else if (entry.isFile()) yield filename;
    else throw new Error('Unexpected symlink or special file in deployment.');
  }
}

async function check() {
  const exportDirectory = path.join(project, 'out');
  await stat(path.join(exportDirectory, 'index.html')); // Require a Pages build.
  const sourceFiles = execFileSync('git', ['ls-files', '-z', '--cached', '--others', '--exclude-standard'], { cwd: repository, encoding: 'utf8' }).split('\0').filter(Boolean);
  const findings = [];
  let sourceCount = 0;
  let deploymentCount = 0;
  async function scan(filename, label, deployment) {
    let data;
    try { data = await readFile(filename); }
    catch (error) { if (error.code === 'ENOENT' && !deployment) return; throw error; }
    if (privateArtifact(label, deployment)) findings.push({ file: label, category: 'Private deployment/repository artifact' });
    if (deployment && hasImageMetadata(data)) findings.push({ file: label, category: 'Image metadata must be stripped before publishing' });
    if (deployment) deploymentCount++; else sourceCount++;
    // Scan binary assets too: plain-text credentials can be embedded in metadata.
    const text = data.toString('utf8');
    findings.push(...credentialFindings(text).map(finding => ({ file: label, ...finding })));
    if (deployment && /\/Users\/|\/private\/var\/folders\//.test(text)) findings.push({ file: label, category: 'Machine-local path' });
  }
  for (const filename of new Set(sourceFiles)) await scan(path.join(repository, filename), filename, false);
  for await (const filename of files(exportDirectory)) await scan(filename, path.relative(repository, filename), true);
  if (findings.length) {
    console.error('Public-safety check failed. Values are redacted.');
    for (const finding of findings) console.error(`${finding.file}${finding.line ? ':' + finding.line : ''}: ${finding.category}`);
    process.exitCode = 1;
    return;
  }
  console.log(`Public-safety check passed: ${sourceCount} source files and ${deploymentCount} exported files; no recognized credentials or private artifacts found.`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await check();
