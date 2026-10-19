const test = require('node:test');
const assert = require('node:assert');
const { spawnSync } = require('node:child_process');
const path = require('node:path');

test('index.js has valid syntax', () => {
  const result = spawnSync(process.execPath, ['--check', path.join(__dirname, '..', 'index.js')]);
  assert.strictEqual(result.status, 0, result.stderr.toString());
});

test('dependencies can be loaded', () => {
  require('express');
  require('request');
  require('instagram-node');
});
