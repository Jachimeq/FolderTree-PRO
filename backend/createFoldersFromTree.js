const fs = require("fs");
const path = require("path");

const OUTPUT_DIR = path.join(__dirname, "generated");

function isLikelyFile(name) {
  return /\.[a-z0-9]+$/i.test(name); // np. ArenaManager.cs
}

function createFoldersFromTree(tree, nodeId, basePath) {
  const node = tree.items[nodeId];
  const folderName = node.data.title;
  if (isLikelyFile(folderName)) return; // pomijamy pliki

  const currentPath = path.join(basePath, folderName);

  if (!fs.existsSync(currentPath)) {
    fs.mkdirSync(currentPath, { recursive: true });
    console.log("📁 Created:", currentPath);
  }

  for (const childId of node.children) {
    createFoldersFromTree(tree, childId, currentPath);
  }
}

function generateFoldersFromTree(tree) {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR);
  }
  createFoldersFromTree(tree, tree.rootId, OUTPUT_DIR);
  return OUTPUT_DIR;
}

module.exports = { generateFoldersFromTree };
