import express from "express";
import { classifyText } from "C:\Users\Qwe\Desktop\foldertree-pro\backend\src\routesclassifyText.ts";

const router = express.Router();

router.post("/classify", async (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ error: "No title provided" });

  try {
    const category = await classifyText(title);
    return res.status(200).json({ category });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Classification failed" });
  }
});

export default router;
