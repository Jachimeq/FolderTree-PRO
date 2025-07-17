import express from 'express';
import { createFoldersFromTree } from '../utils/createFolders';
import path from 'path';
import fs from 'fs';

const router = express.Router();

router.post('/create-folders', (req, res) => {
  const tree = req.body.tree;
  if (!tree) {
    return res.status(400).json({ error: 'No tree provided' });
  }

  const baseFolder = path.join(__dirname, '../../generated_folders');
  if (!fs.existsSync(baseFolder)) {
    fs.mkdirSync(baseFolder);
  }

  try {
    createFoldersFromTree(tree, baseFolder);
    return res.status(200).json({ message: 'Folders created successfully', path: baseFolder });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to create folders' });
  }
});

export default router;
