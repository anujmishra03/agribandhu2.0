import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { loadEnvFiles, defaultEnvPaths } from '../lib/env';

function withTempEnv(contents: string): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'agribandhu-env-'));
  const file = path.join(dir, '.env');
  fs.writeFileSync(file, contents);
  return file;
}

test('loadEnvFiles loads variables from a .env file', () => {
  const file = withTempEnv('AGRIBANDHU_TEST_LOADED=from_file\n');
  delete process.env.AGRIBANDHU_TEST_LOADED;

  loadEnvFiles([file]);

  assert.equal(process.env.AGRIBANDHU_TEST_LOADED, 'from_file');
  delete process.env.AGRIBANDHU_TEST_LOADED;
  fs.rmSync(path.dirname(file), { recursive: true, force: true });
});

test('loadEnvFiles does not overwrite deployment-provided variables', () => {
  const file = withTempEnv('AGRIBANDHU_TEST_PRESET=from_file\n');
  process.env.AGRIBANDHU_TEST_PRESET = 'from_process';

  loadEnvFiles([file]);

  assert.equal(process.env.AGRIBANDHU_TEST_PRESET, 'from_process');
  delete process.env.AGRIBANDHU_TEST_PRESET;
  fs.rmSync(path.dirname(file), { recursive: true, force: true });
});

test('loadEnvFiles ignores files that do not exist', () => {
  assert.doesNotThrow(() =>
    loadEnvFiles([path.join(os.tmpdir(), 'agribandhu-missing-does-not-exist.env')])
  );
});

test('defaultEnvPaths returns absolute candidate paths', () => {
  const paths = defaultEnvPaths();
  assert.ok(paths.length >= 2);
  assert.ok(paths.every((p) => path.isAbsolute(p)));
});
