#!/usr/bin/env node
const { spawn } = require('child_process');
const path = require('path');

const electronExe = path.join(__dirname, 'node_modules', 'electron', 'dist', 'electron.exe');

// Clone env and remove ELECTRON_RUN_AS_NODE
const env = { ...process.env };
delete env.ELECTRON_RUN_AS_NODE;

const child = spawn(electronExe, ['.'], {
  stdio: 'inherit',
  env,
  cwd: __dirname,
  windowsHide: false
});

child.on('close', (code) => process.exit(code));
