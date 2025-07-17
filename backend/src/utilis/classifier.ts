// backend/utils/classifier.ts
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export interface FileMeta {
  name: string;
  path: string;
  extension: string;
  created: string;
  size: number;
  parentContext: string[];
}

export async function classifyFile(meta: FileMeta): Promise<{ category: string; confidence: number }> {
  const prompt = `
Zadanie: Na podstawie metadanych zdecyduj, do jakiego folderu powinien trafić ten plik.
Zwróć tylko nazwę folderu i poziom pewności (confidence 0-1).
Nie używaj domyślnych nazw takich jak "Inne" lub "Pozostałe" bez uzasadnienia.

Plik:
- Nazwa: ${meta.name}
- Ścieżka: ${meta.path}
- Rozszerzenie: ${meta.extension}
- Data utworzenia: ${meta.created}
- Rozmiar: ${meta.size} bajtów
- Foldery nadrzędne: ${meta.parentContext.join(" > ")}

Odpowiedź w formacie JSON:
{
  "category": "...",
  "confidence": ...
}
`;

  const completion = await openai.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "gpt-4o",
    temperature: 0.2,
  });

  const json = completion.choices[0].message.content || "{}";
  try {
    const result = JSON.parse(json);
    return {
      category: result.category || "Uncategorized",
      confidence: result.confidence || 0.0,
    };
  } catch {
    return { category: "Uncategorized", confidence: 0.0 };
  }
}
