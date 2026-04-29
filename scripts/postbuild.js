#!/usr/bin/env node
/**
 * Post-build script to reorganize the build output:
 * - Move English content from root to /en
 * - Update internal links in English HTML files
 * - Create a redirect index.html at root that redirects based on browser language
 */

const fs = require('fs');
const path = require('path');

const buildDir = path.join(__dirname, '..', 'build');

// Files/folders that should stay at root (not be moved to /en)
const rootFiles = [
  '.nojekyll',
  'CNAME',
  'assets',
  'img',
  'sitemap.xml',
  '404.html',
  '404',
  'es', // Spanish version stays at /es
];

// Create /en directory
const enDir = path.join(buildDir, 'en');
if (!fs.existsSync(enDir)) {
  fs.mkdirSync(enDir, { recursive: true });
}

// Get all files/folders in build directory
const items = fs.readdirSync(buildDir);

// Move English content to /en
items.forEach(item => {
  if (rootFiles.includes(item) || item === 'en') {
    return; // Skip files that should stay at root
  }
  
  const srcPath = path.join(buildDir, item);
  const destPath = path.join(enDir, item);
  
  // Move the item
  fs.renameSync(srcPath, destPath);
  console.log(`Moved: ${item} -> en/${item}`);
});

/**
 * Recursively update links in HTML files
 */
function updateLinksInDir(dir) {
  const items = fs.readdirSync(dir);
  
  items.forEach(item => {
    const itemPath = path.join(dir, item);
    const stat = fs.statSync(itemPath);
    
    if (stat.isDirectory()) {
      updateLinksInDir(itemPath);
    } else if (item.endsWith('.html')) {
      updateLinksInFile(itemPath);
    }
  });
}

/**
 * Update links in a single HTML file
 */
function updateLinksInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Update href links that start with / but not /en/ or /es/ or /assets/ or /img/
  // This includes the root "/" link which should become "/en/"
  let modified = content;
  
  // First, update all /docs/, /markdown-page/, etc. to /en/...
  modified = modified.replace(
    /href="\/(?!en\/|es\/|assets\/|img\/)([^"]+)"/g,
    (match, path) => {
      if (path === '') {
        return match; // Keep href="/" for now, we'll handle it separately
      }
      return `href="/en/${path}"`;
    }
  );
  
  // Now update the bare "/" links to "/en/"
  // But be careful not to update links in <link> tags for canonical URLs
  // Update in <a> tags
  modified = modified.replace(
    /<a([^>]*?)href="\/"([^>]*?)>/g,
    '<a$1href="/en/"$2>'
  );
  
  if (modified !== content) {
    fs.writeFileSync(filePath, modified);
    console.log(`Updated links in: ${path.relative(buildDir, filePath)}`);
  }
}

// Update links in English HTML files
console.log('\\nUpdating links in English HTML files...');
updateLinksInDir(enDir);

// Also need to update the locale dropdown in Spanish files to point to /en/ instead of /
console.log('\\nUpdating locale dropdown in Spanish HTML files...');
const esDir = path.join(buildDir, 'es');
if (fs.existsSync(esDir)) {
  updateLocaleDropdownInDir(esDir);
}

/**
 * Update locale dropdown links in Spanish files
 */
function updateLocaleDropdownInDir(dir) {
  const items = fs.readdirSync(dir);
  
  items.forEach(item => {
    const itemPath = path.join(dir, item);
    const stat = fs.statSync(itemPath);
    
    if (stat.isDirectory()) {
      updateLocaleDropdownInDir(itemPath);
    } else if (item.endsWith('.html')) {
      updateLocaleDropdownInFile(itemPath);
    }
  });
}

function updateLocaleDropdownInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // In Spanish pages, the English links point to paths without /es/ prefix
  // We need to change /docs/... to /en/docs/...
  // And / to /en/
  
  let modified = content;
  
  // Update all links that go to /docs/... (without /es/ or /en/ prefix) to /en/docs/...
  // These are the English version links in the locale dropdown
  modified = modified.replace(
    /href="(\/docs\/[^"]+)"/g,
    'href="/en$1"'
  );
  
  // Update links to root "/" that should go to English
  // In <a> tags only (not <link> tags)
  modified = modified.replace(
    /<a([^>]*?)href="\/"([^>]*?)>/g,
    '<a$1href="/en/"$2>'
  );
  
  // Update hreflang alternate links to use /en/
  modified = modified.replace(
    /href="(https:\/\/docs\.almena\.id)(\/docs\/[^"]+)" hreflang="en/g,
    'href="$1/en$2" hreflang="en'
  );
  
  // Also update hreflang links in <link> tags for x-default and en
  modified = modified.replace(
    /href="(https:\/\/docs\.almena\.id\/docs\/[^"]+)" hreflang="(en-US|x-default)"/g,
    (match, url, lang) => {
      const newUrl = url.replace('docs.almena.network/docs/', 'docs.almena.network/en/docs/');
      return `href="${newUrl}" hreflang="${lang}"`;
    }
  );

  if (modified !== content) {
    fs.writeFileSync(filePath, modified);
    console.log(`Updated locale dropdown in: ${path.relative(buildDir, filePath)}`);
  }
}

// Create the root index.html with language detection redirect
const rootIndexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Almena Network - Redirecting...</title>
  <meta name="description" content="Almena Network - Decentralized Identity Platform">
  <link rel="icon" href="/img/favicon.ico">
  <link rel="canonical" href="https://docs.almena.network/en/">
  <link rel="alternate" hreflang="en" href="https://docs.almena.network/en/">
  <link rel="alternate" hreflang="es" href="https://docs.almena.network/es/">
  <link rel="alternate" hreflang="x-default" href="https://docs.almena.network/en/">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      margin: 0;
      background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
      color: white;
    }
    .container {
      text-align: center;
      padding: 2rem;
    }
    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid rgba(255,255,255,0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 1rem;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    h1 {
      margin: 0 0 0.5rem;
      font-size: 2rem;
    }
    p {
      margin: 0;
      opacity: 0.9;
    }
    .links {
      margin-top: 2rem;
    }
    .links a {
      color: white;
      margin: 0 1rem;
      text-decoration: none;
      padding: 0.75rem 1.5rem;
      border: 2px solid white;
      border-radius: 8px;
      transition: all 0.2s;
      display: inline-block;
    }
    .links a:hover {
      background: white;
      color: #f97316;
    }
  </style>
  <script>
    (function() {
      // Detect browser language
      var browserLang = navigator.language || navigator.userLanguage || 'en';
      browserLang = browserLang.toLowerCase();
      
      // Determine target locale
      var targetLocale = 'en'; // Default to English
      
      if (browserLang.startsWith('es')) {
        targetLocale = 'es';
      }
      
      // Redirect to the appropriate locale
      window.location.replace('/' + targetLocale + '/');
    })();
  </script>
</head>
<body>
  <noscript>
    <meta http-equiv="refresh" content="0;url=/en/">
  </noscript>
  <div class="container">
    <div class="spinner"></div>
    <h1>Almena Network</h1>
    <p>Redirecting to your language...</p>
    <p style="margin-top: 0.5rem; font-size: 0.9em;">Redirigiendo a tu idioma...</p>
    <div class="links">
      <a href="/en/">English</a>
      <a href="/es/">Español</a>
    </div>
  </div>
</body>
</html>`;

fs.writeFileSync(path.join(buildDir, 'index.html'), rootIndexHtml);
console.log('\\nCreated: index.html (language redirect)');

// Update sitemap to include both /en and /es paths
const sitemapPath = path.join(buildDir, 'sitemap.xml');
if (fs.existsSync(sitemapPath)) {
  let sitemap = fs.readFileSync(sitemapPath, 'utf8');
  // Update URLs that don't have /en or /es prefix to have /en
  sitemap = sitemap.replace(
    /<loc>(https:\/\/docs\.almena\.id)\/(?!en\/|es\/|assets\/|img\/)([^<]*)<\/loc>/g,
    '<loc>$1/en/$2</loc>'
  );
  fs.writeFileSync(sitemapPath, sitemap);
  console.log('Updated: sitemap.xml');
}

console.log('\\n✅ Post-build complete!');
console.log('\\nStructure:');
console.log('  /          -> Language detection redirect');
console.log('  /en/       -> English content');
console.log('  /es/       -> Spanish content');
console.log('\\nTest with: npx serve build');
