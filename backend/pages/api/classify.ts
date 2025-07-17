// backend/pages/api/classify.ts
import { NextApiRequest, NextApiResponse } from "next";
import { classifyFile } from "C:\Users\Qwe\Desktop\foldertree-pro\backend\src\utilis\classifier.ts";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const result = await classifyFile(req.body);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Classification error:", error);
    return res.status(500).json({ error: "AI classification failed" });
  }
}
