import { defineConfig } from 'vite';
import { resolve, join } from 'path';
import fs from 'fs';

// Helper to recursively find all HTML files
function getHtmlFiles(dir, files_ = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const name = join(dir, file);
        if (fs.statSync(name).isDirectory()) {
            // Exclude node_modules, git, and build output directories
            if (file !== 'node_modules' && file !== '.git' && file !== 'dist' && file !== '.gemini') {
                getHtmlFiles(name, files_);
            }
        } else if (name.endsWith('.html')) {
            files_.push(name);
        }
    }
    return files_;
}

// Helper to copy folder recursively
function copyFolderRecursiveSync(source, target) {
    if (!fs.existsSync(source)) return;
    if (!fs.existsSync(target)) {
        fs.mkdirSync(target, { recursive: true });
    }
    const files = fs.readdirSync(source);
    for (const file of files) {
        const curSource = join(source, file);
        const curTarget = join(target, file);
        if (fs.lstatSync(curSource).isDirectory()) {
            copyFolderRecursiveSync(curSource, curTarget);
        } else {
            fs.copyFileSync(curSource, curTarget);
        }
    }
}

const htmlFiles = getHtmlFiles(process.cwd());
const input = {};

htmlFiles.forEach(file => {
    // Normalize path to root-relative Unix-style
    const relativePath = file.replace(process.cwd(), '').replace(/^[/\\]/, '').replace(/\\/g, '/');
    // Create unique key for Rollup entry points
    let key = relativePath.replace(/\.html$/, '');
    if (key === 'index' || key === '') {
        key = 'main';
    }
    input[key] = resolve(process.cwd(), relativePath);
});

export default defineConfig({
    root: './',
    plugins: [
        {
            name: 'copy-assets-plugin',
            closeBundle() {
                const src = resolve(process.cwd(), 'assets');
                const dest = resolve(process.cwd(), 'dist/assets');
                copyFolderRecursiveSync(src, dest);
                console.log('Successfully copied assets folder to dist/assets');
            }
        }
    ],
    build: {
        outDir: 'dist',
        rollupOptions: {
            input: input
        }
    },
    server: {
        port: 3000,
        open: true
    }
});
