export async function classify(title: string) {
  const keywords: Record<string, string[]> = {
    code: ["script", "manager", ".cs", ".js", "controller"],
    graphics: ["button", "logo", "icon", "sprite", "canvas"],
    audio: ["sound", "music", ".mp3", ".wav"],
    game: ["boss", "arena", "enemy", "player"],
    accounting: ["faktura", "podatek", "rachunek", "księga"],
  };

  title = title.toLowerCase();
  for (const [tag, terms] of Object.entries(keywords)) {
    if (terms.some((term) => title.includes(term))) {
      return { category: tag };
    }
  }
  return { category: "Uncategorized" };
}
