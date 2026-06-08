import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const DEFAULT_DATA_DIR = path.join(process.cwd(), '.maiji-local-data');

export function getLocalDataDir() {
  return path.resolve(process.env.MAIJI_DATA_DIR?.trim() || DEFAULT_DATA_DIR);
}

export function getLocalDatabasePath() {
  return path.join(getLocalDataDir(), 'app.sqlite');
}

export function getLocalAssetsDir() {
  return path.join(getLocalDataDir(), 'assets');
}

export async function ensureLocalDataDirs() {
  await mkdir(getLocalAssetsDir(), { recursive: true });
}

