import fs from "fs";
import path from "path";

function simplifyFilename(filename: string): string {
  let device = "iPhone";
  let screen = "Overview";

  if (filename.includes("iPad")) {
    device = "iPad";
  } else if (filename.includes("Mac")) {
    device = "Mac";
  }

  if (filename.toLocaleLowerCase().includes("detail")) {
    screen = "Detail";
  } else if (filename.toLocaleLowerCase().includes("edit")) {
    screen = "Edit";
  } else if (filename.toLocaleLowerCase().includes("features")) {
    screen = "Features";
  }

  return `${device}_${screen}.png`;
}

function findPngFiles(dir: string): string[] {
  const files: string[] = [];

  function walk(currentDir: string) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);

      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.isFile() && entry.name.endsWith(".png")) {
        files.push(fullPath);
      }
    }
  }

  walk(dir);
  return files;
}

function renameScreenshots(directory: string, dryRun = true) {
  const files = findPngFiles(directory);
  let renamedCount = 0;

  for (const filePath of files) {
    const dir = path.dirname(filePath);
    const oldName = path.basename(filePath);
    const newName = simplifyFilename(oldName);

    if (oldName !== newName) {
      const newPath = path.join(dir, newName);

      if (dryRun) {
        console.log(`[DRY RUN] ${oldName} -> ${newName}`);
      } else {
        fs.renameSync(filePath, newPath);
        console.log(`Renamed: ${oldName} -> ${newName}`);
      }
      renamedCount++;
    }
  }

  console.log(`\n${dryRun ? "Would rename" : "Renamed"} ${renamedCount} files`);

  if (dryRun && renamedCount > 0) {
    console.log("\nRun with --run to actually rename files");
  }
}

// Main
const args = process.argv.slice(2);
const targetDir = args.find((arg) => !arg.startsWith("--")) || ".";
const dryRun = !args.includes("--run");

console.log(`Scanning: ${path.resolve(targetDir)}`);
console.log(dryRun ? "Mode: DRY RUN (no changes will be made)\n" : "Mode: RENAME\n");

renameScreenshots(targetDir, dryRun);
