// This file is deprecated and conflicts with src/index.js
// The main entry point is src/index.js which uses CommonJS
// This file uses ES6 modules which creates a conflict
// Removing this file to prevent module system conflicts

console.warn('WARNING: app.js is deprecated. Use src/index.js as the main entry point.');
process.exit(1);
