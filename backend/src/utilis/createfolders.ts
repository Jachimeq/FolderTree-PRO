import fs from 'fs';
import path from 'path';

interface TreeNode {
  id: string;
  children: string[];
  isExpanded: boolean;
  data: {
    title: string;
    tags: string[];
  };
}

interface Tree {
  rootId: string;
  items: {
    [key: string]: TreeNode;
  };
}

export function createFoldersFromTree(tree: Tree, basePath: string) {
  function createRecursive(nodeId: string, currentPath: string) {
    const node = tree.items[nodeId];
    if (nodeId !== 'root') {
      currentPath = path.join(currentPath, node.data.title);
      if (!fs.existsSync(currentPath)) {
        fs.mkdirSync(currentPath);
      }
    }

    node.children.forEach(childId => {
      createRecursive(childId, currentPath);
    });
  }

  createRecursive(tree.rootId, basePath);
}
