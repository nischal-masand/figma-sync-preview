import esbuild from 'esbuild';
import fs from 'fs';
import { execSync } from 'child_process';

const isWatch = process.argv.includes('--watch');

async function build() {
  // Ensure dist directory exists
  if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist');
  }

  const buildOptions = {
    plugin: {
      entryPoints: ['plugin/code.ts'],
      bundle: true,
      outfile: 'dist/code.js',
      platform: 'node',
      target: 'es2017',
    },
    ui: {
      entryPoints: ['src/plugin-ui/index.tsx'],
      bundle: true,
      outfile: 'dist/ui.js',
      platform: 'browser',
      target: 'es2017',
      minify: true,
      jsx: 'automatic',
      define: {
        'process.env.NODE_ENV': '"production"',
      },
      loader: {
        '.tsx': 'tsx',
        '.ts': 'ts',
      },
    },
  };

  if (isWatch) {
    // Watch mode
    const ctxPlugin = await esbuild.context(buildOptions.plugin);
    const ctxUI = await esbuild.context(buildOptions.ui);

    await ctxPlugin.watch();
    await ctxUI.watch();

    console.log('👀 Watching for changes...');
  } else {
    // Build once
    await esbuild.build(buildOptions.plugin);
    await esbuild.build(buildOptions.ui);
  }

  // Compile Tailwind CSS
  console.log('⚡ Compiling Tailwind CSS...');
  try {
    execSync('npx @tailwindcss/cli -i src/styles/index.css -o dist/tailwind-built.css --minify', {
      stdio: 'inherit'
    });
  } catch (err) {
    console.error('❌ Tailwind compilation failed:', err);
  }

  let combinedCSS = '';
  if (fs.existsSync('dist/tailwind-built.css')) {
    combinedCSS = fs.readFileSync('dist/tailwind-built.css', 'utf8');
    // Clean up temporary CSS file
    try {
      fs.unlinkSync('dist/tailwind-built.css');
    } catch (e) {}
  }

  // Read compiled ui.js
  let compiledJS = '';
  if (fs.existsSync('dist/ui.js')) {
    compiledJS = fs.readFileSync('dist/ui.js', 'utf8');
    // Clean up temporary JS file
    try {
      fs.unlinkSync('dist/ui.js');
    } catch (e) {}
  }

  // Generate ui.html with inlined styles
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    /* box-sizing only — margin/padding reset is handled by Tailwind preflight inside @layer base,
       which correctly loses to @layer utilities. A bare * { padding:0 } here is unlayered and
       would silently override every Tailwind padding/margin utility class. */
    *, *::before, *::after {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      overflow: hidden;
    }

    #root {
      width: 100vw;
      height: 100vh;
    }

    ${combinedCSS}
  </style>
</head>
<body>
  <div id="root"></div>
  <script>
    ${compiledJS}
  </script>
</body>
</html>
`;

  fs.writeFileSync('dist/ui.html', html);
  console.log('✓ Plugin build complete');
}

build().catch(() => process.exit(1));
