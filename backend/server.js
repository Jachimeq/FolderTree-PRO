const express = require("express");
const cors = require("cors");
const { generateFoldersFromTree } = require("./createFoldersFromTree");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/generate-folders", (req, res) => {
  const tree = req.body;
  try {
    const outDir = generateFoldersFromTree(tree);
    res.json({ success: true, output: outDir });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(3001, () => console.log("✅ Backend running on http://localhost:3001"));
