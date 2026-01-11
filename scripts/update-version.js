#!/usr/bin/env node

/**
 * Script to update version numbers across all package.json files
 * Usage: node scripts/update-version.js <version>
 * Example: node scripts/update-version.js 1.0.0
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const SCREEGEN_PACKAGES = ['@screegen/cli', '@screegen/components'];

// Package.json files to update (relative to root)
const PACKAGE_FILES = [
  'package.json',
  'packages/cli/package.json',
  'packages/components/package.json',
  'packages/example/package.json',
  'packages/cli/templates/package.json.template',
];

function updatePackageJson(filePath, newVersion, useCaretForTemplate = false) {
  const fullPath = path.resolve(rootDir, filePath);

  if (!fs.existsSync(fullPath)) {
    console.warn(`⚠️  File not found: ${filePath}`);
    return false;
  }

  const content = fs.readFileSync(fullPath, 'utf-8');
  const pkg = JSON.parse(content);
  const changes = [];

  // Update the package's own version
  if (pkg.version) {
    const oldVersion = pkg.version;
    pkg.version = newVersion;
    changes.push(`version: ${oldVersion} → ${newVersion}`);
  }

  // Determine version format for dependencies
  const depVersion = useCaretForTemplate ? `^${newVersion}` : newVersion;

  // Update dependencies
  for (const depType of ['dependencies', 'devDependencies', 'peerDependencies']) {
    if (pkg[depType]) {
      for (const pkgName of SCREEGEN_PACKAGES) {
        if (pkg[depType][pkgName]) {
          const oldVersion = pkg[depType][pkgName];
          pkg[depType][pkgName] = depVersion;
          changes.push(`${depType}.${pkgName}: ${oldVersion} → ${depVersion}`);
        }
      }
    }
  }

  if (changes.length > 0) {
    fs.writeFileSync(fullPath, JSON.stringify(pkg, null, 2) + '\n');
    console.log(`✅ ${filePath}`);
    changes.forEach(change => console.log(`   ${change}`));
    return true;
  }

  return false;
}

function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error('Usage: node scripts/update-version.js <version>');
    console.error('Example: node scripts/update-version.js 1.0.0');
    process.exit(1);
  }

  const newVersion = args[0];

  // Validate version format (basic semver check)
  if (!/^\d+\.\d+\.\d+(-[\w.]+)?(\+[\w.]+)?$/.test(newVersion)) {
    console.error(`Error: Invalid version format "${newVersion}"`);
    console.error('Expected format: major.minor.patch (e.g., 1.0.0, 1.0.0-beta.1)');
    process.exit(1);
  }

  console.log(`\n📦 Updating all packages to version ${newVersion}\n`);

  let updatedCount = 0;

  for (const file of PACKAGE_FILES) {
    // Template files use caret (^) prefix for dependencies
    const isTemplate = file.includes('.template');
    if (updatePackageJson(file, newVersion, isTemplate)) {
      updatedCount++;
    }
  }

  console.log(`\n✨ Updated ${updatedCount} file(s)\n`);
}

main();
