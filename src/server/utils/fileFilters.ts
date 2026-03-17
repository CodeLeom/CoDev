import * as path from 'path';

const IGNORE_DIRS = new Set([
  'node_modules',
  '.git',
  '.next',
  'dist',
  'build',
  'coverage',
  '.turbo',
  '.cache',
  '__pycache__',
  '.venv',
  'venv',
]);

const SUPPORTED_EXT = new Set([
  '.js',
  '.ts',
  '.jsx',
  '.tsx',
  '.json',
  '.md',
  '.yml',
  '.yaml',
  '.txt',
]);

const IGNORE_FILES = new Set([
  'package-lock.json',
  'yarn.lock',
  'pnpm-lock.yaml',
  'bun.lock',
]);

const MAX_FILE_SIZE_BYTES = 200 * 1024;

export function shouldIgnorePath(relPath: string): boolean {
  const parts = relPath.split(path.sep);
  for (const p of parts) {
    if (IGNORE_DIRS.has(p)) return true;
  }
  const base = path.basename(relPath);
  if (IGNORE_FILES.has(base)) return true;
  const ext = path.extname(relPath).toLowerCase();
  if (!SUPPORTED_EXT.has(ext)) return true;
  return false;
}

export function getSupportedExtensions(): string[] {
  return [...SUPPORTED_EXT];
}

export function isValidExt(filePath: string): boolean {
  const ext = path.extname(filePath).toLowerCase();
  return SUPPORTED_EXT.has(ext);
}

export function shouldSkipBySize(sizeBytes: number): boolean {
  return sizeBytes > MAX_FILE_SIZE_BYTES;
}
