/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");
const AdmZip = require("adm-zip");

const projectRoot = process.cwd();
const distDir = projectRoot;
const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
const zipName = `juice-bar-cpanel-${timestamp}.zip`;
const outputPath = path.join(distDir, zipName);

const requiredPaths = [
    ".next",
    "public",
    "src",
    "scripts",
    ".env.production",
    // ".env.local",
    "drizzle.config.ts",
    "next.config.mjs",
    "package.json",
    "package-lock.json",
    "tsconfig.json",
    "postcss.config.mjs",
    "eslint.config.mjs",
    "server.js",
    "README.md",
];

if (!fs.existsSync(path.join(projectRoot, ".next"))) {
    console.warn(
        "⚠️  '.next' directory not found. Run `npm run build` before packaging if you need production build output."
    );
}

const zip = new AdmZip();

requiredPaths.forEach((item) => {
    const fullPath = path.join(projectRoot, item);
    if (!fs.existsSync(fullPath)) {
        console.warn(`Skipping missing path: ${item}`);
        return;
    }

    const stats = fs.statSync(fullPath);
    if (stats.isDirectory()) {
        zip.addLocalFolder(fullPath, item.replace(/\\/g, "/"));
    } else {
        const folder = path.dirname(item);
        zip.addLocalFile(fullPath, folder === "." ? "" : folder);
    }
});

zip.writeZip(outputPath);

console.log(`📦 Deployment archive created at: ${outputPath}`);
console.log("Upload this ZIP to cPanel and extract it inside the application root directory.");


