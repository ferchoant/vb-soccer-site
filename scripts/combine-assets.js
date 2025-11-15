#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '..', 'index.html');
const outputPath = path.join(__dirname, '..', 'index.all-in-one.html');

const cssFiles = [
  path.join(__dirname, '..', 'style', 'fonts.css'),
  path.join(__dirname, '..', 'style', 'bootstrap.css'),
  path.join(__dirname, '..', 'style', 'theme.css'),
];

const jsFiles = [
  path.join(__dirname, '..', 'script', 'bootstrap.bundle.min.js'),
  path.join(__dirname, '..', 'script', 'main.js'),
];

function combineFiles(files) {
  return files
    .map((filePath) => {
      const content = fs.readFileSync(filePath, 'utf8');
      return `/* Source: ${path.relative(path.join(__dirname, '..'), filePath)} */\n${content}`;
    })
    .join('\n\n');
}

const combinedCss = combineFiles(cssFiles).replace(/\.\.\/assets\//g, './assets/');
const combinedJs = combineFiles(jsFiles);

let html = fs.readFileSync(htmlPath, 'utf8');

const cssBlock = `  <!-- Combined CSS (fonts.css + bootstrap.css + theme.css) -->\n  <style>\n${combinedCss}\n  </style>\n`;
const jsBlock = `  <!-- Combined JS (bootstrap.bundle.min.js + main.js) -->\n  <script>\n${combinedJs}\n  </script>\n`;

if (!html.includes('<!-- Combined CSS')) {
  html = html.replace('</head>', `${cssBlock}</head>`);
}

if (!html.includes('<!-- Combined JS')) {
  html = html.replace('</body>', `${jsBlock}</body>`);
}

fs.writeFileSync(outputPath, html, 'utf8');
console.log(`Combined file generated at ${outputPath}`);
