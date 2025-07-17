import axios from "axios";

export async function classifyText(text: string): Promise<string> {
  const labels = ["Documents", "Images", "Audio", "Video", "Source code", "Design", "Finance", "Other"];

  const response = await axios.post(
    "https://api-inference.huggingface.co/models/facebook/bart-large-mnli",
    {
      inputs: text,
      parameters: {
        candidate_labels: labels
      }
    },
    {
      headers: {
        "Content-Type": "application/json"
      }
    }
  );

  const result = response.data;
  return result?.labels?.[0] || "Other";
}
